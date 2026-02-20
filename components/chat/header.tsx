"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Database, Settings, Trash2 } from "lucide-react";

import ConfirmModal from "@/components/ui/confirm-modal";

type Props = {
    onClear: () => void;
};

export default function ChatHeader({ onClear }: Props) {
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleConfirmClear = () => {
        onClear();
        setOpenConfirm(false);
    };

    return (
        <>
            <header className="navbar bg-base-100 border-b px-4">
                {/* Left */}
                <div className="flex-1">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-bold transition-transform duration-150 ease-out active:scale-95"
                    >
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                        <span>AI Movie Chatbot</span>
                    </Link>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    {/* Clear chat */}
                    <button
                        onClick={() => setOpenConfirm(true)}
                        className="
                            btn btn-neutral btn-circle
                            text-error
                            tooltip tooltip-bottom
                        "
                        data-tip="Clear chat"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Movie data */}
                    <Link
                        href="/data"
                        className="btn btn-secondary btn-circle tooltip tooltip-bottom"
                        data-tip="Movie dataset"
                    >
                        <Database className="w-5 h-5" />
                    </Link>

                    {/* Settings */}
                    <Link
                        href="/settings"
                        className="btn btn-primary btn-circle tooltip tooltip-bottom"
                        data-tip="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </Link>
                </div>
            </header>

            {/* Confirm modal */}
            <ConfirmModal
                open={openConfirm}
                title="Clear conversation and movie panel?"
                description="This will remove all messages and movie panel. This action cannot be undone!."
                confirmText="Clear"
                cancelText="Cancel"
                onConfirm={handleConfirmClear}
                onCancel={() => setOpenConfirm(false)}
            />
        </>
    );
}
