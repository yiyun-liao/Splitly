// 隨機產生 1~12 的專案照片 index 

const CLOUDINARY_BASE = "https://res.cloudinary.com/ddkkhfzuk/image/upload/v1749526499";
const PROJECT_COVER_FOLDER = "projectCover";

// ---------- feature: get amount in folder to auto-random

export function getRandomProjectCoverIndex(): number {
  return Math.floor(Math.random() * 12) + 1;
}

// 組合 Cloudinary 頭貼網址
export function buildProjectCoverUrl(index: number): string {
  return `${CLOUDINARY_BASE}/${PROJECT_COVER_FOLDER}/${index}.jpg`;
}