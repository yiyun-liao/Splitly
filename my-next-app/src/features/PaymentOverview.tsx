import clsx from "clsx";
import { useEffect, useRef, useState, useMemo } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useCategoryOptions } from "@/contexts/CategoryContext";

import Button from "@/components/ui/Button"
import ImageButton from "@/components/ui/ImageButton"
import IconButton from "@/components/ui/IconButton";
import ReceiptCardByCat from "./PaymentListSections/ReceiptCardByCat";
import CreatePayment from "./CreatePaymentSections/CreatePayment-main";
import { useProjectStats, useUserStats } from "@/hooks/usePaymentStats";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { formatNumber, formatPercent } from "@/utils/parseNumber";
import { GetPaymentData } from "@/types/payment";
import { Category } from "@/types/category";

type CategorySectionProps = {
    idx:number
    totalCat:number
    cat: {
        id: number;
        imgURL: string;
        name_en: string;
        name_zh: string;
        totalAmount: number;
        percent: number;
        groupedPayments: Record<string, GetPaymentData[]>;
        sortedDates: string[];
    };
    openCatListIndex: number | null;
    onToggle: () => void;
    userId: string;
    categoryOptions: Category[];
    viewExpenseWay:string;
    setEditPayment:(payment: GetPaymentData) => void;
    isMobile:boolean
  };

