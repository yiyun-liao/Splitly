"use client"; 
import clsx from "clsx";
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageButton from "@/components/ui/ImageButton"
import IconButton from "@/components/ui/IconButton"
import CreateProject from "../CreateProjectSections/CreateProject-main";

import { useAuth } from '@/contexts/AuthContext';
import { getLocalStorageItem } from '@/hooks/useTrackLastVisitedProjectPath';
import { clearUserCache } from "@/utils/cache";


interface MemberNavProps {
    setNavWidth:(width: number) => void; 
}

export default function MemberNav({setNavWidth}:MemberNavProps) {
    const {logOutUser, projectData, userData} = useAuth();

    const router = useRouter();
    const pathname = usePathname();
    const { projectId, userId } = useParams();
    const lastPath = getLocalStorageItem<string>("lastVisitedProjectPath") || projectData?.[0]?.id;

    const [navStyle, setNavStyle] = useState<"contraction" | "expansion">("contraction")
    const [activePath, setActivePath] = useState<"dashboard" | "expense">();
    const [isCreateProject, setIsCreateProject]= useState(false);
  
    useEffect(() => {
        setNavWidth(navStyle === "expansion" ? 200 : 72);
    }, [navStyle, setNavWidth]);

    useEffect(() => {
        if (pathname.includes("/dashboard")) setActivePath("dashboard");
        else if (pathname.includes("/expense")) setActivePath("expense");
    }, [pathname]);

    async function handleLogout() {
        const success = await logOutUser();
        if (success){
            console.log('Bye Bye 👋🏻');
            toast.success('Bye Bye 👋🏻')
            clearUserCache();
            router.replace('/');    
        }
    }

    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const navStyleClass = clsx("box-border py-4 flex flex-col justify-start gap-2 bg-sp-white-40",
        "transition-all duration-300 ease-in-out",
        {
            "min-w-18 items-center": navStyle === 'contraction',
            "w-[200px] items-start": navStyle === 'expansion',            
        }
    )
    const labelClass = clsx("w-full font-medium truncate", 
        "transition-opacity duration-300",
        {
            "opacity-0": navStyle === 'contraction',
            "opacity-100": navStyle === 'expansion',
        }
    )
    const itemClass= clsx("w-full flex gap-2 items-center rounded-xl hover:text-sp-blue-600 hover:bg-zinc-900/10 active:text-sp-blue-800 active:bg-zinc-900/40 cursor-pointer")
    const navDivClass = clsx(
        "w-full flex flex-col justify-start gap-2 py-3 px-3",
        {
            "items-center": navStyle === 'contraction',
            "items-start": navStyle === 'expansion'
        }
    ) 
    const navFunctionDivClass = clsx("w-full flex flex-col items-start justify-start gap-2 py-2 px-2") 
    const navFunctionClass = clsx("w-full flex flex-col items-start justify-start p-1 gap-2 rounded-xl",
        {
            "bg-sp-white-60 shadow": navStyle === 'contraction',
            "bg-sp-white-60": navStyle === 'expansion'            
        }
    )

    const navSetting = () => (
        <>
            <div id="nav-setting" className={`${navStyle == 'expansion' ? "flex-row items-start justify-between": "flex-col items-center justify-start"} w-full flex gap-2 py-3 px-3 border-t-1 border-sp-blue-400`}>
                {navStyle === 'expansion' &&(
                    <IconButton
                    icon='solar:logout-2-bold'
                    size='md'
                    variant='text-button'
                    color='primary'
                    type= 'button'
                    onClick={handleLogout}
                    />           
                )}  
                <IconButton
                    icon='solar:user-bold'
                    size='md'
                    variant='text-button'
                    color='primary'
                    type= 'button'
                    onClick={() => router.push(`/${userId}/setting`)}
                />
                <IconButton
                    icon={navStyle === 'contraction' ? 'solar:maximize-outline' : "solar:minimize-outline"}
                    size='md'
                    variant='text-button'
                    color='primary'
                    type= 'button'
                    onClick={()=>{setNavStyle(navStyle === "expansion" ? "contraction" : "expansion")}} 
                />               
            </div>
        </>
    )

    return(
        <div className="w-fit box-border text-zinc-700">
            <>
                {isCreateProject && userData && (
                    <CreateProject
                        onClose={() => setIsCreateProject(false)}
                        userData = {userData}
                    />
                )}
            </>
            {navStyle === 'contraction' && (
                <nav className={navStyleClass} style={{ height: "100vh" }}>
                    <div id="nav-brand-logo" className={navDivClass}>
                        <ImageButton
                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                            size='md'
                            imageName= "Splitly"
                        />
                    </div>
                    <div id="nav-function" className={`${navDivClass} flex-1 `}>
                        <div className={navFunctionClass}>
                            <IconButton
                                icon='solar:widget-2-bold'
                                size='md'
                                variant={activePath === 'dashboard' ? 'solid' : 'outline'}
                                color='primary'
                                type= 'button'
                                onClick={() => router.push(`/${userId}/${lastPath}/dashboard`)}  
                                />
                            <IconButton
                                icon='solar:reorder-bold'
                                size='md'
                                variant={activePath === 'expense' ? 'solid' : 'outline'}
                                color='primary'
                                type= 'button'
                                onClick={() => router.push(`/${userId}/${lastPath}/expense`)} 
                                />
                        </div>
                    </div>
                    <div id="nav-project-list" className={`${navDivClass} ${scrollClass}`}>
                        {projectData?.map(project => {
                            return(
                                <ImageButton
                                    key={project.id}
                                    image={project.imgURL}
                                    size='md'
                                    imageName= {project.project_name}
                                    onClick={() => router.push(`/${userId}/${project.id}/dashboard`)}
                                />
                            )}
                        )}
                    </div>
                    {navSetting() }
                </nav>
            )}
            {navStyle === 'expansion' && (
                <nav className={navStyleClass} style={{ height: "100vh" }}>
                    <div id="nav-brand-logo" className={navDivClass}>
                        <ImageButton
                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                            size='md'
                            imageName= "Splitly"
                        />
                    </div>
                    <div id="nav-function" className={`${navFunctionDivClass} flex-1 `}>
                        <div className={navFunctionClass}>
                            <div 
                                onClick={() => router.push(`/${userId}/${lastPath}/dashboard`)}  
                                className={itemClass}
                            >
                                <IconButton
                                    icon='solar:widget-2-bold'
                                    size='md'
                                    variant={activePath === 'dashboard' ? 'solid' : 'outline'}
                                    color='primary'
                                    type= 'button'
                                    onClick={() => {}} 
                                />
                                <p className={`${labelClass} ${activePath === 'dashboard' && "text-sp-blue-500"}`}>專案檢視</p>
                            </div>
                            <div 
                                onClick={() => router.push(`/${userId}/${lastPath}/expense`)} 
                                className={itemClass}
                            >
                                <IconButton
                                    icon='solar:reorder-bold'
                                    size='md'
                                    variant={activePath === 'expense' ? 'solid' : 'outline'}
                                    color='primary'
                                    type= 'button'
                                    onClick={() => {}} 
                                />
                                <p className={`${labelClass} ${activePath === 'expense' && "text-sp-blue-500"}`}>收支紀錄</p>
                            </div>
                        </div>
                    </div>
                    <div id="nav-project-list" className={`${navDivClass} ${scrollClass}`}>
                        {projectData?.map(project => {
                            return(
                                <div 
                                    key={project.id} 
                                    onClick={() => router.push(`/${userId}/${project.id}/dashboard`)}
                                    className={`${itemClass} ${projectId === project.id && 'bg-sp-blue-200'}`}
                                >
                                    <ImageButton
                                        key={project.id}
                                        image={project.imgURL}
                                        size='md'
                                        imageName= {project.project_name}
                                        onClick={() => {}}
                                    />
                                    <p className={`${labelClass} ${projectId === project.id && "text-sp-blue-500"}`}>{project.project_name}</p>
                                </div>
                            )}
                        )}
                        <div
                            className={itemClass}
                            onClick={() => setIsCreateProject(true)}
                        >
                            <IconButton
                                icon='solar:add-circle-bold'
                                size='md'
                                variant='text-button'
                                color='primary'
                                type= 'button'
                                onClick={() => {}}
                            />
                            <p className={`${labelClass}`}>新增專案</p>
                        </div>
                    </div>
                    {navSetting() }
                </nav>
            )}
        </div>
    )
}