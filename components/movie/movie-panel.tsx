"use client";

import { motion } from "framer-motion";

import MovieCard from "./movie-card";
import CompareTable from "./compare-table";
import GenreChart from "./genre-chart";
import MovieRadarChart from "./radar-chart";
import RatingChart from "./rating-chart";

import type { MoviePanelData } from "@/lib/types";

export default function MoviePanel({ data }: { data: MoviePanelData }) {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
        >
            {/* SINGLE */}
            {data.mode === "single" && data.main && (
                <MovieCard movie={data.main} />
            )}

            {/* COMPARE */}
            {data.mode === "compare" &&
                data.compare &&
                data.compare.length >= 2 && (
                    <CompareTable movies={data.compare} />
                )}

            {/* RECOMMEND */}
            {data.mode === "recommend" && data.compare && (
                <div className="grid sm:grid-cols-1 gap-4">
                    {data.compare.map((m) => (
                        <MovieCard key={m.id} movie={m} />
                    ))}
                </div>
            )}

            {/* CHARTS */}
            {data.mode === "single" &&
                (data.genres?.length || data.radar?.length) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.genres && data.genres.length > 0 && (
                            <GenreChart data={data.genres} />
                        )}
                        {data.radar && data.radar.length === 5 && (
                            <MovieRadarChart data={data.radar} />
                        )}
                    </div>
                )}

            {data.mode === "single" &&
                data.ratings &&
                data.ratings.length > 0 && <RatingChart data={data.ratings} />}
        </motion.div>
    );
};
