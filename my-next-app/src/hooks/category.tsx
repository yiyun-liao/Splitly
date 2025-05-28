// my-next-app/src/hooks/category.tsx
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/categoryApi"; // 假設你把 API 拆出來了

interface Category {
    id: number | string;
    name: string;
    parent_id: number | string | null;
}

interface SelectOption {
    label: string;
    value: string;
    disabled: boolean;
  }

export function useCategorySelectOptions() {
    const [options, setOptions] = useState<SelectOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
    async function fetchOptions() {
        try {
        const categories: Category[] = await getCategories();
        const mapped = categories.map((cat) => ({
            label: cat.name,
            value: String(cat.id),
            disabled: cat.parent_id === null,
        }));
        setOptions(mapped);

        const firstEnabled = mapped.find((opt) => !opt.disabled);
        if (firstEnabled) {
            setSelectedValue(firstEnabled.value);
        }
        } catch (err) {
        console.error("Failed to load categories", err);
        setError("載入分類失敗");
        } finally {
        setLoading(false);
        }
    }

    fetchOptions();
    }, []);

    return {options,selectedValue,setSelectedValue,loading,error,};
}