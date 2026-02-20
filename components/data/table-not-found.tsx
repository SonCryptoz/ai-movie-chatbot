import { SearchX } from "lucide-react";

type Props = {
    message?: string;
};

export function TableNotFound({ message }: Props) {
    return (
        <div className="rounded-xl border bg-base-100 py-12 text-center space-y-3">
            <SearchX className="mx-auto w-10 h-10 opacity-50" />

            <p className="font-semibold">{message || "No movies found"}</p>

            <p className="text-sm opacity-60">
                Try changing your search or filters
            </p>
        </div>
    );
};
