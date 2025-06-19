'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCategories } from '@/lib/categoryApi';
import { Category } from '@/types/category';
import { categoryIconMap } from '@/utils/getCategory';

type CategoryType = {
    categoryOptions:Category[] | undefined; 
    isReady: boolean;
};


const CategoryContext = createContext<CategoryType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [categoryOptions, setCategoryOptions] = useState<Category[] | undefined>(undefined);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (categoryOptions) {
        setIsReady(true);
        }
    }, [categoryOptions]);

    useEffect(() => {

        const catKey = `🐱 cat`;
        const metaCatKey = `🐱 cacheCatMeta`;
        const CACHE_TTL = 1000 * 60 * 1440;

        const cachedCats = localStorage.getItem(catKey);
        const cachedMeta = localStorage.getItem(metaCatKey);
        const isCacheExpired = !cachedMeta || Date.now() - JSON.parse(cachedMeta).timestamp > CACHE_TTL;

        if (cachedCats  &&  !isCacheExpired) {
            try {
                // const parsed = JSON.parse(cachedCats);
                const raw: Omit<Category, 'icon'>[] = JSON.parse(cachedCats);
                // 讀快取後，再把 icon 映射進來
                const parsed = raw.map(cat => ({
                    ...cat,
                    icon: categoryIconMap[cat.id],
                }));
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCategoryOptions(parsed);
                    setIsReady(true);
                    return;
                } else {
                    localStorage.removeItem(catKey);
                    localStorage.removeItem(metaCatKey);
                }        
            } catch (error) {
                console.warn("❌ 快取解析失敗，清除...", error);
                localStorage.removeItem(catKey);
                localStorage.removeItem(cachedMeta);
            }
        }

        const fetchAndBuildCategories = async () => {
            try {
                // 1. 先拿原始不含 icon 的資料
                const raw: Omit<Category, 'icon'>[] = await getCategories();
                // 2. 存快取（不含 icon）
                localStorage.setItem(catKey, JSON.stringify(raw));
                localStorage.setItem(metaCatKey, JSON.stringify({ timestamp: Date.now() }));
        
                // 3. 再把 icon 裝回去
                const withIcon: Category[] = raw.map(cat => ({
                  ...cat,
                  icon: categoryIconMap[cat.id],
                }));
                setCategoryOptions(withIcon);
                console.log("🛠 加工後 finalCategory", withIcon);

                // const categories = await getCategories(); 
                // console.log("📥 原始 categories", categories);

                // const finalCategory: Category[] = categories.map((cat:Category) => {
                //     return {
                //       ...cat,
                //       icon:categoryIconMap[cat.id]
                //     };
                //   });

                // console.log("🛠 加工後 finalCategory", finalCategory);
                // setCategoryOptions(finalCategory);
                
                // localStorage.setItem(catKey, JSON.stringify(finalCategory))
                // localStorage.setItem(metaCatKey, JSON.stringify({ timestamp: Date.now() }));
                
                setIsReady(true);
            } catch (error) {
                console.error("取得分類失敗", error);
                setCategoryOptions([]);
                setIsReady(true);
            }
        }
        
        fetchAndBuildCategories();
    },[]);

    return (
        <CategoryContext.Provider value={{categoryOptions, isReady}}>
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
