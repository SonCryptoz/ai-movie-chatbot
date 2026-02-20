"use client";

import { motion } from "framer-motion";
import { Sparkles, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { useChatStore } from "@/store/use-chat-store";
import Image from "next/image";

const PROMPTS = [
    "Find a family movie",
    "Show me an animation movie",
    "Compare Inception vs Interstellar",
    "Best movie about animals",
];

export default function Home() {
    const router = useRouter();
    const setInitialQuestion = useChatStore((s) => s.setInitialQuestion);

    const handlePrompt = (q: string) => {
        setInitialQuestion(q);
        router.push("/chat");
    };

    return (
        <main className="app-bg relative min-h-screen overflow-hidden bg-base-100 text-base-content">
            {/* BACKGROUND GLOW*/}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 blur-3xl" />

            {/* POSTER STRIP */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 0.1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute -top-24 left-1/2 -translate-x-1/2 flex gap-6 rotate-6"
            >
                {Array.from({ length: 9 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-64 w-40 rounded-xl bg-primary shadow-xl"
                    />
                ))}
            </motion.div>

            {/* CONTENT */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
            >
                {/* LOGO */}
                <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 rounded-full bg-base-200 p-5 shadow-xl"
                >
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                </motion.div>

                {/* TITLE */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
                    <span className="block bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        AI Movie Chatbot
                    </span>
                </h1>

                {/* TAGLINE */}
                <p className="mt-4 max-w-xl text-base sm:text-lg md:text-xl opacity-70">
                    Discover movies, compare them, and get smart recommendations
                    like a real film critic powered by AI.
                </p>

                {/* CTA */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10"
                >
                    <button
                        onClick={() =>
                            handlePrompt("Recommend a top movie in 2022")
                        }
                        className="btn btn-primary btn-lg gap-2 shadow-xl"
                    >
                        <PlayCircle className="w-5 h-5" />
                        Start Chatting
                    </button>
                </motion.div>

                {/* PROMPTS */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-14"
                >
                    <p className="mb-4 flex items-center justify-center gap-1 text-sm opacity-60">
                        <Sparkles className="w-4 h-4" />
                        Try these prompts
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 max-w-xl">
                        {PROMPTS.map((q) => (
                            <motion.button
                                key={q}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePrompt(q)}
                                className="badge badge-outline badge-lg cursor-pointer hover:bg-base-200 transition backdrop-blur"
                            >
                                {q}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </motion.section>

            {/* POSTER STRIP */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 0.1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex gap-6 rotate-6"
            >
                {Array.from({ length: 9 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-64 w-40 rounded-xl bg-secondary shadow-xl"
                    />
                ))}
            </motion.div>
        </main>
    );
}
