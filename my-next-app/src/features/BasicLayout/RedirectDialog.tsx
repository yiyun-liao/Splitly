import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import ModalPortal from "@/components/ui/ModalPortal";
import toast from "react-hot-toast";
import { useState } from "react";

interface RedirectDialogProps {
    open: boolean;
    onClose: () => void;
    url:string;
}

export default function RedirectDialog({
    open = false,
    onClose,
    url
}:RedirectDialogProps){
    const [copied, setCopied] = useState(false)


    const renderBody = () => {
        return(
            <div className="flex flex-col justify-start items-center gap-4 pt-20">
            <p className="text-xl w-full text-sp-blue-500 font-bold text-center">新增成員</p>
            <div  className="w-full flex items-center justify-center -space-x-2">
                <p className="text-base">由於內嵌瀏覽器限制，Google 登入必須在系統瀏覽器完成。</p>
                <p className="text-base">{url}</p>
            </div>
            <div className="w-60">
                <Button
                    size="md"
                    variant="solid"
                    color="primary"
                    onClick={() => {
                        navigator.clipboard.writeText(url)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                        toast.success('複製成功，請分享連結給團員');
                        onClose();
                    }}
                >
                    {copied ? '已複製!' : '複製連結'}
                </Button>
                <p className="text-sm text-gray-500">複製完畢後，請使用瀏覽器前往，即可完成登入。</p>                
            </div>
        </div>
        )
    }

    return(
        <ModalPortal>
            <Dialog
                    header="編輯個人資訊"
                    open={open} // 從某處打開
                    onClose={ () => {onClose();}} 
                    footerClassName= "items-center justify-end"
                    closeOnBackdropClick = {true}
                    footer= {<div> </div>}
                >
                    {renderBody()}
            </Dialog>
        </ModalPortal>
    )
}