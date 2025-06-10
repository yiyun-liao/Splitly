import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ViewportHeightSetter from "@/components/layout/ViewportHeightSetter"; 

export const metadata = {
title: "Splitly",
icons: {
    icon: "/favicon.ico",
},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
    <html lang="zh-Hant">
    <body>
        <AuthProvider>
        <ViewportHeightSetter />
            {children}
        </AuthProvider>
    </body>
    </html>
);
}
