// 隨機產生 1~16 的頭貼 index 

const CLOUDINARY_BASE = "https://res.cloudinary.com/ddkkhfzuk/image/upload";
const CATEGORY_FOLDER = "cat";


// 組合 Cloudinary 頭貼網址
export function buildCatUrl(name: string): string {
  const sanitizedName = name.replace(/[\\\/\?\&#%<> ]/g, '');
  return `${CLOUDINARY_BASE}/${CATEGORY_FOLDER}/${sanitizedName}.jpg`;
}