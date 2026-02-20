import { Metadata } from "next";
import DataTablePage from "./data";

export const metadata: Metadata = {
    title: "Movie Data",
    description: "Browse and explore the movie database",
    icons: {
        icon: "/logo.ico",
    },
};

export default DataTablePage;
