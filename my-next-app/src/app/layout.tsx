import "./globals.css";
import ViewportHeightSetter from "@/components/layout/ViewportHeightSetter"; 
import { CategoryProvider } from "@/contexts/CategoryContext";

export const metadata = {
    title: 'Splitly – 您最佳的分帳工具',
    icons: {
        icon: "/favicon.ico",
    },
    description: 'Splitly 幫助您與朋友同事快速分帳、記帳，支援多種分帳方式。',
    openGraph: {
      title: 'Splitly – 您最佳的分帳工具',
      description: 'Splitly 幫助您與朋友同事快速分帳、記帳，支援多種分帳方式。',
      url: 'https://splitly-steel.vercel.app',
      images: [
        {
          url: 'https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG',
          width: 1200,
          height: 630,
          alt: 'Splitly Logo',
        },
      ],
      siteName: 'Splitly',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Splitly – 您最佳的分帳工具',
      description: 'Splitly 幫助您與朋友同事快速分帳、記帳，支援多種分帳方式。',
      images: ['https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG'],
    },
  }
  

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
