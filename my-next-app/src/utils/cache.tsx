

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
