"use client";

import { Database, Settings, Trash2 } from "lucide-react";
import Image from "next/image";

import ChatMessagesDemo from "./messages-demo";

type Message = {
    role: "user" | "assistant";
    content: string;
};

const PREVIEW_MESSAGES: Message[] = [
    {
        role: "assistant",
        content: "Hi! I can help you with movie recommendations 🎬",
    },
    {
        role: "user",
        content: "Recommend me a sci-fi movie similar to Interstellar",
    },
    {
        role: "assistant",
        content:
            "You might enjoy *Arrival (2016)* or *The Martian (2015)* — both focus on science, space, and emotional storytelling.",
    },
];

export default function ChatPreview() {
    return (
        <div className="flex h-full flex-col rounded-2xl overflow-hidden border bg-accent">
            {/* Header */}
            <header className="navbar bg-base-100 border-b px-4 min-h-12 shrink-0">
                <div className="flex-1 items-center flex gap-2">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                    <span>AI Movie Chatbot</span>
                </div>

                <div className="flex items-center gap-1">
                    {/* Delete conversation */}
                    <div
                        // onClick={onClear}
                        className="
                            btn btn-neutral btn-circle
                            text-error btn-sm
                            tooltip tooltip-bottom
                        "
                    >
                        <Trash2 className="w-4 h-4" />
                    </div>
                    <div className="btn btn-secondary btn-circle btn-sm cursor-default">
                        <Database className="w-4 h-4" />
                    </div>
                    <div className="btn btn-primary btn-circle btn-sm cursor-default">
                        <Settings className="w-4 h-4" />
                    </div>
                </div>
            </header>

            {/* Chat body */}
            <div className="flex-1 overflow-y-auto bg-base-100">
                <div className="pointer-events-none">
                    <ChatMessagesDemo messages={PREVIEW_MESSAGES} />
                </div>
            </div>

            {/* Input */}
            <div className="shrink-0 border-t bg-base-100 p-3">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Ask about movies..."
                        className="input input-bordered input-sm w-full"
                        disabled
                    />
                    <button className="btn btn-primary btn-sm btn-square">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path d="M3.4 20.4l17.45-8.23c.79-.37.79-1.57 0-1.94L3.4 1.99c-.7-.33-1.5.18-1.5.94l.01 6.4c0 .49.36.91.85.99l9.5 1.67-9.5 1.67a1 1 0 00-.85.99l-.01 6.4c0 .76.8 1.27 1.5.94z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
