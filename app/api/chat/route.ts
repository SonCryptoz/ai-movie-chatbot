import {
    RetrievedMovie,
    retrieveMovies,
    retrieveMovieByTitle,
} from "@/lib/retriever";
import { buildMoviePrompt } from "@/lib/prompts";
import { askGemini } from "@/lib/gemini";
import { NextResponse } from "next/server";

type ChatBody = {
    question: string;
};

type GeminiResponse = {
    recommendations: { id: number; reason?: string }[];
    genres: { name: string; value: number }[];
    radar: { metric: string; score: number }[];
    ratings: { label: string; rating: number }[];
};

/* =========================
   HELPERS
========================= */

function cleanTitle(t: string): string {
    return t
        .replace(/\(\d{4}\)/, "")
        .replace(/movie|film/gi, "")
        .trim();
}

function extractTitle(q: string): string {
    const quoted = q.match(/["“](.+?)["”]/);
    if (quoted) return cleanTitle(quoted[1]);

    const review = q.match(/review of\s+(.+?)(\s|\(|$)/i);
    if (review) return cleanTitle(review[1]);

    return cleanTitle(q);
}

function extractCompareTitles(q: string): string[] {
    const quoted = q.match(/["“](.+?)["”]\s*(with|vs|versus)\s*["“](.+?)["”]/i);
    if (quoted) return [cleanTitle(quoted[1]), cleanTitle(quoted[3])];

    const m = q.match(/compare\s+(.+?)\s+(with|vs|versus)\s+(.+)/i);
    if (!m) return [];

    return [cleanTitle(m[1]), cleanTitle(m[3])];
}

function detectCount(q: string): number {
    q = q.toLowerCase();

    if (/\b(2|two|some|movies)\b/.test(q)) return 2;
    if (/\b(1|one|a|an|movie)\b/.test(q)) return 1;

    return 2; // default
}

function detectMode(
    question: string,
): "single" | "compare" | "recommend" | "review" {
    const q = question.toLowerCase();

    // 1. Compare
    if (/(compare|vs|versus|which is better)/i.test(q)) {
        return "compare";
    }

    // 2. Review
    if (/(review of|give me a review|write a review)/i.test(q)) {
        return "review";
    }

    // 3. Recommend / search / discover
    if (
        /(recommend|suggest|similar|movies like|find|show|give me|tell me)/i.test(
            q,
        ) ||
        /(best|top rated|highly rated|rating above|rating over)/i.test(q)
    ) {
        return "recommend";
    }

    // 4. Default: assume user refers to 1 movie entity
    return "single";
}

/* =========================
   API
========================= */

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as ChatBody;

        if (!body.question?.trim()) {
            return NextResponse.json(
                { error: "Missing question" },
                { status: 400 },
            );
        }

        const question = body.question.trim();
        const mode = detectMode(question);

        let movies: RetrievedMovie[] = [];

        /* =========================
        RETRIEVE
        ========================= */

        if (mode === "review" || mode === "single") {
            const title = extractTitle(question);
            const found = await retrieveMovieByTitle(title);

            if (!found.length) {
                return NextResponse.json({ error: "Movie not found" });
            }

            movies = [found[0]];
        } else if (mode === "compare") {
            const titles = extractCompareTitles(question);
            if (titles.length !== 2) {
                return NextResponse.json({ error: "Invalid compare query" });
            }

            const m1 = await retrieveMovieByTitle(titles[0]);
            const m2 = await retrieveMovieByTitle(titles[1]);

            const combined = [...m1, ...m2];

            // dedupe by id
            const unique = Array.from(
                new Map(combined.map((m) => [m.id, m])).values(),
            );

            movies = unique.slice(0, 2);

            if (movies.length < 2) {
                return NextResponse.json({
                    error: "Could not find both movies",
                });
            }
        } else {
            if (
                mode === "recommend" &&
                /(similar to|movies like|like)/i.test(question)
            ) {
                const title = extractTitle(question);
                const base = await retrieveMovieByTitle(title);

                if (!base.length) {
                    return NextResponse.json({ error: "Base movie not found" });
                }

                let similar = (await retrieveMovies(base[0].content, 3))
                    .filter((m) => m.id !== base[0].id)
                    .slice(0, 2);

                if (similar.length < 2) {
                    similar = await retrieveMovies(question, 2);
                }

                movies = similar;
            } else {
                const count = detectCount(question);

                if (mode === "recommend") {
                    movies = await retrieveMovies(question, count);
                }
            }
        }

        if (!movies.length) {
            return NextResponse.json({
                mode,
                main: null,
                compare: [],
                genres: [],
                radar: [],
                ratings: [],
                recommendations: [],
                error: "No relevant movie found",
            });
        }

        /* =========================
        PROMPT
        ========================= */

        const prompt = buildMoviePrompt(question, movies);
        const raw = await askGemini(prompt);

        let parsed: GeminiResponse;
        try {
            parsed = JSON.parse(raw) as GeminiResponse;
        } catch (err) {
            console.error("❌ JSON parse error:", err, raw);
            return NextResponse.json(
                { error: "JSON parse failed" },
                { status: 500 },
            );
        }

        /* =========================
        SELECT MOVIES
        ========================= */

        const mergedMovies = parsed.recommendations
            .map((r) => {
                const original = movies.find((m) => m.id === Number(r.id));
                if (!original) return null;

                return {
                    ...original,
                    reason: r.reason ?? "",
                };
            })
            .filter(Boolean) as RetrievedMovie[];

        let finalMovies = mergedMovies;

        if (!finalMovies.length) {
            finalMovies =
                mode === "compare" ? movies.slice(0, 2) : movies.slice(0, 1);
        }

        return NextResponse.json({
            mode,
            main: finalMovies[0] ?? null,
            compare: finalMovies,
            genres: parsed.genres ?? [],
            radar: parsed.radar ?? [],
            ratings: parsed.ratings ?? [],
            recommendations: parsed.recommendations ?? [],
        });
    } catch (err) {
        console.error("❌ /api/chat error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
};