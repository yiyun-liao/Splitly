import { GetPaymentData, CreatePaymentPayload } from "@/types/payment";

const BASE_URL = "http://localhost:8000";

// 建立支出
export async function createPayment(payload: CreatePaymentPayload) {
    try {
        const res = await fetch(`${BASE_URL}/api/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to create payment: " + errorText);
        }

        const data = await res.json();
        console.log("createPayment:", data);
        return data;
    } catch (err) {
        console.error("Error creating payment:", err);
        throw err;
    }
}
// 刪除支出
export async function deletePayment(paymentId: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/payment/by-payment?paymentId=${paymentId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to delete payment: " + errorText);
        }

        const data = await res.json();
        console.log("deletePayment:", data);
        return data;
    } catch (err) {
        console.error("Error deleting payment:", err);
        throw err;
    }
}
// 取得某專案的支出列表
export async function fetchPaymentsByProject(projectId: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/payment/by-project?pid=${projectId}`);

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to fetch payments: " + errorText);
        }

        const data = await res.json();
        console.log("fetchPaymentsByProject:", data);
        return data;
    } catch (err) {
        console.error("Error fetching payments:", err);
        throw err;
    }
}
// 更新支出
export async function updatePayment(paymentId: string, payload: GetPaymentData) {
    try {
        const res = await fetch(`${BASE_URL}/api/payment/by-payment?paymentId=${paymentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Failed to update payment: " + errorText);
        }

        const data = await res.json();
        console.log("updatePayment:", data);
        return data;
    } catch (err) {
        console.error("Error updating payment:", err);
        throw err;
    }
}
