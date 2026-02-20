import { supabase } from "./supabase";
import { embedText } from "./embeddings";
import { Movie } from "./types";

export type RetrievedMovie = {
    id: number;
    title: string;
    content: string;
    year: number;
    rating: number;
    genres: string[];
    popularity: number;
    runtime: number;
    language: string;
    source: string;
    poster_url: string | null;
};

const GENRE_KEYWORDS: Record<string, string[]> = {
    Action: ["action", "fight", "battle", "war", "combat", "explosion"],
    Drama: ["drama", "emotional", "life", "relationship", "family drama"],
    Comedy: ["comedy", "funny", "humor", "humour", "laugh", "satire"],
    "Science Fiction": [
        "Sci-Fi",
        "sci-fi",
        "science fiction",
        "space",
        "alien",
        "future",
        "robot",
        "ai",
        "cyber",
    ],
    Romance: ["romance", "romantic", "love", "couple", "relationship"],
    Horror: ["horror", "scary", "ghost", "monster", "zombie", "creepy"],
    Animation: ["animation", "animated", "cartoon", "anime", "pixar", "disney"],
    Thriller: ["thriller", "suspense", "tense", "psychological"],
    Documentary: ["documentary", "doc", "real story", "true story"],
    Adventure: ["adventure", "journey", "exploration", "quest"],
    Fantasy: ["fantasy", "magic", "myth", "legend", "fairy"],
    Mystery: ["mystery", "detective", "investigation", "whodunit"],
    Crime: ["crime", "mafia", "gang", "police", "heist"],
    Family: [
        "family",
        "kids",
        "children",
        "child",
        "for kids",
        "for family",
        "family friendly",
    ],
    Musical: ["musical", "music", "singing", "song", "dance"],
    War: ["war", "soldier", "army", "battlefield"],
    Western: ["western", "cowboy", "wild west"],
    Biography: ["biography", "biopic", "life of", "based on life"],
    History: ["history", "historical", "period"],
    Sport: ["sport", "sports", "football", "basketball", "soccer", "boxing"],
};

/* =========================
   UTILS
========================= */

function normalizeTitle(t: string): string {
    return t
        .toLowerCase()
        .replace(/\(\d{4}\)/gi, "")
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

/* =========================
   PARSERS
========================= */

function detectGenres(query: string): string[] {
    const q = query.toLowerCase();
    const matched = new Set<string>();

    for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS)) {
        if (keywords.some((k) => q.includes(k))) {
            matched.add(genre);
        }
    }

    return Array.from(matched);
}

function detectYear(query: {
    toLowerCase: () => string;
    match: (arg0: RegExp) => RegExpMatchArray | null;
}): { min?: number; max?: number } | null {
    const after = query.match(/after\s+(19|20)\d{2}/i);
    const before = query.match(/before\s+(19|20)\d{2}/i);
    const from = query.match(/from\s+(19|20)\d{2}/i);
    const exact = query.match(/\b(19|20)\d{2}\b/);

    if (after) return { min: Number(after[0].slice(-4)) };
    if (before) return { max: Number(before[0].slice(-4)) };
    if (from)
        return {
            min: Number(from[0].slice(-4)),
            max: Number(from[0].slice(-4)),
        };
    if (exact) return { min: Number(exact[0]), max: Number(exact[0]) };

    return null;
}

function detectRating(query: string): number | null {
    const q = query.toLowerCase();

    if (
        q.includes("best") ||
        q.includes("top rated") ||
        q.includes("highly rated")
    )
        return 7.5;

    // rating above / over / greater than
    const m1 = q.match(/(rating\s+)?(above|over|greater than)\s+(\d(\.\d)?)/);
    if (m1) return Number(m1[3]);

    // > 7
    const m2 = q.match(/>\s*(\d(\.\d)?)/);
    if (m2) return Number(m2[1]);

    // "rating 7"
    const m3 = q.match(/rating\s+(\d(\.\d)?)/);
    if (m3) return Number(m3[1]);

    return null;
}

/* =========================
   TITLE LOOKUP (ENTITY SEARCH)
========================= */

export async function retrieveMovieByTitle(
    rawTitle: string,
    year?: number,
): Promise<RetrievedMovie[]> {
    const title = normalizeTitle(rawTitle);

    // chỉ query những phim có title gần giống
    const { data, error } = await supabase
        .from("movie_embeddings")
        .select("*")
        .ilike("title", `%${rawTitle}%`);

    if (error || !data) {
        console.error("❌ Title search error:", error);
        return [];
    }

    const scored = data
        .map((m) => {
            const dbTitle = normalizeTitle(m.title);

            let score = 0;

            // ưu tiên exact
            if (dbTitle === title) score = 100;
            else if (dbTitle.startsWith(title)) score = 80;
            else if (dbTitle.includes(title)) score = 60;

            // bonus nếu match year
            if (year && m.year === year) score += 40;

            return { movie: m, score };
        })
        .filter((x) => x.score > 0)
        .sort(
            (a, b) =>
                b.score - a.score || b.movie.popularity - a.movie.popularity,
        );

    if (!scored.length) return [];

    return [mapMovie(scored[0].movie)];
}

/* =========================
   MAIN SEMANTIC RETRIEVER
========================= */

export async function retrieveMovies(
    query: string,
    limit = 2,
): Promise<RetrievedMovie[]> {
    if (!query) return [];

    const genreFilters = detectGenres(query);
    const yearFilter = detectYear(query);
    const ratingMin = detectRating(query);

    const embedding = await embedText(query);

    const { data, error } = await supabase.rpc("match_movies", {
        query_embedding: embedding,
        match_count: limit,
        genre_filter: genreFilters.length ? genreFilters : null,
        year_min: yearFilter?.min ?? null,
        year_max: yearFilter?.max ?? null,
        rating_min: ratingMin ?? null,
    });

    if (error) {
        console.error("❌ Vector search error:", error);
        return [];
    }

    if (!data || !Array.isArray(data)) return [];

    return data.map(mapMovie);
}

/* =========================
   MAPPER
========================= */

function mapMovie(m: Movie): RetrievedMovie {
    return {
        id: m.id,
        title: m.title,
        content: m.content,
        year: m.year,
        rating: m.rating,
        genres: m.genres ?? [],
        popularity: m.popularity ?? 0,
        runtime: m.runtime ?? 0,
        language: m.language ?? "en",
        source: m.source ?? "unknown",
        poster_url: m.poster_url ?? null,
    };
}
