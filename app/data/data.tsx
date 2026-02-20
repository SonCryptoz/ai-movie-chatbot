"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";

import { TableLoading } from "@/components/data/table-loading";
import { TableError } from "@/components/data/table-error";
import { TableNotFound } from "@/components/data/table-not-found";
import { useChatStore } from "@/store/use-chat-store";

type MovieRow = {
    id: number;
    title: string;
    year: number;
    genres: string[];
    rating: number;
};

const GENRES = [
    "Action",
    "Drama",
    "Comedy",
    "Science Fiction",
    "Romance",
    "Horror",
    "Animation",
    "Thriller",
    "Documentary",
    "Adventure",
    "Fantasy",
    "Mystery",
    "Crime",
    "Family",
    "Musical",
    "War",
    "Western",
    "Biography",
    "History",
    "Sport",
];

const DataTablePage = () => {
    const router = useRouter();

    const [movies, setMovies] = useState<MovieRow[]>([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(0);

    const setInitialQuestion = useChatStore((s) => s.setInitialQuestion);

    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [genre, setGenre] = useState(searchParams.get("genre") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "popularity");
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

    const limit = 7;

    useEffect(() => {
        const params = new URLSearchParams();

        if (search) params.set("q", search);
        if (genre) params.set("genre", genre);
        if (sort) params.set("sort", sort);
        if (page > 1) params.set("page", String(page));

        router.replace(`?${params.toString()}`);
    }, [search, genre, sort, page, router]);

    useEffect(() => {
        const abortController = new AbortController();

        async function fetchMovies() {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams({
                    q: search,
                    genre,
                    sort,
                    page: String(page),
                    limit: String(limit),
                });

                const res = await fetch(`/api/movies?${params.toString()}`, {
                    signal: abortController.signal,
                });

                if (!res.ok) throw new Error("Failed to fetch movies");

                const json = await res.json();

                if (!abortController.signal.aborted) {
                    setMovies(json.data);
                    setTotal(json.total);
                }
            } catch (err) {
                if (!abortController.signal.aborted) {
                    setError("Cannot load movies. Please try again. " + err);
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchMovies();
        return () => abortController.abort();
    }, [search, genre, sort, page, refresh]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="container mx-auto max-w-7xl px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-3">
                <Link href="/chat" className="btn btn-primary btn-sm gap-2">
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

                <div className="md:text-right">
                    <h1 className="text-xl md:text-2xl font-bold">
                        Movie Dataset
                    </h1>
                    <p className="text-sm opacity-60">
                        Browse and explore available movie data
                    </p>
                </div>
            </div>

            {/* TOOLBAR */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Search */}
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        className="input input-bordered focus:ring-0 focus:border-base-200 w-full pl-9"
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-2 md:flex">
                    <select
                        className="select w-full md:w-auto"
                        value={genre}
                        onChange={(e) => {
                            setPage(1);
                            setGenre(e.target.value);
                        }}
                    >
                        <option value="">All genres</option>
                        {GENRES.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>

                    <select
                        className="select w-full md:w-auto"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="popularity">🔥 Popularity</option>
                        <option value="rating">⭐ Rating</option>
                        <option value="year">🆕 Year</option>
                    </select>
                </div>

                {/* Stats */}
                <div className="text-sm opacity-60 text-right">
                    Total movies:{" "}
                    <span className="font-semibold text-primary">{total}</span>
                </div>
            </div>

            {loading && <TableLoading />}

            {error && !loading && (
                <TableError
                    message={error}
                    onRetry={() => setRefresh((r) => r + 1)}
                />
            )}

            {!loading && !error && movies.length === 0 && (
                <TableNotFound message="No movies match your search" />
            )}

            {!loading && !error && movies.length > 0 && (
                <>
                    {/* TABLE (Desktop) */}
                    <div className="hidden md:block overflow-x-auto rounded-xl border bg-base-100">
                        <table className="table">
                            <thead className="bg-accent text-accent-content">
                                <tr>
                                    <th>Title</th>
                                    <th>Year</th>
                                    <th>Genres</th>
                                    <th>Rating</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map((movie) => (
                                    <tr key={movie.id}>
                                        <td className="font-medium">
                                            {movie.title}
                                        </td>
                                        <td>{movie.year}</td>
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {movie.genres.map((g) => (
                                                    <span
                                                        key={g}
                                                        className="badge badge-outline"
                                                    >
                                                        {g}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-secondary">
                                                ⭐ {movie.rating}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="join">
                                                <Link
                                                    href={`/movie/${movie.id}`}
                                                    className="btn btn-sm btn-primary join-item"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setInitialQuestion(
                                                            `Review "${movie.title}" (${movie.year}).`,
                                                        );
                                                        router.push("/chat");
                                                    }}
                                                    className="btn btn-sm btn-secondary join-item"
                                                >
                                                    Ask AI
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARD LIST */}
                    <div className="md:hidden space-y-3">
                        {movies.map((movie) => (
                            <div
                                key={movie.id}
                                className="card bg-base-100 border shadow-sm"
                            >
                                <div className="card-body p-4 space-y-2">
                                    <h2 className="font-semibold text-lg">
                                        {movie.title}
                                    </h2>

                                    <div className="flex justify-between text-sm opacity-70">
                                        <span>{movie.year}</span>
                                        <span>⭐ {movie.rating}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {movie.genres.map((g) => (
                                            <span
                                                key={g}
                                                className="badge badge-outline badge-sm"
                                            >
                                                {g}
                                            </span>
                                        ))}
                                    </div>

                                    <Link
                                        href={`/movie/${movie.id}`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        View
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setInitialQuestion(
                                                `Give me a short review of "${movie.title}"`,
                                            );
                                            router.push("/chat");
                                        }}
                                        className="btn btn-secondary btn-sm w-full mt-2"
                                    >
                                        Ask AI
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-3">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="btn btn-primary btn-sm md:btn-md"
                >
                    ◀
                </button>

                <span className="text-sm">
                    Page {page} / {totalPages || 1}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="btn btn-primary btn-sm md:btn-md"
                >
                    ▶
                </button>
            </div>
        </div>
    );
};

export default DataTablePage;