import { UserData } from "@/types/user";

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

// after update myself data, should update cache
export function updateAllCachedProjectUsers(user: UserData) {
    const uid = user.uid;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith("projectUsers | ")) continue;

        try {
            const cached = localStorage.getItem(key);
            if (!cached) continue;

            const parsed = JSON.parse(cached) as UserData[];
            const updated = parsed.map(u =>
                u.uid === uid ? user : u
            );

            localStorage.setItem(key, JSON.stringify(updated));

            const projectId = key.split("|")[1]?.trim();
            if (projectId) {
                const metaKey = `cacheProjectMeta | ${projectId}`;
                localStorage.setItem(metaKey, JSON.stringify({ timestamp: Date.now() }));
            }
        } catch (e) {
            console.warn(`⚠️ 快取更新失敗 (${key})`, e);
        }
    }
}

