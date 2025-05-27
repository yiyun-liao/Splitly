import { useState, useEffect, useMemo } from "react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Sheet from "@/components/ui/Sheet";

interface CreatePaymentProps {
    onClose: () => void;
    open?: boolean;
}

export default function CreateProject({
    onClose,
    open = true,
    }:CreatePaymentProps){

    // project data

    
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open]);

    // disable button 

    const handleSubmitData = () => {
        // onSubmit(payload); // 把資料丟到外層
        onClose()
    };

    return(
        <Sheet open={open} onClose={onClose}>
            {(onClose) => (
                <div id="receipt-form-header"  className="shrink-0 w-full max-w-xl flex pt-1 pb-4 items-center gap-2 justify-start overflow-hidden">
                    <IconButton icon='solar:alt-arrow-left-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />
                    <p className="w-full text-xl font-medium truncate min-w-0"> 新增專案</p>
                    <Button
                        size='sm'
                        width='fit'
                        variant='solid'
                        color='primary'
                        //disabled={!isComplete} 
                        //isLoading={isLoading}
                        onClick={handleSubmitData}
                        >
                            儲存
                    </Button>
                </div>
            )}
        </Sheet>
    )
}