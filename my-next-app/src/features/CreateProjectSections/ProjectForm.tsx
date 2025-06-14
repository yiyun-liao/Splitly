'use client';

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from 'next/navigation';
import clsx from "clsx";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Sheet from "@/components/ui/Sheet";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textArea";
import ImageButton from "@/components/ui/ImageButton";
import { ProjectStyle, MemberBudgetMap, ProjectData, GetProjectData } from "@/types/project";
import { UserData } from "@/types/user";
import { getNowDateLocal } from "@/utils/time";
import { useCreateProject } from "@/features/CreateProjectSections/hooks/useCreateProject";
import { useUpdateProject } from "@/features/CreateProjectSections/hooks/useUpdateProject";
import { useIsMobile } from "@/hooks/useIsMobile";
import ModalPortal from "@/components/ui/ModalPortal";
import { validateInput, tokenTest } from "@/utils/validate";




export interface ProjectFormProps {
    open?: boolean;
    onClose: () => void;
    userData: UserData;
    sheetTitle?: string;
    submitButtonText?: string;
    onSuccessRedirect?: boolean;
    initialProjectData?:GetProjectData;
}

export default function ProjectForm({
    open = true,
    onClose,
    userData,
    sheetTitle = "新增專案",
    submitButtonText = "儲存",
    onSuccessRedirect = true,
    initialProjectData
    }: ProjectFormProps) {
    const currentUid = userData.uid;
    const router = useRouter();
    const isMobile = useIsMobile();

    const [chooseCoverValue, setChooseCoverValue] = useState("");
    const [chooseCoverURLValue, setChooseCoverURLValue] = useState("");
    const [inputProjectName, setInputProjectName] = useState("出去玩！");
    const [inputStartTimeValue, setInputStartTimeValue] = useState(getNowDateLocal());
    const [inputEndTimeValue, setInputEndTimeValue] = useState("");
    const [chooseProjectStyle, setChooseProjectStyle] = useState<ProjectStyle>("travel");
    const [inputBudgetValue, setInputBudgetValue] = useState("");
    const [memberBudgetMap, setMemberBudgetMap] = useState<MemberBudgetMap>(() => ({ [currentUid]: undefined }));
    const [inputDescValue, setInputDescValue] = useState("");    

    const [isCoverPageSectionOpen, setIsCoverPageSectionOpen] = useState(true);

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [open]);

    // update
    useEffect(()=> {
        if(!initialProjectData) return
        isInitialLoadingRef.current = true;

        setChooseCoverValue(initialProjectData.img.toString())
        setChooseCoverURLValue(initialProjectData.imgURL || "")
        setInputProjectName(initialProjectData.project_name)
        setInputStartTimeValue(initialProjectData.start_time || "")
        setInputEndTimeValue(initialProjectData.end_time || "")
        setChooseProjectStyle(initialProjectData.style)
        setInputBudgetValue(initialProjectData.budget?.toString() || "")
        setMemberBudgetMap(initialProjectData.member_budgets || {})
        setInputDescValue(initialProjectData.desc || "")
        setIsCoverPageSectionOpen(false)

    },[initialProjectData])

    // clear end time when i update start time   
    const isInitialLoadingRef = useRef(true);
    const didManuallyChangeTimeRef = useRef(false);
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputStartTimeValue(e.target.value);
        didManuallyChangeTimeRef.current = true;
    };
    useEffect(() => {
        if (isInitialLoadingRef.current) {
            isInitialLoadingRef.current = false;
            return;
        }
        if (!didManuallyChangeTimeRef.current) return;
        setInputEndTimeValue('')
        didManuallyChangeTimeRef.current = false;
    }, [inputStartTimeValue]);

    // 輸入測試
    const displayNameAvoidInjectionTest = validateInput(inputProjectName);
    const displayNameTokenTest = tokenTest(inputProjectName);
    const descAvoidInjectionTest = validateInput(inputDescValue);

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
        img: parseFloat(chooseCoverValue),
    }), [currentUid, inputProjectName, inputStartTimeValue, inputEndTimeValue, chooseProjectStyle, inputBudgetValue, memberBudgetMap, inputDescValue, chooseCoverValue]);

    const updateProjectPayload: GetProjectData = useMemo(() => {
        if (!initialProjectData || !initialProjectData.id) return {} as GetProjectData;
        return {
            ...initialProjectData!,
            id: initialProjectData!.id,
            project_name: inputProjectName,
            start_time: inputStartTimeValue || undefined,
            end_time: inputEndTimeValue || undefined,
            style: chooseProjectStyle,
            currency: "TWD",
            budget: inputBudgetValue === "" ? undefined : parseFloat(inputBudgetValue),
            editor: [currentUid],
            member: undefined,
            member_budgets: memberBudgetMap || undefined,
            desc: inputDescValue || undefined,
            img: parseFloat(chooseCoverValue),
            imgURL:chooseCoverURLValue,
        }
    }, [initialProjectData,currentUid, inputProjectName, inputStartTimeValue, inputEndTimeValue, chooseProjectStyle, inputBudgetValue, memberBudgetMap, inputDescValue, chooseCoverValue, chooseCoverURLValue]);

    // console.log(projectPayload, updateProjectPayload)

    //disable button 
    const {isComplete } = useMemo(() => {
        let isComplete = false;
        if (!!projectPayload.project_name && !!projectPayload.owner && !!projectPayload.img){
            isComplete = true;
        }    
        if (!!displayNameAvoidInjectionTest || !!displayNameTokenTest || !!descAvoidInjectionTest ){
            isComplete = false;
        } 
        return { isComplete };
    }, [projectPayload, displayNameAvoidInjectionTest, displayNameTokenTest, descAvoidInjectionTest]); 

    // submit and create project
    const { handleCreateProject } = useCreateProject({
        onSuccess: (project) => {
            // console.log("✅ 成功建立專案：", project);
            if (onSuccessRedirect) {
                router.push(`/${currentUid}/${project.id}/dashboard`);
            }
            onClose();
            },
        onError: (err) => {
            // alert("建立專案失敗，請稍後再試");
            console.log("專案建立", err);
        },
    });

    const { handleUpdateProject } = useUpdateProject({
        onSuccess: (project) => {
            // console.log("✅ 成功更新專案：", project);
            if (onSuccessRedirect) {
                router.push(`/${currentUid}/${project.id}/dashboard`);
            }
            onClose();
            },
        onError: (err) => {
            // alert("更新專案失敗，請稍後再試");
            console.log("專案更新", err);
        },
    });

    // css
    const formSpan = (cols: number) => clsx(`col-span-${cols}`, "shrink-0 flex flex-col gap-2 items-start justify-start mt-2 min-w-0");
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const labelClass = clsx("w-full font-medium truncate")

    return (
        <ModalPortal>
            <Sheet open={open} onClose={onClose}>
                {(onClose) => (
                    <div className="w-full h-full overflow-hidden">
                        <div className={`shrink-0 w-full px-1 ${!isMobile && "max-w-xl"} flex pt-1 pb-4 items-center gap-2 justify-start overflow-hidden`}>
                            <IconButton icon='solar:alt-arrow-left-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />
                            <p className="w-full text-xl font-medium truncate min-w-0">{sheetTitle}</p>
                            {initialProjectData ? (
                                    <Button
                                    size='sm'
                                    width='fit'
                                    variant='solid'
                                    color='primary'
                                    disabled={!isComplete}
                                    onClick={async()=> {
                                        if (!updateProjectPayload) return;
                                        await handleUpdateProject(updateProjectPayload);
                                    }}  
                                >
                                    {submitButtonText}
                                </Button>                                
                            ) : (
                                <Button
                                    size='sm'
                                    width='fit'
                                    variant='solid'
                                    color='primary'
                                    disabled={!isComplete}
                                    onClick={async()=> {
                                        await handleCreateProject(projectPayload);
                                    }}  
                                >
                                    {submitButtonText}
                                </Button>
                            )}
                        </div>
                        <section className={`w-full px-1 h-full pb-20 mb-20 flex items-start justify-start gap-5 ${scrollClass}`}>
                            <div className={`w-full grid grid-cols-6 gap-2 ${!isMobile && "max-w-xl"}`}>
                                <div className={formSpan(6)}>
                                    <span className={labelClass}>專案封面</span>
                                    <div  className="shrink-0" onClick={()=> setIsCoverPageSectionOpen(prev => (!prev))}>
                                        <ImageButton
                                            image={chooseCoverURLValue}
                                            size= 'md'
                                            imageName= {inputProjectName} 
                                        />
                                    </div>
                                </div>
                                {isCoverPageSectionOpen && (
                                    <div className={`col-span-6 p-8 flex flex-wrap gap-2  min-h-40 overflow-hidden rounded-r-2xl rounded-b-2xl bg-sp-white-40`}>
                                        {Array.from({ length: 12 }, (_, index) => {
                                            const imgUrl = `https://res.cloudinary.com/ddkkhfzuk/image/upload/v1749526499/projectCover/${index + 1}.jpg`;
                                            const isSelected = index === parseInt(chooseCoverValue) - 1;
                                            return (
                                                <div key={index} 
                                                    className={clsx("w-12 h-12 flex items-center justify-center cursor-pointer rounded-xl overflow-hidden", {
                                                        "border-2 border-sp-blue-500": isSelected,
                                                    })}
                                                    onClick={() => {
                                                        setChooseCoverURLValue(imgUrl)
                                                        setChooseCoverValue((index+1).toString())
                                                        setIsCoverPageSectionOpen(false)
                                                    }}
                                                >
                                                    <ImageButton
                                                        image={imgUrl}
                                                        size='md'
                                                        imageName= "素材"
                                                    />                                            
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <div className={formSpan(3)}>
                                    <span className={labelClass}>專案名稱</span>
                                    <Input 
                                        value={inputProjectName} 
                                        onChange={(e) => setInputProjectName(e.target.value)} 
                                        type="text" 
                                        width="full" 
                                        placeholder="點擊編輯"
                                        errorMessage={displayNameAvoidInjectionTest ? displayNameAvoidInjectionTest : displayNameTokenTest ? displayNameTokenTest : undefined}
                                        tokenMaxCount={[inputProjectName.length, 20] }   
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
                                    <Input type="date" value={inputStartTimeValue} onChange={handleAmountChange} width="full" />
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
                                            const parsed = parseFloat(val);
                                            setMemberBudgetMap((prev) => ({
                                                ...prev,
                                                [currentUid]: val === "" || Number.isNaN(parsed) ? undefined : parsed,
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
                                        errorMessage={descAvoidInjectionTest ? descAvoidInjectionTest : undefined}
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
        </ModalPortal>
    );
}
