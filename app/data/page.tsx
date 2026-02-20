import { Metadata } from "next";
import { Suspense } from "react";
import DataTablePage from "./data";

export const metadata: Metadata = {
    title: "Movie Data",
    description: "Browse and explore the movie database",
    icons: {
        icon: "/logo.ico",
    },
};

const Page = () => {
    return (
        <Suspense fallback={<div className="p-6">Loading...</div>}>
            <DataTablePage />
        </Suspense>
    );
};

export default Page;
