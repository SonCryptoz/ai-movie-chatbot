"use client";

import { motion } from "framer-motion";

const BLOCKS = Array.from({ length: 120 });

export default function CinematicBlocksBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div
                className="
                grid grid-cols-12 md:grid-cols-16 gap-2 
                opacity-40
                "
            >
                {BLOCKS.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: i * 0.005,
                            duration: 0.6,
                        }}
                        whileHover={{
                            scale: 1.25,
                            y: -12,
                            zIndex: 10,
                        }}
                        className="
                        aspect-square rounded-md
                        bg-linear-to-br from-primary/40 via-secondary/30 to-accent/40
                        shadow-[0_0_20px_rgba(255,0,80,0.15)]
                        hover:shadow-[0_0_40px_rgba(255,0,120,0.4)]
                        transition-all
                        "
                    />
                ))}
            </div>

            {/* cinematic glow overlay */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-base-100 via-transparent to-base-100 opacity-40" />
        </div>
    );
}