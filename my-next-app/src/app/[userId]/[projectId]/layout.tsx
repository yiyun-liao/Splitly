// app/[userId]/[projectId]/layout.tsx
'use client';
import { ReactNode } from "react";
import MobileLayout from "./MobileLayout";
import DesktopLayout from "./DesktopLayout";
import { useTrackLastVisitedProjectPath } from "@/hooks/useTrackLastVisitedProjectPath";

export default function ProjectLayout({ children }: { children: ReactNode }) {
    useTrackLastVisitedProjectPath();

    return (
        <>
            <div className="block md:hidden" style={{ height: "var(--vh)" }}>
                <MobileLayout>{children}</MobileLayout>
            </div>
            <div className="hidden md:block" style={{ height: "var(--vh)" }}>
                <DesktopLayout>{children}</DesktopLayout>
            </div>
        </>
    );
}



// 'use client';
// import { ReactNode } from "react";

// import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
// import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";
// import { CategoryProvider } from "@/contexts/CategoryContext";
// import MobileLayout from "./MobileLayout"; 
// import DesktopLayout from "./DesktopLayout"; 
// import { useTrackLastVisitedProjectPath } from "@/hooks/useTrackLastVisitedProjectPath";

// export default function DashboardLayout({ children }: { children: ReactNode }) {   
//     useTrackLastVisitedProjectPath();
 
//     return (
//         <GlobalProjectProvider>
//             <CategoryProvider>
//                 <CurrentProjectProvider>
//                     <div className="block md:hidden" style={{ height: "var(--vh)" }}><MobileLayout>{children}</MobileLayout></div>
//                     <div className="hidden md:block" style={{ height: "var(--vh)" }}><DesktopLayout>{children}</DesktopLayout></div>
//                 </CurrentProjectProvider>
//             </CategoryProvider>
//         </GlobalProjectProvider>
//     )

// }

