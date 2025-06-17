import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import ModalPortal from "@/components/ui/ModalPortal";
import { useState } from "react";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectMemberListProps {
    isMemberListOpen: boolean;
    onClose: () => void;
}

export default function ProjectMemberList({
    isMemberListOpen = false,
    onClose,
}:ProjectMemberListProps){

    const {currentProjectData, currentProjectUsers} = useCurrentProjectData();
    const {userData} = useAuth();

    const inviteUrl = `${window.location.origin}/join?pid=${currentProjectData?.id}`;


    const [step, setStep] = useState<"list" | "add">("list")
    const handleBack = () => {
        setStep('list')
    }

    const renderBody = () => {
        if (step === 'list'){
            return(
                <div>
                    {currentProjectUsers?.map((user) => (
                        <div key={user.uid} className="px-3 py-3 flex items-center justify-start gap-2">
                            <div  className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                <div  className="shrink-0  flex items-center justify-center ">
                                    <Avatar
                                        size="md"
                                        img={user.avatarURL}
                                        userName = {user.name}
                                        //onAvatarClick={() => console.log('Clicked!')}
                                    />
                                </div>
                                <p className="text-base w-fll  truncate">{user.name}{user.name === userData?.name ? "（你）" : ""}</p>
                            </div>
                            {currentProjectData?.owner  == user.uid && (
                                <div className="shrink-0 p-1 rounded-sm bg-sp-blue-300 text-sp-blue-500">擁有者</div>
                            )}
                        </div>
                    ))}
                </div>
            )
        }
        if (step === 'add'){
            return(
                <div className="flex flex-col justify-start items-center gap-4 pt-20">
                    <p className="text-xl w-full text-sp-blue-500 font-bold text-center">新增成員</p>
                    <div  className="w-full flex items-center justify-center -space-x-2">
                            <Avatar
                                size="lg"
                                img="https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/1.jpg"
                                userName="demo"
                                className="border-2 border-zinc-100"
                            />
                            <Avatar
                                size="lg"
                                img="https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/2.jpg"
                                userName="demo"
                                className="border-2 border-zinc-100"
                            />
                            <Avatar
                                size="lg"
                                img="https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/3.jpg"
                                userName="demo"
                                className="border-2 border-zinc-100"
                            />
                            <Avatar
                                size="lg"
                                img="https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/4.jpg"
                                userName="demo"
                                className="border-2 border-zinc-100"
                            />
                            <Avatar
                                size="lg"
                                img="https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/5.jpg"
                                userName="demo"
                                className="border-2 border-zinc-100"
                            />
                            <Avatar
                                size="lg"
                                img="https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/6.jpg"
                                userName="demo"
                                className="border-2 border-zinc-100"
                            />
                    </div>
                    <div className="w-60">
                        <Button
                            size="md"
                            variant="solid"
                            color="primary"
                            width = 'full'
                            onClick={()=>{
                                navigator.clipboard.writeText(inviteUrl);
                                toast.success('複製成功，請分享連結給團員');
                                onClose();
                            }}
                        >
                            複製專案連結
                        </Button>
                    </div>
                    <div>
                        {/* QR code  */}
                    </div>
                </div>
            )
        }
    }
    //console.log('dialog state', isMemberListOpen)
    return(
        <ModalPortal>
            <Dialog
                    header="成員"
                    open={isMemberListOpen}
                    onClose={ () => {
                        setStep("list");
                        onClose();
                    }} 
                    footerClassName= "items-center justify-end"
                    leftIcon={step === "add" ? "solar:arrow-left-line-duotone" : undefined}
                    closeOnBackdropClick = {true}
                    onLeftIconClick={handleBack}
                    footer={
                        step === "list" ? (
                            <>
                                {/* <Button
                                    variant="outline"
                                    color="primary"
                                    width = 'full'
                                    disabled = {true}
                                    onClick={() => alert('建立虛擬成員')}
                                >
                                    建立虛擬成員(還沒做)
                                </Button> */}
                                <Button
                                    variant="outline"
                                    color="primary"
                                    width = 'full'
                                    onClick={() => setStep("add")}
                                >
                                    新增成員
                                </Button>
                            </>
                        ) : ("")
                    }
                >
                    {renderBody()}
            </Dialog>
        </ModalPortal>
    )
}