"use client";

import ChatMessage from "./message";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type Props = {
    messages: Message[];
};

export default function ChatMessagesDemo({ messages }: Props) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))}
        </div>
    );
}
