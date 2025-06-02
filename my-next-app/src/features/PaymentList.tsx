import { groupBy } from "lodash";
import { useState } from "react";
import clsx from "clsx";
import ReceiptCard from "./PaymentListSections/ReceiptCard";
import Button from "@/components/ui/Button";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useCategoryOptions } from "@/contexts/CategoryContext";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import CreatePayment from "./CreatePaymentSections/CreatePayment-main";

export default function PaymentList(){
    const [isCreatePayment, setIsCreatePayment] = useState(false)
    
    const {userData} = useGlobalProjectData();
    const {currentPaymentList:list, currentProjectUsers} = useCurrentProjectData();
    const { categoryOptions } = useCategoryOptions();
    
    const currentUserId = userData?.uid || "";
    const userList = currentProjectUsers || [];

    // 處理卡片需要資料
    const groupedPayments = groupBy(list, (payment) => {
        return new Date(payment.time).toLocaleDateString("zh-TW", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    });
    
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")

    
    return(
        <div id="receipt-list" className="shrink-0 w-xl px-3 py-3 rounded-2xl box-border h-full overflow-hidden bg-sp-green-300">
            <div>
                {isCreatePayment && currentProjectUsers && (
                    <CreatePayment 
                        onClose={() => setIsCreatePayment(false)}
                    />
                )}
            </div>
            <div id="receipt-list-header"  className="py-2 px-4 flex items-center gap-2 w-full justify-between overflow-hidden">
                <p className="text-xl font-medium whitespace-nowrap truncate min-w-0 max-w-100"> 收支紀錄</p>
            </div>
            <div id="receipt-list-frame" className={`py-2 px-4 h-full ${scrollClass}`}>
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
                    <div key={date} className="w-full pb-4">
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
        </div>
    )
}