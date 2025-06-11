'use client';

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import clsx from "clsx";

import { useAuth } from "@/contexts/AuthContext";
import { fetchProjectsByNew } from "@/lib/projectApi";
import { fetchUserByProject } from "@/lib/userApi";
import { useAddMemberProject } from "@/features/CreateProjectSections/hooks/useAddMemberProject";

import ImageButton from "@/components/ui/ImageButton";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";

import { getProjectStyle } from "@/utils/renderProjectStyle";
import { buildAvatarUrl } from "@/utils/getAvatar";
import { buildProjectCoverUrl } from "@/utils/getProjectCover";
import { GetProjectData, JoinProjectData } from "@/types/project";
import { UserData } from "@/types/user";
import { MemberBudgetMap } from "@/types/project";

export default function JoinProjectPage() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("pid");
    const router = useRouter();

    const { firebaseUser, userData, isLoadedReady } = useAuth();
    const currentUid : string = userData?.uid || "";

    const [joinProject, setJoinProject] = useState<GetProjectData>();
    const [joinProjectUser, setJoinProjectUser] = useState<UserData[]>();
    const [addMemberBudget, setAddMemberBudget] = useState<MemberBudgetMap>(() => ({ [currentUid]: undefined }));
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState("");

    // check customer is member already
    useEffect(() => {
        if (!projectId){
            alert('無效的邀請連結，請重新索取或是建立自己的專案！')
            router.push(`/`);
        }
        if (!isLoadedReady || !projectId) return;

        if (!firebaseUser || !userData) {
            const redirect = `/join?pid=${projectId}`;
            router.push(`/?redirect=${encodeURIComponent(redirect)}`);
        }
    }, [isLoadedReady, firebaseUser, userData, projectId, router]);


    // get current project data
    useEffect(() => {
        if (!isLoadedReady || !firebaseUser || !projectId || !currentUid) return;
        setAddMemberBudget({[currentUid]: undefined})
        const loadProject = async () => {
            try {
                console.log("try to get certain project1")
                const token = await firebaseUser.getIdToken();
                const rawProject = await fetchProjectsByNew(token, currentUid , projectId);
                const newProject: GetProjectData = {
                    ...rawProject.project,
                    imgURL: buildProjectCoverUrl(rawProject.project.img),
                };
                console.log("try to get certain project4")
                if (newProject.owner === currentUid) {
                    alert('你已是專案成員')
                    router.replace(`/${currentUid}/${projectId}/dashboard`);
                    return;
                }
                if (newProject.member){
                    if (newProject.member.includes(currentUid)) {
                        alert('你已是專案成員')
                        router.replace(`/${currentUid}/${projectId}/dashboard`);
                        return;
                    }
                }
                
                const rawUsers = await fetchUserByProject(projectId);
                const users: UserData[] = rawUsers.map((user:UserData) => ({
                    ...user,
                    avatarURL: buildAvatarUrl(Number(user.avatar)),
                }));
                setJoinProject(newProject);
                setJoinProjectUser(users);
            } catch (err) {
                console.error("❌ 無法取得專案資料", err);
                setError("無法取得專案資料");
            }
        };
        loadProject();
    }, [isLoadedReady, firebaseUser, projectId, currentUid,router]);

    // fetch and join
    const updateProjectPayload = useMemo<JoinProjectData | undefined>(() => {
        if (!joinProject || !projectId || !userData) return undefined;
        return {
            id: projectId,
            member: currentUid,
            member_budgets: addMemberBudget || undefined,
        }
    }, [addMemberBudget, currentUid,joinProject,projectId,userData]);
    
    console.log(updateProjectPayload)
    console.log(currentUid)
    const { handleUpdateProject, isLoading:isUpdateLoading } = useAddMemberProject({
        onSuccess: (project) => {
            console.log("✅ 成功更新專案：", project);
            setJoined(true);
            },
        onError: (err) => {
            console.error("Error fetching to join project:", err);
            setError("加入失敗，請稍後再試");
        },
    });

    const typeParsed = useMemo(() => {
        if (!joinProject) return undefined;
        return getProjectStyle(joinProject.style);
    }, [joinProject]);

    // css
    const itemClass= clsx("w-full flex gap-1 p-1 items-center rounded-xl hover:text-sp-blue-600 hover:bg-zinc-900/10 active:text-sp-blue-800 active:bg-zinc-900/40 ")
    const memberClass = clsx("w-full shrink-0 flex flex-col gap-2 box-border px-3 py-3 rounded-2xl h-fit min-h-40 bg-sp-green-200",)
    const listClass = clsx("flex gap-2 justify-start items-start")
    const labelClass = clsx("shrink-0  w-[120px] font-medium truncate")
    const listContentClass = clsx("w-full")
    const listWithoutContentClass = clsx("text-zinc-500 text-sm")
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")

    return (
        <div className={`h-full text-zinc-700  ${scrollClass}`} >
            <div className="flex flex-col items-start justify-start h-full py-10 px-4 gap-2 max-w-xl mx-auto">
                <div className="w-full px-4 ">
                    <div 
                        className="flex items-center justify-start gap-2 pb-2"
                        onClick={()=> {router.push(`/`)}}
                    >
                        <ImageButton
                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                            size='sm'
                            imageName= "Splitly"
                        />
                        <h1 className="text-2xl font-medium text-zinc-700 ">Splitly</h1>
                    </div>
                    <p className="text-lg text-zinc-700">您最佳的分帳工具</p>
                </div>
                <div className="shrink-0 flex flex-col gap-4 w-full bg-sp-green-300 px-8 py-4 rounded-2xl overflow-hidden">
                    <p className="text-base font-bold">您受 {joinProjectUser?.find((u) => u.uid === joinProject?.owner)?.name} 邀請加入：</p>
                    {error && <p className="text-red-700 mb-2">{error} </p>}
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        {joined ? (
                            <div className="pt-8 text-sp-blue-500 font-bold text-xl"> 加入成功！🎉 </div>
                        ) : (
                            <div className="flex flex-col gap-2 items-start justify-start flex-1">
                                <p className={labelClass}>個人預算</p>
                                <Input
                                    type="number"
                                    value={addMemberBudget[currentUid] ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const parsed = parseFloat(val);
                                        setAddMemberBudget({[currentUid]: val === "" || Number.isNaN(parsed) ? undefined : parsed} );
                                    }}
                                    placeholder="點擊編輯（選填）"
                                    width="full"
                                    step="0.01"
                                    inputMode="decimal"
                                />
                            </div>
                        )}
                        <div className="sm:w-40 sm:pt-8">
                            {joined ? (
                                <Button
                                    size='sm'
                                    width='full'
                                    variant='solid'
                                    color='primary'
                                    disabled={isUpdateLoading}
                                    isLoading={isUpdateLoading}
                                    onClick={() => router.replace(`/${currentUid}/${projectId}/dashboard`)}   
                                >
                                    前往專案
                                </Button> 
                            ) : (
                                <Button
                                    size='sm'
                                    width='full'
                                    variant='solid'
                                    color='primary'
                                    disabled={isUpdateLoading}
                                    isLoading={isUpdateLoading}
                                    onClick={async()=> {
                                        console.log("update", updateProjectPayload);
                                        if (!updateProjectPayload) return;
                                        await handleUpdateProject(updateProjectPayload);
                                    }}  
                                >
                                    {isUpdateLoading ? "加入中..." : "確認加入"}
                                </Button>   
                            )}
                        </div>
                    </div>
                </div>
                <div className={`shrink-0 flex-col gap-4 w-full bg-sp-green-300 py-4 px-8 rounded-2xl overflow-hidden h-fit`}>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                            <ImageButton
                                image={joinProject?.imgURL}
                                size='sm'
                                imageName= {joinProject?.project_name || ""}
                            />
                            <p className="text-xl font-medium whitespace-nowrap truncate min-w-0 max-w-100">{joinProject?.project_name || ""}</p>
                        </div>
                    </div>
                    <div className="py-4 flex flex-col gap-4">
                        <div className={listClass}>
                            <p className={labelClass}>類型</p>
                            <p className={listContentClass}>{typeParsed}</p>
                        </div>
                        <div className={listClass}>
                            <p className={labelClass}>時間</p>
                            <p className={listContentClass}>{joinProject?.start_time ?? "過去某天"} - {joinProject?.end_time ?? "至今"}</p>
                        </div>
                        <div className={listClass}>
                            <p className={labelClass}>預算</p>
                            <p className={`${listContentClass} ${joinProject?.budget === undefined && listWithoutContentClass}`}> {joinProject?.budget !== undefined ? `NT$ ${joinProject.budget?.toLocaleString()}` : "(沒有設定預算)"}</p>
                        </div>
                        <div className={listClass}>
                            <p className={labelClass}>幣別</p>
                            <p className={listContentClass}>{joinProject?.currency}</p>
                        </div>
                        <div className={listClass}>
                            <p className={labelClass}>Memo</p>
                            <p className={`${listContentClass} ${!joinProject?.desc && listWithoutContentClass}`}>{joinProject?.desc ? joinProject?.desc : "(沒有備註)"}</p>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-2">
                            <p className={labelClass}>目前參與成員</p>
                            <div className={memberClass}>
                                {joinProjectUser?.map(user => {
                                    return(
                                        <div key={user.uid} className={itemClass}>
                                            <div className="w-full flex items-center justify-start gap-2 overflow-hidden" >
                                                <div className="shrink-0  flex items-center justify-center ">
                                                    <Avatar
                                                        size='md'
                                                        img={user?.avatarURL}
                                                        userName={user?.name}
                                                    />
                                                </div>
                                                <p className="text-base w-fll  truncate">{user.name}</p>
                                            </div>
                                            {joinProject?.owner  == user.uid && (
                                                <div className="shrink-0 p-1 rounded-sm bg-sp-blue-300 text-sp-blue-500">擁有者</div>
                                            )}
                                        </div>
                                    )}
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
