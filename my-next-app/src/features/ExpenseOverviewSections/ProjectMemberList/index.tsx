    // 包含整體邏輯和 Dialog 結構

    'use client';

    import Dialog from "@/components/ui/Dialog";
    import Button from "@/components/ui/Button";
    import { useState } from "react";
    import { ProjectMemberListProps } from "./types";
    import MemberItem from "./MemberItem";
    import AddMemberStep from "./AddMemberStep";

    export default function ProjectMemberList({
    isMemberListOpen = false,
    onClose,
    userData,
    }: ProjectMemberListProps) {
    const [step, setStep] = useState<'list' | 'add'>('list');
    const handleBack = () => setStep('list');

    const renderBody = () => {
        if (step === 'list') {
        return (
            <div>
            <MemberItem userData={userData} />
            <MemberItem userData={userData} />
            </div>
        );
        }
        if (step === 'add') {
        return <AddMemberStep />;
        }
    };

    return (
        <Dialog
        header="成員"
        open={isMemberListOpen} // 從某處打開
        onClose={() => {
            setStep('list');
            onClose();
        }}// 點擊哪裡關閉
        //headerClassName= {step === "add" ? undefined : "ml-11"}
        // bodyClassName= string // 看需求
        footerClassName="items-center justify-end"
        leftIcon={step === 'add' ? 'solar:arrow-left-line-duotone' : undefined}
        onLeftIconClick={handleBack}
        //hideCloseIcon = false
        //closeOnBackdropClick = false
        footer={
            step === 'list' ? (
            <>
                <Button variant="outline" color="primary" onClick={() => alert('建立虛擬成員')}>
                建立虛擬成員
                </Button>
                <Button variant="outline" color="primary" onClick={() => setStep('add')}>
                新增成員
                </Button>
            </>
            ) : (
            <Button variant="solid" color="primary" onClick={handleBack}>
                返回成員列表
            </Button>
            )
        }
        >
        {renderBody()}
        </Dialog>
    );
    }