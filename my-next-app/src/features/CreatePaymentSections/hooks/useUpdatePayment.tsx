import { updatePayment } from "@/lib/paymentApi";
import { GetPaymentData, UpdatePaymentData } from "@/types/payment";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useLoading } from "@/contexts/LoadingContext";
import toast from "react-hot-toast";

type UseUpdatePaymentOptions = {
    onSuccess?: (payment: GetPaymentData) => void;
    onError?: (error: unknown) => void;
};

export function useUpdatePayment(options?: UseUpdatePaymentOptions) {
    const { setCurrentPaymentList } = useCurrentProjectData();
    const { setLoading } = useLoading();

    const handleUpdatePayment = async (payload: UpdatePaymentData) => {
        const toastId = toast.loading("更新中…");

        try {
            setLoading(true);
            // setIsLoading(true);
            const result = await updatePayment(payload.id, payload);
            const payment = result?.payment;

            if (!payment) {
                throw new Error("伺服器回傳格式不正確");
            }

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

                toast.success("更新成功！", { id: toastId });
                options?.onSuccess?.(payment);
            } 
        } catch (error) {
            toast.error("更新失敗，請稍後再試", { id: toastId });
            console.error("Create payment failed:", error);
            options?.onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    return { handleUpdatePayment };
}
