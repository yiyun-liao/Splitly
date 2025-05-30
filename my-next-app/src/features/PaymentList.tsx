import { groupBy } from "lodash";

import ReceiptCard from "./PaymentListSections/ReceiptCard";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useCategoryOptions } from "@/contexts/CategoryContext";
import { getPayerText, isBorrowed, getCategoryImg } from "./PaymentListSections/ReceiptCardutils";


interface PaymentListProps {
    onCreateClick?: () => void;
  }

export default function PaymentList({
    }:PaymentListProps){

    const {userData} = useAuth();
    const categoryList = useCategoryOptions();
    const {currentPaymentList:list, currentProjectUsers} = useCurrentProjectData();

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
    
    
    return(
        <div id="receipt-list" className="shrink-0 w-xl px-3 py-3 rounded-2xl box-border h-full overflow-hidden bg-sp-green-300">
            <div id="receipt-list-header"  className="py-2 px-4 flex items-center gap-2 w-full justify-between overflow-hidden">
                <p className="text-xl font-medium whitespace-nowrap truncate min-w-0 max-w-100"> 收支紀錄</p>
            </div>
            <div id="receipt-list-frame" className="py-2 px-4 h-full overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth">
                {Object.entries(groupedPayments).map(([date, payments]) => (
                    <div key={date} className="w-full pb-4">
                        <p className="text-sm pb-2 w-full font-semibold">{date}</p>
                        {payments.map((payment, index) => (
                            <div key={payment.id}>
                                <ReceiptCard
                                    payment_name={payment.payment_name}
                                    payer_text={getPayerText(payment.payer_map,payment.amount, currentUserId, userList)}
                                    isBorrowed={isBorrowed(payment.payer_map, currentUserId)}
                                    amount={payment.amount}
                                    category={getCategoryImg(payment.category_id?? 0, categoryList)}
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