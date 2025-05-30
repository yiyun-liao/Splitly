import { ProjectData } from "@/types/project";

const BASE_URL = "http://localhost:8000";

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
        console.log("createProject:", data);
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
        console.log("deleteProject:", data);
        return data;
    } catch (err) {
        console.error("Error deleting project:", err);
        throw err;
    }
}

// 取得某使用者的專案列表
export async function fetchProjectsByUser(token: string,uid: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/project/by-user?uid=${uid}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to fetch projects: " + errorText);
        }

        const data = await res.json();
        console.log("fetchProjectsByUser:", data);
        return data;
    } catch (err) {
        console.error("Error fetching projects:", err);
        throw err;
    }
}

// 取得專案的所有成員
export async function fetchUserByProject(token: string,pid: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/getUsers/by-project?pid=${pid}`,{
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to fetch projects: " + errorText);
        }

        const data = await res.json();
        console.log("fetchProjectsByUser:", data);
        return data;
    } catch (err) {
        console.error("Error fetching projects:", err);
        throw err;
    }
}

// 新增成員到專案
export async function addProjectMembers(projectId: string, memberUids: string[]) {
    try {
        const res = await fetch(`${BASE_URL}/api/project/member?projectId=${projectId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ member: memberUids }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to add members: " + errorText);
        }

        const data = await res.json();
        console.log("addProjectMembers:", data);
        return data;
    } catch (err) {
        console.error("Error adding project members:", err);
        throw err;
    }
}

