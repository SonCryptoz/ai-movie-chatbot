"use client";

import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/use-chat-store";

type Props = {
    movie: {
        title: string;
        year: number;
        genres: string[];
        rating: number;
        runtime: number | null;
    };
};

export default function AskAIButtons({ movie }: Props) {
    const router = useRouter();
    const setInitialQuestion = useChatStore((s) => s.setInitialQuestion);

    const askAboutMovie = () => {
        const prompt = `Review "${movie.title}" (${movie.year}).`;
        setInitialQuestion(prompt);
        router.push("/chat");
    };

    const findSimilarMovies = () => {
        const prompt = `Suggest 2 movies similar to "${movie.title}" (${movie.year}).`;
        setInitialQuestion(prompt);
        router.push("/chat");
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4">
            <button
                onClick={askAboutMovie}
                className="btn btn-primary w-full sm:w-auto"
            >
                🤖 Ask AI about this movie
            </button>

            <button
                onClick={findSimilarMovies}
                className="btn btn-secondary w-full sm:w-auto"
            >
                🎬 Find similar movies
            </button>
        </div>
    );
}
