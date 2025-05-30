import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import clsx from "clsx";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Sheet from "@/components/ui/Sheet";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textArea";
import { ProjectStyle, MemberBudgetMap, ProjectData } from "@/types/project";
import { UserData } from "@/types/user";
import { getNowDateLocal } from "@/utils/time";
import { getRandomProjectCoverIndex } from "@/utils/projectCover";
import { useCreateProject } from "./hooks";

interface CreatePaymentProps {
    onClose: () => void;
    open?: boolean;
    userData: UserData;
}

export default function CreateProject({
    onClose,
    open = true,
    userData
    }:CreatePaymentProps){

    const currentUid = userData.uid;
    const router = useRouter();
    

    const [inputProjectName, setInputProjectName] = useState("");
    const [inputStartTimeValue, setInputStartTimeValue] = useState(getNowDateLocal());
    const [inputEndTimeValue, setInputEndTimeValue] = useState("");
    const [chooseProjectStyle, setChooseProjectStyle] = useState<ProjectStyle>("travel");
    const [selectProjectCurrency, setSelectedProjectCurrency] = useState("TWD");
    const [inputBudgetValue, setInputBudgetValue] = useState("");
    const [memberBudgetMap, setMemberBudgetMap] = useState<MemberBudgetMap>({[currentUid]: undefined,});
    const [inputDescValue, setInputDescValue] = useState("");

    const [projectPayload, setProjectPayload] = useState<ProjectData>({
        project_name: "",
        style: "travel",
        currency: "TWD",       
        owner: currentUid,
        editor: [currentUid],
        img: 1,
    });    
    
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open]);
    
    // time setting
    useEffect(()=>{
        setInputEndTimeValue('')
    }, [inputStartTimeValue])
    

    // get data
    const payload: ProjectData = useMemo(() => {
        return {
            project_name: inputProjectName,
            start_time: inputStartTimeValue || undefined,
            end_time: inputEndTimeValue || undefined,
            style: chooseProjectStyle,
            currency: "TWD",       
            budget: inputBudgetValue === "" ? undefined : parseFloat(inputBudgetValue), 
            owner: currentUid,
            editor: [currentUid],
            member: undefined,
            member_budgets: memberBudgetMap || undefined, 
            desc: inputDescValue || undefined,
            img: getRandomProjectCoverIndex(),
        };
    }, [currentUid, inputProjectName,inputStartTimeValue, inputEndTimeValue, chooseProjectStyle, inputBudgetValue,memberBudgetMap,inputDescValue]);
    
    useEffect(() => {
        setProjectPayload(payload);
    }, [payload]);

    //disable button 
    const {isComplete } = useMemo(() => {
        let isComplete = false;
        if (!!projectPayload.project_name && !!projectPayload.owner){
            isComplete = true;
        }    
        return { isComplete };
    }, [projectPayload]); 

    // submit and create project
    const { handleCreateProject, isLoading  } = useCreateProject({
        onSuccess: (project) => {
          console.log("✅ 成功建立專案：", project);
          router.push(`/${project.id}/dashboard`);
          onClose();
        },
        onError: (err) => {
          alert("建立專案失敗，請稍後再試");
          console.log("專案建立" , err)
        },
    });
    

    // css
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const labelClass = clsx("w-full font-medium truncate")
    const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end mt-2")
    const formSpan3CLass = clsx("col-span-3 flex flex-col gap-2 items-start justify-end mt-2")
    const formSpan4CLass = clsx("col-span-4 flex flex-col gap-2 items-start justify-end mt-2")
    const formSpan6CLass = clsx("col-span-6 flex flex-col gap-2 items-start justify-end mt-2")
    
    return(
        <Sheet open={open} onClose={onClose}>
            {(onClose) => (
                <>
                    <div id="project-form-header"  className="shrink-0 w-full max-w-xl flex px-1 pt-1 pb-4 items-center gap-2 justify-start overflow-hidden">
                        <IconButton icon='solar:alt-arrow-left-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />
                        <p className="w-full text-xl font-medium truncate min-w-0"> 新增專案</p>
                        <Button
                            size='sm'
                            width='fit'
                            variant='solid'
                            color='primary'
                            disabled={!isComplete || isLoading} 
                            isLoading={isLoading}
                            onClick={async()=> {
                                console.log("create", projectPayload);
                                await handleCreateProject(projectPayload);
                            }}
                            >
                                儲存
                        </Button>
                    </div>
                    <section id="project-form-frame" className={`w-full h-full  pb-20 px-1 flex items-start justify-start gap-5 ${scrollClass}`}>
                        <div className="max-w-xl w-full grid grid-cols-6 gap-2">
                            <div className={formSpan4CLass}>
                                <span className={labelClass}>專案名稱</span>
                                <Input
                                value={inputProjectName}
                                type="text"
                                onChange={(e) => {setInputProjectName(e.target.value)}}
                                flexDirection="row"
                                width="full"
                                placeholder="點擊編輯"                                        
                                />
                            </div>
                            <div className={formSpan2CLass}>
                                <span className={labelClass}>幣別</span>
                                <Select
                                    value={selectProjectCurrency}
                                    required={true}
                                    placeholder="點擊選擇"
                                    onChange={(e) => setSelectedProjectCurrency(e.target.value)}
                                    flexDirection="row"
                                    width="full"
                                    disabled = {true}
                                    options={[
                                        { label: "TWD", value: "TWD" , disabled: true}
                                    ]}
                                />
                            </div>
                            <div className={formSpan6CLass}>
                                <span className={labelClass}>專案類別</span>
                                <div className="w-full flex  bg-sp-white-20 rounded-xl mb-5">
                                    <Button
                                        size='sm'
                                        width='full'
                                        variant= {chooseProjectStyle == 'travel' ? 'solid' : 'text-button'}
                                        color= 'primary'
                                        onClick={() => setChooseProjectStyle("travel")}
                                        >
                                            旅行
                                    </Button>
                                    <Button
                                        size='sm'
                                        width='full'
                                        variant= {chooseProjectStyle == 'daily' ? 'solid' : 'text-button'}
                                        color= 'primary'
                                        onClick={() => setChooseProjectStyle("daily")}
                                        >
                                            日常
                                    </Button>
                                    <Button
                                        size='sm'
                                        width='full'
                                        variant= {chooseProjectStyle == 'other' ? 'solid' : 'text-button'}
                                        color= 'primary'
                                        onClick={() => setChooseProjectStyle("other")}
                                        >
                                            其他
                                    </Button>
                                </div>
                            </div>                                                              
                            <div className={formSpan3CLass}>
                                <span className={labelClass}>開始時間</span>
                                <Input
                                    value={inputStartTimeValue}
                                    type="date"
                                    onChange={(e) => setInputStartTimeValue(e.target.value)}
                                    flexDirection="row"
                                    width="full"
                                    placeholder="點擊編輯"
                                />
                            </div>
                            <div className={formSpan3CLass}>
                                <span className={labelClass}>結束時間</span>
                                <Input
                                    value={inputEndTimeValue}
                                    type="date"
                                    onChange={(e) => setInputEndTimeValue(e.target.value)}
                                    min={inputStartTimeValue} 
                                    flexDirection="row"
                                    width="full"
                                    placeholder="點擊選擇"
                                />
                            </div>  
                            <div className={formSpan3CLass}>
                                <span className={labelClass}>專案預算</span>
                                <Input
                                    value={inputBudgetValue}
                                    type="number"
                                    onChange={(e) => setInputBudgetValue(e.target.value)}
                                    flexDirection="row"
                                    width="full"
                                    placeholder="點擊編輯（選填）"
                                    step="0.01"
                                    inputMode="decimal"                                          
                                />
                            </div> 
                            <div className={formSpan3CLass}>
                                <span className={labelClass}>個人預算</span>
                                <Input
                                    value={memberBudgetMap[currentUid] ?? ""}
                                    type="number"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setMemberBudgetMap((prev) => ({
                                            ...prev,
                                            [currentUid]: val === "" ? undefined : parseFloat(val),
                                        }));
                                        }}
                                    flexDirection="row"
                                    width="full"
                                    placeholder="點擊編輯（選填）"
                                    step="0.01"
                                    inputMode="decimal"                                          
                                />
                            </div> 
                            <div className={formSpan6CLass}>
                                <span className={labelClass}>備忘錄</span>
                                <TextArea
                                    value={inputDescValue}
                                    rows={2}
                                    maxRows={4}
                                    required={true}
                                    onChange={(e) => setInputDescValue(e.target.value)}
                                    flexDirection="row"
                                    width="full"
                                    placeholder="點擊編輯"
                                />
                            </div> 
                            <div className="col-span-6 bg-sp-white-20 rounded-xl p-4 mt-4">
                                <p>
                                    <span className="font-medium text-sp-green-500">專案預算：</span>
                                    您可以設定整體支出的預算，系統會檢視團隊當前支出狀況提供提醒。
                                </p>
                                <p className="mt-2">
                                    <span className="font-medium text-sp-green-500">個人預算：</span>
                                    您可以在專案中紀錄私人支出，在個人支出分析中會提供提醒，私人支出並不會被其他人看到，詳見增加紀錄功能。
                                </p>
                            </div>                                 
                        </div>
                    </section>
                </>
            )}
        </Sheet>
    )
}