import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768): boolean {
  const getMatch = () =>
    typeof window !== "undefined" && window.innerWidth <= breakpoint;

  const [isMobile, setIsMobile] = useState<boolean>(getMatch);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setIsMobile(getMatch());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

