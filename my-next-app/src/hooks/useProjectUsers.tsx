// hooks/useProjectUsers.ts
import { useEffect, useState } from "react";
import { UserData } from "@/types/user";
import { buildAvatarUrl } from "@/utils/avatar";
import { fetchUserByProject } from "@/lib/projectApi";

export function useProjectUsers(projectId?: string) {
  const [users, setUsers] = useState<UserData[] | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchProjectUsers = async(projectId:string) => {
        setLoading(true);
        try{
            setLoading(true);
            const rawUsers = await fetchUserByProject(projectId)
            const fullUsers: UserData[] = rawUsers.map((user: UserData)=>({
                ...user,
                avatarURL: buildAvatarUrl(Number(user?.avatar) || 1),
            }))
            setUsers(fullUsers);
        }catch(error){
            console.error("Error fetching project user data:", error);
            setUsers(undefined);
        }finally{
            setLoading(false);
        }
    }
    
    fetchProjectUsers(projectId);
  }, [projectId]);

  return { users, loading };
}
