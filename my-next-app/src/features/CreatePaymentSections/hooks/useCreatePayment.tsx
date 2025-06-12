import { useParams } from "next/navigation";
import { createPayment } from "@/lib/paymentApi";
import { CreatePaymentPayload, GetPaymentData } from "@/types/payment";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useLoading } from "@/contexts/LoadingContext";
import toast from "react-hot-toast";

type UseCreatePaymentOptions = {
    onSuccess?: (payment: GetPaymentData) => void;
    onError?: (error: unknown) => void;
};

export function useCreatePayment(options?: UseCreatePaymentOptions) {
    const { setLoading } = useLoading();
    const { setCurrentPaymentList } = useCurrentProjectData();
    const rawProjectId = useParams()?.projectId;
    const projectId = typeof rawProjectId === 'string' ? rawProjectId : "";

    const handleCreatePayment = async (payload: CreatePaymentPayload) => {
        const toastId = toast.loading("新增中…");

        const fullPayload: CreatePaymentPayload = {
            ...payload, 
            project_id: projectId || "", 
        };
        try {
            setLoading(true);
            const result = await createPayment(fullPayload);
            const payment = result?.payment;

            if (!payment) {
                throw new Error("伺服器回傳格式不正確");
            }

            if (setCurrentPaymentList) {
                setCurrentPaymentList((prev) => {
                    const newList = [payment, ...(prev ?? [])];

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
            toast.success("新增成功！", { id: toastId });
            options?.onSuccess?.(payment);
        } catch (error) {
            toast.error("新增失敗，請稍後再試", { id: toastId });
            console.error("Create payment failed:", error);
            options?.onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreatePayment };
}
