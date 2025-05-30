// 渲染一個成員資料（Avatar + 名稱）

import Avatar from "@/components/ui/Avatar";
import { UserData } from "./types";

interface MemberItemProps {
  userData: UserData | null;
}

export default function MemberItem({ userData }: MemberItemProps) {
  return (
    <div className="px-3 py-3 flex items-center justify-start gap-2">
      <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
        <Avatar 
            size="md" 
            img={userData?.avatarURL} 
            userName={userData?.name} 
            //onAvatarClick={() => console.log('Clicked!')}
        />
        <p className="text-base w-full truncate">{userData?.name}</p>
      </div>
      <p className="shrink-0 text-base font-semibold">---</p>
    </div>
  );
}