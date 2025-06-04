
import { useEffect, ReactNode, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import clsx from "clsx";


interface SheetProps {
    open: boolean;
    onClose: () => void;
    children: (onClose: () => void) => ReactNode; 
}


export default function Sheet({
        onClose,
        open = true,
        children,
    }:SheetProps){

    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"
            setVisible(true);
        }else {
            document.body.style.overflow = "auto";
            setTimeout(() => setVisible(false), 300);
        };

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);
    
    
    const isMobile = useIsMobile();
    const isMobileClass = clsx("w-full h-fit flex flex-col items-center justify-bottom",
        {"w-full pl-0": isMobile === true,
            "max-w-520 pl-17": isMobile === false,  
        }
    )
    
    if (!open && !visible) return null;
    
    return(
        <div style={{ opacity: open ? 1 : 0 }} className="fixed inset-0 z-110 flex items-center justify-center bg-black/50">
            <div className={isMobileClass}>
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full h-screen box-border px-6 py-6 rounded-2xl overflow-hidden shadow-md flex flex-col items-start justify-bottom  bg-sp-green-300 text-zinc-700 text-base ${open ? "translate-x-0" : "translate-x-full"}`}
                >
                {children(onClose)} 
                </div>
            </div>
        </div>
    )
}


{/* <Sheet open={open} onClose={onClose}>
{(onClose) => (
  <>
  </>
)}
</Sheet> */}