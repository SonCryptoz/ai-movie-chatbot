/* scripts/ingest-movies.ts */

import "./env";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { EmbeddedMovie } from "../lib/types";

/* ================= CONFIG ================= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("❌ Missing Supabase env vars");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
});

/* ================= UTILS ================= */

function isValidEmbeddedMovie(m: EmbeddedMovie): boolean {
    return (
        typeof m.id === "number" &&
        typeof m.title === "string" &&
        Array.isArray(m.embedding) &&
        m.embedding.length > 0
    );
}

/* ================= MAIN ================= */

async function main() {
    console.log("📦 Loading movie embeddings...");

    const inputPath = path.join(process.cwd(), "data/movie-embeddings.json");

    if (!fs.existsSync(inputPath)) {
        throw new Error("❌ movie-embeddings.json not found");
    }

    const raw: unknown = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

    if (!Array.isArray(raw)) {
        throw new Error("❌ movie-embeddings.json is not an array");
    }

    const rawEmbeddings = raw.filter(isValidEmbeddedMovie);

    console.log(`📥 Loaded ${rawEmbeddings.length} valid embeddings`);

    /* ================= DEDUP ================= */

    const map = new Map<number, EmbeddedMovie>();

    for (const m of rawEmbeddings) {
        map.set(m.id, m);
    }

    const embeddings = Array.from(map.values());

    console.log(
        `🧹 Deduplicated: ${rawEmbeddings.length} → ${embeddings.length}`,
    );

    /* ================= INGEST ================= */

    const BATCH_SIZE = 50;

    for (let i = 0; i < embeddings.length; i += BATCH_SIZE) {
        const batch = embeddings.slice(i, i + BATCH_SIZE);

        const rows = batch.map((m) => ({
            id: m.id,
            title: m.title,
            content: m.text.split("Overview:")[1] ?? m.text,
            embedding: m.embedding,

            year: m.metadata.year,
            rating: m.metadata.rating,
            genres: m.metadata.genres,
            popularity: m.metadata.popularity,

            language: m.metadata.language ?? "en",
            runtime: m.metadata.runtime ?? null,
            source: m.metadata.source ?? "tmdb",
            poster_url: m.metadata.poster_url ?? null,
        }));

        console.log(
            `⬆️ Inserting batch ${i / BATCH_SIZE + 1} (${rows.length} rows)...`,
        );

        const { error } = await supabase
            .from("movie_embeddings")
            .upsert(rows, { onConflict: "id" });

        if (error) {
            console.error("❌ Supabase batch error:", error);
            console.error("Batch index:", i);
            process.exit(1);
        }
    }

    console.log("🎉 Ingest completed successfully");
}

main().catch((err) => {
    console.error("❌ Ingest failed:", err);
    process.exit(1);
});
