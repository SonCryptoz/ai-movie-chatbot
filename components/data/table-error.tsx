type Props = {
    message?: string;
    onRetry?: () => void;
};

export function TableError({ message, onRetry }: Props) {
    return (
        <div className="rounded-xl border bg-base-100 py-10 text-center space-y-3">
            <p className="text-error font-semibold">
                {message || "Something went wrong 😢"}
            </p>
            {onRetry && (
                <button onClick={onRetry} className="btn btn-sm btn-error">
                    Retry
                </button>
            )}
        </div>
    );
};
