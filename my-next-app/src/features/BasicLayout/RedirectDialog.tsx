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
        <div className="flex flex-col justify-start items-center gap-4 pt-20 text-zinc-700">
            <p className="text-xl w-full text-sp-blue-500 font-bold text-center">新增成員</p>
            <p className="text-base">由於內嵌瀏覽器限制，Google 登入必須在系統瀏覽器完成。</p>
            <div className="w-60 mx-auto pt-4">
                <Button
                    size="md"
                    variant="solid"
                    width="full"
                    color="primary"
                    onClick={() => {
                        navigator.clipboard.writeText(url)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                        toast.success('複製成功，請用瀏覽器開啟');
                        onClose();
                    }}
                >
                    {copied ? '已複製!' : '複製連結'}
                </Button>
            </div>
            <p className="text-sm text-gray-500">複製完畢後，請使用瀏覽器開啟，即可完成登入。</p>                
        </div>
        )
    }

    return(
        <ModalPortal>
            <Dialog
                    header=" "
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