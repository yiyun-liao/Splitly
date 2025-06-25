// 登出時更新用戶、project、payment

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function refreshDemoData(token: string, uid: string,){
    try{
        const res = await fetch(`${BASE_URL}/api/auth/demo_user?uid=${uid}`, {
            method: "PATCH",
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
             },
        });
        
        if (!res.ok) throw new Error("Failed to refresh demo data");
        const result = await res.json();
        // console.log("refreshUser: ",result)
        return result;
    }catch(error){
        console.error("Error refreshing demo user data from backend:", error);
        throw error;
    }
}