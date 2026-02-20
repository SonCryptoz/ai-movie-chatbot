import type { Metadata } from "next";
import { Saira } from "next/font/google";

import "./globals.css";
import ThemeProvider from "./theme-provider";

const saira = Saira({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-saira",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "AI Movie Chatbot",
        template: "%s | AI Movie Chatbot",
    },
    description: "An AI chatbot for discovering and chatting about movies",
    icons: {
        icon: "/logo.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${saira.variable} antialiased app-bg`}>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
