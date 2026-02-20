"use client";

import { Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    onSelect: (question: string) => void;
    loading?: boolean;
    hidden?: boolean;
};

type Suggestion = {
    text: string;
    icon: React.ReactNode;
};

const ALL_SUGGESTIONS: Suggestion[] = [
    {
        text: "Recommend a highly rated animated movie",
        icon: <Film className="h-4 w-4" />,
    },
    {
        text: "Find an animation with rating above 7",
        icon: <Film className="h-4 w-4" />,
    },
    {
        text: "Best animated movies",
        icon: <Film className="h-4 w-4" />,
    },
    {
        text: "Top rated family movie",
        icon: <Film className="h-4 w-4" />,
    },
    {
        text: "Compare Zootopia with Avatar",
        icon: <Film className="h-4 w-4" />,
    },
    {
        text: `Suggest 2 movies similar to "Greenland 2: Migration" (2026)`,
        icon: <Film className="h-4 w-4" />,
    },
];

function pickRandom<T>(arr: T[], n: number) {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

export default function ChatSuggestions({
    onSelect,
    loading = false,
    hidden = false,
}: Props) {
    if (hidden) return null;

    const suggestions = pickRandom(ALL_SUGGESTIONS, 3);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap gap-3 p-4"
            >
                {suggestions.map((s) => (
                    <motion.button
                        key={s.text}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(s.text)}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-full border 
                                   px-3 py-1.5 text-xs sm:text-sm
                                   bg-base-100 shadow-sm
                                   hover:bg-base-200 transition
                                   cursor-pointer
                                   disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {s.icon}
                        <span className="whitespace-nowrap">{s.text}</span>
                    </motion.button>
                ))}
            </motion.div>
        </AnimatePresence>
    );
};