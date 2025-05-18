import clsx from "clsx";
import { useParams, useRouter } from 'next/navigation';
import { useState } from "react";
import Icon from "@/components/lib/Icon";
import Button from "@/components/lib/Button";
import Avatar from "@/components/lib/Avatar";

interface CreateReceiptProps {
    userData: {
      avatar?: string;
      name?: string;
    } | null;
  }

export default function CreateReceipt({userData}:CreateReceiptProps){

    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const headerClass = clsx("min-h-13 py-2 px-4 w-full inline-flex items-center justify-start gap-2")
    const bodyClass = clsx("py-4 px-4 w-full flex-1 overflow-y-auto overflow-x-none", )
    const footerClass = clsx("min-h-13 py-2 px-4 w-full flex gap-1", ) //items-center justify-end
    
    return(
        <div className="fixed inset-0 z-101 flex items-center justify-center bg-black/50">
            <div className="w-fit h-fit p-4">
                <div className="w-lg h-105 max-h-[90vh] bg-zinc-50 rounded-xl overflow-hidden shadow-md flex flex-col items-start justify-start">
                <div className={headerClass}>

                </div>
                <div className={bodyClass} >hihi</div>
                <div className={footerClass}>hihi</div>
                </div>
            </div>
        </div>
    )
}