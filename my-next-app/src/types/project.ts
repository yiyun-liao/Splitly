// 建立專案
export interface CreateProjectPayload {
    project_name: string;
    start_time?: string; 
    end_time?: string;
    style: "travel" | "daily" | "other"; 
    currency: string;       
    budget?: number; 
    owner: string;
    editor:string[];
    member?:string[];
    member_budgets?:  Record<string, number>;
    desc?: string;
}