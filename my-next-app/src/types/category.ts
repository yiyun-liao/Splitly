import type { IconProps } from "@phosphor-icons/react";

export interface Category {
    id: number;
    name_zh: string;
    name_en: string;
    parent_id: number | null;
    icon?: React.ComponentType<IconProps>;
}

export type CategoryGrouped = Category & {
    children: Category[]
}