// 隨機產生 1~12 的專案照片 index 

const CLOUDINARY_BASE = "https://res.cloudinary.com/ddkkhfzuk/image/upload/v1750164850";

// 組合 Cloudinary 頭貼網址
export function buildProjectCoverUrl(index: number): string {
  return `${CLOUDINARY_BASE}/${index}.jpg`;
}