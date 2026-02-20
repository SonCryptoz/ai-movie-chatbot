"use client";

import { useRouter } from "next/navigation";
import { THEMES, useThemeStore } from "@/store/use-theme-store";
import ChatPreview from "@/components/chat/preview";

const SettingsPage = () => {
    const router = useRouter();
    const { theme, setTheme } = useThemeStore();

    return (
        <div className="container mx-auto max-w-7xl px-4 pt-10 pb-10">
            <div className="space-y-10">
                {/* HEADER */}
                <div className="flex items-center justify-between gap-3">
                    <button
                        onClick={() => router.back()}
                        className="btn btn-primary btn-sm gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <span className="hidden sm:inline">Back</span>
                    </button>

                    <div className="text-center sm:text-right">
                        <h2 className="text-2xl font-bold">Settings</h2>
                        <p className="opacity-60 text-sm">
                            Customize your preferences.
                        </p>
                    </div>
                </div>

                {/* CHAT PREVIEW */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                    <p className="text-sm text-base-content/60">
                        Preview the chat UI with the selected theme.
                    </p>

                    <div
                        data-theme={theme}
                    >
                        <ChatPreview />
                    </div>
                </div>

                {/* THEME SELECTOR */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Theme</h3>
                    <p className="text-base-content/70 text-sm">
                        Choose an interface theme.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
                        {THEMES.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                data-theme={t}
                                className={`
                                    group p-2 rounded-2xl border-4 transition-all
                                    hover:scale-[1.03] active:scale-[0.98]
                                    ${
                                        theme === t
                                            ? "border-primary shadow-md"
                                            : "border-base-300 hover:border-base-200"
                                    }
                                `}
                            >
                                <div className="h-6 w-full rounded-md bg-linear-to-r from-primary via-secondary to-accent mb-2" />
                                <div className="grid grid-cols-4 gap-1">
                                    <div className="h-3 rounded bg-primary" />
                                    <div className="h-3 rounded bg-secondary" />
                                    <div className="h-3 rounded bg-accent" />
                                    <div className="h-3 rounded bg-neutral" />
                                </div>
                                <span className="block text-[11px] mt-1 text-center font-medium truncate">
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
