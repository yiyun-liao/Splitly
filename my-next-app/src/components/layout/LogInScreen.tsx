export function LogInScreen({ text = "登入中..." }) {
    return (
        <div 
            className="flex flex-col items-center justify-center  text-zinc-600 text-base animate-pulse bg-amber-300"
            style={{ height: "100vh" }}
        >
            <span>{text}</span>
        </div>
    );
}
