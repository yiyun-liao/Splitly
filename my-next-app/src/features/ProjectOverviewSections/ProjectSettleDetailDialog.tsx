import Dialog from "@/components/ui/Dialog";
import Avatar from "@/components/ui/Avatar";
import ModalPortal from "@/components/ui/ModalPortal";

import { UserData } from "@/types/user";

interface ProjectSettleDetailProps {
    isSelfExpenseOpen: boolean;
    onClose: () => void;
    userData: UserData | null;
}

export default function ProjectSettleDetail({
    isSelfExpenseOpen = false,
    onClose,
    userData
}:ProjectSettleDetailProps){

    const renderBody = () => {
        return(
            <div>
                <div className="px-3 py-3 flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                        <div  className="shrink-0  flex items-center justify-center ">
                            <Avatar
                                size="md"
                                img={userData?.avatarURL}
                                userName = {userData?.name}
                                //onAvatarClick={() => console.log('Clicked!')}
                            />
                        </div>
                        <p className="text-base w-fll  truncate">{userData?.name}</p>
                    </div>
                    <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                        <p className="shrink-0 text-base">欠你</p>
                        <p className="shrink-0 text-xl font-semibold">$489.54805</p>
                    </div>
                </div>
                <div className="px-3 py-3 flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                        <div  className="shrink-0  flex items-center justify-center ">
                            <Avatar
                                size="md"
                                img={userData?.avatarURL}
                                userName = {userData?.name}
                                //onAvatarClick={() => console.log('Clicked!')}
                            />
                        </div>
                        <p className="text-base w-fll  truncate">{userData?.name}</p>
                    </div>
                    <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                        <p className="shrink-0 text-base">欠你</p>
                        <p className="shrink-0 text-xl font-semibold">$489.54805</p>
                    </div>
                </div>
            </div>
        )
}
    return(
        <ModalPortal>
            <Dialog
                    header="您在專案中"
                    open={isSelfExpenseOpen} // 從某處打開
                    onClose={ () => {
                        onClose();
                    }} // 點擊哪裡關閉
                    footerClassName= "items-center justify-end"
                    footer= {<div> </div>}
                >
                    {renderBody()}
            </Dialog>
        </ModalPortal>
    )
}