'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCategories } from '@/lib/categoryApi';
import { Category } from '@/types/category';
import { buildCatUrl } from '@/utils/category';


const CategoryContext = createContext<Category[] | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchAndBuildCategories() {
        try {
        const categories = await getCategories(); 
        const finalCategory: Category[] = categories.map((cat:Category) => ({
            ...cat,
            imgURL: buildCatUrl(cat.name_en),
        }));
        setCategoryOptions(finalCategory);
        } catch (error) {
        console.error("取得分類失敗", error);
        }
    }
    
    fetchAndBuildCategories();
  }, []);

  return (
    <CategoryContext.Provider value={categoryOptions}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryOptions = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategoryOptions 必須在 CategoryProvider 內使用");
  }
  return context;
};
