"use client";

type Props = {
    role: "user" | "assistant";
    content: string;
};

export default function ChatMessage({ role, content }: Props) {
    const isUser = role === "user";

    if (isUser) {
        return (
            <div className="chat chat-end">
                <div className="chat-bubble bg-primary text-primary-content">
                    {content}
                </div>
            </div>
        );
    }

    if (!content.includes("\n\n") && !content.includes("\n")) {
        return (
            <div className="chat chat-start">
                <div className="chat-bubble bg-base-200 text-base-content">
                    {content}
                </div>
            </div>
        );
    }

    const blocks = content.split("\n\n");

    return (
        <div className="chat chat-start">
            <div className="chat-bubble bg-base-200 text-base-content space-y-3">
                {blocks.map((block, i) => {
                    const lines = block.split("\n");
                    const titleLine = lines[0] || "";
                    const reason = lines
                        .slice(1)
                        .join(" ")
                        .replace("undefined", "")
                        .trim();

                    return (
                        <div key={i} className="space-y-1">
                            <div className="font-semibold">{titleLine}</div>
                            {reason && (
                                <div className="text-sm opacity-80 italic">
                                    {reason}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
