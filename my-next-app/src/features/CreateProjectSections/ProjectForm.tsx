'use client';

import { useEffect, useState, useMemo } from "react";
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
import { useCreateProject } from "@/features/CreateProjectSections/hooks";
import { useIsMobile } from "@/hooks/useIsMobile";


export interface ProjectFormProps {
open?: boolean;
onClose: () => void;
userData: UserData;
sheetTitle?: string;
submitButtonText?: string;
onSuccessRedirect?: boolean;
}

export default function ProjectForm({
    open = true,
    onClose,
    userData,
    sheetTitle = "新增專案",
    submitButtonText = "儲存",
    onSuccessRedirect = true,
    }: ProjectFormProps) {
    const currentUid = userData.uid;
    const router = useRouter();
    const isMobile = useIsMobile();


    const [inputProjectName, setInputProjectName] = useState("");
    const [inputStartTimeValue, setInputStartTimeValue] = useState(getNowDateLocal());
    const [inputEndTimeValue, setInputEndTimeValue] = useState("");
    const [chooseProjectStyle, setChooseProjectStyle] = useState<ProjectStyle>("travel");
    const [inputBudgetValue, setInputBudgetValue] = useState("");
    const [memberBudgetMap, setMemberBudgetMap] = useState<MemberBudgetMap>({ [currentUid]: undefined });
    const [inputDescValue, setInputDescValue] = useState("");

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [open]);


    // time setting    
    useEffect(() => {
        setInputEndTimeValue('')
    }, [inputStartTimeValue]);

    // get data
    const projectPayload: ProjectData = useMemo(() => ({
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
    }), [currentUid, inputProjectName, inputStartTimeValue, inputEndTimeValue, chooseProjectStyle, inputBudgetValue, memberBudgetMap, inputDescValue]);

    //disable button 
    const {isComplete } = useMemo(() => {
        let isComplete = false;
        if (!!projectPayload.project_name && !!projectPayload.owner){
            isComplete = true;
        }    
        return { isComplete };
    }, [projectPayload]); 

    // submit and create project
    const { handleCreateProject, isLoading } = useCreateProject({
        onSuccess: (project) => {
            console.log("✅ 成功建立專案：", project);
            if (onSuccessRedirect) {
                router.push(`/${project.id}/dashboard`);
            }
            onClose();
            },
        onError: (err) => {
            alert("建立專案失敗，請稍後再試");
            console.log("專案建立", err);
        },
    });

    // css
    const formSpan = (cols: number) => clsx(`col-span-${cols}`, "flex flex-col gap-2 items-start justify-end mt-2 min-w-0");
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const labelClass = clsx("w-full font-medium truncate")

    return (
        <Sheet open={open} onClose={onClose}>
            {(onClose) => (
                <div className="w-full h-full overflow-hidden">
                    <div className={`shrink-0 w-full px-1 ${!isMobile && "max-w-xl"} flex pt-1 pb-4 items-center gap-2 justify-start overflow-hidden`}>
                        <IconButton icon='solar:alt-arrow-left-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />
                        <p className="w-full text-xl font-medium truncate min-w-0">{sheetTitle}</p>
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
                            {submitButtonText}
                        </Button>
                    </div>
                    <section className={`w-full px-1 h-full pb-20 mb-20 flex items-start justify-start gap-5 ${scrollClass}`}>
                        <div className={`w-full grid grid-cols-6 gap-2 ${!isMobile && "max-w-xl"}`}>
                            <div className={formSpan(3)}>
                                <span className={labelClass}>專案名稱</span>
                                <Input 
                                    value={inputProjectName} 
                                    onChange={(e) => setInputProjectName(e.target.value)} 
                                    type="text" 
                                    width="full" 
                                    placeholder="點擊編輯"
                                />
                            </div>
                            <div className={formSpan(3)}>
                                <span className={labelClass}>幣別</span>
                                <Select
                                    value="TWD"
                                    required={true}
                                    placeholder="點擊選擇"
                                    disabled = {true}
                                    onChange={() => {}}
                                    width="full"
                                    options={[{ label: "TWD", value: "TWD", disabled: true }]}
                                />
                            </div>
                            <div className={formSpan(6)}>
                                <span className={labelClass}>專案類別</span>
                                <div className="w-full flex bg-sp-white-20 rounded-xl mb-5">
                                    {["travel", "daily", "other"].map((style) => (
                                        <Button
                                            key={style}
                                            size="sm"
                                            width="full"
                                            variant={chooseProjectStyle === style ? 'solid' : 'text-button'}
                                            color="primary"
                                            onClick={() => setChooseProjectStyle(style as ProjectStyle)}
                                        >
                                            {style === 'travel' ? '旅行' : style === 'daily' ? '日常' : '其他'}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className={formSpan(3)}>
                                <span className={labelClass}>開始時間</span>
                                <Input type="date" value={inputStartTimeValue} onChange={(e) => setInputStartTimeValue(e.target.value)} width="full" />
                            </div>
                            <div className={formSpan(3)}>
                                <span className={labelClass}>結束時間</span>
                                <Input type="date" value={inputEndTimeValue} min={inputStartTimeValue} onChange={(e) => setInputEndTimeValue(e.target.value)} width="full" />
                            </div>
                            <div className={formSpan(3)}>
                                <span className={labelClass}>專案預算</span>
                                <Input
                                    type="number"
                                    value={inputBudgetValue}
                                    onChange={(e) => setInputBudgetValue(e.target.value)}
                                    placeholder="點擊編輯（選填）"
                                    width="full"
                                    step="0.01"
                                    inputMode="decimal"
                                />
                            </div>
                            <div className={formSpan(3)}>
                                <span className={labelClass}>個人預算</span>
                                <Input
                                    type="number"
                                    value={memberBudgetMap[currentUid] ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setMemberBudgetMap((prev) => ({
                                            ...prev,
                                            [currentUid]: val === "" ? undefined : parseFloat(val),
                                        }));
                                    }}
                                    placeholder="點擊編輯（選填）"
                                    width="full"
                                    step="0.01"
                                    inputMode="decimal"
                                />
                            </div>
                            <div className={formSpan(6)}>
                                <span className={labelClass}>備忘錄</span>
                                <TextArea
                                    value={inputDescValue}
                                    onChange={(e) => setInputDescValue(e.target.value)}
                                    rows={2}
                                    maxRows={4}
                                    placeholder="點擊編輯"
                                    width="full"
                                />
                            </div>
                            <div className="col-span-6 bg-sp-white-20 rounded-xl p-4 mt-4">
                                <p>
                                    <span className="font-medium text-sp-green-500">專案預算：</span>
                                    您可以設定整體支出的預算，系統會檢視團隊當前支出狀況提供提醒。
                                </p>
                                <p className="mt-2">
                                    <span className="font-medium text-sp-green-500">個人預算：</span>
                                    您可以在專案中紀錄私人支出，並在分析中提供提醒，私人支出不會被他人看到。
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </Sheet>
    );
}
