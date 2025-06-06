import { useMemo } from "react";
import { Category } from "@/types/category";
import { GetPaymentData } from "@/types/payment";
import { GroupedByParent } from "@/types/calculation";
import { useCategoryParent } from "@/hooks/useCategory";
import { useCategoryOptions } from "@/contexts/CategoryContext";



export function useGroupedPaymentsByParentCategory(
    payments: GetPaymentData[],
    ): GroupedByParent[] {

    const { categoryOptions: rawCategories } = useCategoryOptions();
    const { categoryParents } = useCategoryParent();

    
    return useMemo(() => {
        if (payments.length == 0) return [];
        const categoryMap = new Map<number, Category>();

        const categories = rawCategories ?? [];
        categories.forEach((cat) => categoryMap.set(cat.id, cat));

        const grouped: GroupedByParent[] = categoryParents.map((parent) => ({
            parent,
            payments: [],
        }));

        payments.forEach((payment) => {
            const categoryId = typeof payment.category_id === 'string' ? parseInt(payment.category_id) : payment.category_id;
            if (!categoryId) return;

            const cat = categoryMap.get(categoryId);
            if (!cat) return;
            const parentId = cat.parent_id ?? cat.id;
            const parentGroup = grouped.find((g) => g.parent.id === parentId);
            if (parentGroup) {
                parentGroup.payments.push(payment);
            }
        });

        return grouped;
    }, [payments, rawCategories, categoryParents]);
}
