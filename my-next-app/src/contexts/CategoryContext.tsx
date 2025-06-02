'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCategories } from '@/lib/categoryApi';
import { Category } from '@/types/category';
import { buildCatUrl } from '@/utils/category';

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
        const CACHE_TTL = 1000 * 60 * 300;

        const cachedCats = localStorage.getItem(catKey);
        const cachedMeta = localStorage.getItem(metaCatKey);
        const isCacheExpired = !cachedMeta || Date.now() - JSON.parse(cachedMeta).timestamp > CACHE_TTL;

        if (cachedCats &&  !isCacheExpired) {
            try {
                setCategoryOptions(JSON.parse(cachedCats));
                setIsReady(true); // ✅ 快取成功也標記 ready
                return;
            } catch (error) {
                console.warn("❌ 快取解析失敗，清除...", error);
                localStorage.removeItem(catKey);
                localStorage.removeItem(cachedMeta);
            }
        }

        const fetchAndBuildCategories = async () => {
            try {
                const categories = await getCategories(); 
                console.log("📥 原始 categories", categories);
                const finalCategory: Category[] = categories.map((cat:Category) => ({
                    ...cat,
                    imgURL: buildCatUrl(cat.name_en),
                }));

                console.log("🛠 加工後 finalCategory", finalCategory);
                setCategoryOptions(finalCategory);
                
                localStorage.setItem(catKey, JSON.stringify(finalCategory))
                localStorage.setItem(metaCatKey, JSON.stringify({ timestamp: Date.now() }));
                
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
