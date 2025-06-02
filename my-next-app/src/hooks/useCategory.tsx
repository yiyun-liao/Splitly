// my-next-app/src/hooks/category.tsx
import { useState, useMemo } from "react";
import { useCategoryOptions } from "@/contexts/CategoryContext";


interface SelectOption {
    label: string;
    value: string;
    disabled: boolean;
  }

// export function useCategorySelectOptions() {
//     const categories = useCategoryOptions(); // 取自全域 context
//     const [selectedValue, setSelectedValue] = useState<string | null>(null);

//     const options: SelectOption[] = useMemo(() => {
//         return categories.map((cat) => ({
//           label: cat.name_zh,
//           value: String(cat.id),
//           disabled: cat.parent_id === null,
//         }));
//       }, [categories]);
      
//       useEffect(() => {
//         if (!selectedValue) {
//           const firstEnabled = options.find((opt) => !opt.disabled);
//           if (firstEnabled) {
//             setSelectedValue(firstEnabled.value);
//           }
//         }
//       }, [options, selectedValue]);

//     return {options,selectedValue,setSelectedValue};
// }
export function useCategorySelectOptions() {
  const { categoryOptions } = useCategoryOptions();


  const options: SelectOption[] = useMemo(() => {
    if (!categoryOptions) return [];

    return categoryOptions.map((cat) => ({
        label: cat.name_zh,
        value: String(cat.id),
        disabled: cat.parent_id === null,
    }));
  }, [categoryOptions]);

  // ✅ Lazy initialize：只在第一次執行時設定
  const [selectedValue, setSelectedValue] = useState<string | null>(() => {
    const firstEnabled = options.find((opt) => !opt.disabled);
    return firstEnabled?.value ?? null;
  });

  return { options, selectedValue, setSelectedValue };
}

export function useCategoryParent() {
    const { categoryOptions } = useCategoryOptions();
    if (!categoryOptions) return [];

    const categoryParents = categoryOptions.filter((opt) => !opt.parent_id); 

    return {categoryParents};
}