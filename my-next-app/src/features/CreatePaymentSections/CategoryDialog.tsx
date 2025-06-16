import Dialog from "@/components/ui/Dialog";
import IconButton from "@/components/ui/IconButton";
import ImageButton from "@/components/ui/ImageButton";
import ModalPortal from "@/components/ui/ModalPortal";

import clsx from "clsx";
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
    setSelectedCategoryURLValue: (url: string) => void
}

export default function CategoryDialog({
        isCategoryOpen = false,
        onClose,
        grouped,
        selectedParentId,
        setSelectedParentId,
        selectedCategoryValue,
        setSelectedCategoryValue,
        setSelectedCategoryURLValue,
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
                <div className={`w-full flex items-center justify-start gap-2 p-2 bg-sp-blue-200 rounded-2xl ${scrollXClass}`}>
                    {grouped.map(cat =>{ 
                        const isSelected = selectedParentId === cat.id
                        return(
                            <div key={cat.id} 
                                className={clsx("min-w-20 flex flex-col gap-1 items-center justify-center cursor-pointer rounded-xl overflow-hidden hover:bg-sp-blue-300", {
                                    "bg-sp-blue-300": isSelected,
                                })}
                                onClick={() => setSelectedParentId(cat.id)}
                            >
                                <div className="shrink-0 w-12 h-12 flex items-center justify-center">
                                    <ImageButton
                                        image={cat.imgURL}
                                        size="sm"
                                        imageName={cat.name_zh}
                                        onClick={()=> {}}
                                    />
                                </div>
                                <p className="w-full text-sm truncate text-center">{cat.name_zh}</p>
                            </div>
                    )})}
                </div>
                <div className={clsx("w-full grid gap-2",{
                    "grid-cols-5 p-2": !isMobile,
                    "grid-cols-4": isMobile
                })}>
                    {parent?.children.map(child => {
                        const isSelected = parseFloat(selectedCategoryValue) === child.id

                        return(
                            <div
                                key={child.id}
                                className={clsx("flex flex-col gap-1 items-center justify-center cursor-pointer rounded-xl overflow-hidden hover:bg-sp-blue-200",{
                                    "bg-sp-blue-200": isSelected,
                                    "min-w-20": !isMobile,
                                })}
                                onClick={() => {
                                    setSelectedCategoryValue(child.id.toString())
                                    setSelectedCategoryURLValue(child.imgURL ?? "")
                                    onClose()
                                }}
                            >
                                <div className="shrink-0 w-12 h-12 flex items-center justify-center">
                                    <ImageButton 
                                        image={child.imgURL} 
                                        size="sm" 
                                        imageName={child.name_zh} 
                                    />
                                </div>
                                <p className="w-full text-sm truncate text-center">{child.name_zh}</p>
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