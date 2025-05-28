// 專案分類
export type ProjectStyle = "travel" | "daily" | "other";

// 付款人 db
type MemberUID = string;

// 個人預算
export type MemberBudgetMap = Record<MemberUID, number | undefined>;
// { "uid1": 500, "uid2": 300 } 表示各成員預算分配

// 建立專案
export interface ProjectData {
  project_name: string;
  start_time?: string;             
  end_time?: string;
  style: ProjectStyle; // "travel" | "daily" | "else"
  currency: string;
  budget?: number; // 預算金額
  owner: string;
  editor: MemberUID[];
  member?: MemberUID[];           
  member_budgets?: MemberBudgetMap;
  desc?: string;
  img:number; // 後端回傳的 avatar index
  imgURL?: string; // 最後是 Cloudinary URL
}
