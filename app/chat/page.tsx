import { Metadata } from "next";
import ChatPage from "./chat";

export const metadata: Metadata = {
    title: "Chat",
    description: "Chat with AI to get movie recommendations and details",
    icons: {
        icon: "/logo.ico",
    },
};

export default ChatPage;
