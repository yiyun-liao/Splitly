"use client"; 
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

import IconButton from "@/components/ui/IconButton";
import CreatePayment from "../CreatePaymentSections/CreatePayment-main";

import { useAuth } from '@/contexts/AuthContext';
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { getLocalStorageItem } from '@/hooks/useTrackLastVisitedProjectPath';

export default function MemberNavMobile() {
    const router = useRouter();
    const pathname = usePathname();
    const { projectId, userId } = useParams();

    const { projectData } =useAuth();
    const { currentProjectUsers} = useCurrentProjectData();
    
    const [isCreatePayment, setIsCreatePayment] = useState(false)
    const [activePath, setActivePath] = useState(pathname); // 對應當前功能頁面渲染按鈕
    const lastPath = getLocalStorageItem<string>("lastVisitedProjectPath") || projectData?.[0]?.id;

    // console.log("i would like to go ",lastPath)

    useEffect(() => {
        setActivePath(pathname);
    }, [pathname]);


    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white z-25">
            <div>
                {isCreatePayment && currentProjectUsers && (
                    <CreatePayment 
                        open = {true}
                        onClose={() => setIsCreatePayment(false)}
                    />
                )}
            </div>
            <div className="flex justify-around items-end h-13 py-2">
                <IconButton
                    icon='solar:widget-2-bold'
                    size='sm'
                    variant= 'text-button'
                    color= {activePath === `/${userId}/${projectId}/dashboard` ? 'primary' : 'zinc'}
                    type= 'button'
                    onClick={() => router.push(`/${userId}/${lastPath}/dashboard`)}  
                />
                <IconButton
                    icon='solar:reorder-bold'
                    size='sm'
                    variant= 'text-button'
                    color= {activePath === `/${userId}/${projectId}/expense` ? 'primary' : 'zinc'}
                    type= 'button'
                    onClick={() => router.push(`/${userId}/${lastPath}/expense`)} 
                />
                <IconButton
                    icon='solar:clipboard-add-linear'
                    size='md'
                    variant= 'solid'
                    color= 'primary'
                    type= 'button'
                    onClick={() => {
                        if (pathname === `/${userId}/setting`) {
                            router.push(`/${userId}/${lastPath}/expense?openCreatePayment=true`);
                        } else {
                            setIsCreatePayment(true);
                        }
                    }}
                />
                <IconButton
                    icon='solar:chart-bold'
                    size='sm'
                    variant= 'text-button'
                    color= {activePath === `/${userId}/${projectId}/overview` ? 'primary' : 'zinc'}
                    type= 'button'
                    onClick={() => router.push(`/${userId}/${lastPath}/overview`)} 
                />
                <IconButton
                    icon='solar:user-bold'
                    size='sm'
                    variant= 'text-button'
                    color= {activePath === `/${userId}/setting` ? 'primary' : 'zinc'}
                    type= 'button'
                    onClick={() => router.push(`/${userId}/setting`)}
                />
            </div>
        </div>
    );
}
