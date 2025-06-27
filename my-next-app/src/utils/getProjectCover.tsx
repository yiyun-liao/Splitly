// 隨機產生 1~12 的專案照片 index 

const S3_BASE = "https://splitly-bucket.s3.ap-northeast-1.amazonaws.com/assets/project/project";

// 組合 S3 頭貼網址
export function buildProjectCoverUrl(index: number): string {
  return `${S3_BASE}-${index}.jpg`;
}