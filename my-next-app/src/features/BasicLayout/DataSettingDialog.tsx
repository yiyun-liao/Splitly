import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";
import ModalPortal from "@/components/ui/ModalPortal";
import clsx from "clsx";

import { validateInput } from "@/utils/validate";
import { useEffect, useState, useMemo } from "react";
import { UserData } from "@/types/user";
import { useUpdateUser } from "./hooks/useUpdateUser";

interface DataSettingDialogProps {
    isSettingDialogOpen: boolean;
    onClose: () => void;
    userData: UserData;
}

export default function DataSettingDialog({
    isSettingDialogOpen = false,
    onClose,
    userData,
}:DataSettingDialogProps){
    const [inputNameValue, setInputNameValue] = useState("");
    const [chooseAvatarValue, setChooseAvatarValue] = useState("");
    const [chooseAvatarURLValue, setChooseAvatarURLValue] = useState("");

    useEffect(()=> {
        if(userData){
            setInputNameValue(userData.name);
            setChooseAvatarValue(userData.avatar?.toString() || "");
            setChooseAvatarURLValue(userData.avatarURL || "");
        }
    },[isSettingDialogOpen,userData])

    const avoidInjectionTest = validateInput(inputNameValue);
    const errorMessage = inputTest(inputNameValue);

    function inputTest(name: string): string | null {
        const trimmed = name.trim();
        if (trimmed.length < 1 || trimmed.length > 20) {
          return "稱呼需為 1~20 字內";
        }      
        return null;
    }

    // disable button
    const { isSaveDisabled } = useMemo(() => {
        let isSaveDisabled = true;
        if (inputNameValue !== userData.name || chooseAvatarValue !== userData.avatar?.toString() ){     
            isSaveDisabled = false;
        }
        if (!!avoidInjectionTest || !!errorMessage){
            isSaveDisabled = true;
        } 
        return { isSaveDisabled };
    }, [avoidInjectionTest, errorMessage, inputNameValue, chooseAvatarValue, userData ]);  

    // submit
    const { handleUpdateUser } = useUpdateUser({
        onSuccess: () => {
            // console.log("✅ 成功建立紀錄：", user);
            onClose();
        },
        onError: (err) => {
            console.log("紀錄建立錯誤", err);
        },
    });


    const renderBody = () => {
        return(
            <div className="flex flex-col px-4 pag-8 text-zinc-500">
                <div className="w-full flex items-start justify-start gap-8">
                    <div className="flex flex-col gap-2 items-start justify-end w-fit shrink-0">
                        <span className="w-full font-medium">更新頭像</span>
                        <div className="shrink-0">
                            <Avatar
                                size='md'
                                img={chooseAvatarURLValue}
                                userName={userData?.name}
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-2 items-start justify-end">
                        <span className="w-full font-medium">更換稱呼</span>
                        <Input
                            value={inputNameValue}
                            type="text"
                            onChange={(e)=>{setInputNameValue(e.target.value)}}
                            flexDirection="row"
                            width="full"
                            placeholder="點擊編輯"   
                            errorMessage={avoidInjectionTest ? avoidInjectionTest : errorMessage ? errorMessage : undefined}
                            tokenMaxCount={[inputNameValue.length, 20] }                                     
                        />
                    </div>
                </div>
                <div className="w-fll p-8 flex flex-wrap gap-2  min-h-40 overflow-hidden rounded-r-2xl rounded-b-2xl bg-sp-blue-200">
                    {Array.from({ length: 15 }, (_, index) => {
                        const imgUrl = `https://res.cloudinary.com/ddkkhfzuk/image/upload/v1750175833/avatar/${index + 1}.jpg`;
                        const isSelected = index === parseInt(chooseAvatarValue) - 1;
                        return (
                            <div key={index} 
                                className={clsx("shrink-0 h-14 w-14 flex items-center justify-center cursor-pointer rounded-full overflow-hidden", {
                                    "border-4 border-sp-grass-500": isSelected,
                                })}
                                onClick={() => {
                                    setChooseAvatarURLValue(imgUrl)
                                    setChooseAvatarValue((index+1).toString())
                                }}
                            >
                                <Avatar
                                    size="lg"
                                    img={imgUrl}
                                    userName={userData?.name ?? "user"}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }

    const renderFooter = () => {
        return(
            <div className="w-full flex items-start justify-start gap-2 text-base  text-zinc-700">
                <Button
                    size='sm'
                    width='full'
                    variant= 'text-button'
                    color= 'primary'
                    onClick={() => {
                        onClose();
                    }}
                    >
                        取消
                </Button>
                <Button
                    size='sm'
                    width='full'
                    variant= 'solid'
                    color= 'primary'
                    disabled={isSaveDisabled}
                    onClick={async()=>{
                        if ( !userData) return;
                        const data: UserData = {
                            ...userData,
                            name: inputNameValue,
                            avatar: parseFloat(chooseAvatarValue),
                            avatarURL: chooseAvatarURLValue
                        };

                        await handleUpdateUser(data)
                    }}
                    >
                        儲存
                </Button>
            </div>
        )
    }
    return(
        <ModalPortal>
            <Dialog
                    header="編輯個人資訊"
                    open={isSettingDialogOpen} // 從某處打開
                    onClose={ () => {
                        onClose();
                    }} // 點擊哪裡關閉
                    footerClassName= "items-center justify-end"
                    closeOnBackdropClick = {true}
                    footer= {renderFooter()}
                >
                    {renderBody()}
            </Dialog>
        </ModalPortal>
    )
}