// my-next-app/src/hooks/category.tsx
import { useState, useMemo } from "react";
import { useCategoryOptions } from "@/contexts/CategoryContext";
import { Category } from "@/types/category";


interface SelectOption {
    label: string;
    value: string;
    disabled: boolean;
  }

export function useCategorySelectOptions(): {
    options: SelectOption[];
    selectedValue: string | null;
    setSelectedValue: (v: string | null) => void;
  } {
    const { categoryOptions } = useCategoryOptions();
  
    const options: SelectOption[] = useMemo(() => {
      if (!categoryOptions) return [];
      return categoryOptions.map((cat: Category) => ({
        label: cat.name_zh,
        value: String(cat.id),
        disabled: cat.parent_id === null,
      }));
    }, [categoryOptions]);
  
    const [selectedValue, setSelectedValue] = useState<string | null>(() => {
      const firstEnabled = options.find((opt: SelectOption) => !opt.disabled);
      return firstEnabled?.value ?? null;
    });
  
    return { options, selectedValue, setSelectedValue };
}
  

export function useCategoryParent(): { categoryParents: Category[] } {
    const { categoryOptions } = useCategoryOptions();
    const categoryParents: Category[] =
        categoryOptions?.filter((opt: Category) => !opt.parent_id) ?? [];
    return { categoryParents };
}