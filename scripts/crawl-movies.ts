/* scripts/crawl-movies.ts */

import "./env";
import fs from "fs";
import path from "path";

import type { CrawledMovie, TMDBMovie, TMDBMovieDetail } from "../lib/types";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
    throw new Error("Missing TMDB_API_KEY in .env.local");
}

/* ================= UTILS ================= */

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function randomDelay(min = 200, max = 300) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    await sleep(ms);
}

async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch: ${url}\n${text}`);
    }

    return res.json();
}

/* ================= FETCHERS ================= */

async function fetchMovieDetail(id: number): Promise<TMDBMovieDetail> {
    return fetchJSON<TMDBMovieDetail>(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
    );
}

/* ================= CRAWLER ================= */

async function crawlMovies(pages = 15): Promise<CrawledMovie[]> {
    const movies: CrawledMovie[] = [];

    for (let page = 1; page <= pages; page++) {
        console.log(`📥 Fetching page ${page}/${pages}`);

        const data = await fetchJSON<{
            results: TMDBMovie[];
        }>(
            `${TMDB_BASE_URL}/discover/movie` +
                `?api_key=${TMDB_API_KEY}` +
                `&sort_by=popularity.desc` +
                `&vote_count.gte=100` +
                `&with_original_language=en` +
                `&page=${page}`,
        );

        for (const movie of data.results) {
            // lọc phim rác
            if (!movie.overview || movie.vote_average === 0) continue;

            const detail = await fetchMovieDetail(movie.id);

            movies.push({
                id: movie.id,
                title: movie.title,
                original_title: movie.original_title,
                overview: movie.overview,

                genres: detail.genres.map((g) => g.name),
                release_date: movie.release_date,
                year: Number(movie.release_date?.slice(0, 4)) || 0,

                rating: movie.vote_average,
                vote_count: movie.vote_count,
                popularity: movie.popularity,
                language: movie.original_language,

                runtime: detail.runtime,
                poster_path: movie.poster_path ?? undefined,
            });

            await randomDelay(200, 300); // chống rate limit
        }
    }

    return movies;
}

/* ================= MAIN ================= */

async function main() {
    console.log("🚀 Start crawling movies...");

    const movies = await crawlMovies(15); // crawl khoảng 300 phim

    const outDir = path.join(process.cwd(), "data");
    const outFile = path.join(outDir, "movies.json");

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }

    fs.writeFileSync(outFile, JSON.stringify(movies, null, 2), "utf-8");

    console.log(`✅ Saved ${movies.length} movies → data/movies.json`);
}

main().catch((err) => {
    console.error("❌ Crawl failed:", err);
    process.exit(1);
});
