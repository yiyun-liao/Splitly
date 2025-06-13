'use client'
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { logInUser } from '@/lib/auth';
import ImageButton from '@/components/ui/ImageButton';
import IconButton from '@/components/ui/IconButton';



export default function LandingClient() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [copied, setCopied] = useState(false)
    const [inWebView, setInWebView] = useState(false)

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
          setInWebView(
            /Line|FBAN|FBAV|Instagram|Messenger|Twitter|MicroMessenger/i.test(
              navigator.userAgent
            )
          )
        }
      }, [])

    const handleLogin = async () => {
        const ok = await logInUser()
        if (!ok) {
            return;
        }
  
        // 登入成功，再導到 loading 頁面
        const redirect = searchParams.get('redirect')
        const target = redirect
            ? `/loading?redirect=${encodeURIComponent(redirect)}`
            : '/loading'
        router.push(target)
    }

    if (inWebView) {
        const url = window.location.href
        return (
            <div className="flex flex-col items-center justify-center h-screen px-4 space-y-4 text-center">
                <p className="text-base">由於內嵌瀏覽器限制，Google 登入必須在系統瀏覽器完成。</p>
                <input
                    type="text"
                    readOnly
                    value={url}
                    className="w-full max-w-md p-2 border rounded"
                    onFocus={(e) => e.currentTarget.select()}
                />
                <Button
                    size="md"
                    variant="solid"
                    color="primary"
                    onClick={() => {
                        navigator.clipboard.writeText(url)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                    }}
                >
                    {copied ? '已複製!' : '複製連結'}
                </Button>
                <p className="text-sm text-gray-500">複製完畢後，請使用瀏覽器前往，即可完成登入。</p>
            </div>
        )
    }

    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")

    return (
        <div className={`h-full ${scrollClass}`}>
            <main className='min-h-[500px] flex flex-col items-center justify-center'>
                <div className="h-full  px-4">
                    <h1>main page - landing page</h1>
                    <p>這頁只是還沒做介面，請放心登入</p>
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
            </main>
            <footer className='bg-white text-zinc-700 m-auto flex flex-col items-center'>
                <div className='flex px-20 py-20 min-h-50 w-full max-w-[1400px] justify-between items-start'>
                    <div className="shrink-0">
                        <div className='flex items-center justify-start gap-2 pb-4'>
                            <ImageButton
                                image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                size='sm'
                                imageName= "Splitly"
                            />
                            <h1 className="text-xl font-medium">Splitly</h1>
                        </div>
                        <p className="text-base">您最佳的分帳工具</p>
                    </div>
                    <div className='shrink-0 flex flex-col justify-start items-end gap-2'>
                        <p className="text-sp-blue-500 font-bold text-sm">聯絡我</p>
                        <p className="text-base ">廖宜昀 LIAO, YI-YUN</p>
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
