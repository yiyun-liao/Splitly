import ImageButton from "@/components/ui/ImageButton"
import IconButton from "@/components/ui/IconButton"
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import clsx from "clsx";
import CreateProject from "./CreateProjectSections/CreateProject-main";
import { logOutUser } from "@/lib/auth";
import { useProjectData } from "@/contexts/GlobalProjectContext";



export default function MemberNav() {
    const router = useRouter();
    const pathname = usePathname();
    const { projectId } = useParams();
    const {projectData, userData} = useProjectData();

    const [navStyle, setNavStyle] = useState<"contraction" | "expansion">("contraction")
    const [activePath, setActivePath] = useState(pathname); // 對應當前功能頁面渲染按鈕
    const [isCreateProject, setIsCreateProject]= useState(false);
  
    useEffect(() => {
      setActivePath(pathname);
    }, [pathname]);

    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const navDivClass = clsx(
        "w-full flex flex-col items-center justify-start py-2 gap-2 px-2",
        {
            "": navStyle === 'contraction',
            "": navStyle === 'expansion'
        }
    ) 

    async function handleLogout() {
        await logOutUser();
        console.log('Logged out!');
        router.push('/');    
    }
    return(
        <div className="w-fit box-border">
            <>
                {isCreateProject && userData && (
                    <CreateProject
                        onClose={() => setIsCreateProject(false)}
                        userData = {userData}
                    />
                )}
            </>
            {navStyle === 'contraction' && (
                <nav className="min-w-18 h-screen box-border py-4 flex flex-col items-center justify-start gap-2 bg-sp-white-40">
                    <div id="nav-brand-logo" className={navDivClass}>
                        <ImageButton
                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                            size='md'
                            imageName= "Splitly"
                        />
                    </div>
                    <div id="nav-function" className={`${navDivClass} flex-1 `}>
                        <div className="flex flex-col items-start justify-start p-1 gap-2 rounded-xl bg-sp-white-80 shadow">
                            <IconButton
                                icon='solar:widget-2-bold'
                                size='md'
                                variant={activePath === `/${projectId}/dashboard` ? 'solid' : 'outline'}
                                color='primary'
                                type= 'button'
                                onClick={() => router.push(`/${projectId}/dashboard`)} 
                            />
                            <IconButton
                                icon='solar:reorder-bold'
                                size='md'
                                variant={activePath === `/${projectId}/expense` ? 'solid' : 'outline'}
                                color='primary'
                                type= 'button'
                                onClick={() => router.push(`/${projectId}/expense`)} 
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
                                    onClick={() => router.push(`/${project.id}/dashboard`)}
                                />
                            )}
                        )}
                        <IconButton
                            icon='solar:add-circle-bold'
                            size='md'
                            variant='text-button'
                            color='primary'
                            type= 'button'
                            onClick={() => setIsCreateProject(true)}
                        />
                    </div>
                    <div id="nav-setting" className={`${navDivClass} border-t-1 border-sp-blue-400`}>
                        <IconButton
                            icon='solar:user-bold'
                            size='md'
                            variant='text-button'
                            color='primary'
                            type= 'button'
                            //onClick={handleClick} 
                            >
                        </IconButton> 
                        <IconButton
                            icon='solar:square-double-alt-arrow-right-outline'
                            size='md'
                            variant='text-button'
                            color='primary'
                            type= 'button'
                            //onClick={()=>{setNavStyle('expansion')}} 
                            >
                        </IconButton> 
                        <IconButton
                            icon='solar:multiple-forward-left-bold'
                            size='md'
                            variant='text-button'
                            color='primary'
                            type= 'button'
                            onClick={handleLogout} 
                            >
                        </IconButton> 
                    </div>
                </nav>
            )}
            {navStyle === 'expansion' && (
                <p>none</p>
            )}
        </div>
    )
}