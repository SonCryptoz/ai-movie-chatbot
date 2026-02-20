// =======================
// UI TYPES
// =======================

export type Movie = {
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

export type GenreStat = {
    name: string;
    value: number;
};

export type RadarMetric = {
    metric: string;
    score: number; // 0–10
};

export type RatingPoint = {
    label: string; // year, source, etc.
    rating: number; // 0–10
};

export type MoviePanelData = {
    mode: "single" | "compare" | "recommend";
    main?: Movie;
    compare?: Movie[];
    genres?: GenreStat[];
    radar?: RadarMetric[];
    ratings?: RatingPoint[];
};

// =======================
// RAW DATA FROM TMDB
// =======================

export type CrawledMovie = {
    id: number;
    title: string;
    original_title?: string;
    overview: string;
    genres: string[];
    release_date: string;
    year: number;
    rating: number;
    vote_count: number;
    popularity: number;
    language: string;
    runtime: number | null;
    poster_path?: string | null; // raw TMDB path: "/abc.jpg"
};

// =======================
// EMBEDDING INPUT
// =======================

export type EmbeddedMovie = {
    id: number;
    title: string;
    text: string; // text used for embedding (title + overview + genres)
    embedding: number[];
    metadata: {
        year: number;
        rating: number;
        genres: string[];
        popularity: number;
        runtime?: number | null;
        language?: string;
        source?: "tmdb";
        poster_url?: string | null;
    };
};

// =======================
// DATABASE ROW (SUPABASE)
// =======================

export type DbMovie = {
    id: number;
    title: string;
    content: string;
    embedding: number[];
    year: number;
    rating: number;
    genres: string[];
    popularity: number;
    language: string;
    runtime: number | null;
    source: string | null;
    poster_url: string | null;
};

// =======================
// TMDB API TYPES
// =======================

export type TMDBMovie = {
    id: number;
    title: string;
    original_title: string;
    overview: string;

    release_date: string;
    original_language: string;
    genre_ids: number[];

    popularity: number;
    vote_average: number;
    vote_count: number;

    adult: boolean;
    video: boolean;

    poster_path: string | null;
};

export type TMDBMovieDetail = {
    runtime: number | null;
    genres: { id: number; name: string }[];
};
