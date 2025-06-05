import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
    children: React.ReactNode;
}

export default function ModalPortal({ children }: ModalPortalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return createPortal(children, document.body);
}