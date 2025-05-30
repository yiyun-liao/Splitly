// my-next-app/src/features/CreatePaymentSections/hooks.tsx
import { useState } from "react";
import { createPayment } from "@/lib/paymentApi";
import { CreatePaymentPayload, GetPaymentData } from "@/types/payment";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

type UseCreatePaymentOptions = {
    onSuccess?: (payment: GetPaymentData) => void;
    onError?: (error: unknown) => void;
};

export function useCreatePayment(options?: UseCreatePaymentOptions) {
    const { currentPaymentList } = useCurrentProjectData();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreatePayment = async (payload: CreatePaymentPayload) => {
        try {
            setIsLoading(true);
            const result = await createPayment(payload);
            const payment = result?.payment;

            if (payment) {
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
