import { useState } from "react";
import { deletePayment } from "@/lib/paymentApi";
import { GetPaymentData } from "@/types/payment";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

type UseDeletePaymentOptions = {
    onSuccess?: (paymentId: string) => void;
    onError?: (error: unknown) => void;
};

export function useDeletePayment(options?: UseDeletePaymentOptions) {
    const { setCurrentPaymentList } = useCurrentProjectData();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeletePayment = async (projectId: string, paymentId:string) => {
        try {
            setIsLoading(true);
            const result = await deletePayment(paymentId);
            // return: {"success":true}
            if (result.success) {
                if (setCurrentPaymentList) {
                    setCurrentPaymentList((prev) => {
                        const newList = (prev ?? []).filter(p => p.id !== paymentId);

                        // 同步更新 localStorage 快取
                        const paymentKey = `paymentList | ${projectId}`;
                        const metaKey = `cacheProjectMeta | ${projectId}`;
                        try {
                            localStorage.setItem(paymentKey, JSON.stringify(newList));
                            localStorage.setItem(metaKey, JSON.stringify({ timestamp: Date.now() }));
                        } catch (e) {
                            console.warn("⚠️ 快取更新失敗", e);
                        }

                        return newList;
                    })
                }
                options?.onSuccess?.(paymentId);
            } else {
                console.error("⚠️ createPayment 回傳格式不符合預期", result);
            }
        } catch (error) {
            console.error("Create payment failed:", error);
            options?.onError?.(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleDeletePayment, isLoading };
}
