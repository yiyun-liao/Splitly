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
};