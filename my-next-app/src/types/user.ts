export interface UserData {
    uid: string;
    email: string;
    name: string;
    uid_in_auth?:string;
    avatarURL?: string; // 最後是 db URL
    avatar?: number; // 後端回傳的 avatar index
}