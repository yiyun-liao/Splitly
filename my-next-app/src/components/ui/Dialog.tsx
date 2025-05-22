import IconButton from "./IconButton";
import clsx from 'clsx';
import { useEffect } from "react";

interface DialogProps {
    header: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    open: boolean;
    onClose: () => void;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    leftIcon?: string;
    onLeftIconClick?: () => void;
    hideCloseIcon?: boolean;
    closeOnBackdropClick?: boolean;
}


export default function Dialog({
        header,
        children,
        footer,
        open = true,
        onClose,
        headerClassName,
        bodyClassName,
        footerClassName,
        leftIcon,
        onLeftIconClick,
        hideCloseIcon = false,
        closeOnBackdropClick = false,
    ...props}:DialogProps){

    const headerClass = clsx("min-h-13 py-2 px-4 w-full inline-flex items-center justify-start gap-2", headerClassName)
    const bodyClass = clsx("py-4 px-4 w-full flex-1 overflow-y-auto overflow-x-none", bodyClassName)
    const footerClass = clsx("min-h-13 py-2 px-4 w-full flex gap-1", footerClassName) //items-center justify-end

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open]);
    
    if (!open) return null;

    const handleBackdropClick = () => {
        if (closeOnBackdropClick) onClose();
    };
    
    return(
        <div className="fixed inset-0 z-101 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
            <div className="w-fit h-fit p-4">
                <div className="w-lg h-140 max-h-[90vh] bg-zinc-50 rounded-xl overflow-hidden shadow-md flex flex-col items-start justify-start">
                    <div className={headerClass}>
                        {leftIcon && <IconButton icon={leftIcon} size="sm" variant="text-button" color="zinc" type="button" onClick={onLeftIconClick} />}
                        {header && <div className="w-full whitespace-nowrap truncate align-middle text-xl font-medium text-zinc-700" >{header}</div>}
                        {!hideCloseIcon && <IconButton icon='solar:close-circle-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />}
                    </div>
                    <div className={bodyClass} {...props}>{children}</div>
                    {footer && <div className={footerClass}>{footer}</div>}
                </div>
            </div>
        </div>
    )
}


{/* <Dialog
        header="這是 Dialog 標題"
        open={isDialogOpen} // 從某處打開
        onClose={handleClose} // 點擊哪裡關閉
        headerClassName= "string" // 看需求
        bodyClassName= "string" // 看需求
        footerClassName: "items-center justify-end"
        leftIcon="solar:arrow-left-line-duotone"
        hideCloseIcon= {false}
        closeOnBackdropClick= {false}
        onLeftIconClick={handleBack}
        footer={
        <>
            <Button variant="outline" color="primary" onClick={handleClose}>取消</Button>
            <Button variant="solid" color="primary" onClick={() => alert('確定！')}>確定</Button>
        </>
        }
    >
        children
</Dialog> */}