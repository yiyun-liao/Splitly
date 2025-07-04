// src/features/PaymentListSections/ReceiptCardByCat.tsx
import IconButton from "@/components/ui/IconButton/IconButton";
import type { IconProps } from '@phosphor-icons/react';
import clsx from "clsx";
import { GetPaymentData } from "@/types/payment";
import { Category } from "@/types/category";
import { formatNumber } from "@/utils/parseNumber";
import { formatDate } from "@/utils/formatTime";

interface ReceiptCardByCatProps {
    currentUserId: string;
    categoryList: Category[] | undefined;
    payment:GetPaymentData;
    viewExpenseWay:string;
    isMobile:boolean
}

const getCategoryIcon = (
    categoryId: number | string,
    categoryList: Category[]
    ): React.ComponentType<IconProps> | undefined => {
    return categoryList.find((cat) => cat.id === categoryId)?.icon;
};

export default function ReceiptCardByCat({
    currentUserId,
    categoryList,
    payment,
    viewExpenseWay,
    isMobile
    }: ReceiptCardByCatProps) {

    const categoryIcon = getCategoryIcon(payment.category_id ?? "", categoryList ?? []);

    const cardClass = clsx("flex items-center justify-start py-2 pl-2 pr-14 gap-2 h-16 rounded-lg cursor-pointer hover:bg-sp-white-60 active:bg-sp-white-80",
        {"bg-sp-blue-100": isMobile, " bg-sp-white-40": !isMobile}
    )
    const paymentNameClass = clsx("text-base font-semibold whitespace-nowrap truncate")
    const payerTextClass = clsx("text-sm whitespace-nowrap truncate")
    return (
        <div className={cardClass}>
            <div className="shrink-0">
                <IconButton
                    icon={categoryIcon}
                    size='md'
                    variant='text-button'
                    color='primary'
                />
            </div>
            <div className="flex-1 overflow-hidden">
                <p className={paymentNameClass}>{payment.payment_name}</p>
                
                <p className={payerTextClass}>{formatDate(payment.time)} {viewExpenseWay === 'personal' &&  payment.account_type === 'personal' ? "個人支出" : ""}</p>
            </div>
            <div className="shrink-0 text-right overflow-hidden">
                {viewExpenseWay === 'shared' && (
                    <>
                        <p className="text-lg font-semibold whitespace-nowrap truncate">${payment.amount}</p>
                    </>
                )}
                {viewExpenseWay === 'personal' && (
                    <>
                        <p className={payerTextClass}>總額 ${payment.amount}</p>
                        <p className="text-lg font-semibold whitespace-nowrap truncate">${formatNumber(payment.split_map?.[currentUserId]?.total ?? 0)}</p>
                    </>
                )}
            </div>
        </div>
    );
}
