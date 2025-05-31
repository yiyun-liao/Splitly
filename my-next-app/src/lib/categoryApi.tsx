// my-next-app/src/lib/categoryApi.tsx
// get useable data on : my-next-app/src/hooks/category.tsx

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function getCategories() {
    try {
        const response = await fetch(`${BASE_URL}/api/category-all`, {
            method: "GET",
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Failed to sync user: " + errorText);
        }
        const data = await response.json();
        console.log(data)
        return data;
    } catch (err) {
        console.error("Error syncing user to backend:", err);
        return []; // 加上 fallback
    }
}

// export async function getCategoryNest() {
//     try {
//     const response = await fetch(`${BASE_URL}/api/category-nest`, {
//         method: "GET",
//     });

//     if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error("Failed to sync user: " + errorText);
//     }

//     const data = await response.json();
//     console.log('get category', data)
//     return data;
//     } catch (err) {
//     console.error("Error syncing user to backend:", err);
//     return []; // 加上 fallback
//     }
// }
