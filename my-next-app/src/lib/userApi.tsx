
export async function syncUserToBackend(
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
      console.log('login', data)
      return data;
    } catch (err) {
      console.error("Error syncing user to backend:", err);
    }
  }
  