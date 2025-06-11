'use client';
import { LogInScreen } from "./LogInScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { logOutUser } from "@/lib/auth";
import { clearUserCache } from "@/utils/cache";

async function logOut(){
    const success = await logOutUser();
    if (success){
        clearUserCache();
        console.log('Can not get auth, plz try again');
        return success;
    }else{
        return null;
    }
}

export function LogInReadyGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    const { firebaseUser, isLoadedReady:myDataReady, userData, projectData } = useAuth();

    console.log(`login ing ... authReady: ${myDataReady},projectData: ${projectData}, userData: ${userData}`)

    const isLogInReady = myDataReady  && !!userData ;

    if (isLogInReady === true){
        console.log("Login success 🏖️");
    } 

    if (!isLogInReady) return <LogInScreen text="正在檢查登入狀態…"/>;

    if (!firebaseUser) {
        alert('權限失敗，請重新登入')
        const success = logOut();
        if (!!success){
            clearUserCache();
            router.replace('/');    
        }
        return null;        
    }

    return <>{children}</>;
}
