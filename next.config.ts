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
    
    // Chuyển tiếp API từ Vercel sang Render trước khi kiểm tra file cục bộ
    async rewrites() {
        const rawUrl = process.env.RENDER_BACKEND_URL;
        if (!rawUrl) return [];

        const backendUrl = rawUrl.replace(/\/+$/, "");
        return {
            beforeFiles: [
                {
                    source: "/api/:path*",
                    destination: `${backendUrl}/api/:path*`,
                },
            ],
        };
    },
};

export default nextConfig;