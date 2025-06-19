'use client'
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { logInUser } from '@/lib/auth';
import Button from '@/components/ui/Button';
import ImageButton from '@/components/ui/ImageButton';
import IconButton from '@/components/ui/IconButton';
import RedirectDialog from '@/features/BasicLayout/RedirectDialog';


const slides = [
    {
      id: 1,
      subtitle: '多人群組，還款不麻煩',
      title: '自動計算 · 最佳還款方案',
      description:
        '系統統整所有人收支，智能計算還款金額與最優路徑，減少還款次數，多種檢視模式，一目了然。',
      media: "https://res.cloudinary.com/ddkkhfzuk/image/upload/v1750233295/iPhone_14_Pro_Max_qznjuh.png",
    },
    {
      id: 2,
      subtitle: '大採購怎麼分？',
      title: '項目拆帳 · 精細化帳務管理',
      description:
        '單筆支出可依項目細分，精準拆帳與銷帳紀錄，不必再拿發票手動計算。',
      media: "https://res.cloudinary.com/ddkkhfzuk/image/upload/v1750233295/iPhone_14_Pro_Max_qznjuh.png",
    },
    {
      id: 3,
      subtitle: '旅程花費，一目瞭然',
      title: '私人帳目紀錄 · 開銷更清晰',
      description:
        '可設定個人預算並記錄私人開銷，精準掌握旅途花費，不再遺漏任何細節，不只局限於團員間的共同開銷。',
      media: "https://res.cloudinary.com/ddkkhfzuk/image/upload/v1750233295/iPhone_14_Pro_Max_qznjuh.png",
    },
];

export default function LandingClient() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [inWebView, setInWebView] = useState(false)
    const [isRedirectDialog, setIsRedirectDialog] = useState(false)


    useEffect(() => {
        if (typeof navigator !== 'undefined') {
          setInWebView(
            /Line|FBAN|FBAV|Instagram|Messenger|Twitter|MicroMessenger/i.test(
              navigator.userAgent
            )
          )
        }
      }, [])


    const redirect = searchParams.get('redirect') || '';
    const decoded = decodeURIComponent(redirect);
    const target = decoded  ? `/loading?redirect=${encodeURIComponent(decoded)}`  : '/loading';
    
    const handleLogin = async () => {
        if (inWebView) { 
            setIsRedirectDialog(true);
            return;
        }
        const ok = await logInUser()
        if (!ok) return;
  
        // 登入成功，再導到 loading 頁面
        router.push(target)
    }

    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")

    return (
        <div className={`h-screen flex flex-col text-zinc-700 ${scrollClass}`}>
            <>
                { isRedirectDialog && (
                    <RedirectDialog
                        open={isRedirectDialog}
                        onClose={() => setIsRedirectDialog(false)}
                        url={window.location.href} //保持原網址讓瀏覽器打開用
                    />            
                )}
            </>             
            <header className='flex-none w-full mx-auto flex flex-col items-center justify-start overflow-hidden' style={{ height: "80vh" }}>
                <div className='max-w-[1024px] w-full h-full flex items-center justify-between mx-24 px-6'>
                    <div className='flex flex-col gap-4 w-1/2'>
                        <div className='flex items-center justify-start gap-2'>
                            <img
                                    src="/logo/logo.svg"
                                    alt="Splitly"
                                    className="w-12 h-12 object-contain "
                                />
                            <h1 className="text-2xl font-medium">Splitly</h1>
                        </div>
                        <h1 className='text-4xl font-bold'>最快速的分帳幫手</h1>
                        <p className='text-lg'>幫助您與朋友同事快速分帳、記帳，支援多種分帳方式</p>
                        <p className='text-lg'>立即登入使用！</p>
                        <Button
                            size="md"
                            width="fit"
                            variant="outline"
                            color="primary"
                            leftIcon="logos:google-icon"
                            onClick={handleLogin} >
                            Log in
                        </Button>
                    </div>
                    <div className="relative h-full w-1/2">
                        <span className="block absolute inset-0 overflow-hidden">
                            <img
                                alt="Image of iPhone 12 Pro"
                                src="https://res.cloudinary.com/ddkkhfzuk/image/upload/v1750233295/iPhone_14_Pro_Max_qznjuh.png"
                                sizes="100vw"
                                className="absolute inset-0 w-full h-full object-contain"
                                decoding="async"
                            />
                        </span>
                    </div>
                    <div className="fixed right-[-100px] bottom-[60px] z-[-1] pointer-events-none">
                        <img
                            src="/bg/landing-header.svg"
                            alt="bg"
                            className="w-160 h-160 object-contain "
                        />
                    </div>
                </div>
            </header>
            <main className='flex-1 w-full mx-auto flex flex-col items-center justify-start bg-sp-blue-100'>
                <div className='max-w-[1024px] w-full h-full flex items-center justify-between mx-24 px-6'>
                    {slides.map((slide) => (
                        <div key={slide.id} className="SlideImgCardLayout ccMKDm flex flex-col md:flex-row items-center gap-6">
                            <div className="text-area">
                                <span className="text-area-title_sub block mb-2">{slide.subtitle}</span>
                                <h2 className="text-2xl font-bold whitespace-pre-wrap">{slide.title}</h2>
                                <p className="mt-2 text-base leading-relaxed">{slide.description}</p>
                            </div>
                            <div className="img-position">
                                <video className="w-full max-w-sm rounded-lg shadow-lg">
                                    <source src={slide.media} type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer className='flex-none w-full mx-auto bg-white text-zinc-700 m-auto flex flex-col items-center'>
                <div className='max-w-[1024px] w-full h-full flex items-start justify-between mx-24 px-6 py-20 min-h-50 '>
                    <div className="shrink-0">
                        <div className='flex items-center justify-start gap-2 pb-4'>
                            <img
                                    src="/logo/logo.svg"
                                    alt="Splitly"
                                    className="w-9 h-9 object-contain "
                                />
                            <h1 className="text-2xl font-medium">Splitly</h1>
                        </div>
                        <p className="text-lg">您最佳的分帳工具</p>
                    </div>
                    <div className='shrink-0 flex flex-col justify-start items-end gap-2'>
                        <p className="text-sp-blue-500 font-bold text-base">聯絡我</p>
                        <p className="text-lg ">廖宜昀 LIAO, YI-YUN</p>
                        <div className='flex gap-2'>
                            <Button
                                size='sm'
                                width='fit'
                                variant= 'text-button'
                                color='primary'
                                leftIcon='solar:folder-favourite-bookmark-bold'
                                onClick={() => {}}
                                >
                                Portfolio   
                            </Button> 
                            <Button
                                size='sm'
                                width='fit'
                                variant='text-button'
                                color='primary'
                                leftIcon='solar:card-2-bold'
                                onClick={() => {}}
                                >
                                Resume  
                            </Button>    
                            <IconButton
                                icon= 'logos:github-icon'
                                size='md'
                                variant='text-button'
                                color='primary'
                                type= 'button'
                                onClick={()=>{router.push(`https://github.com/yiyun-liao`)}} 
                            />    
                            <IconButton
                                icon= 'skill-icons:linkedin'
                                size='md'
                                variant='text-button'
                                color='primary'
                                type= 'button'
                                onClick={()=>{router.push(`https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit`)}} 
                            />              
                        </div>  
                    </div>
                </div>
                <div className='w-full flex justify-center items-center h-20 border-t-1 border-zinc-300 '>
                    <p className="">© 2025  All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
