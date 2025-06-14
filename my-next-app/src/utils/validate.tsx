
/**
 * 驗證使用者輸入的名稱
 * @param name 使用者輸入字串
 * @returns null 表示合法；否則回傳錯誤訊息
 */
export function validateInput(name: string): string | null {
    const trimmed = name.trim();
  
    // 簡單 SQL injection 防範（關鍵字 + 危險符號）
    const blacklist = [
        "--", ";", "'", "\"", "\\", "/*", "*/", "DROP", "SELECT", "INSERT", "DELETE", "UPDATE"
    ];
    
    const escaped = blacklist.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(escaped.join("|"), "i");
    
    if (pattern.test(trimmed)) {
        return "名稱含有不允許的字元";
    }
  
    return null;
  }
  

export function tokenTest(name: string): string | null {
    const trimmed = name.trim();
    if (trimmed.length < 1 || trimmed.length > 20) {
      return "稱呼需為 1~20 字內";
    }      
    return null;
}