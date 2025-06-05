import Avatar from "@/components/ui/Avatar"
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";


export default function SettingMemberHeader(){
    const { userData,} = useGlobalProjectData();
    console.log("who am i", userData)
    if (!userData) {
        console.error("userData is null");
        return <p>無法取得使用者資料</p>; // 或 return null
    }

    
    return(
        <div id="dashboard-header"  className="flex items-center gap-2 w-full box-border justify-between px-6 py-2">
            <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                <Avatar
                    size='md'
                    img={userData.avatarURL}
                    userName={userData.name}
                />
                <p className="text-2xl font-medium text-zinc-700 whitespace-nowrap truncate min-w-0 max-w-100">{userData.name || ""}</p>
            </div>
        </div>
    )
}