'use client';

import { useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProjectsByNew } from "@/lib/projectApi";
import { getProjectStyle } from "@/utils/renderProjectStyle";
import ImageButton from "@/components/ui/ImageButton";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { GetProjectData } from "@/types/project";
import { UserData } from "@/types/user";
import { fetchUserByProject } from "@/lib/projectApi";
import { buildAvatarUrl } from "@/utils/getAvatar";
import { useUpdateProject } from "@/features/CreateProjectSections/hooks/useUpdateProject";
import { MemberBudgetMap } from "@/types/project";

export default function JoinProjectPage() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("pid");
    const router = useRouter();

    const { firebaseUser, userData, isReady } = useAuth();
    const currentUid : string = userData?.uid || "";

    const [joinProject, setJoinProject] = useState<GetProjectData>();
    const [joinProjectUser, setJoinProjectUser] = useState<UserData[]>();
    const [addMemberBudget, setAddMemberBudget] = useState<MemberBudgetMap>({});
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState("");

    // check customer is member already
    useEffect(() => {
        if (!projectId){
            alert('無效的邀請連結，請重新索取或是建立自己的專案！')
            router.push(`/`);
        }
        if (!isReady || !projectId) return;

        if (!firebaseUser || !userData) {
            const redirect = `/join?pid=${projectId}`;
            router.push(`/?redirect=${encodeURIComponent(redirect)}`);
        }
    }, [isReady, firebaseUser, userData, projectId, router]);


    // get current project data
    useEffect(() => {
        if (!isReady || !firebaseUser || !projectId || !currentUid) return;

        const loadProject = async () => {
            try {
                const token = await firebaseUser.getIdToken();
                const rawProject = await fetchProjectsByNew(token, currentUid , projectId);
                const rawUsers = await fetchUserByProject(projectId);
                const users: UserData[] = rawUsers.map((user:UserData) => ({
                    ...user,
                    avatarURL: buildAvatarUrl(Number(user.avatar) || 1),
                }));
                setJoinProject(rawProject);
                setJoinProjectUser(users);
                if (rawProject.member_budgets){
                    setAddMemberBudget(rawProject.member_budgets)
                }
            } catch (err) {
                console.error("❌ 無法取得專案資料", err);
                setError("無法取得專案資料");
            }
        };
        loadProject();
    }, [isReady, firebaseUser, projectId, currentUid]);

    // fetch and join
    const updateProjectPayload = useMemo<GetProjectData | undefined>(() => {
        if (!joinProject || !projectId || !userData) return undefined;
        return {
            ...joinProject!,
            member: [...(joinProject.member || []), currentUid],
            member_budgets: addMemberBudget || undefined,
        }
    }, [addMemberBudget, currentUid,joinProject,projectId,userData]);

    const { handleUpdateProject, isLoading:isUpdateLoading } = useUpdateProject({
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
    const titleClass = clsx("text-xl pb-4 font-medium whitespace-nowrap truncate min-w-0 max-w-100")
    const itemClass= clsx("w-full flex gap-1 p-1 items-center rounded-xl hover:text-sp-blue-600 hover:bg-zinc-900/10 active:text-sp-blue-800 active:bg-zinc-900/40 ")
    const projectClass = clsx("shrink-0 w-full px-0 py-3 box-border h-fit overflow-hidden ")
    const memberClass = clsx("w-full shrink-0 flex flex-col gap-2 box-border px-3 py-3 rounded-2xl h-fit min-h-40 bg-sp-green-200",)
    const listClass = clsx("flex gap-2 justify-start items-start")
    const labelClass = clsx("shrink-0  w-[120px] font-medium truncate")
    const listContentClass = clsx("shrink-0 w-full")

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl font-bold mb-4">邀請加入專案</h1>
        <p>這頁只是還沒做介面，請放心加入</p>
        <p className="mb-2">您確定要加入這個專案嗎？</p>
        <div className="flex flex-col pag-4 text-zinc-700">
            <div className={projectClass}>
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
                        <p className={clsx(listContentClass, joinProject?.budget === undefined && "text-sm text-zinc-500")}> {joinProject?.budget !== undefined ? `NT$ ${joinProject.budget?.toLocaleString()}` : "(沒有設定預算)"}</p>
                    </div>
                    <div>
                        <p className={labelClass}>個人預算</p>
                        <Input
                            type="number"
                            value={addMemberBudget[currentUid] ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                const parsed = parseFloat(val);
                                setAddMemberBudget((prev) => ({
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
                    <div className={listClass}>
                        <p className={labelClass}>幣別</p>
                        <p className={listContentClass}>{joinProject?.currency}</p>
                    </div>
                    {joinProject?.desc && (
                        <div className={listClass}>
                            <p className={labelClass}>Memo</p>
                            <p className={listContentClass}>{joinProject?.desc}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className={projectClass}>
                <p className={titleClass}>參與成員</p>
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
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {joined ? (
            <>
            <p className="text-sp-blue-500">✅ 加入成功！</p>
            <Button onClick={() => router.replace(`/${currentUid}/${projectId}/dashboard`)} color="primary">
                前往專案
            </Button>
            </>
        ) : (
            <Button
                size='sm'
                width='fit'
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
    );
}
