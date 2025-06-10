// my-next-app/src/lib/userApi.tsx

import { UserData } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createNewUser(
    token: string,
    user: {
        name: string | '';
        email: string | '';
        uid_in_auth: string;
        avatar: number;
    }
) {
    try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to sync user: " + errorText);
    }

        const data = await response.json();
        console.log('login success', data)
    return data;
    } catch (err) {
        console.error("Error syncing user to backend:", err);
    }
}

export async function fetchCurrentUser(token: string, uid: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/user?uid=${uid}`, {
            method: "GET",
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        console.log("getUser: ",data)
        console.log("Have a great day! 🏖️");
        return data;
    } catch (error) {
        console.error("Error fetching user data from backend:", error);
        throw error;
    }
}

// 更新用戶
export async function updateUser(token: string, uid: string, data:UserData) {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/user?uid=${uid}`, {
            method: "PATCH",
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
             },
            body: JSON.stringify(data),

        });
        
        if (!res.ok) throw new Error("Failed to update user data");
        const result = await res.json();
        console.log("updateUser: ",result)
        return result;
    } catch (error) {
        console.error("Error updating user data from backend:", error);
        throw error;
    }
}

// 取得專案的所有成員
export async function fetchUserByProject(pid: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/member?pid=${pid}`,{
            method: "GET",
            headers: {"Content-Type": "application/json",},
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