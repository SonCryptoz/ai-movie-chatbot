"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

import type { GenreStat } from "@/lib/types";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];

export default function GenreChart({ data }: { data: GenreStat[] }) {
    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body p-3 sm:p-4">
                <h3 className="card-title text-sm sm:text-base">Genre Distribution</h3>

                <div className="h-52 sm:h-60 md:h-64">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                label
                            >
                                {data.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={COLORS[i % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
