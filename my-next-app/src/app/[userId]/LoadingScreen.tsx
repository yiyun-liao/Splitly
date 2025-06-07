export function LoadingScreen({ text = "資料載入中..." }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-zinc-600 text-base animate-pulse">
            <span>{text}</span>
        </div>
    );
}
