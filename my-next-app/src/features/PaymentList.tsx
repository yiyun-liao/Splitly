import { groupBy } from "lodash";
import { useEffect, useRef, useState, useMemo } from "react";
import clsx from "clsx";

import ReceiptCard from "./PaymentListSections/ReceiptCard";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useCategoryOptions } from "@/contexts/CategoryContext";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import CreatePayment from "./CreatePaymentSections/CreatePayment-main";
import { useIsMobile } from "@/hooks/useIsMobile";


export default function PaymentList(){
    const [isCreatePayment, setIsCreatePayment] = useState(false)
    const [showMyPayment, setShowMyPayment] = useState(false);
    const toggleAccountType = () => {
        setShowMyPayment(prev => (!prev));
    };
    
    // 處理卡片需要資料
    const { categoryOptions } = useCategoryOptions();

    const {userData} = useGlobalProjectData();
    const currentUserId = userData?.uid || "";

    const {currentPaymentList:list, currentProjectUsers} = useCurrentProjectData();
    const userList = currentProjectUsers || [];

    const filteredList = useMemo(() => {
        if (!list) return [];
        
        return list.filter(payment => {
            if (payment.account_type === 'personal' && !(currentUserId in payment.payer_map)) {
              return false;
            }
            if (showMyPayment) {
              return true;
            }
            return payment.account_type !== 'personal';
        });
    }, [list, showMyPayment, currentUserId]);
      
    const groupedPayments = groupBy(filteredList, (payment) => {
        return new Date(payment.time).toLocaleDateString("zh-TW", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    });
    
    // css
    const isMobile = useIsMobile();
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;
    
        const handleScroll = () => {
           setIsScrolled(scrollEl.scrollTop > 0);
        };
    
        scrollEl.addEventListener("scroll", handleScroll);
        return () => scrollEl.removeEventListener("scroll", handleScroll);
    }, []);
      
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const isMobileClass = clsx("shrink-0  box-border h-full flex flex-col overflow-hidden bg-sp-green-300 text-zinc-700",
        {
            "w-full px-0 py-0": isMobile === true,
            "w-xl px-3 py-3 rounded-2xl": isMobile === false,  
        }
    )
    const headerClass = clsx("py-2 px-4 flex items-center gap-2 w-full justify-between overflow-hidden transition-opacity duration-200",
        {"opacity-0 pointer-events-none h-0": isMobile && isScrolled }
    )
    
    return(
        <div id="receipt-list" className={isMobileClass}>
            <div>
                {isCreatePayment && currentProjectUsers && (
                    <CreatePayment 
                        onClose={() => setIsCreatePayment(false)}
                    />
                )}
            </div>
            <div id="receipt-list-header"  className={headerClass}>
                <p className="text-xl font-medium whitespace-nowrap truncate min-w-0 max-w-100"> 收支紀錄</p>
                <div
                    className={`shrink-0 px-2 py-2 flex items-center justify-center gap-2 rounded-xl bg-sp-white-20 hover:bg-sp-green-100 active:bg-sp-green-200 cursor-pointer }`}
                    onClick={() => { toggleAccountType()}}
                >
                    <p className="text-base ml-4 shrink-0">個人收支</p>
                    <IconButton
                        icon={showMyPayment === true ? "solar:check-square-bold" : "solar:stop-outline" }
                        size="sm"
                        variant="text-button"
                        color="primary"
                        type="button"
                    />
                </div>
            </div>
            <div id="receipt-list-frame" ref={scrollRef} className={`py-2 px-4 flex-1 ${scrollClass}`}>
                {list && (list?.length < 1 ) && (
                    <>
                        <div 
                        onClick={() => setIsCreatePayment(true)}
                        className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg bg-sp-white-20 hover:bg-sp-white-40 active:bg-sp-white-40 cursor-pointer"
                        >
                            <div className="flex-1 overflow-hidden">
                                <p className="text-base font-semibold whitespace-nowrap truncate">目前沒有紀錄</p>
                            </div>
                            <div className="shrink-0 text-right overflow-hidden">
                                <Button
                                    size='sm'
                                    width='fit'
                                    variant='solid'
                                    color='primary'
                                    leftIcon='solar:clipboard-add-linear'
                                    onClick={() => setIsCreatePayment(true)}
                                    >
                                        第一筆紀錄
                                </Button> 
                            </div>
                        </div>
                    </>
                )}
                {Object.entries(groupedPayments).map(([date, payments]) => (
                    <div key={date} className="w-full pb-4 mb-4">
                        <p className="text-sm pb-2 w-full font-semibold">{date}</p>
                        {payments.map((payment, index) => (
                            <div key={payment.id}>
                                <ReceiptCard
                                    record_mode={payment.record_mode}
                                    account_type={payment.account_type}
                                    payment_name={payment.payment_name}
                                    amount={payment.amount}
                                    payer_map={payment.payer_map}
                                    split_map={payment.split_map}
                                    currentUserId={currentUserId}
                                    userList={userList}
                                    categoryId={payment.category_id ?? ""}
                                    categoryList={categoryOptions || []}
                                />
                                {index !== payments.length - 1 && (
                                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {isMobile && (
                    <div className="shrink-0 w-full pb-3" />
            )}
        </div>
    )
}