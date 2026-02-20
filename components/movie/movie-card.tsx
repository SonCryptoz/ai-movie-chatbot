"use client";

import Image from "next/image";
import type { Movie } from "@/lib/types";

export default function MovieCard({ movie }: { movie: Movie }) {
    return (
        <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 items-start">
                {/* ================= POSTER ================= */}
                <div className="flex justify-center sm:justify-start">
                    <div className="relative w-full max-w-50 aspect-2/3 bg-base-200 rounded-xl overflow-hidden">
                        {movie.poster_url ? (
                            <Image
                                src={movie.poster_url}
                                alt={movie.title}
                                fill
                                className="object-cover"
                                sizes="(max-width:640px) 100vw, 200px"
                                priority={false}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm opacity-50">
                                No image
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="card-body p-3 sm:p-4">
                    {/* Title */}
                    <h2 className="card-title text-sm sm:text-base md:text-lg line-clamp-2">
                        {movie.title}
                        {movie.year && (
                            <span className="badge badge-neutral ml-2">
                                {movie.year}
                            </span>
                        )}
                    </h2>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mt-1">
                        {typeof movie.rating === "number" && (
                            <span className="badge badge-accent">
                                ⭐ {movie.rating.toFixed(1)}
                            </span>
                        )}

                        {typeof movie.runtime === "number" &&
                            movie.runtime > 0 && (
                                <span className="badge badge-outline">
                                    ⏱ {movie.runtime}m
                                </span>
                            )}

                        {typeof movie.popularity === "number" && (
                            <span className="badge badge-outline">
                                🔥 {Math.round(movie.popularity)}
                            </span>
                        )}

                        {movie.language && (
                            <span className="badge badge-outline uppercase">
                                🌐 {movie.language}
                            </span>
                        )}

                        {movie.source && (
                            <span className="badge badge-ghost uppercase">
                                {movie.source}
                            </span>
                        )}
                    </div>

                    {/* Genres */}
                    {movie.genres?.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                            {movie.genres.map((g) => (
                                <span
                                    key={g}
                                    className="badge badge-outline badge-sm"
                                >
                                    {g}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Overview */}
                    {movie.content && (
                        <p className="text-xs sm:text-sm text-justify opacity-80 mt-2 sm:line-clamp-none">
                            {movie.content}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};