import { GroupedByParent, ParentCategoryStat } from "@/types/calculation";
import { formatNumberForData } from "./parseNumber";
import { Category } from "@/types/category";
import { GetPaymentData } from "@/types/payment";




// my-next-app/src/hooks/usePaymentStats 合用，分別計算群組跟個人
// 收支以類別做分類
export function getGroupedPaymentsByParentCategory(payments:GetPaymentData[] , categories:Category[], categoryParents:Category[]){
    const categoryMap = new Map<number, Category>();

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
}

// 專案的各分類總額
export function getProjectCategoryStats(groupedData: GroupedByParent[]): ParentCategoryStat[] {
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
            percent,
            name_zh: group.parent.name_zh,
            imgURL: group.parent.imgURL || "",
            payments:allValidPayments
        };
    });
}

// 自己的各分類總額
export function getUserCategoryStats(
    groupedData: GroupedByParent[],
    userId: string
  ): ParentCategoryStat[] {
    const filteredGroups = groupedData.filter(group => group.parent.id !== 101);
  
    // 所有使用者有參與的 payment（非 101 類別）
    const allUserPayments = filteredGroups.flatMap(group =>
      group.payments.filter(p => userId in (p.split_map || {}))
    );
  
    const grandTotal = allUserPayments.reduce((sum, p) => {
      const amount = p.split_map?.[userId]?.total || 0;
      return sum + amount;
    }, 0);
  
    return filteredGroups.map(group => {
      const userPayments = group.payments.filter(p => userId in (p.split_map || {}));
  
      const totalAmount = userPayments.reduce((sum, p) => {
        const amount = p.split_map?.[userId]?.total || 0;
        return sum + amount;
      }, 0);
  
      const percent = grandTotal > 0 ? parseFloat(formatNumberForData(totalAmount / grandTotal)): 0;
  
      return {
        id: group.parent.id,
        name_en: group.parent.name_en,
        totalAmount,
        percent,
        name_zh: group.parent.name_zh,
        imgURL: group.parent.imgURL || "",
        payments:allUserPayments
      };
    });
}