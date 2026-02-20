import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

type Params = {
    params: Promise<{ id: string }>;
};

export async function GET(req: Request, { params }: Params) {
    const { id } = await params

    const movieId = Number(id);

    if (Number.isNaN(movieId)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("movie_embeddings")
        .select("id,title,year,genres,rating,popularity,poster_url,content")
        .eq("id", movieId)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(data);
};