export function TableLoading() {
    return (
        <>
            {/* DESKTOP TABLE SKELETON */}
            <div className="hidden md:block overflow-x-auto rounded-xl border bg-base-100">
                <table className="table">
                    <thead className="bg-accent text-accent-content">
                        <tr>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Genres</th>
                            <th>Rating</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 7 }).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td>
                                    <div className="h-4 bg-base-300 rounded w-40"></div>
                                </td>
                                <td>
                                    <div className="h-4 bg-base-300 rounded w-12"></div>
                                </td>
                                <td>
                                    <div className="flex gap-1">
                                        <div className="h-3 w-12 bg-base-300 rounded"></div>
                                        <div className="h-3 w-12 bg-base-300 rounded"></div>
                                    </div>
                                </td>
                                <td>
                                    <div className="h-4 w-14 bg-base-300 rounded"></div>
                                </td>
                                <td>
                                    <div className="h-8 w-20 bg-base-300 rounded"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MOBILE CARD SKELETON */}
            <div className="md:hidden space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse card bg-base-100 border shadow-sm"
                    >
                        <div className="card-body p-4 space-y-2">
                            <div className="h-4 bg-base-300 rounded w-2/3"></div>

                            <div className="flex justify-between">
                                <div className="h-3 bg-base-300 rounded w-12"></div>
                                <div className="h-3 bg-base-300 rounded w-10"></div>
                            </div>

                            <div className="flex gap-1">
                                <div className="h-3 w-12 bg-base-300 rounded"></div>
                                <div className="h-3 w-12 bg-base-300 rounded"></div>
                            </div>

                            <div className="h-8 bg-base-300 rounded w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
