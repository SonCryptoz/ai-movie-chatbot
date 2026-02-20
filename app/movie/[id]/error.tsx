"use client";

import Link from "next/link";

export default function Error({
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-12 text-center space-y-4">
            <p className="text-error font-semibold">Failed to load movie 😢</p>

            <div className="flex justify-center gap-3">
                <button onClick={reset} className="btn btn-error btn-sm">
                    Retry
                </button>

                <Link href="/data" className="btn btn-outline btn-sm">
                    Back to list
                </Link>
            </div>
        </div>
    );
};
