import { useState } from "react";
import { deletePayment } from "@/lib/paymentApi";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useLoading } from "@/contexts/LoadingContext";
import toast from "react-hot-toast";

type UseDeletePaymentOptions = {
    onSuccess?: (paymentId: string) => void;
    onError?: (error: unknown) => void;
};

export function useDeletePayment(options?: UseDeletePaymentOptions) {
    const { setCurrentPaymentList } = useCurrentProjectData();
    const { setLoading } = useLoading();
    // const [isLoading, setIsLoading] = useState(false);

    const handleDeletePayment = async (projectId: string, paymentId:string) => {
        const toastId = toast.loading("刪除中…");

        try {
            setLoading(true);
            // setIsLoading(true);
            const result = await deletePayment(paymentId);

            if (!result.success){
                throw new Error("伺服器回傳格式不正確");
            }

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
            toast.success("刪除成功！", { id: toastId });
            options?.onSuccess?.(paymentId);
        } catch (error) {
            toast.error("刪除失敗，請稍後再試", { id: toastId });
            console.error("Create payment failed:", error);
            options?.onError?.(error);
        } finally {
            setLoading(false);
            // setIsLoading(false);
        }
    };

    return { handleDeletePayment };
}
