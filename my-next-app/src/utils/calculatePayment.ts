// my-next-app/src/hooks/useGroupedPaymentsByParentCategory.tsx 合用，分別計算群組跟個人
import { GroupedByParent, ParentCategoryStat } from "@/types/calculation";
import { formatNumberForData } from "./parseNumber";


// 專案的分類支出
export function getProjectParentCategoryStats(groupedData: GroupedByParent[]): ParentCategoryStat[] {
    // 所有 payments 的總和
    const filteredGroups = groupedData.filter(group => group.parent.id !== 101);

    const allValidPayments = filteredGroups.flatMap(group =>
        group.payments.filter(p => p.account_type !== "personal")
    );
    
    const grandTotal = allValidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    return filteredGroups.map(group => {
        // 只計算非 personal 的 payment
        const validPayments = group.payments.filter(p => p.account_type !== "personal");
        const totalAmount = validPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const percent = grandTotal > 0 ? parseFloat(formatNumberForData((totalAmount / grandTotal))) : 0;
    
        return {
            id: group.parent.id,
            name_en: group.parent.name_en,
            totalAmount,
            percent: percent,
            name_zh: group.parent.name_zh,
            imgURL: group.parent.imgURL || "",
        };
    });
}