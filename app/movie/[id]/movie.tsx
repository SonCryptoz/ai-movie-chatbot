import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AskAIButtons from "@/components/movie/ask-ai-buttons";
import { supabase } from "@/lib/supabase";

type Movie = {
    id: number;
    title: string;
    content: string;
    year: number;
    rating: number;
    genres: string[];
    popularity: number;
    language: string;
    runtime: number | null;
    source: string | null;
    poster_url: string | null;
};

/* ---------------- FETCH ---------------- */

async function getMovie(id: number): Promise<Movie | null> {
    const { data, error } = await supabase
        .from("movie_embeddings")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("❌ Fetch movie error:", error);
        return null;
    }

    return data as Movie;
}

/* ---------------- SEO ---------------- */

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const movie = await getMovie(Number(id));

    if (!movie) return { title: "Movie not found" };

    return {
        title: `${movie.title} (${movie.year})`,
        description: movie.content?.slice(0, 160),
        openGraph: {
            images: movie.poster_url ? [movie.poster_url] : [],
        },
    };
}

/* ---------------- PAGE ---------------- */

const MovieDetailPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;
    const movieId = Number(id);
    if (Number.isNaN(movieId)) notFound();

    const movie = await getMovie(movieId);
    if (!movie) notFound();

    return (
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-5 sm:py-8">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <Link href="/data" className="btn btn-primary btn-sm gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back
                </Link>

                {movie.language && (
                    <span className="badge badge-secondary">
                        {movie.language.toUpperCase()}
                    </span>
                )}
            </div>

            {/* MAIN */}
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5 md:gap-8">
                {/* POSTER */}
                <div className="w-full flex justify-center md:block">
                    {movie.poster_url ? (
                        <div className="relative aspect-2/3 w-2/3 sm:w-1/2 md:w-full overflow-hidden rounded-xl shadow">
                            <Image
                                src={movie.poster_url}
                                alt={movie.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 280px"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="aspect-2/3 w-2/3 sm:w-1/2 md:w-full rounded-xl bg-base-200 flex items-center justify-center text-sm opacity-50">
                            No poster
                        </div>
                    )}
                </div>

                {/* INFO */}
                <div className="space-y-3 sm:space-y-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            {movie.title}
                        </h1>
                        <p className="opacity-60 text-sm sm:text-base">
                            {movie.year || "N/A"} •{" "}
                            {movie.runtime
                                ? `${movie.runtime} min`
                                : "Unknown runtime"}
                        </p>
                    </div>

                    {/* GENRES */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {movie.genres?.length ? (
                            movie.genres.map((g) => (
                                <span key={g} className="badge badge-outline">
                                    {g}
                                </span>
                            ))
                        ) : (
                            <span className="opacity-50">No genres</span>
                        )}
                    </div>

                    {/* STATS */}
                    <div className="stats stats-vertical sm:stats-horizontal shadow">
                        <div className="stat">
                            <div className="stat-title">Rating</div>
                            <div className="stat-value">
                                ⭐ {movie.rating ?? "N/A"}
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">Popularity</div>
                            <div className="stat-value">
                                {movie.popularity ?? "N/A"}
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">Source</div>
                            <div className="stat-value text-sm">
                                {movie.source ?? "TMDB"}
                            </div>
                        </div>
                    </div>

                    {/* OVERVIEW */}
                    <div className="prose prose-sm sm:prose max-w-none">
                        <p className="text-justify">
                            {movie.content || "No description available."}
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <AskAIButtons
                        movie={{
                            title: movie.title,
                            year: movie.year,
                            genres: movie.genres || [],
                            rating: movie.rating,
                            runtime: movie.runtime,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;