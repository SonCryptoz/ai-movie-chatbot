"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./message";
import { useTypewriter } from "@/store/use-type-writer";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type Props = {
    messages: Message[];
};

export default function ChatMessages({ messages }: Props) {
    const last = messages[messages.length - 1];

    const typed = useTypewriter(
        last?.role === "assistant" ? last.content : "",
        25,
    );

    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto scroll khi có message mới hoặc khi đang type chữ
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length, typed]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => {
                const isLast = idx === messages.length - 1;
                const isTyping = isLast && msg.role === "assistant";

                return (
                    <ChatMessage
                        key={idx}
                        role={msg.role}
                        content={isTyping ? typed : msg.content}
                    />
                );
            })}

            {/* mốc để scroll xuống */}
            <div ref={bottomRef} />
        </div>
    );
};