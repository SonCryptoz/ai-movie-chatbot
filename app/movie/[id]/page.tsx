import MovieDetailPage from "./movie";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const baseUrl =
        process.env.RENDER_BACKEND_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/movies/${id}`, {
        cache: "no-store",
    });

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
