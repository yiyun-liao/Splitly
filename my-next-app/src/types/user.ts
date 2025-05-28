export interface UserData {
    uid: string;
    email: string;
    name: string;
    uid_in_auth?:string;
    avatar?: string; // 最後是 Cloudinary URL
    avatar_index?: number; // 後端回傳的 avatar index
}