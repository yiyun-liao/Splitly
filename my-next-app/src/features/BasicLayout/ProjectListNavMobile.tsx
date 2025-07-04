"use client"; 
import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import clsx from "clsx";

import ModalPortal from "@/components/ui/ModalPortal";
import ImageButton from "@/components/ui/ImageButton";
import IconButton from "@/components/ui/IconButton/IconButton";

import { useAuth } from "@/contexts/AuthContext";
import { getLocalStorageItem } from '@/hooks/useTrackLastVisitedProjectPath';


interface ProjectListNavMobileProps {
    isProjectNavOpen: boolean;
    onClose: () => void;
}

export default function ProjectListNavMobile({
    isProjectNavOpen = false,
    onClose,
}:ProjectListNavMobileProps){
    const router = useRouter();
    const { projectId, userId } = useParams();
    const { projectData} = useAuth();
    const [lastPath, setLastPath] = useState<string | null>(null);


    useEffect(() => {
        if (isProjectNavOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isProjectNavOpen]);

    // 讀取 localStorage 中的 lastVisitedProjectPath
    useEffect(() => {
        const stored = getLocalStorageItem<string>("lastVisitedProjectPath");
        setLastPath(stored || projectData?.[0]?.id || null);
    }, [projectData]);
    
    if (!isProjectNavOpen) return null;
    

    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const navWrapperClass = clsx(
        "fixed inset-0 z-55 flex items-start justify-start backdrop-blur-sm bg-black/20", 
      );
      
    const navStyleClass = clsx(
        "h-full min-w-[200px] w-[60%] max-w-[480px] bg-sp-white-100 shadow-xl box-border py-4 px-4 flex flex-col justify-start gap-2 rounded-r-xl text-zinc-700",
        "transition-all duration-300 ease-in-out"
    );
    const labelClass = clsx("w-full font-medium truncate", "transition-opacity duration-300",)
    const itemClass= clsx("w-full flex gap-2 items-center rounded-xl hover:text-sp-blue-600 hover:bg-zinc-900/10 active:text-sp-blue-800 active:bg-zinc-900/40 cursor-pointer")

    return(
        <ModalPortal>  
            <div className={`${navWrapperClass}`} onClick={onClose}>
                <div className={navStyleClass} onClick={(e) => e.stopPropagation()}>
                    <div className="w-full shrink-0 flex justify-end items-center">
                        <p className={`${labelClass}`}>所有專案</p>
                        <IconButton
                                icon='solar:close-circle-line-duotone'
                                size='md'
                                variant='text-button'
                                color='primary'
                                type= 'button'
                                onClick={() => onClose()}
                            />
                    </div>
                    <div
                        className={`shrink-0 ${itemClass}`}
                        onClick={() => {
                            router.push(`/${userId}/${lastPath}/expense?openCreateProject=true`);
                            onClose();
                        }}
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
                    <div className={`flex-1 flex flex-col gap-2 pb-13 ${scrollClass}`}>
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
                    </div>
                    <div className="shrink-0 w-full pb-5 min-h-30 " />
                </div>
            </div>
        </ModalPortal>
    )
}