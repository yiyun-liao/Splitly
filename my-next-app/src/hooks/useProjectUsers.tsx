// hooks/useProjectUsers.ts
import { useEffect, useState } from "react";
import { UserData } from "@/types/user";
import { GetPaymentData } from "@/types/payment";
import { buildAvatarUrl } from "@/utils/avatar";
import { fetchUserByProject } from "@/lib/projectApi";
import { fetchPaymentsByProject } from "@/lib/paymentApi";

export function useProjectUsers(projectId?: string) {
  const [users, setUsers] = useState<UserData[] | undefined>();
  const [payments, setPayments] = useState<GetPaymentData[] | undefined>();
  const [loading, setLoading] = useState(false);
  const isReady = !!users && !loading && !!payments;

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

            const rawPayments = await fetchPaymentsByProject(projectId);
            const fullPayments = rawPayments.payments;
            setUsers(fullUsers);
            setPayments(fullPayments)
        }catch(error){
            console.error("Error fetching project user data:", error);
            setUsers(undefined);
            setPayments(undefined);
        }finally{
            setLoading(false);
        }
    }
    
    fetchProjectUsers(projectId);
  }, [projectId]);

  return { users, payments, isReady };
}
