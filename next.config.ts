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
        const backendUrl = process.env.RENDER_BACKEND_URL;
        if (backendUrl) {
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