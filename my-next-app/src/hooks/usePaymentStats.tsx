import { useMemo } from "react";
import { GroupedByParent } from "@/types/calculation";
import { useCategoryParent } from "@/hooks/useCategory";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useCategoryOptions } from "@/contexts/CategoryContext";
import { getGroupedPaymentsByParentCategory, getProjectCategoryStats, getUserCategoryStats } from "@/utils/calculatePayment"; 
import { ParentCategoryStat } from "@/types/calculation";


export function useGroupedByParentCategory(): GroupedByParent[] {

    const { currentPaymentList } = useCurrentProjectData();
    const { categoryOptions } = useCategoryOptions();
    const { categoryParents } = useCategoryParent();
    
    return useMemo(() => {
        if (!currentPaymentList || !categoryOptions || !categoryParents) return [];
        return getGroupedPaymentsByParentCategory(currentPaymentList, categoryOptions, categoryParents);

    }, [currentPaymentList, categoryOptions, categoryParents]);
}

export function useProjectStats() :{ stats: ParentCategoryStat[]; grandTotal: number }  {
    const list = useGroupedByParentCategory();
  
    const projectStats = useMemo(() => {
        const stats = list ? getProjectCategoryStats(list) : [];
        const grandTotal = stats.reduce((sum, stat) => sum + stat.totalAmount, 0);
        return { stats, grandTotal };
      }, [list]);

    return projectStats
}

export function useUserStats(userId:string) :{ stats: ParentCategoryStat[]; grandTotal: number }  {
    const list = useGroupedByParentCategory();
  
    const projectStats = useMemo(() => {
        const stats = list ? getUserCategoryStats(list, userId) : [];
        const grandTotal = stats.reduce((sum, stat) => sum + stat.totalAmount, 0);
        return { stats, grandTotal };
      }, [list, userId]);
      
    return projectStats
}
// {grandTotal : 7110
// [0 : {id: 46, name_en: 'Food & Drink', totalAmount: 4310, percent: 0.606188, name_zh: '飲食', …}
// 1 : {id: 55, name_en: 'Shopping', totalAmount: 0, percent: 0, name_zh: '購物', …}
// 2 : {id: 65, name_en: 'Transport & Stay', totalAmount: 2800, percent: 0.393812, name_zh: '交通及住宿', …}
// 3 : {id: 76, name_en: 'Home', totalAmount: 0, percent: 0, name_zh: '家居', …}
// 4 : {id: 90, name_en: 'Entertainment', totalAmount: 0, percent: 0, name_zh: '娛樂', …}]}