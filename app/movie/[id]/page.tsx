import MovieDetailPage from "./movie";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/movies/${id}`,
        { cache: "no-store" },
    );

    if (!res.ok) return { title: "Movie not found" };

    const movie = await res.json();

    return {
        title: `${movie.title} (${movie.year})`,
        description: movie.content?.slice(0, 160),
        openGraph: {
            title: movie.title,
            description: movie.content?.slice(0, 160),
            images: movie.poster_url ? [movie.poster_url] : [],
        },
    };
};

export default MovieDetailPage;
