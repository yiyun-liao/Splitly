import "./globals.css";
import ViewportHeightSetter from "@/components/layout/ViewportHeightSetter"; 
import { CategoryProvider } from "@/contexts/CategoryContext";


export const metadata = {
title: "Splitly",
icons: {
    icon: "/favicon.ico",
},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
    <html lang="zh-Hant">
    <head>
        <meta name="google" content="notranslate" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <CategoryProvider>
            <ViewportHeightSetter />
                {children}
        </CategoryProvider>
    </body>
    </html>
);
}
