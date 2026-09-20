import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image.tmdb.org",
                pathname: "/**",
            },
        ],
    },
    
    // Chuyển tiếp API từ Vercel sang Render
    async rewrites() {
        const rawUrl = process.env.RENDER_BACKEND_URL;
        if (rawUrl) {
            const backendUrl = rawUrl.replace(/\/+$/, "");
            return [
                {
                    source: "/api/:path*",
                    destination: `${backendUrl}/api/:path*`,
                },
            ];
        }
        return [];
    },
};

export default nextConfig;