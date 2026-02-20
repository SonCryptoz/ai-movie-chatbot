"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import type { RatingPoint } from "@/lib/types";

export default function RatingChart({ data }: { data: RatingPoint[] }) {
    return (
        <div className="card bg-base-100 shadow mb-4">
            <div className="card-body p-3 sm:p-4">
                <h3 className="card-title text-sm sm:text-base">Rating Trend</h3>

                <div className="h-52 sm:h-60 md:h-64">
                    <ResponsiveContainer>
                        <LineChart data={data}>
                            <XAxis dataKey="label" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="rating"
                                stroke="#22c55e"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
