import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MoviePanelData } from "@/lib/types";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type ChatStore = {
    messages: Message[];
    moviePanels: MoviePanelData[];

    addMessage: (msg: Message) => void;
    clearMessages: () => void;

    addMoviePanel: (data: MoviePanelData) => void;
    clearMoviePanels: () => void;

    initialQuestion?: string;
    setInitialQuestion: (q?: string) => void;
    clearInitialQuestion: () => void;
};

const INITIAL_MESSAGES: Message[] = [
    {
        role: "assistant",
        content:
            "Greetings! Ask me for movie recommendations, comparisons, or reviews 🎬",
        
    },
];

export const useChatStore = create<ChatStore>()(
    persist(
        (set) => ({
            messages: INITIAL_MESSAGES,
            moviePanels: [],

            /* ======================
               CHAT
            ====================== */
            addMessage: (msg) =>
                set((state) => ({
                    messages: [...state.messages, msg],
                })),

            clearMessages: () =>
                set({
                    messages: INITIAL_MESSAGES,
                }),

            /* ======================
               MOVIE PANELS (HISTORY)
            ====================== */
            addMoviePanel: (data) =>
                set((state) => ({
                    moviePanels: [...state.moviePanels, data],
                })),

            clearMoviePanels: () =>
                set({
                    moviePanels: [],
                }),

            /* ======================
               AUTO QUESTION
            ====================== */
            initialQuestion: undefined,
            setInitialQuestion: (q) => set({ initialQuestion: q }),
            clearInitialQuestion: () => set({ initialQuestion: undefined }),
        }),
        {
            name: "chat-storage",
            partialize: (state) => ({
                messages: state.messages,
                moviePanels: state.moviePanels, // persist luôn panel history
            }),
        },
    ),
);
