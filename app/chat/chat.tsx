"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useChatStore } from "@/store/use-chat-store";
import ChatLayout from "@/components/chat/layout";
import { Movie } from "@/lib/types";

const ChatPage = () => {
    const messages = useChatStore((s) => s.messages);
    const addMessage = useChatStore((s) => s.addMessage);
    const clearMessages = useChatStore((s) => s.clearMessages);

    const moviePanels = useChatStore((s) => s.moviePanels);
    const addMoviePanel = useChatStore((s) => s.addMoviePanel);
    const clearMoviePanels = useChatStore((s) => s.clearMoviePanels);

    const initialQuestion = useChatStore((s) => s.initialQuestion);
    const clearInitialQuestion = useChatStore((s) => s.clearInitialQuestion);

    const [loading, setLoading] = useState(false);
    const hasAutoSent = useRef(false);

    const handleSend = useCallback(
        async (text: string) => {
            if (!text.trim() || loading) return;

            addMessage({ role: "user", content: text });
            setLoading(true);

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question: text }),
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Server error");
                }

                const data = await res.json();

                const movies: Movie[] = data.compare || [];
                const recs = data.recommendations || [];
                const mode: "single" | "compare" | "recommend" =
                    data.mode || "single";

                if (!movies.length) {
                    addMessage({
                        role: "assistant",
                        content: "No suitable movies found.",
                    });
                    return;
                }

                let reply = "";

                if (mode === "single") {
                    const m = movies[0];
                    const rec = recs.find(
                        (r: { id: string | number }) =>
                            Number(r.id) === Number(m.id),
                    );

                    reply = `${m.title} (${m.year}) - ⭐ ${m.rating.toFixed(1)}`;
                    if (
                        rec &&
                        typeof rec.reason === "string" &&
                        rec.reason.trim() !== ""
                    ) {
                        reply += `\n${rec.reason.trim()}`;
                    }
                } else {
                    reply = movies
                        .map((m: Movie) => {
                            const rec = recs.find(
                                (r: { id: string | number }) =>
                                    Number(r.id) === Number(m.id),
                            );

                            let line = `${m.title} (${m.year}) - ⭐ ${m.rating.toFixed(1)}`;

                            if (
                                rec &&
                                typeof rec.reason === "string" &&
                                rec.reason.trim() !== ""
                            ) {
                                line += `\n${rec.reason.trim()}`;
                            }

                            return line;
                        })
                        .join("\n\n");
                }

                addMessage({ role: "assistant", content: reply });

                addMoviePanel({
                    main: data.main,
                    compare: data.compare,
                    genres: data.genres,
                    radar: data.radar,
                    ratings: data.ratings,
                    mode,
                });
            } catch (err) {
                console.error("❌ Chat error:", err);
                addMessage({
                    role: "assistant",
                    content: "❌ Something went wrong. Please try again.",
                });
            } finally {
                setLoading(false);
            }
        },
        [loading, addMessage, addMoviePanel],
    );

    useEffect(() => {
        if (initialQuestion && !hasAutoSent.current) {
            hasAutoSent.current = true;
            handleSend(initialQuestion);
            clearInitialQuestion();
        }
    }, [initialQuestion, handleSend, clearInitialQuestion]);

    const handleClear = () => {
        clearMessages();
        clearMoviePanels();
        hasAutoSent.current = false;
    };

    return (
        <ChatLayout
            moviePanels={moviePanels}
            messages={messages}
            onSend={handleSend}
            onClear={handleClear}
            loading={loading}
            initialQuestion={initialQuestion}
        />
    );
};

export default ChatPage;
