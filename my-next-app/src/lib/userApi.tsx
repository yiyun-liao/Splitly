
export async function createNewUser(
    token: string | null,
    user: {
    name: string | '';
    email: string | '';
    uidInAuth: string;
    avatar: number;
    }
) {
    try {
    const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to sync user: " + errorText);
    }

    const data = await response.json();
    console.log('login success', data)
    return data;
    } catch (err) {
    console.error("Error syncing user to backend:", err);
    }
}

export async function fetchCurrentUser(token: string, userId: string) {
    try {
        const res = await fetch(`/api/auth/getUser?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching user data from backend:", error);
        throw error;
    }
}