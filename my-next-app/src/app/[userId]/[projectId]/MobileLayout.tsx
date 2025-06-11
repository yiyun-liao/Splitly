import { ReactNode } from "react";
import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import clsx from "clsx";
import MemberNavMobile from "@/features/BasicLayout/MemberNavMobile";
import MemberHeaderMobile from "@/features/BasicLayout/MemberHeaderMobile";

export default function MobileLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { projectId, userId } = useParams();

    const isMobileClass = clsx("flex flex-col h-full overflow-hidden overscroll-none",
        {
            "bg-sp-green-300": pathname === `/${userId}/${projectId}/expense`,
            "bg-sp-blue-100 ": pathname !== `/${userId}/${projectId}/expense`
        }
    )
    return (
        <div className={isMobileClass}>
            <MemberHeaderMobile/>
                <main  className="flex-1 h-full overscroll-none py-13 px-2">
                    {children}
                </main>
            <MemberNavMobile /> 
        </div>
    );
}
