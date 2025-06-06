import { useMemo } from "react";
import { GroupedByParent } from "@/types/calculation";
import { useCategoryParent } from "@/hooks/useCategory";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useCategoryOptions } from "@/contexts/CategoryContext";
import { getGroupedPaymentsByParentCategory, getProjectCategoryStats } from "@/utils/calculatePayment"; 
import { ParentCategoryStat } from "@/types/calculation";


export function useGroupedPaymentsByParentCategory(): GroupedByParent[] {

    const { currentPaymentList } = useCurrentProjectData();
    const { categoryOptions } = useCategoryOptions();
    const { categoryParents } = useCategoryParent();
    
    return useMemo(() => {
        if (!currentPaymentList || !categoryOptions || !categoryParents) return [];
        return getGroupedPaymentsByParentCategory(currentPaymentList, categoryOptions, categoryParents);

    }, [currentPaymentList, categoryOptions, categoryParents]);
}

export function useProjectStats() :{ stats: ParentCategoryStat[]; grandTotal: number }  {
    const { currentPaymentList } = useCurrentProjectData();
    const { categoryOptions } = useCategoryOptions();
    const { categoryParents } = useCategoryParent();
  
    return useMemo(() => {
      if (!currentPaymentList || !categoryOptions || !categoryParents) return null;
  
      const grouped = getGroupedPaymentsByParentCategory(
        currentPaymentList,
        categoryOptions,
        categoryParents
      );
  
      const stats = getProjectCategoryStats(grouped);
      const grandTotal = stats.reduce((sum, stat) => sum + stat.totalAmount, 0);
  
      return { stats, grandTotal };
    }, [currentPaymentList, categoryOptions, categoryParents]);
}