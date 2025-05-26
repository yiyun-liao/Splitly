// 當下時間
export function getNowDatetimeLocal(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000); // 調整為 local 時間
    return localDate.toISOString().slice(0, 16); // 去掉秒數與 Z
  }
  