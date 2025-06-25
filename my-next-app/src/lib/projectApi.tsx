import { ProjectData, GetProjectData, JoinProjectData } from "@/types/project";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 建立專案
export async function createProject(payload: ProjectData) {
    try {
        const res = await fetch(`${BASE_URL}/api/project`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to create project: " + errorText);
        }

        const data = await res.json();
        // console.log("createProject:", data);
        return data;
    } catch (err) {
        console.error("Error creating project:", err);
        throw err;
    }
}

// 刪除專案
export async function deleteProject(projectId: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/project?pid=${projectId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to delete project: " + errorText);
        }

        const data = await res.json();
        // console.log("deleteProject:", data);
        return data;
    } catch (err) {
        console.error("Error deleting project:", err);
        throw err;
    }
}

// 取得某使用者的專案列表
export async function fetchProjectsByUser(token: string,uid: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/project?uid=${uid}`,{ 
            method: "GET", 
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to fetch projects: " + errorText);
        }

        const data = await res.json();
        // console.log("fetchProjectsByUser:", data);
        return data;
    } catch (err) {
        console.error("Error fetching projects:", err);
        throw err;
    }
}

// join 專案時拿到特定專案資料
export async function fetchProjectsByNew(token: string,uid: string,pid: string) {
    try {
        console.log(`${BASE_URL}/api/project/certain?pid=${pid}&uid=${uid}`)
        const res = await fetch(`${BASE_URL}/api/project/certain?pid=${pid}&uid=${uid}`,{ 
            method: "GET", 
            headers: { 
                Authorization: `Bearer ${token}`, 
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to fetch projects: " + errorText);
        }

        const data = await res.json();
        // console.log("fetchProjectsByUser:", data);
        return data;
    } catch (err) {
        console.error("Error fetching projects:", err);
        throw err;
    }
}


// 更新專案 
export async function updateProject(projectId: string, payload: GetProjectData) {
    try {
        const res = await fetch(`${BASE_URL}/api/project?pid=${projectId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to update project: " + errorText);
        }

        const data = await res.json();
        // console.log("updateProject:", data);
        return data;
    } catch (err) {
        console.error("Error creating project:", err);
        throw err;
    }
}

// 新增成員到專案
export async function joinProject(payload: JoinProjectData) {
    try {
        const res = await fetch(`${BASE_URL}/api/project/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to update project: " + errorText);
        }

        const data = await res.json();
        // console.log("joinProject:", data);
        return data;
    } catch (err) {
        console.error("Error creating project:", err);
        throw err;
    }
}

