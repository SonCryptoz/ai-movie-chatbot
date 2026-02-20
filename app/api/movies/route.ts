import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() ?? "";
    const genre = searchParams.get("genre");
    const sort = searchParams.get("sort") ?? "popularity";

    let page = Number(searchParams.get("page") ?? 1);
    let limit = Number(searchParams.get("limit") ?? 10);

    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1 || limit > 50) limit = 10;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("movie_embeddings")
        .select("id,title,year,genres,rating,popularity,poster_url", {
            count: "exact",
        });

    if (q) query = query.ilike("title", `%${q}%`);

    if (genre) {
        query = query.contains("genres", [genre]);
    }

    // whitelist sort
    switch (sort) {
        case "rating":
            query = query.order("rating", { ascending: false });
            break;
        case "year":
            query = query.order("year", { ascending: false });
            break;
        default:
            query = query.order("popularity", { ascending: false });
    }

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
        console.error("❌ DB error:", error);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    return NextResponse.json({
        data,
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
    });
};