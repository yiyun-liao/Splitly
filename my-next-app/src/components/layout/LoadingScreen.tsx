import { FlowerGif } from "../gif/flowerGif";
import IconButton from "../ui/IconButton/IconButton";
import Button from "../ui/Button/Button";
import clsx from "clsx";
import { useIsMobile } from "@/hooks/useIsMobile";


export function LoadingScreen({ text = "資料載入中..." }) {
        const isMobile = useIsMobile();
        const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
        const navStyleClass = clsx("box-border py-4 flex flex-col justify-start gap-2 bg-sp-white-40","transition-all duration-300 ease-in-out", "min-w-18 items-center")
        const navDivClass = clsx("w-full flex flex-col justify-start gap-2 py-3 px-3", "items-center") 
        const navFunctionClass = clsx("w-full flex flex-col items-start justify-start p-1 gap-2 rounded-xl","bg-sp-white-60 shadow",)
        const headerClass = clsx("w-full mb-4 flex shrink-0 bg-sp-blue-300 rounded-xl transition-opacity duration-200",)

    return (
        <div 
            className="flex flex-col items-center justify-center gap-4  text-zinc-600 text-base"
            style={{ height: "100vh" }}
        >
            <div className="fixed inset-0 z-10 flex flex-col items-center justify-center text-zinc-600 text-base">
                <FlowerGif
                    interval={600}
                    className="w-24 h-24 object-contain animate-float"
                />
                <span className="animate-pulse">{text}</span>
            </div>
            {isMobile ? (
                <div 
                    className="fixed top-0 flex flex-col items-center gap-2 w-full box-border justify-start px-2 py-2 bg-sp-blue-100" 
                    style={{opacity: 0.2, pointerEvents: 'none'}}
                >
                    <div className="flex w-full ">
                        <div className="shrink-0 flex items-center justify-start gap-2">
                            <IconButton
                                icon='solar:reorder-outline'
                                size='sm'
                                variant='text-button'
                                color='zinc'
                                type= 'button'
                                onClick={() => {}} 
                            />
                        </div>
                        <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                            <div className="h-9 w-9 bg-sp-blue-500 border-zinc-50/10 rounded-xl overflow-hidden" />  {/* ImageButton */}
                        </div>
                        <div className="shrink-0 flex items-center justify-start gap-2"> 
                            <button  
                                className="shrink-0 flex items-center justify-start gap-2 px-2 py-0.5 rounded-xl cursor-pointer bg-sp-yellow-200 text-sp-blue-500 hover:bg-sp-yellow-400 hover:text-sp-blue-600 active:bg-sp-yellow-600 active:text-sp-blue-700">
                                    <div className="flex items-center justify-start -space-x-2">
                                        {Array.from({ length: 3 }, (_, index) => {
                                            return(
                                                <div key={index} className="h-8 w-8 rounded-2xl overflow-hidden bg-sp-blue-500 border-2 border-zinc-100"/> //avatar
                                            )}
                                        )}
                                    </div>
                            </button>
                        </div>
                    </div>
                    <main  className="overscroll-none py-2 px-4 flex-1">
                            <div  className={`py-3 rounded-2xl px-3 bg-sp-blue-200 flex flex-col gap-2 w-full h-full}`}>
                                {Array.from({ length: 6 }, (_, index) => {
                                    return(
                                        <div key={index} className="w-[520px] h-[64px] bg-sp-blue-300 rounded-2xl">
                                        </div>
                                    )}
                                )}
                            </div>
                    </main>
                    <div className="flex justify-around items-end h-13 py-2 w-full fixed bottom-0 left-0">
                        {Array.from({ length: 5 }, (_, index) => {
                            return(
                                <IconButton
                                    key={index}
                                    icon=''
                                    size='md'
                                    variant='solid'
                                    color='primary'
                                    type= 'button'
                                    onClick={() => []}  
                                />
                            )}
                        )}
                    </div>
                </div>
            ) : (                
                <div 
                    className="flex items-start justify-center overflow-x-hidden w-screen h-full  bg-sp-blue-100"
                    style={{opacity: 0.2, pointerEvents: 'none'}}
                >
                    <div className="shrink-0 box-border">
                        <nav className={navStyleClass} style={{ height: "100vh" }}>
                            <div className={navDivClass}>
                                <img
                                    src="/logo/logo.svg"
                                    alt="Splitly"
                                    className="w-9 h-9 object-contain "
                                />
                            </div>
                            <div className={`${navDivClass} flex-1 `}>
                                <div className={navFunctionClass}>
                                    {Array.from({ length: 2 }, (_, index) => {
                                        return(
                                            <IconButton
                                                key={index}
                                                icon=''
                                                size='md'
                                                variant='solid'
                                                color='primary'
                                                type= 'button'
                                                onClick={() => []}  
                                                />
                                        )}
                                    )}
                                </div>
                            </div>
                            <div className={`${navDivClass} ${scrollClass}`}>
                                {Array.from({ length: 3 }, (_, index) => {
                                    return(
                                        <div key={index} className="h-12 w-12 bg-sp-blue-500 border-zinc-50/10 rounded-xl overflow-hidden" />  // ImageButton 
                                    )}
                                )}
                            </div>
                        </nav>
                    </div>
                    <div className="py-4 h-full w-full max-w-[2080px] box-border flex flex-col items-center justify-start gap-2">
                        <div className="flex items-center gap-2 w-full box-border justify-between px-6 py-2">
                            <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                                <div className="h-12 w-12 bg-sp-blue-500 border-zinc-50/10 rounded-xl overflow-hidden" />  {/* ImageButton */}
                            </div>
                            <div className="shrink-0 flex items-center justify-start gap-2">
                                <Button
                                    size='sm'
                                    width='fit'
                                    variant='solid'
                                    color='primary'
                                    leftIcon='solar:clipboard-add-linear'
                                    onClick={() => {}}
                                    >
                                        新增紀錄
                                </Button> 
                                <button  
                                    className="shrink-0 flex items-center justify-start gap-2 px-2 py-0.5 rounded-xl cursor-pointer bg-sp-yellow-200 text-sp-blue-500 hover:bg-sp-yellow-400 hover:text-sp-blue-600 active:bg-sp-yellow-600 active:text-sp-blue-700">
                                    <div className="flex items-center justify-start -space-x-2">
                                        {Array.from({ length: 3 }, (_, index) => {
                                            return(
                                                <div key={index} className="h-8 w-8 rounded-2xl overflow-hidden bg-sp-blue-500 border-2 border-zinc-100"/> //avatar
                                            )}
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-start justify-start box-border px-6 gap-6 w-full h-full overflow-hidden text-zinc-700">
                            <div className="max-w-2xl">
                                <div className={headerClass}>
                                    <Button
                                        size='sm'
                                        width='full'
                                        leftIcon='solar:waterdrops-bold'
                                        variant= 'solid'
                                        color= 'primary'
                                        onClick={() => { }}
                                        >
                                            專案支出
                                    </Button>
                                    <Button
                                        size='sm'
                                        width='full'
                                        leftIcon='solar:waterdrop-bold'
                                        variant='text-button'
                                        color='primary'
                                        onClick={() => {}}
                                        >
                                            個人支出
                                    </Button>
                                </div>
                                <div  className="flex-1">
                                    <div id="expense-list" className={`py-3 rounded-2xl h-fit px-3 bg-sp-blue-200}`}>
                                        <div className="flex flex-col gap-2">
                                            {Array.from({ length: 6 }, (_, index) => {
                                                return(
                                                    <div key={index} className="w-[520px] h-[64px] bg-sp-blue-300 rounded-2xl">
                                                    </div>
                                                )}
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <div  className="flex-1">
                                    <div className={`py-3 rounded-2xl h-fit px-3 bg-sp-blue-200}`}>
                                        <div className="flex flex-col gap-2">
                                            {Array.from({ length: 4 }, (_, index) => {
                                                return(
                                                    <div key={index} className="w-full h-[120px] bg-sp-blue-300 rounded-2xl">
                                                    </div>
                                                )}
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
