"use client";

import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { Film } from "lucide-react";

import ChatMessages from "./messages";
import ChatInput from "./input";
import MoviePanel from "../movie/movie-panel";
import ChatHeader from "./header";

import type { MoviePanelData } from "@/lib/types";
import ChatSuggestions from "./suggestions";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type Props = {
    messages: Message[];
    moviePanels: MoviePanelData[];
    onSend: (message: string) => void;
    onClear: () => void;
    loading: boolean;
    initialQuestion?: string;
};

export default function ChatLayout({
    messages,
    moviePanels,
    onSend,
    onClear,
    loading,
    initialQuestion,
}: Props) {
    const panelRef = useRef<HTMLDivElement>(null);
    const prevLenRef = useRef(0);

    useEffect(() => {
        const currentLen = moviePanels.length;
        const prevLen = prevLenRef.current;

        if (prevLen > 0 && currentLen > prevLen) {
            const container = panelRef.current;
            const lastPanel = container?.lastElementChild as HTMLElement | null;

            if (lastPanel) {
                lastPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }

        prevLenRef.current = currentLen;
    }, [moviePanels.length]);

    return (
        <div className="flex h-screen flex-col bg-base-200">
            <ChatHeader onClear={onClear} />

            <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
                {/* Chat */}
                <section className="order-1 flex flex-1 flex-col bg-base-100 lg:order-1 lg:border-r">
                    <div className="h-[40vh] overflow-y-auto space-y-6 p-4 lg:h-full">
                        <ChatMessages messages={messages} />
                        <div className="bg-base-100">
                            <ChatSuggestions
                                onSelect={onSend}
                                loading={loading}
                                hidden={messages.length > 1}
                            />
                        </div>
                    </div>

                    <ChatInput
                        onSend={onSend}
                        loading={loading}
                        initialValue={initialQuestion}
                    />
                </section>

                {/* Movie panels */}
                <aside className="z-1 order-2 flex-1 shrink-0 border-b bg-base-200 lg:order-2 lg:border-b-0 lg:border-l">
                    <div
                        ref={panelRef}
                        className="h-[45vh] overflow-y-auto space-y-6 p-4 lg:h-full"
                    >
                        {moviePanels.length === 0 ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="flex flex-col items-center gap-2 text-center text-sm opacity-60">
                                    <div className="flex gap-2">
                                        <MessageCircle className="h-7 w-7" />
                                        <Film className="h-7 w-7" />
                                    </div>
                                    <span>
                                        Ask about movies to see details here
                                    </span>
                                </div>
                            </div>
                        ) : (
                            moviePanels.map((panel, i) => {
                                const isLast = i === moviePanels.length - 1;

                                return (
                                    <div
                                        key={i}
                                        className={`card rounded-xl p-3 ${
                                            isLast ? "animate-fade-in" : ""
                                        }`}
                                    >
                                        <MoviePanel data={panel} />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </aside>
            </main>
        </div>
    );
}
