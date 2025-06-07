export interface Category {
    id: number;
    name_zh: string;
    name_en: string;
    parent_id: number | null;
    imgURL?:string;
}