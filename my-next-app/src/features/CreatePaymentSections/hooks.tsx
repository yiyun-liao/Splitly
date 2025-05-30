// my-next-app/src/features/CreatePaymentSections/hooks.tsx
import { useState } from "react";
import { useParams } from "next/navigation";
import { createPayment } from "@/lib/paymentApi";
import { CreatePaymentPayload, GetPaymentData } from "@/types/payment";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

type UseCreatePaymentOptions = {
    onSuccess?: (payment: GetPaymentData) => void;
    onError?: (error: unknown) => void;
};

export function useCreatePayment(options?: UseCreatePaymentOptions) {
    const { setCurrentPaymentList } = useCurrentProjectData();
    const [isLoading, setIsLoading] = useState(false);
    const rawProjectId = useParams()?.projectId;
    const projectId = typeof rawProjectId === 'string' ? rawProjectId : "";

    const handleCreatePayment = async (payload: CreatePaymentPayload) => {
        const fullPayload: CreatePaymentPayload = {
            ...payload, 
            project_id: projectId || "", 
        };
        try {
            console.log(payload)
            setIsLoading(true);
            const result = await createPayment(fullPayload);
            const payment = result?.payment;

            if (payment) {
                if (setCurrentPaymentList) {
                    setCurrentPaymentList((prev) => [...(prev ?? []), payment]);
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

    return { handleCreatePayment, isLoading };
}
