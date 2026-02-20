/* scripts/embed-movies.ts */

import "./env";
import fs from "fs";
import path from "path";
import { pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";

import type { CrawledMovie, EmbeddedMovie } from "../lib/types";

/* ================= CONFIG ================= */

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

/* ================= UTILS ================= */

function buildPosterUrl(posterPath?: string | null): string | null {
    if (!posterPath) return null;
    return `${TMDB_IMAGE_BASE}${posterPath}`;
}

/**
 * Text ONLY for semantic embedding (not for UI)
 */
function buildEmbeddingText(movie: CrawledMovie): string {
    if (!movie.overview) return "";
    return movie.overview.replace(/\s+/g, " ").trim();
}

/* ================= MAIN ================= */

async function main() {
    console.log("🔄 Loading embedding model...");

    const embedder = (await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
    )) as FeatureExtractionPipeline;

    const inputPath = path.join(process.cwd(), "data/movies.json");
    const outputPath = path.join(process.cwd(), "data/movie-embeddings.json");

    const movies: CrawledMovie[] = JSON.parse(
        fs.readFileSync(inputPath, "utf-8"),
    );

    console.log(`📦 Loaded ${movies.length} movies`);

    const embedded: EmbeddedMovie[] = [];

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const text = buildEmbeddingText(movie);

        console.log(`🧠 Embedding ${i + 1}/${movies.length}: ${movie.title}`);

        const output = await embedder(text, {
            pooling: "mean",
            normalize: true,
        });

        embedded.push({
            id: movie.id,
            title: movie.title,
            text, // dùng cho AI
            embedding: Array.from(output.data as Float32Array),
            metadata: {
                year: movie.year,
                rating: movie.rating,
                genres: movie.genres,
                popularity: movie.popularity,
                runtime: movie.runtime ?? undefined,
                language: movie.language,
                source: "tmdb",
                poster_url: buildPosterUrl(movie.poster_path),
            },
        });
    }

    fs.writeFileSync(outputPath, JSON.stringify(embedded, null, 2));

    console.log(
        `✅ Saved ${embedded.length} embeddings → data/movie-embeddings.json`,
    );
}

main().catch((err) => {
    console.error("❌ Embed failed:", err);
    process.exit(1);
});
