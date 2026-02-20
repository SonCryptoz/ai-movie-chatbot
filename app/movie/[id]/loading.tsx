export default function Loading() {
    return (
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-5 sm:py-8">
            {/* HEADER */}
            <div className="flex justify-between mb-4 sm:mb-6">
                <div className="h-8 w-20 bg-base-300 rounded animate-pulse" />
                <div className="h-6 w-12 bg-base-300 rounded animate-pulse" />
            </div>

            {/* MAIN */}
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5 md:gap-8">
                {/* POSTER */}
                <div className="flex justify-center md:block">
                    <div className="relative aspect-2/3 w-2/3 sm:w-1/2 md:w-full bg-base-300 rounded-xl animate-pulse" />
                </div>

                {/* INFO */}
                <div className="space-y-3 sm:space-y-4">
                    <div>
                        <div className="h-7 w-2/3 bg-base-300 rounded animate-pulse" />
                        <div className="h-4 w-1/3 bg-base-300 rounded animate-pulse mt-2" />
                    </div>

                    {/* GENRES */}
                    <div className="flex gap-2">
                        <div className="h-6 w-16 bg-base-300 rounded animate-pulse" />
                        <div className="h-6 w-16 bg-base-300 rounded animate-pulse" />
                        <div className="h-6 w-16 bg-base-300 rounded animate-pulse" />
                    </div>

                    {/* STATS */}
                    <div className="stats stats-vertical sm:stats-horizontal shadow">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="stat">
                                <div className="h-4 w-16 bg-base-300 rounded animate-pulse" />
                                <div className="h-6 w-20 bg-base-300 rounded animate-pulse mt-2" />
                            </div>
                        ))}
                    </div>

                    {/* OVERVIEW */}
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-base-300 rounded animate-pulse" />
                        <div className="h-4 w-full bg-base-300 rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-base-300 rounded animate-pulse" />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4">
                        <div className="h-10 w-full sm:w-48 bg-base-300 rounded animate-pulse" />
                        <div className="h-10 w-full sm:w-48 bg-base-300 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};
