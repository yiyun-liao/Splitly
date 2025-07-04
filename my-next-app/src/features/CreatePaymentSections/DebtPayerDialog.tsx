import Dialog from "@/components/ui/Dialog";
import Avatar from "@/components/ui/Avatar";
import IconButton from "@/components/ui/IconButton/IconButton";
import ModalPortal from "@/components/ui/ModalPortal";

import { UserData } from "@/types/user";


interface DebtPayerProps {
    isDebtPayerOpen: boolean;
    onClose: () => void;
    selectedUid: string;
    setSelectedUid: (uid: string) => void;
    currentProjectUsers: UserData[];
}

export default function DebtPayer({
        isDebtPayerOpen = false,
        onClose,
        selectedUid,
        setSelectedUid,
        currentProjectUsers
    }:DebtPayerProps){


    const renderBody = () => {
        return(
            <div>
                {currentProjectUsers.map((user) => {
                const isSelected = user.uid === selectedUid;

                return (
                    <div
                    key={user.uid}
                    className={`px-3 py-2 flex items-start justify-start gap-2 rounded-xl hover:bg-sp-green-100 active:bg-sp-green-200 ${isSelected ? "bg-sp-green-100" : ""}`}
                    onClick={() => {
                        setSelectedUid(user.uid);
                        onClose(); 
                    }}
                    >
                        <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                            <div className="shrink-0 flex items-center justify-center">
                            <Avatar size="md" img={user.avatarURL} userName={user.name} />
                            </div>
                            <p className="text-base w-full truncate">{user.name}</p>
                        </div>
                        <div className="shrink-0 flex items-start justify-start gap-2">
                            <IconButton
                            icon={isSelected ? "solar:unread-bold" : "solar:stop-line-duotone"}
                            size="sm"
                            variant="text-button"
                            color="zinc"
                            type="button"
                            />
                        </div>
                    </div>
                );
                })}
          </div>
        )
    }

    return(
        <ModalPortal>
            <Dialog
                    header="匯款人"
                    open={isDebtPayerOpen} // 從某處打開
                    onClose={ () => {
                        onClose();
                    }} // 點擊哪裡關閉
                >
                    {renderBody()}
            </Dialog>
        </ModalPortal>
    )
}