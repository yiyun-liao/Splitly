export interface UserData {
    userId: string;
    email: string;
    name: string;
    uidInAuth?:string;
    avatar?: string; // 最後是 Cloudinary URL
    avatarIndex?: number; // 後端回傳的 avatar index
}