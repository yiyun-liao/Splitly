'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCategories } from '@/lib/categoryApi';
import { Category } from '@/types/category';



const CategoryContext = createContext<Category[] | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategoryOptions);
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
