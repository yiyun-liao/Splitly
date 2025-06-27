'use client'
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { logInUser, logInDemoUser } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import IconButton from '@/components/ui/IconButton';
import RedirectDialog from '@/features/BasicLayout/RedirectDialog';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScrollDirection } from '@/hooks/useScrollDirection';



const slides = [
    {
      id: 1,
      subtitle: '多人群組，還款不麻煩',
      title: '自動計算 · 最佳還款方案',
      description:
        '系統統整所有人收支，智能計算還款金額與最優路徑，減少還款次數，多種檢視模式，一目了然。',
      media: "https://splitly-bucket.s3.ap-northeast-1.amazonaws.com/assets/landingPage/video_wise_settle.gif",
    },
    {
      id: 2,
      subtitle: '大採購怎麼分？',
      title: '項目拆帳 · 精細化帳務管理',
      description:
        '單筆支出可依項目細分，精準拆帳與銷帳紀錄，不必再拿發票手動計算。',
      media: "https://splitly-bucket.s3.ap-northeast-1.amazonaws.com/assets/landingPage/video_item_split.gif",
    },
    {
      id: 3,
      subtitle: '旅程花費，一目瞭然',
      title: '私人帳目紀錄 · 開銷更清晰',
      description:
        '可設定個人預算並記錄私人開銷，精準掌握旅途花費，不再遺漏任何細節，不只局限於團員間的共同開銷。',
      media: "https://splitly-bucket.s3.ap-northeast-1.amazonaws.com/assets/landingPage/video_multiple_display.gif",
    },
];

