// 型別定義

// 專案分類
export type ProjectStyle = "travel" | "daily" | "other";

// 付款人 db
type MemberUID = string;
type ProjectTeam = "owner" | "editor" | "member";
export type MemberList = Partial<Record<ProjectTeam, MemberUID>>
// {"owner": 4kjf39480fjlk, "member":92jf20fkk29jf}

// 個人預算
export type MemberBudgetMap = Record<MemberUID, number | undefined>;
// { "uid1": 500, "uid2": 300 } 表示各成員預算分配


// 建立專案
export interface CreateProjectPayload {
    createdBy: string;
    projectName: string;
    startTime: string | null; 
    endTime: string | null;
    style: ProjectStyle;    // "travel" | "daily" | "else"
    currency: string;       
    budget: number | null;         // 預算金額
    memberList: MemberList; // 成員 UID 陣列
    memberBudgets: MemberBudgetMap | null;
    desc: string | null;
}
