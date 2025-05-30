// 型別定義
export interface UserData {
    avatarURL?: string;
    name?: string;
}

export interface ProjectMemberListProps {
    isMemberListOpen: boolean;
    onClose: () => void;
    userData: UserData | null;
}