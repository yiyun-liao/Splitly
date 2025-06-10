import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button"
import ImageButton from "@/components/ui/ImageButton"
import IconButton from "@/components/ui/IconButton";
import { useIsMobile } from "@/hooks/useIsMobile";
import { formatNumber, formatPercent } from "@/utils/parseNumber";
import { useProjectStats, useUserStats } from "@/hooks/usePaymentStats";
import { useAuth } from "@/contexts/AuthContext";


export default function PaymentOverview(){
    // receipt-way
    const [viewExpenseWay, setViewExpenseWay] = useState<"shared" | "personal">("shared");
    const [openChart, setOpenChart] = useState(true);

    // get group and personal data
    const {userData} = useAuth()
    const projectStats = useProjectStats();
    const userId = userData?.uid || ""
    const userStats = useUserStats(userId)
    // console.log(projectStats, userStats)

    // css
    const isMobile = useIsMobile();
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const lastScrollTop = useRef(0);

    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;
    
        const handleScroll = () => {
            const currentTop = scrollEl.scrollTop;

            if (currentTop > lastScrollTop.current) {
              setIsScrolled(true); // 向下捲動
            } else if (currentTop < lastScrollTop.current) {
              setIsScrolled(false); // 向上捲動
            }
        
            lastScrollTop.current = currentTop;        
        };
    
        scrollEl.addEventListener("scroll", handleScroll);
        return () => scrollEl.removeEventListener("scroll", handleScroll);
    }, []);

    const isMobileClass = clsx("shrink-0 h-full flex flex-col box-border overflow-hidden text-zinc-700 ",
        {
            "w-full ": isMobile === true,
            "w-xl": isMobile === false,  
        }
    )
    const headerClass = clsx("w-full mb-4 flex shrink-0 bg-sp-blue-300 rounded-xl transition-opacity duration-200",
        {"opacity-0 pointer-events-none h-0": isMobile && isScrolled }
    )
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")

    return(
        <div id="project-analysis" className={isMobileClass}>
            <div id="Expense-splitting" className={headerClass}>
                <Button
                    size='sm'
                    width='full'
                    leftIcon='solar:waterdrops-bold'
                    variant= {viewExpenseWay == 'shared' ? 'solid' : 'text-button'}
                    color= 'primary'
                    onClick={() => setViewExpenseWay("shared")}
                    >
                        專案支出
                </Button>
                <Button
                    size='sm'
                    width='full'
                    leftIcon='solar:waterdrop-bold'
                    variant={viewExpenseWay == 'personal' ? 'solid' : 'text-button'}
                    color='primary'
                    onClick={() => setViewExpenseWay("personal")}
                    >
                        個人支出
                </Button>
            </div>
            <div ref={scrollRef} className={`flex-1 ${scrollClass} `}>
                {/* <div id="project-analysis-chart" className="px-3 py-3 mb-4 rounded-2xl h-fit overflow-hidden bg-sp-blue-300 ">
                    <div id="project-analysis-chart"  className="py-2 px-4 w-full overflow-hidden">
                        <div className="flex items-center justify-start gap-2">
                            <p className="text-xl font-medium truncate w-full"> 開銷總覽</p>
                            <div className="shrink-0">
                                <IconButton
                                    icon= {openChart ? "solar:minimize-linear" : "solar:maximize-outline"}
                                    size='md'
                                    variant= 'text-button'
                                    color='primary'
                                    type= 'button'
                                    onClick={() => setOpenChart((prev) => (!prev))} 
                                />
                            </div>
                        </div>
                        {openChart && (
                            <img src="https://res.cloudinary.com/ddkkhfzuk/image/upload/test.JPG" width={480} height={200} alt="圖" />
                        )}
                    </div>
                </div> */}
                <div id="expense-list" className="px-3 py-3 rounded-2xl h-fit bg-sp-blue-200">
                    <div id="expense-list-header"  className="py-2 px-4 flex items-center gap-2 w-full justify-between overflow-hidden">
                        <p className="text-xl font-medium truncate min-w-0 max-w-100 pb-2"> 類別檢視</p>
                    </div>
                    {viewExpenseWay === "shared" && ( 
                        <div className="py-2 px-4">
                            {projectStats  && (projectStats.stats.map(cat => {
                                return(
                                    <div key={cat.id} className="w-full">
                                        <div id="expense-list-token" className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
                                            <div className="h-full w-full flex items-center justify-start gap-2">
                                                <ImageButton
                                                    image={cat.imgURL}
                                                    size='md'
                                                    imageName= {cat.name_en}
                                                    >
                                                </ImageButton> 
                                                <p className="text-base font-semibold truncate">{cat.name_zh}</p>
                                            </div>
                                            <div className="shrink-0 text-right overflow-hidden ">
                                                <p className="text-base font-semibold  truncate">${formatNumber(cat.totalAmount)}</p>
                                                <p className="text-sm truncate">{formatPercent(cat.percent)}</p>
                                            </div>
                                        </div>
                                        <div className="w-full h-0.25 bg-sp-blue-300"></div>
                                    </div>
                                )
                            }))}
                        </div>
                    )}
                    {viewExpenseWay === "personal" && ( 
                        <div className="py-2 px-4">
                            {userStats  && (userStats.stats.map(cat => {
                                return(
                                    <div key={cat.id} className="w-full">
                                        <div id="expense-list-token" className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
                                            <div className="h-full w-full flex items-center justify-start gap-2">
                                                <ImageButton
                                                    image={cat.imgURL}
                                                    size='md'
                                                    imageName= {cat.name_en}
                                                    >
                                                </ImageButton> 
                                                <p className="text-base font-semibold truncate">{cat.name_zh}</p>
                                            </div>
                                            <div className="shrink-0 text-right overflow-hidden ">
                                                <p className="text-base font-semibold  truncate">${formatNumber(cat.totalAmount)}</p>
                                                <p className="text-sm truncate">{formatPercent(cat.percent)}</p>
                                            </div>
                                        </div>
                                        <div className="w-full h-0.25 bg-sp-blue-300"></div>
                                    </div>
                                )
                            }))}
                        </div>
                    )}
                </div>
                {isMobile && (
                    <div className="shrink-0 w-full pb-5 min-h-5 " />
                )}
            </div>
        </div>
    )
}