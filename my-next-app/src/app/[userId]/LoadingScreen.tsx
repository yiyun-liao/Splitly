export function LoadingScreen({ text = "資料載入中..." }) {
    return (
        <div 
            className="flex flex-col items-center justify-center  text-zinc-600 text-base animate-pulse"
            style={{ height: "100vh" }}
        >
            <span>{text}</span>
        </div>
    );
}