function CategorySection({ idx, cat,totalCat, openCatListIndex, onToggle, userId, categoryOptions,viewExpenseWay,setEditPayment, isMobile }: CategorySectionProps) {
    const isOpen = openCatListIndex === idx;
    const catParentClass = clsx(
        "flex items-center justify-start p-2 gap-2 h-16 rounded-lg cursor-pointer",
        "bg-sp-blue-200 hover:bg-sp-white-20 active:bg-sp-white-40",
        {"sticky top-0 z-3" : isOpen}
    )
    return (
        <div className="w-full relative">
            <div className={catParentClass} onClick={onToggle}>
                <div className="flex items-center gap-2 flex-1">
                    <ImageButton image={cat.imgURL} size="md" imageName={cat.name_en} />
                    <p className="text-base font-semibold truncate">{cat.name_zh}</p>
                </div>
                <div className="shrink-0 text-right overflow-hidden">
                    <p className="text-sm">{formatPercent(cat.percent)}</p>
                    <p className="text-lg font-semibold">${formatNumber(cat.totalAmount)}</p>
                </div>
                <IconButton
                    icon={isOpen ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                    size="md"
                    variant="text-button"
                    color="primary"
                    style={{ opacity: (cat.sortedDates.length > 0) ? 1 : 0 }}
                />
            </div>
            {!openCatListIndex && (idx + 1 < totalCat) && (
                <div className="w-full h-0.25 bg-sp-blue-300"></div>
            )}
            {isOpen && cat.sortedDates.map((date) => (
                <>
                    {cat.groupedPayments[date].map((payment, idx) => (
                        <div key={payment.id} onClick={() => setEditPayment(payment)}>
                            <ReceiptCardByCat
                                currentUserId={userId}
                                categoryList={categoryOptions}
                                payment={payment}
                                viewExpenseWay={viewExpenseWay}
                                isMobile={isMobile}
                            />
                            {idx + 1 < cat.sortedDates.length && (
                                <div className="w-full h-px bg-sp-blue-300" />
                            )}
                        </div>
                    ))}
                </>        
            ))}
        </div>
    );
  }


export default function PaymentOverview(){
    // receipt-way
    const [viewExpenseWay, setViewExpenseWay] = useState<"shared" | "personal">("shared");
    const [openCatListIndex, setOpenCatListIndex] = useState<number | null>(null);
    const [editPayment, setEditPayment] = useState<GetPaymentData | null>(null); //開啟 payment list
    // const [openChart, setOpenChart] = useState(true);

    // get group and personal data
    const {userData} = useAuth();
    const userId = userData?.uid || "";
    const { currentProjectUsers} = useCurrentProjectData();
    const { categoryOptions } = useCategoryOptions();

    const { stats: pStats } = useProjectStats();
    const { stats: uStats } = useUserStats(useAuth().userData?.uid || '');
    const stats = viewExpenseWay === 'shared' ? pStats : uStats;

    const statsWithGroups = useMemo(() => {
        return stats.map(cat => {
          const grouped: Record<string, GetPaymentData[]> = {};
          cat.payments.forEach(p => {
            const key = new Date(p.time).toISOString().slice(0, 10);
            (grouped[key] ||= []).push(p);
          });
          const sortedDates = Object.keys(grouped).sort((a, b) => +new Date(b) - +new Date(a));
          return { ...cat, groupedPayments: grouped, sortedDates };
        });
    }, [stats]);

    console.log(stats)
    // css
    const isMobile = useIsMobile();
    // 計算位移收合
    const scrollRef = useRef<HTMLDivElement>(null);
    const isScrolled = useScrollDirection(scrollRef, 5);

    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const isMobileClass = clsx("shrink-0 h-full flex flex-col box-border overflow-hidden text-zinc-700 ",
        {
            "w-full ": isMobile === true,
            "w-xl": isMobile === false,  
        }
    )
    const headerClass = clsx("w-full mb-4 flex shrink-0 bg-sp-blue-300 rounded-xl transition-opacity duration-200",
        {"opacity-0 pointer-events-none h-0": isMobile && isScrolled }
    )

    return(
        <div id="project-analysis" className={isMobileClass}>
            <>
                {editPayment && currentProjectUsers && (
                    <CreatePayment 
                        onClose={() => {
                            setEditPayment(null);
                        }}
                        initialPayload={editPayment || undefined} 
                    />
                )}
            </>
            <div id="Expense-splitting" className={headerClass}>
                <Button
                    size='sm'
                    width='full'
                    leftIcon='solar:waterdrops-bold'
                    variant= {viewExpenseWay == 'shared' ? 'solid' : 'text-button'}
                    color= 'primary'
                    onClick={() => { setViewExpenseWay('shared'); setOpenCatListIndex(null); }}
                    >
                        專案支出
                </Button>
                <Button
                    size='sm'
                    width='full'
                    leftIcon='solar:waterdrop-bold'
                    variant={viewExpenseWay == 'personal' ? 'solid' : 'text-button'}
                    color='primary'
                    onClick={() => { setViewExpenseWay('personal'); setOpenCatListIndex(null);}}
                    >
                        個人支出
                </Button>
            </div>
            <div ref={scrollRef} className={`flex-1 ${scrollClass} `}>
                <div id="expense-list" className={`px-3 py-3 rounded-2xl h-fit ${!isMobile && "bg-sp-blue-200"}`}>
                    <div id="expense-list-header"  className={`w-full ${!isMobile && "py-2 px-4"}`}>
                        <p className="text-xl font-medium truncate min-w-0 max-w-100 ">類別檢視</p>
                        <p className="text-base  min-w-0 max-w-100 pb-2">不包含轉帳紀錄</p>
                    </div>
                    <div className={!isMobile ? "py-2 px-4" : ""}>
                        {statsWithGroups.map((cat, idx) => (
                            <CategorySection
                                key={cat.id}
                                idx={idx}
                                totalCat = {statsWithGroups.length}
                                cat={cat}
                                openCatListIndex={openCatListIndex}
                                onToggle={() => setOpenCatListIndex(openCatListIndex === idx ? null : idx)}
                                userId={userId}
                                categoryOptions={categoryOptions || []}
                                viewExpenseWay={viewExpenseWay}
                                setEditPayment={setEditPayment}
                                isMobile={isMobile}
                            />
                        ))}
                    </div>
                </div>
                {isMobile && (
                    <div className="shrink-0 w-full pb-5 min-h-30 " />
                )}
            </div>
        </div>
    )
}





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