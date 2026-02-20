"use client";

import type { Movie } from "@/lib/types";
import Image from "next/image";
import clsx from "clsx";

export default function CompareTable({ movies }: { movies: Movie[] }) {
    if (!movies || movies.length < 2) return null;

    // AI score
    const scores = movies.map(
        (m) => (m.rating ?? 0) * 10 + (m.popularity ?? 0) / 100,
    );
    const maxScore = Math.max(...scores);
    const winnerIndex = scores.indexOf(maxScore);

    const maxRating = Math.max(...movies.map((m) => m.rating ?? 0));
    const maxPopularity = Math.max(...movies.map((m) => m.popularity ?? 0));
    const maxRuntime = Math.max(...movies.map((m) => m.runtime ?? 0));

    return (
        <>
            {/* ================= MOBILE VIEW ================= */}
            <div className="block sm:hidden space-y-4">
                {movies.map((m, i) => (
                    <div
                        key={m.id}
                        className={clsx(
                            "card bg-base-100 shadow",
                            i === winnerIndex && "ring-2 ring-success",
                        )}
                    >
                        <div className="flex gap-3 p-3">
                            {/* Poster */}
                            <div className="relative w-24 h-36 shrink-0">
                                {m.poster_url ? (
                                    <Image
                                        src={m.poster_url}
                                        alt={m.title}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-base-300 rounded-lg" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-2 text-sm">
                                <h3 className="font-bold leading-tight">
                                    {m.title}
                                </h3>

                                <div className="grid grid-cols-[1.25rem_1fr] gap-y-1 items-center">
                                    <span className="flex justify-center items-center">⭐</span>
                                    <span>{m.rating?.toFixed(1) ?? "—"}</span>

                                    <span className="flex justify-center items-center">🔥</span>
                                    <span>
                                        {m.popularity?.toFixed(0) ?? "—"}
                                    </span>

                                    <span className="flex justify-center items-center">⏱</span>
                                    <span>
                                        {m.runtime ? `${m.runtime}m` : "—"}
                                    </span>

                                    <span className="flex justify-center items-center">🌐</span>
                                    <span>
                                        {m.language?.toUpperCase() ?? "—"} ·{" "}
                                        {m.source?.toUpperCase() ?? "—"}
                                    </span>
                                </div>

                                <p className="text-xs opacity-70">
                                    {m.genres?.slice(0, 3).join(", ") ?? "—"}
                                </p>

                                <p
                                    className={clsx(
                                        "font-semibold",
                                        i === winnerIndex
                                            ? "text-success"
                                            : "opacity-50",
                                    )}
                                >
                                    {i === winnerIndex ? "🥇 AI pick" : "🥈"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= DESKTOP / TABLET VIEW ================= */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="table w-full text-xs md:text-sm">
                    <thead>
                        <tr>
                            <th></th>
                            {movies.map((m, i) => (
                                <th key={m.id} className="text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div
                                            className="
                                                relative
                                                w-24 h-36
                                                md:w-32 md:h-48
                                                lg:w-40 lg:h-60
                                            "
                                        >
                                            {m.poster_url ? (
                                                <Image
                                                    src={m.poster_url}
                                                    alt={m.title}
                                                    fill
                                                    className={clsx(
                                                        "object-cover rounded-xl shadow transition",
                                                        i === winnerIndex &&
                                                            "ring-4 ring-success",
                                                    )}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-base-300 rounded-xl" />
                                            )}
                                        </div>
                                        <span className="font-semibold text-center">
                                            {m.title}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* AI PICK */}
                        <tr>
                            <td className="font-bold">AI pick</td>
                            {movies.map((_, i) => (
                                <td key={i} className="text-center">
                                    {i === winnerIndex ? (
                                        <span className="inline-flex items-center justify-center bg-success text-success-content rounded-full text-2xl md:text-3xl h-10 w-10 md:h-12 md:w-12 shadow">
                                            🥇
                                        </span>
                                    ) : (
                                        <span className="text-2xl md:text-3xl opacity-40">
                                            🥈
                                        </span>
                                    )}
                                </td>
                            ))}
                        </tr>

                        {/* RATING */}
                        <tr>
                            <td className="font-medium">Rating</td>
                            {movies.map((m, i) => {
                                const percent = maxRating
                                    ? ((m.rating ?? 0) / maxRating) * 100
                                    : 0;

                                return (
                                    <td
                                        key={m.id}
                                        className={clsx("text-center", {
                                            "bg-success/10": i === winnerIndex,
                                        })}
                                    >
                                        ⭐ {m.rating?.toFixed(1) ?? "—"}
                                        <div className="mt-1 h-2 w-full bg-base-200 rounded">
                                            <div
                                                className="h-2 rounded bg-primary transition-all"
                                                style={{
                                                    width: `${percent}%`,
                                                }}
                                            />
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* POPULARITY */}
                        <tr>
                            <td className="font-medium">Popularity</td>
                            {movies.map((m, i) => {
                                const percent = maxPopularity
                                    ? ((m.popularity ?? 0) / maxPopularity) *
                                      100
                                    : 0;

                                return (
                                    <td
                                        key={m.id}
                                        className={clsx("text-center", {
                                            "bg-success/10": i === winnerIndex,
                                        })}
                                    >
                                        🔥 {m.popularity?.toFixed(0) ?? "—"}
                                        <div className="mt-1 h-2 w-full bg-base-200 rounded">
                                            <div
                                                className="h-2 rounded bg-secondary transition-all"
                                                style={{
                                                    width: `${percent}%`,
                                                }}
                                            />
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* RUNTIME */}
                        <tr>
                            <td className="font-medium">Runtime</td>
                            {movies.map((m, i) => {
                                const percent = maxRuntime
                                    ? ((m.runtime ?? 0) / maxRuntime) * 100
                                    : 0;

                                return (
                                    <td
                                        key={m.id}
                                        className={clsx("text-center", {
                                            "bg-success/10": i === winnerIndex,
                                        })}
                                    >
                                        ⏱ {m.runtime ?? "—"}m
                                        <div className="mt-1 h-2 w-full bg-base-200 rounded">
                                            <div
                                                className="h-2 rounded bg-info transition-all"
                                                style={{
                                                    width: `${percent}%`,
                                                }}
                                            />
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* LANGUAGE */}
                        <tr>
                            <td className="font-medium">Language</td>
                            {movies.map((m, i) => (
                                <td
                                    key={m.id}
                                    className={clsx("text-center", {
                                        "bg-success/10": i === winnerIndex,
                                    })}
                                >
                                    🌐 {m.language?.toUpperCase() ?? "—"}
                                </td>
                            ))}
                        </tr>

                        {/* SOURCE */}
                        <tr>
                            <td className="font-medium">Source</td>
                            {movies.map((m, i) => (
                                <td
                                    key={m.id}
                                    className={clsx(
                                        "text-center text-xs uppercase opacity-70",
                                        {
                                            "bg-success/10": i === winnerIndex,
                                        },
                                    )}
                                >
                                    {m.source ?? "—"}
                                </td>
                            ))}
                        </tr>

                        {/* GENRES */}
                        <tr>
                            <td className="font-medium">Genres</td>
                            {movies.map((m, i) => (
                                <td
                                    key={m.id}
                                    className={clsx("text-center", {
                                        "bg-success/10": i === winnerIndex,
                                    })}
                                >
                                    {m.genres?.slice(0, 3).join(", ") ?? "—"}
                                </td>
                            ))}
                        </tr>

                        {/* OVERVIEW */}
                        <tr>
                            <td className="font-medium">Overview</td>
                            {movies.map((m, i) => (
                                <td
                                    key={m.id}
                                    className={clsx(
                                        "max-w-xs hidden md:table-cell",
                                        {
                                            "bg-success/10": i === winnerIndex,
                                        },
                                    )}
                                >
                                    <div className="text-justify text-xs md:text-sm">
                                        {m.content ?? "—"}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};
