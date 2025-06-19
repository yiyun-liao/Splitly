import Dialog from "@/components/ui/Dialog";
import IconButton from "@/components/ui/IconButton";
import ModalPortal from "@/components/ui/ModalPortal";

import clsx from "clsx";
import type { IconProps } from '@phosphor-icons/react';
import { useEffect } from "react";
import { CategoryGrouped } from "@/types/category";
import { useIsMobile } from "@/hooks/useIsMobile";


interface CategoryDialogProps {
    isCategoryOpen: boolean;
    onClose: () => void;
    grouped: CategoryGrouped[];
    selectedParentId: number | null
    setSelectedParentId: (id: number | null) => void
    selectedCategoryValue:string;
    setSelectedCategoryValue: (value: string) => void
    setSelectedCategoryIconValue: (icon: React.ComponentType<IconProps>) => void
}

export default function CategoryDialog({
        isCategoryOpen = false,
        onClose,
        grouped,
        selectedParentId,
        setSelectedParentId,
        selectedCategoryValue,
        setSelectedCategoryValue,
        setSelectedCategoryIconValue,
    }:CategoryDialogProps){
    const isMobile = useIsMobile();
    useEffect(() => {
        if (selectedParentId === null && grouped.length > 0) {
            setSelectedParentId(grouped[0].id)
        }
    }, [grouped, selectedParentId])
    const parent = grouped.find(cat => cat.id === selectedParentId) ?? grouped[0];

    const scrollXClass = clsx("overflow-x-auto overflow-y-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const renderBody = () => {
        return(
            <div className="flex flex-col gap-4">
                <div className={`w-hug max-w-full flex items-center bg-sp-blue-200 rounded-2xl ${scrollXClass} ${isMobile ? 'justify-start' : 'justify-center'}`}>
                    {grouped.map(cat =>{ 
                        const isSelected = selectedParentId === cat.id
                        const Icon = cat.icon
                        return(
                            <div key={cat.id} 
                                className={clsx("min-w-22 flex flex-col items-center justify-center cursor-pointer rounded-xl overflow-hidden hover:bg-sp-blue-300", {
                                    "bg-sp-blue-300": isSelected,
                                })}
                                onClick={() => setSelectedParentId(cat.id)}
                            >
                                <div className="shrink-0 w-12 h-12 flex items-center justify-center">
                                    {Icon && (<Icon weight="duotone" size={28} color="#2e67a7" />)}
                                </div>
                                <p className="w-full text-sm truncate text-center pb-2">{cat.name_zh}</p>
                            </div>
                    )})}
                </div>
                <div className={`w-full flex flex-wrap ${scrollXClass} ${isMobile ? 'justify-start' : 'justify-center'}`}>
                    {parent?.children.map(child => {
                        const isSelected = parseFloat(selectedCategoryValue) === child.id
                        const Icon = child.icon
                        return(
                            <div
                                key={child.id}
                                className={clsx("min-w-22 flex flex-col items-center justify-center cursor-pointer rounded-xl overflow-hidden hover:bg-sp-blue-200",{
                                    "bg-sp-blue-200": isSelected,
                                })}
                                onClick={() => {
                                    setSelectedCategoryValue(child.id.toString())
                                    setSelectedCategoryIconValue(child.icon!)
                                    onClose()
                                }}
                            >
                                <div className="shrink-0 w-12 h-12 flex items-center justify-center">
                                    {Icon && (<Icon weight="duotone" size={28} color="#2e67a7" />)}
                                </div>
                                <p className="w-full text-sm truncate text-center pb-2">{child.name_zh}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return(
        <ModalPortal>
            <Dialog
                    header="支出類別"
                    open={isCategoryOpen} // 從某處打開
                    onClose={ () => {
                        onClose();
                    }} // 點擊哪裡關閉
                    closeOnBackdropClick = {true}
                >
                    {renderBody()}
            </Dialog>
        </ModalPortal>
    )
}