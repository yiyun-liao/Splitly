// 型別定義

// 專案分類
export type ProjectStyle = "travel" | "daily" | "other";

// 付款人 db
type MemberUID = string;

// 個人預算
export type MemberBudgetMap = Record<MemberUID, number | undefined>;
// { "uid1": 500, "uid2": 300 } 表示各成員預算分配


// 建立專案
export interface CreateProjectPayload {
    project_name: string;
    start_time: string | null; 
    end_time: string | null;
    style: ProjectStyle;    // "travel" | "daily" | "else"
    currency: string;       
    budget: number | null;         // 預算金額
    owner: string;
    editor:MemberUID[];
    member:MemberUID[] | null;
    member_budgets: MemberBudgetMap | null;
    desc: string | null;
}
