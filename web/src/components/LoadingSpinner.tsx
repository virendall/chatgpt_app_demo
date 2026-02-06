export function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 gap-4">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm font-medium animate-pulse">Loading journey data...</p>
        </div>
    );
}
