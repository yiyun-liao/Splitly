import { useEffect, useRef, useState, useMemo } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";

import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import ReceiptCard from "./PaymentListSections/ReceiptCard";
import CreatePayment from "./CreatePaymentSections/CreatePayment-main";

import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useCategoryOptions } from "@/contexts/CategoryContext";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
 
import { useIsMobile } from "@/hooks/useIsMobile";
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { GetPaymentData } from "@/types/payment";
import { formatDate } from "@/utils/formatTime";


export default function PaymentList(){
    const [isCreatePayment, setIsCreatePayment] = useState(false)
    const [showMyPayment, setShowMyPayment] = useState(false); //顯示個人支出
    const [editPayment, setEditPayment] = useState<GetPaymentData | null>(null); //開啟 payment list

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
      
    const groupedPayments = useMemo(() => {
        return filteredList.reduce<Record<string, GetPaymentData[]>>((acc, payment) => {
          const isoKey = new Date(payment.time).toISOString().slice(0, 10); 
          if (!acc[isoKey]) acc[isoKey] = [];
          acc[isoKey].push(payment);
          return acc;
        }, {});
    }, [filteredList]);

    const sortedDates = useMemo(() => {
        return Object.keys(groupedPayments).sort((a, b) => {
          return new Date(b).getTime() - new Date(a).getTime();
        });
    }, [groupedPayments]);

    // css
    const isMobile = useIsMobile();
    // 計算位移收合
    const scrollRef = useRef<HTMLDivElement>(null);
    const isScrolled = useScrollDirection(scrollRef, 5);
      
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const isMobileClass = clsx("shrink-0  box-border h-full flex flex-col overflow-hidden bg-sp-green-300 text-zinc-700",
        {
            "w-full px-0 py-0": isMobile === true,
            "w-xl px-3 py-3 rounded-2xl": isMobile === false,  
        }
    )
    const headerClass = clsx("py-2 flex items-center gap-2 w-full justify-between overflow-hidden transition-opacity duration-200",
        {
            "opacity-0 pointer-events-none h-0": isMobile && isScrolled,
            "px-4" : !isMobile,
         }
    )
    
    return(
        <div id="receipt-list" className={isMobileClass}>
            <div>
                {(isCreatePayment || editPayment) && currentProjectUsers && (
                    <CreatePayment 
                        onClose={() => {
                            setIsCreatePayment(false)
                            setEditPayment(null);
                        }}
                        initialPayload={editPayment || undefined} 
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
            <div id="receipt-list-frame" ref={scrollRef} className={`py-2 flex-1 ${scrollClass} ${!isMobile && 'px-4 '}`}>
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
                {list && (list?.length > 0 ) && (
                    sortedDates.map((iso) => (
                        <div key={iso} className="w-full pb-4 mb-4">
                            <p className="text-sm pb-2 w-full font-semibold">{formatDate(iso)}</p>
                            {groupedPayments[iso].map((payment, index) => (
                                <div key={payment.id} onClick={() => setEditPayment(payment)}>
                                    <ReceiptCard
                                        currentUserId={currentUserId}
                                        userList={userList}
                                        categoryList={categoryOptions || []}
                                        payment={payment}
                                    />
                                    {index + 1 < groupedPayments[iso].length && (
                                        <div className="w-full h-0.25 bg-sp-green-200"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                ))}
                {isMobile && (
                        <div className="shrink-0 w-full pb-5 min-h-30 " />
                )}
            </div>
        </div>
    )
}