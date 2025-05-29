export interface Category {
    id: number | string;
    name_zh: string;
    name_en: string;
    parent_id: number | string | null;
    imgURL?:string;
}