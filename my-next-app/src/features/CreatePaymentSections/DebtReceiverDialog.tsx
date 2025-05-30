import Dialog from "@/components/ui/Dialog";
import Avatar from "@/components/ui/Avatar";
import IconButton from "@/components/ui/IconButton";
import { User } from "../../types/payment";



interface DebtReceiverProps {
    isDebtReceiverOpen: boolean;
    onClose: () => void;
    selectedUid: string;
    setSelectedUid: (uid: string) => void;
    userList: User[];
}

export default function DebtReceiver({
        isDebtReceiverOpen = false,
        onClose,
        selectedUid,
        setSelectedUid,
        userList
    }:DebtReceiverProps){


    const renderBody = () => {
        return(
            <div>
                {userList.map((user) => {
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
                        <Avatar size="md" img={user.avatar} userName={user.name} />
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
        <Dialog
                header="匯款人"
                open={isDebtReceiverOpen} // 從某處打開
                onClose={ () => {
                    onClose();
                }} // 點擊哪裡關閉
                //headerClassName= {step === "add" ? undefined : "ml-11"}
                // bodyClassName= string // 看需求
                //footerClassName= "items-center justify-end"
                //leftIcon={step === "add" ? "solar:arrow-left-line-duotone" : undefined}
                //hideCloseIcon = false
                closeOnBackdropClick = {true}
                //onLeftIconClick={handleBack}
                //footer= {renderFooter()}
            >
                {renderBody()}
        </Dialog>
    )
}