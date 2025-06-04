import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

import IconButton from "@/components/ui/IconButton";
import CreatePayment from "../CreatePaymentSections/CreatePayment-main";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";


export default function MemberNavMobile() {
    const router = useRouter();
    const pathname = usePathname();
    const { projectId } = useParams();

    const { currentProjectUsers} = useCurrentProjectData();

    const [isCreatePayment, setIsCreatePayment] = useState(false)
    const [activePath, setActivePath] = useState(pathname); // 對應當前功能頁面渲染按鈕
    useEffect(() => {
        setActivePath(pathname);
    }, [pathname]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white z-50">
            <div>
                {isCreatePayment && currentProjectUsers && (
                    <CreatePayment 
                        onClose={() => setIsCreatePayment(false)}
                    />
                )}
            </div>
            <div className="flex justify-around items-end h-13 py-2">
                <IconButton
                    icon='solar:widget-2-bold'
                    size='sm'
                    variant= 'text-button'
                    color= {activePath === `/${projectId}/dashboard` ? 'primary' : 'zinc'}
                    type= 'button'
                    onClick={() => router.push(`/${projectId}/dashboard`)}  
                />
                <IconButton
                    icon='solar:reorder-bold'
                    size='sm'
                    variant= 'text-button'
                    color= {activePath === `/${projectId}/expense` ? 'primary' : 'zinc'}
                    type= 'button'
                    onClick={() => router.push(`/${projectId}/expense`)} 
                />
                <IconButton
                    icon='solar:clipboard-add-linear'
                    size='md'
                    variant= 'solid'
                    color= 'primary'
                    type= 'button'
                    onClick={() => setIsCreatePayment(true)}
                />
                <IconButton
                    icon='solar:chart-bold'
                    size='sm'
                    variant= 'text-button'
                    color= {activePath === `/${projectId}/overview` ? 'primary' : 'zinc'}
                    type= 'button'
                    onClick={() => router.push(`/${projectId}/overview`)} 
                />
                <IconButton
                    icon='solar:user-bold'
                    size='sm'
                    variant= 'text-button'
                    color= {activePath === `/${projectId}/setting` ? 'primary' : 'zinc'}
                    type= 'button'
                    onClick={() => router.push(`/${projectId}/setting`)}
                />
            </div>
        </div>
    );
}
