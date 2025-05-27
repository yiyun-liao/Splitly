// 當下時間
export function getNowDatetimeLocal(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000); // 調整為 local 時間
    return localDate.toISOString().slice(0, 16); // 去掉秒數與 Z
  }

// 當下日期
export function getNowDateLocal(): string {
  return new Date().toLocaleDateString("sv-SE"); // "2025-05-27"
}