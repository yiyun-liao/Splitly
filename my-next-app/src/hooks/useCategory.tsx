// my-next-app/src/hooks/category.tsx
import { useState, useMemo, useEffect } from "react";
import { useCategoryOptions } from "@/contexts/CategoryContext";
import { Category, CategoryGrouped } from "@/types/category";


interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
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
  

export function useCategoryDisplayOptions(): { grouped: CategoryGrouped[] }{
    const { categoryOptions } = useCategoryOptions()

    const grouped = useMemo<CategoryGrouped[]>(() => {
        const map = new Map<number, CategoryGrouped>()
        categoryOptions
            ?.filter(cat => cat.id !== 101)
            .forEach(cat => {
                map.set(cat.id, { ...cat, children: [] })
        })
        
        const roots: CategoryGrouped[] = []
        map.forEach(node => {
            if (node.parent_id == null) {
                roots.push(node)
            } else {
                const parent = map.get(node.parent_id)
                if (parent) parent.children.push(node)
                else roots.push(node) // fallback if parent not found
            }
        })

        return roots
    }, [categoryOptions])

  return {grouped}
}


export function useCategoryParent(): { categoryParents: Category[] } {
    const { categoryOptions } = useCategoryOptions();
    const categoryParents: Category[] =
        categoryOptions?.filter((opt: Category) => !opt.parent_id) ?? [];
    return { categoryParents };
}