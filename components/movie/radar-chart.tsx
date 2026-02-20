"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import type { RadarMetric } from "@/lib/types";

export default function MovieRadarChart({ data }: { data: RadarMetric[] }) {
    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body p-3 sm:p-4">
                <h3 className="card-title text-sm sm:text-base">Movie Analysis</h3>

                <div className="h-52 sm:h-60 md:h-64">
                    <ResponsiveContainer>
                        <RadarChart data={data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="metric" />
                            <Radar
                                dataKey="score"
                                stroke="#6366f1"
                                fill="#6366f1"
                                fillOpacity={0.6}
                            />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
