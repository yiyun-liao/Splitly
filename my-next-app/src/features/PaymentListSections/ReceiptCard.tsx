// src/features/PaymentListSections/ReceiptCard.tsx
import ImageButton from "@/components/ui/ImageButton";
import clsx from "clsx";
import { PayerMap } from "@/types/payment";
import { UserData } from "@/types/user";
import { Category } from "@/types/category";

interface ReceiptCardProps {
    payment_name: string;
    amount: number;
    payer_map: PayerMap;
    currentUserId: string;
    userList: UserData[];
    categoryId: number | string;
    categoryList: Category[];
}

const getPayerText = (
    payerMap: PayerMap,
    amount: number,
    currentUserId: string,
    userList: UserData[]
    ) => {
    const payerUids = Object.keys(payerMap ?? {});
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

const isBorrowed = (payerMap: PayerMap, currentUserId: string) => {
    if (!payerMap) return false;
    return Object.keys(payerMap).includes(currentUserId);
};

const getCategoryImg = (
    categoryId: number | string,
    categoryList: Category[]
    ) => {
    const matched = (categoryList ?? []).find((cat) => cat.id === categoryId);
    return {
        imgURL: matched?.imgURL ?? "",
        name_en: matched?.name_en ?? "",
    };
};

export default function ReceiptCard({
    payment_name,
    amount,
    payer_map,
    currentUserId,
    userList,
    categoryId,
    categoryList,
    }: ReceiptCardProps) {
    const payer_text = getPayerText(payer_map, amount, currentUserId, userList);
    const borrowed = isBorrowed(payer_map, currentUserId);
    const category = getCategoryImg(categoryId, categoryList);

    const borrowText = clsx("text-sm whitespace-nowrap truncate font-semibold", {
        "text-sp-blue-500": borrowed,
        "text-sp-green-400": !borrowed,
    });

    return (
        <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
        <div className="h-full">
            <ImageButton image={category.imgURL} size="md" imageName={category.name_en} />
        </div>
        <div className="flex-1 overflow-hidden">
            <p className="text-base font-semibold whitespace-nowrap truncate">{payment_name}</p>
            <p className="text-sm whitespace-nowrap truncate">{payer_text}</p>
        </div>
        <div className="shrink-0 text-right overflow-hidden">
            <p className={borrowText}>{borrowed ? "借出" : "花費"}</p>
            <p className="text-base font-semibold whitespace-nowrap truncate">${amount}</p>
        </div>
        </div>
    );
}
