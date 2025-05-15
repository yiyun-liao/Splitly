import ImageButton from "@/components/lib/ImageButton"
import IconButton from "@/components/lib/IconButton"
import { logOutUser } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';


export default function DashboardNav(){
    const navDivClass = "flex flex-col items-start justify-start py-2 gap-2 px-2"
    const router = useRouter();

    async function handleLogout() {
        await logOutUser();
        console.log('Logged out!');
        router.push('/');    
    }
    return(
        <nav className="min-w-18 h-screen py-4 flex flex-col items-center justify-start gap-2 bg-sp-white-40">
            <div id="nav-brand-logo">
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
            </div>
            <div id="nav-loge" className={`${navDivClass} flex-1 `}>
                <div className="flex flex-col items-start justify-start p-1 gap-2 rounded-xl bg-sp-white-80 shadow">
                    <IconButton
                        icon='solar:widget-2-bold'
                        size='md'
                        variant='text-button'
                        color='primary'
                        type= 'button'
                        //onClick={handleClick} 
                        >
                    </IconButton> 
                    <IconButton
                        icon='solar:reorder-bold'
                        size='md'
                        variant='text-button'
                        color='primary'
                        type= 'button'
                        //onClick={handleClick} 
                        >
                    </IconButton> 
                </div>
            </div>
            <div id="nav-project-list" className={`${navDivClass} overflow-y-auto overflow-x-hidden mb-2 scrollbar-gutter-stable scrollbar-thin scroll-smooth`}>
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/1.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/2.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/4.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/12.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/1.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/2.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/4.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/12.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/1.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/2.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/4.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/12.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton> 
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
                    //onClick={handleClick} 
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
    )
}