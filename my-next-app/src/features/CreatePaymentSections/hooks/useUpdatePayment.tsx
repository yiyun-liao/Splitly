import { useState } from "react";
import { updatePayment } from "@/lib/paymentApi";
import { GetPaymentData, UpdatePaymentData } from "@/types/payment";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

type UseUpdatePaymentOptions = {
    onSuccess?: (payment: GetPaymentData) => void;
    onError?: (error: unknown) => void;
};

export function useUpdatePayment(options?: UseUpdatePaymentOptions) {
    const { setCurrentPaymentList } = useCurrentProjectData();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdatePayment = async (payload: UpdatePaymentData) => {
        try {
            console.log(payload)
            setIsLoading(true);
            const result = await updatePayment(payload);
            const payment = result?.payment;

            if (payment) {
                if (setCurrentPaymentList) {
                    setCurrentPaymentList((prev) => {
                        const newList = (prev ?? []).map((p) =>
                            p.id === payment.id ? payment : p
                        );

                        // 同步更新 localStorage 快取
                        const paymentKey = `paymentList | ${payment.project_id}`;
                        const metaKey = `cacheProjectMeta | ${payment.project_id}`;
                        try {
                            localStorage.setItem(paymentKey, JSON.stringify(newList));
                            localStorage.setItem(metaKey, JSON.stringify({ timestamp: Date.now() }));
                        } catch (e) {
                            console.warn("⚠️ 快取更新失敗", e);
                        }

                        return newList;
                    })
                }
                options?.onSuccess?.(payment);
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

    return { handleUpdatePayment, isLoading };
}