export default function LandingClient() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [inWebView, setInWebView] = useState(false)
    const [isRedirectDialog, setIsRedirectDialog] = useState(false)
    const isMobile = useIsMobile();

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
      setIsMounted(true)
    }, [])

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            setInWebView(/Line|FBAN|FBAV|Instagram|Messenger|Twitter|MicroMessenger/i.test(navigator.userAgent))
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
        if (!ok){
            toast.error('登入失敗，請重新登入')
            return;
        } 
        router.push(target) // 登入成功，再導到 loading 頁面
    }

    const handleDemoLogin = async () => {
        if (inWebView) { 
            setIsRedirectDialog(true);
            return;
        }
        const ok = await logInDemoUser()
        if (!ok){
            toast.error('登入失敗，請重新登入')
            return;
        } 
        router.push(target) // 登入成功，再導到 loading 頁面
    }

    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const slideRefs = useRef<Array<HTMLElement | null>>([]);
    const lastRef = useRef<HTMLDivElement | null>(null);
    const nextRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
    
        slideRefs.current.forEach((el, idx) => {
            if (!el) return;
            // 每個 section 單獨一個 observer
            const obs = new IntersectionObserver(
                ([entry]) => {
                if (entry.intersectionRatio > 0.5) {
                    // 這張進入就設定自己
                    setActiveIndex(idx);
                } else if (activeIndex === idx) {
                    // 這張離開，且剛好是 active，就清掉
                    setActiveIndex(-1);
                }
                },
                { threshold: 0.5 }
            );
            obs.observe(el);
            observers.push(obs);
        });
        if (nextRef.current ) {
            const nextObs = new IntersectionObserver(
              ([entry]) => {
                if (entry.intersectionRatio > 0.5) {
                  setActiveIndex(-1);
                }
              },
              { threshold: 0.5 }
            );
            nextObs.observe(nextRef.current);
            observers.push(nextObs);
        }
        if (lastRef.current ) {
            const lastObs = new IntersectionObserver(
              ([entry]) => {
                if (entry.intersectionRatio > 0.5) {
                  setActiveIndex(-1);
                }
              },
              { threshold: 0.5 }
            );
            lastObs.observe(lastRef.current);
            observers.push(lastObs);
        }
    
        return () => observers.forEach(o => o.disconnect());
    }, []);

    // 計算位移收合
    const scrollRef = useRef<HTMLDivElement>(null);
    const isScrolled = useScrollDirection(scrollRef, 5);


    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const sectionClass = clsx("flex-none w-full mx-auto flex flex-col items-center justify-start overflow-hidden",{
        "snap-start": !isMobile,
    })
    const flexClass = clsx("w-full h-full mx-auto flex items-center",{
        "max-w-[1024px] px-12 flex-row justify-between ": !isMobile,
        "flex-col justify-start px-8" : isMobile
    })
    const deviceClass = clsx("w-full  mx-auto items-center py-12 flex flex-col justify-start items-center w-full gap-4",{
        "max-w-[1024px] px-12 ": !isMobile,
        " px-8" : isMobile
    })


    return (
        <div ref={scrollRef} className={`relative h-screen flex flex-col ${!isMobile && "snap-y snap-mandatory "} text-zinc-700 ${scrollClass}`}>
            <>
                { isRedirectDialog && (
                    <RedirectDialog
                        open={isRedirectDialog}
                        onClose={() => setIsRedirectDialog(false)}
                        url={window.location.href} //保持原網址讓瀏覽器打開用
                    />            
                )}
            </>
            {(isMounted && !isMobile && activeIndex > -1) && (
                <div className="fixed flex items-center justify-between gap-2 z-10 min-h-[100vh] min-w-[100vw] pointer-events-none">
                    <div className='relative max-w-[1024px] w-full h-full mx-auto px-12 '>
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center justify-start gap-2'>
                            {slides.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={clsx(
                                        "h-3 w-3 rounded-full border border-sp-blue-500",
                                        idx === activeIndex ? "bg-sp-blue-500" : "bg-sp-blue-200"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>             
            )}
            {(isMounted && isMobile && isScrolled) && (
                <div className="w-full fixed bottom-0 right-0 p-4 z-2">
                    <div className='w-full p-2 backdrop-blur-2xl rounded-2xl overflow-hidden'>
                        <Button
                            size="md"
                            width="full"
                            variant="solid"
                            color="primary"
                            leftIcon="logos:google-icon"
                            onClick={handleLogin} >
                            Log in
                        </Button>
                    </div>
                </div>             
            )}
            <header ref={lastRef} className={`${isMobile ? "pt-10" : "h-[80vh] max-h-[780px]"} ${sectionClass}`}>
                <div className={`relative ${flexClass}`}>
                    <div className='flex flex-col justify-start items-center'>
                        <div className={`w-full h-full flex ${isMobile ? "flex-col justify-start gap-4" : "flex-row justify-between px-6"} items-center `}>
                            <div className={`flex flex-col gap-4 shrink-0 ${isMobile ? "w-full text-center" : "w-1/3"}`}>
                                <div className={`flex items-center gap-2 ${isMobile ? "justify-center" : "justify-start"}`}>
                                    <img
                                        src="/logo/splitly.svg"
                                        alt="Splitly"
                                        className="h-12 object-contain "
                                    />
                                </div>
                                <h1 className={`font-bold ${isMobile ? "text-2xl" : "text-4xl"}`}>最快速的分帳幫手</h1>
                                <p className={`pb-8 text-zinc-500 ${isMobile ? "text-base" : "text-lg"}`}>幫助您與朋友同事快速分帳、記帳，支援多種分帳方式</p>
                                <p className={`text-zinc-500 ${isMobile ? "text-base" : "text-lg"}`}>立即註冊、登入使用！</p>
                                <div className={`flex flex-col gap-2 items-center max-w-60 w-full ${isMobile ? "justify-center mx-auto" : " justify-start"}`}>
                                    <Button
                                        size="md"
                                        width="full"
                                        variant="outline"
                                        color="primary"
                                        leftIcon="logos:google-icon"
                                        onClick={handleLogin} >
                                        Log in
                                    </Button>
                                    <Button
                                        size="md"
                                        width="full"
                                        variant="text-button"
                                        color="primary"
                                        onClick={handleDemoLogin} >
                                        Experience as a guest
                                    </Button>
                                </div>
                            </div>
                            <div className={`shrink-0 ${isMobile ? "w-full pb-6" : "w-2/3 h-full"}`}>
                                <span className="inset-0 overflow-hidden">
                                    <img
                                        alt="header_pic"
                                        src="https://splitly-bucket.s3.ap-northeast-1.amazonaws.com/assets/landingPage/header.png"
                                        sizes="100vw"
                                        className=" w-full h-full object-contain"
                                    />
                                </span>
                            </div>
                        </div>
                        <div className={`absolute z-[-1] pointer-events-none ${isMobile ? "right-[-200px] bottom-[-200px]" : "right-[-200px] bottom-[-100px]"}`}>
                            <img
                                src="/bg/landing-header.svg"
                                alt=""
                                className="w-160 h-160 object-contain "
                            />
                        </div>
                    </div>
                </div>
            </header>
            {slides.map((slide, idx) => (
                <section key={slide.id} ref={el => {slideRefs.current[idx] = el}} className={`${isMobile ? "" : "h-[100vh] max-h-[780px]"}  bg-white ${sectionClass}`}                     >
                    <div className={`${flexClass}`}>
                        {isMobile && (
                            <div className={`flex flex-col shrink-0 w-full gap-0 pt-8`}>
                                <p className={`font-bold text-sp-blue-500 text-base`}>{slide.subtitle}</p>
                                <h2 className={`font-bold text-2xl`}>{slide.title}</h2>
                                <p className="mt-2 text-base text-zinc-500">{slide.description}</p>
                            </div>
                        )}
                        <div className={`shrink-0 ${isMobile ? "w-full" : "w-1/2 h-full"}`}>
                            <span className="inset-0 overflow-hidden">
                                <img
                                    alt={slide.title}
                                    src={slide.media}
                                    sizes="100vw"
                                    className={`${isMobile ? "h-[90vh]" : "h-[100vh] max-h-[780px]"} mx-auto object-contain`}
                                />
                            </span>
                        </div>
                        {!isMobile && (
                            <div className={`flex flex-col shrink-0 w-1/2 gap-4`}>
                                <p className={`font-bold text-sp-blue-500 text-2xl`}>{slide.subtitle}</p>
                                <h2 className={`font-bold text-4xl`}>{slide.title}</h2>
                                <p className="mt-2 text-base text-zinc-500">{slide.description}</p>
                            </div>
                        )}
                    </div>
                </section>
            ))}
            <section ref={nextRef} className={`${isMobile ? "" : ""} ${sectionClass} bg-[#E4E9F2]`}>
                <div className={`relative ${deviceClass}`}>
                    <div className={`w-full shrink-0 flex flex-col items-center justify-center  ${isMobile ? "gap-0 text-center" : "gap-2"}`}>
                            <p className={`text-sp-blue-500 ${isMobile ? "text-base" : "text-lg"}`}>任何裝置<span className='px-4'>|</span>地點都可使用</p>
                            <p className={`font-bold ${isMobile ? "text-2xl" : "text-4xl"}`}>隨時隨地記錄，任何收支不遺漏</p>
                    </div>
                    <div className={`shrink-0 flex justify-center items-center overflow-hidden ${isMobile ? "w-full" : "w-full"}`}>
                        <img
                            src="https://splitly-bucket.s3.ap-northeast-1.amazonaws.com/assets/landingPage/video_device_all.gif"
                            alt="device_all"
                            className={`${isMobile ? "w-[100vw]" : "h-[464px]"} mx-auto object-contain`}
                        />
                    </div>
                </div>
            </section>   
            <section className={`${isMobile ? "min-h-[400px]" : "h-[80vh] max-h-[780px]"} ${sectionClass} bg-sp-blue-500 text-sp-grass-400`}>
                <div className={`relative ${flexClass}`}>
                    <div className={`w-full h-full flex flex-col items-center justify-center  ${isMobile ? "gap-0 text-center" : "gap-2"}`}>
                            <p className={`text-sp-grass-200 ${isMobile ? "text-base" : "text-lg"}`}>暢心遊玩<span className='px-4'>|</span>輕鬆記帳</p>
                            <p className={`font-bold ${isMobile ? "text-2xl" : "text-4xl"}`}>不再讓記帳影響旅程</p>
                            <div className="w-full flex items-center justify-center -space-x-2 py-8 shrink-0">
                                {[1,2,3,4,5,6].map((i, idx) => (
                                    <Avatar
                                    key={i}
                                    size="lg"
                                    img={`/avatar/avatar-${i}.svg`}
                                    userName="demo"
                                    className="border-2 border-zinc-100 animate-float shrink-0"
                                    style={{ animationDelay: `${idx * 0.5}s` }}
                                    />
                                ))}
                            </div>
                            <div className='max-w-60 w-full'>
                                <Button
                                    size="md"
                                    width="full"
                                    variant="outline"
                                    color="primary"
                                    leftIcon="logos:google-icon"
                                    onClick={handleLogin} >
                                    Log in
                                </Button>
                            </div>
                            <p className='text-base text-white pt-2'>立即註冊、登入使用！</p>
                    </div>
                    <div className="absolute right-[-200px] bottom-[-100px] z-[-1] pointer-events-none">
                        <img
                            src="/bg/landing-header.svg"
                            alt="bg"
                            className="w-160 h-160 object-contain "
                        />
                    </div>
                </div>
            </section>            
            <footer className={`bg-white min-h-50 ${sectionClass}`}>
                <div className={`${isMobile ? "py-8 gap-12" : "py-20"} ${flexClass}`}>
                    <div className={`shrink-0 ${isMobile ? "w-full" : "w-1/2"}`}>
                        <img
                                src="/logo/splitly.svg"
                                alt="Splitly"
                                className="h-9 object-contain"
                            />
                        <p className="text-lg pt-4">您最佳的分帳工具</p>
                    </div>
                    <div className={`flex flex-col gap-2 shrink-0 justify-start ${isMobile ? "w-full text-center items-start pb-4" : "w-1/2 items-end"}`}>
                        <p className="text-sp-blue-500 font-bold text-base">聯絡我</p>
                        <p className="text-lg ">廖宜昀 LIAO, YI-YUN</p>
                        <div className='flex gap-2 flex-wrap'>
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
                                onClick={()=>{router.push(`https://github.com/yiyun-liao/Splitly`)}} 
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
