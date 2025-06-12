import { Category } from "@/types/category";
import { GetPaymentData } from "@/types/payment";


export type GroupedByParent = {
    parent: Category;
    payments: GetPaymentData[];
};

// for /{projectId}/dashboard
export type ParentCategoryStat = {
    name_en: string;
    name_zh: string;
    id: number;
    imgURL : string;
    totalAmount: number;
    percent: number;
    payments: GetPaymentData[];
};

// for my-next-app/src/hooks/useSettleDebts.tsx
export interface DebtMap {
  [uid: string]: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}