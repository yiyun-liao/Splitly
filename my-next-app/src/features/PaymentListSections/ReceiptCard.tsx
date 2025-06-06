// src/features/PaymentListSections/ReceiptCard.tsx
import ImageButton from "@/components/ui/ImageButton";
import clsx from "clsx";
import { PayerMap, SplitMap, AccountType, RecordMode } from "@/types/payment";
import { UserData } from "@/types/user";
import { Category } from "@/types/category";
import { formatNumber } from "@/utils/parseNumber";

interface ReceiptCardProps {
    account_type : AccountType;
    record_mode : RecordMode | undefined;
    payment_name: string;
    amount: number;
    payer_map: PayerMap;
    split_map: SplitMap;
    currentUserId: string;
    userList: UserData[];
    categoryId: number | string;
    categoryList: Category[] | undefined;
}

const getPayerText = (
    payer_map: PayerMap,
    amount: number,
    currentUserId: string,
    userList: UserData[]
    ) => {
    const payerUids = Object.keys(payer_map ?? {});
    const payerCount = payerUids.length;

    if (payerCount > 1) {
        return `${payerCount} 人支付了 $${amount}`;
    }

    const onlyPayerUid = payerUids[0] ?? '';
    const onlyPayer = (userList ?? []).find((user) => user.uid === onlyPayerUid);
    if (onlyPayerUid === currentUserId) {
        return `你支付了 $${amount}`;
    }

    const name = onlyPayer?.name || "";
        return `${name} 支付了 $${amount}`;
};

const getMyText = (
    account_type: AccountType,
    record_mode:RecordMode | undefined,
    payer_map: PayerMap,
    split_map: SplitMap,
    currentUserId: string,
    ) => {
    if (account_type === 'personal' || record_mode === 'debt'){
        return Math.abs(payer_map?.[currentUserId] ?? 0);
    }
    const payer = payer_map?.[currentUserId] ?? 0;
    const split = split_map?.[currentUserId]?.total ?? 0;
    return formatNumber(Math.abs(payer - split));
};

const isBorrowed = (
    account_type: AccountType,
    record_mode:RecordMode | undefined,
    payer_map: PayerMap,
    split_map: SplitMap,
    currentUserId: string
    ) => {
    if (!payer_map) return false;
    if (account_type === 'personal' || record_mode === 'debt') return true;
    const payer = payer_map?.[currentUserId] ?? 0;
    const split = split_map?.[currentUserId]?.total ?? 0;
    if (payer - split > 0){
        return true
    } else return false;
};

const getCategoryImg = (
    categoryId: number | string,
    categoryList: Category[]
    ) => {
    const matched = Array.isArray(categoryList)
        ? categoryList.find((cat) => cat.id === categoryId)
        : undefined;
    return {
        imgURL: matched?.imgURL ?? "",
        name_en: matched?.name_en ?? "",
    };
};

export default function ReceiptCard({
    account_type,
    record_mode,
    payment_name,
    amount,
    payer_map,
    split_map,
    currentUserId,
    userList,
    categoryId,
    categoryList,
    }: ReceiptCardProps) {

    // if (account_type === 'personal' && !(currentUserId in payer_map)) {
    //     return null;
    // }

    const payer_text = getPayerText(payer_map, amount, currentUserId, userList);
    const category = getCategoryImg(categoryId, categoryList ?? []);
    const borrowed = isBorrowed(account_type, record_mode ,payer_map, split_map, currentUserId);
    const displayAmount = getMyText(account_type,record_mode, payer_map, split_map, currentUserId)

    const borrowText = clsx("text-sm whitespace-nowrap truncate font-semibold", {
        "text-sp-blue-500": borrowed,
        "text-sp-green-400": !borrowed,
    });

    const cardClass = clsx("flex items-center justify-start p-2 gap-2 h-16 rounded-lg cursor-pointer hover:bg-sp-white-60 active:bg-sp-white-80",
        {
            "bg-sp-white-20 " : account_type === 'personal',
        }
    )

    const paymentNameClass = clsx("text-base font-semibold whitespace-nowrap truncate",
        {
            "text-sp-blue-500" : record_mode === 'debt',
        }
    )

    const payerTextClass = clsx("text-sm whitespace-nowrap truncate",
        {
            "text-sp-blue-500" : record_mode === 'debt',
        }
    )

    return (
        <div className={cardClass}>
        <div className="h-full">
            <ImageButton image={category.imgURL} size="md" imageName={category.name_en} />
        </div>
        <div className="flex-1 overflow-hidden">
            <p className={paymentNameClass}>{payment_name}</p>
            <p className={payerTextClass}>{payer_text}</p>
        </div>
        <div className="shrink-0 text-right overflow-hidden">
            {Number(displayAmount) !== 0 && (
                <>
                    <p className={borrowText}>{record_mode === 'debt' ? "還款" : account_type === 'personal' ? "個人" : borrowed ? "借出" : "借用"}</p>
                    <p className="text-base font-semibold whitespace-nowrap truncate">${displayAmount}</p>
                </>
            )}
        </div>
        </div>
    );
}
