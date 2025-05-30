import { PayerMap } from "@/types/payment";
import { UserData } from "@/types/user";
import { Category } from "@/types/category";


export function getPayerText(
    payerMap: PayerMap, 
    amount:number, 
    currentUserId: string, 
    userList: UserData[]
) {
    const payerUids = Object.keys(payerMap);
    const payerCount = payerUids.length;

    if (payerCount > 1) {
    return `${payerCount} 人支付了 $${amount}`;
    }

    const onlyPayerUid = payerUids[0];
    const onlyPayer = userList.find(user => user.uid === onlyPayerUid);  
    if (onlyPayerUid === currentUserId) {
    return `你支付了 $${amount}`;
    }

    const name = onlyPayer?.name || '';
    return `${name} 支付了 $${amount}`;
}

export function isBorrowed(payerMap: PayerMap, currentUserId: string) {
    return Object.keys(payerMap).includes(currentUserId);
}

export const getCategoryImg = (categoryId: number | string, categoryList: Category[]) => {
    const imgURL = categoryList.find(cat => cat.id === categoryId)?.imgURL ?? '';
    const name_en = categoryList.find(cat => cat.id === categoryId)?.name_en ?? ''
    return {imgURL, name_en}
};