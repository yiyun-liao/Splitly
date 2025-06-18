import { LogoGif } from "../gif/logoGif";

export function LogInScreen({ text = "登入中..." }) {
    return (
        <div 
            className="flex flex-col items-center gap-4 justify-center  text-zinc-600 text-base bg-sp-blue-100"
            style={{ height: "100vh" }}
        >
            <LogoGif
                interval={300}
                className="w-24 h-24 object-contain animate-float"
            />
            <span className=" animate-pulse">{text}</span>
        </div>
    );
}
