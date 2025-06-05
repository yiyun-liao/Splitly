export function getLastVisitedProjectId(): string | null {
    try {
      const raw = localStorage.getItem("lastVisitedProjectPath");
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.path || null;
    } catch {
      return null;
    }
}
  



export function clearUserCache() {
    Object.keys(localStorage).forEach((key) => {
        if (
            key.startsWith("projectUsers |") ||
            key.startsWith("paymentList |") ||
            key.startsWith("cacheProjectMeta |") ||
            key.startsWith(`👀 myData:`) ||
            key.startsWith(`👀 myProjectList:`) ||
            key.startsWith(`👀 cacheMyMeta:`)
        ) {
            localStorage.removeItem(key);
        }
    });
}
