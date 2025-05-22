
export async function getCategories() {
    try {
    const response = await fetch("http://localhost:8000/api/category-all", {
        method: "GET",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to sync user: " + errorText);
    }

    const data = await response.json();
    console.log('get category', data)
    //return data;
    } catch (err) {
    console.error("Error syncing user to backend:", err);
    }
}

export async function getCategoryNest() {
    try {
    const response = await fetch("http://localhost:8000/api/category-nest", {
        method: "GET",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to sync user: " + errorText);
    }

    const data = await response.json();
    console.log('get category', data)
    return data;
    } catch (err) {
    console.error("Error syncing user to backend:", err);
    return []; // 加上 fallback
    }
}