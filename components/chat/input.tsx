"use client";

import { useState } from "react";

type Props = {
    onSend?: (message: string) => Promise<void> | void;
    initialValue?: string;
    loading?: boolean;
};

export default function ChatInput({
    onSend,
    initialValue,
    loading = false,
}: Props) {
    const [value, setValue] = useState(initialValue || "");

    const handleSend = async () => {
        if (!value.trim() || loading) return;
        const msg = value;
        setValue("");
        await onSend?.(msg);
    };

    return (
        <div className="border-t p-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Ask about movies..."
                    className="input input-bordered w-full focus:ring-0 focus:border-base-300"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={loading}
                />

                <button
                    className="btn btn-primary btn-square"
                    onClick={handleSend}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path d="M3.4 20.4l17.45-8.23c.79-.37.79-1.57 0-1.94L3.4 1.99c-.7-.33-1.5.18-1.5.94l.01 6.4c0 .49.36.91.85.99l9.5 1.67-9.5 1.67a1 1 0 00-.85.99l-.01 6.4c0 .76.8 1.27 1.5.94z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
