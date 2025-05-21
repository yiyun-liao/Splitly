// 隨機產生 1~8 的頭貼 index 

const CLOUDINARY_BASE = "https://res.cloudinary.com/ddkkhfzuk/image/upload";
const AVATAR_FOLDER = "avatar";

// ---------- feature: get amount in folder to auto-random

export function getRandomAvatarIndex(): number {
  return Math.floor(Math.random() * 8) + 1;
}

// 組合 Cloudinary 頭貼網址
export function buildAvatarUrl(index: number): string {
  return `${CLOUDINARY_BASE}/${AVATAR_FOLDER}/${index}.jpg`;
}