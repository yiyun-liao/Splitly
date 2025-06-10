import Avatar from "@/components/ui/Avatar"
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";


export default function SettingMemberHeader(){
    const { userData,} = useGlobalProjectData();
    
    return(
        <div id="dashboard-header"  className="min-h-13 md:min-h-18 flex items-center gap-2 w-full box-border justify-between px-6 py-2">
            <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                <div className="shrink-0">
                    <Avatar
                        size='md'
                        img={userData?.avatarURL}
                        userName={userData?.name}
                    />
                </div>
                <p className="text-2xl font-medium text-zinc-700 break-all min-w-0 max-w-100">{userData?.name || ""}</p>
            </div>
        </div>
    )
}