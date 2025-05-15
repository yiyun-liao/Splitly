'use client'

import { withAuth } from "@/utils/withAuth";
import { useRouter } from 'next/navigation';
import { logOutUser } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/useUser";
import Button from "@/components/lib/Button";
import Avatar from "@/components/lib/Avatar";
import Icon from "@/components/lib/Icon";
import Image from 'next/image';
import IconButton from "@/components/lib/IconButton";
import ImageButton from "@/components/lib/ImageButton";
import DashboardNav from "@/features/DashboardNav";
import DashboardHeader from "@/features/DashboardHeader";

function DashboardPage(){
    const {userData, isLoading} = useUser();

    console.log(userData, isLoading)

    return(
        <main className="flex items-start justify-start bg-sp-blue-100">
            <DashboardNav></DashboardNav>
            <div className="py-4 w-full h-screen flex flex-col items-center justify-start gap-2 ">
                <DashboardHeader userData={userData} />
                <div className="flex items-start justify-start px-6 gap-6 w-full h-full overflow-hidden text-zinc-700 ">
                    <div id="expense-list" className="shrink-0 w-xl px-3 py-3 rounded-2xl h-full overflow-hidden bg-sp-green-300">
                        <div id="expense-list-header"  className="py-2 px-4 flex items-center gap-2 w-full justify-between overflow-hidden">
                            <p className="text-2xl font-medium whitespace-nowrap truncate min-w-0 max-w-100"> 收支紀錄</p>
                            <Button
                                size='sm'
                                width='fit'
                                variant='solid'
                                color='primary'
                                leftIcon='solar:clipboard-add-linear'
                                //disabled={isdisabled} 
                                //isLoading={isLoading}
                                //onClick={handleClick} 
                                >
                                    新增
                            </Button> 
                        </div>
                        <div id="expense-list-frame" className="py-2 px-4 h-full overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth">
                            <div id="expense-list-frame-date" className="w-full pb-4">
                                <p className="text-sm pb-2 w-full font-semibold">05.11.2025</p>
                                <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40">
                                    <div className="h-full">
                                        <ImageButton
                                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                            size='md'
                                            imageName= "Splitly"
                                            >
                                        </ImageButton> 
                                    </div>
                                    <div className="flex-1 overflow-hidden ">
                                        <p className="text-base font-semibold whitespace-nowrap truncate">飲料錢</p>
                                        <p className="text-sm whitespace-nowrap truncate">JJ 支付了 $580459</p>
                                    </div>
                                    <div className="shrink-0 text-right overflow-hidden ">
                                        <p className="text-sm whitespace-nowrap truncate">借出</p>
                                        <p className="text-base font-semibold whitespace-nowrap truncate">$4359</p>
                                    </div>
                                </div>
                                <div className="w-full h-0.25 bg-sp-green-200"></div>
                                <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40">
                                    <div className="h-full">
                                        <ImageButton
                                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                            size='md'
                                            imageName= "Splitly"
                                            >
                                        </ImageButton> 
                                    </div>
                                    <div className="flex-1 overflow-hidden ">
                                        <p className="text-base font-semibold whitespace-nowrap truncate">飲料錢</p>
                                        <p className="text-sm whitespace-nowrap truncate">JJ 支付了 $580459</p>
                                    </div>
                                    <div className="shrink-0 text-right overflow-hidden ">
                                        <p className="text-sm whitespace-nowrap truncate">借出</p>
                                        <p className="text-base font-semibold whitespace-nowrap truncate">$4359</p>
                                    </div>
                                </div>
                                <div className="w-full h-0.25 bg-sp-green-200"></div>
                                <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40">
                                    <div className="h-full">
                                        <ImageButton
                                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                            size='md'
                                            imageName= "Splitly"
                                            >
                                        </ImageButton> 
                                    </div>
                                    <div className="flex-1 overflow-hidden ">
                                        <p className="text-base font-semibold whitespace-nowrap truncate">飲料錢</p>
                                        <p className="text-sm whitespace-nowrap truncate">JJ 支付了 $580459</p>
                                    </div>
                                    <div className="shrink-0 text-right overflow-hidden ">
                                        <p className="text-sm whitespace-nowrap truncate">借出</p>
                                        <p className="text-base font-semibold whitespace-nowrap truncate">$4359</p>
                                    </div>
                                </div>
                            </div>
                            <div id="expense-list-frame-date" className="w-full pb-4">
                                <p className="text-sm pb-2 w-full font-semibold">05.11.2025</p>
                                <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40">
                                    <div className="h-full">
                                        <ImageButton
                                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                            size='md'
                                            imageName= "Splitly"
                                            >
                                        </ImageButton> 
                                    </div>
                                    <div className="flex-1 overflow-hidden ">
                                        <p className="text-base font-semibold whitespace-nowrap truncate">飲料錢</p>
                                        <p className="text-sm whitespace-nowrap truncate">JJ 支付了 $580459</p>
                                    </div>
                                    <div className="shrink-0 text-right overflow-hidden ">
                                        <p className="text-sm whitespace-nowrap truncate">借出</p>
                                        <p className="text-base font-semibold whitespace-nowrap truncate">$4359</p>
                                    </div>
                                </div>
                                <div className="w-full h-0.25 bg-sp-green-200"></div>
                                <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40">
                                    <div className="h-full">
                                        <ImageButton
                                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                            size='md'
                                            imageName= "Splitly"
                                            >
                                        </ImageButton> 
                                    </div>
                                    <div className="flex-1 overflow-hidden ">
                                        <p className="text-base font-semibold whitespace-nowrap truncate">飲料錢</p>
                                        <p className="text-sm whitespace-nowrap truncate">JJ 支付了 $580459</p>
                                    </div>
                                    <div className="shrink-0 text-right overflow-hidden ">
                                        <p className="text-sm whitespace-nowrap truncate">借出</p>
                                        <p className="text-base font-semibold whitespace-nowrap truncate">$4359</p>
                                    </div>
                                </div>
                                <div className="w-full h-0.25 bg-sp-green-200"></div>
                                <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40">
                                    <div className="h-full">
                                        <ImageButton
                                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                            size='md'
                                            imageName= "Splitly"
                                            >
                                        </ImageButton> 
                                    </div>
                                    <div className="flex-1 overflow-hidden ">
                                        <p className="text-base font-semibold whitespace-nowrap truncate">飲料錢</p>
                                        <p className="text-sm whitespace-nowrap truncate">JJ 支付了 $580459</p>
                                    </div>
                                    <div className="shrink-0 text-right overflow-hidden ">
                                        <p className="text-sm whitespace-nowrap truncate">借出</p>
                                        <p className="text-base font-semibold whitespace-nowrap truncate">$4359</p>
                                    </div>
                                </div>
                            </div>
                            <div id="expense-list-frame-date" className="w-full pb-4">
                                <p className="text-sm pb-2 w-full font-semibold">05.11.2025</p>
                                <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40">
                                    <div className="h-full">
                                        <ImageButton
                                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                            size='md'
                                            imageName= "Splitly"
                                            >
                                        </ImageButton> 
                                    </div>
                                    <div className="flex-1 overflow-hidden ">
                                        <p className="text-base font-semibold whitespace-nowrap truncate">飲料錢</p>
                                        <p className="text-sm whitespace-nowrap truncate">JJ 支付了 $580459</p>
                                    </div>
                                    <div className="shrink-0 text-right overflow-hidden ">
                                        <p className="text-sm whitespace-nowrap truncate">借出</p>
                                        <p className="text-base font-semibold whitespace-nowrap truncate">$4359</p>
                                    </div>
                                </div>
                                <div className="w-full h-0.25 bg-sp-green-200"></div>
                                <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40">
                                    <div className="h-full">
                                        <ImageButton
                                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                            size='md'
                                            imageName= "Splitly"
                                            >
                                        </ImageButton> 
                                    </div>
                                    <div className="flex-1 overflow-hidden ">
                                        <p className="text-base font-semibold whitespace-nowrap truncate">飲料錢</p>
                                        <p className="text-sm whitespace-nowrap truncate">JJ 支付了 $580459</p>
                                    </div>
                                    <div className="shrink-0 text-right overflow-hidden ">
                                        <p className="text-sm whitespace-nowrap truncate">借出</p>
                                        <p className="text-base font-semibold whitespace-nowrap truncate">$4359</p>
                                    </div>
                                </div>
                                <div className="w-full h-0.25 bg-sp-green-200"></div>
                                <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40">
                                    <div className="h-full">
                                        <ImageButton
                                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                            size='md'
                                            imageName= "Splitly"
                                            >
                                        </ImageButton> 
                                    </div>
                                    <div className="flex-1 overflow-hidden ">
                                        <p className="text-base font-semibold whitespace-nowrap truncate">飲料錢</p>
                                        <p className="text-sm whitespace-nowrap truncate">JJ 支付了 $580459</p>
                                    </div>
                                    <div className="shrink-0 text-right overflow-hidden ">
                                        <p className="text-sm whitespace-nowrap truncate">借出</p>
                                        <p className="text-base font-semibold whitespace-nowrap truncate">$4359</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="expense-overview" className="w-full px-3 flex flex-col items-start justify-start gap-6 text-zinc-700">
                        <div id="over-view-bubble-budget" className="w-full px-3 py-3 rounded-2xl text-center bg-sp-yellow-400  text-sp-blue-500 overflow-hidden">
                            <Icon 
                                icon='solar:confounded-square-bold'
                                size='xl'
                                //className="text-red-500"
                            />
                            <p className="text-xl font-semibold ">專案預算...爆掉了！</p>
                        </div>
                        <div className="w-full flex justify-start gap-3 items-stretch">
                            <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                                <div id="over-view-bubble-quick-view" className="w-full px-3 py-3 rounded-2xl bg-sp-blue-200 overflow-hidden">
                                    <div className="px-3 py-3">
                                        <p className="text-base">專案期間</p>
                                        <p className="text-base font-semibold">05.11.2025 - 06.24.2025</p>
                                    </div>
                                    <div className="px-3 py-3">
                                        <p className="text-base">預算規劃</p>
                                        <p className="text-xl font-bold">$10000.00</p>
                                    </div>
                                </div>
                                <div id="over-view-bubble-expense" className="w-full px-3 py-3 rounded-2xl bg-sp-blue-200 overflow-hidden">
                                    <div className="px-3 py-3">
                                        <p className="text-base">整體支出</p>
                                        <p className="text-2xl font-bold">$8000.00</p>
                                    </div>
                                </div>
                                <div id="over-view-bubble-expense-self" className="w-full px-3 py-3 rounded-2xl bg-sp-blue-200 overflow-hidden">
                                    <div className="px-3 py-3">
                                        <p className="text-base">你的支出</p>
                                        <p className="text-2xl font-bold">$4231.00</p>
                                    </div>
                                </div>                        
                            </div>
                            <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                                <div id="over-view-bubble-spilt-self" className="w-full px-3 py-3 rounded-2xl bg-sp-blue-200 overflow-hidden">
                                    <div className="px-3 pb-3 flex items-center justify-start gap-2">
                                        <p className="text-base w-full">你在專案中借出</p>
                                        <div className="shrink-0 ">
                                            <Button
                                                size='sm'
                                                width='fit'
                                                variant='text-button'
                                                color='primary'
                                                //disabled={isdisabled} 
                                                //isLoading={isLoading}
                                                //onClick={handleClick} 
                                                >
                                                    查看全部
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="px-3 py-3 flex items-center justify-start gap-2">
                                        <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                            <Avatar
                                                size="md"
                                                img={userData?.avatar}
                                                userName = {userData?.name}
                                                //onAvatarClick={() => console.log('Clicked!')}
                                            />
                                            <p className="text-base w-fll  whitespace-nowrap truncate">Yun</p>
                                        </div>
                                        <p className="shrink-0 text-xl font-semibold">$359.00</p>
                                    </div>
                                </div>
                                <div id="over-view-bubble-spilt" className="w-full flex-1 px-3 py-3 rounded-2xl bg-sp-blue-200 overflow-hidden">
                                    <div className="px-3 pb-3 flex items-center justify-start gap-2">
                                        <p className="text-base w-full">分帳</p>
                                        <div className="shrink-0 ">
                                            <Button
                                                size='sm'
                                                width='fit'
                                                variant='text-button'
                                                color='primary'
                                                //disabled={isdisabled} 
                                                //isLoading={isLoading}
                                                //onClick={handleClick} 
                                                >
                                                    查看全部
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col items-center justify-start gap-2">
                                        <div id="over-view-bubble-spilt-token" className="w-full px-3 flex items-center justify-start gap-2">
                                            <div className="w-20 flex flex-col items-center justify-start gap-0 overflow-hidden">
                                                <Avatar
                                                    size="md"
                                                    img={userData?.avatar}
                                                    userName = {userData?.name}
                                                    //onAvatarClick={() => console.log('Clicked!')}
                                                />
                                                <p className="text-base w-fll  whitespace-nowrap truncate">Yun</p>
                                            </div>
                                            <div className="w-full text-center flex flex-col items-center justify-start -space-y-3">
                                                <p className="text-sm ">須還款</p>
                                                <div className="w-full flex items-center justify-start -space-x-4.5 text-sp-blue-500">
                                                    <div className="w-full h-0.5 bg-sp-blue-500"></div>
                                                    <Icon 
                                                        icon='solar:alt-arrow-right-outline'
                                                        size='xl'
                                                    />
                                                </div>
                                                <p className="text-sm font-semibold">$359.00</p>
                                                
                                            </div>
                                            <div className="w-20 flex flex-col items-center justify-start gap-0 overflow-hidden">
                                                <Avatar
                                                    size="md"
                                                    img={userData?.avatar}
                                                    userName = {userData?.name}
                                                    //onAvatarClick={() => console.log('Clicked!')}
                                                />
                                                <p className="text-base w-fll  whitespace-nowrap truncate">Yun</p>
                                            </div>                                       
                                        </div>
                                        <div id="over-view-bubble-spilt-token" className="w-full px-3 flex items-center justify-start gap-2">
                                            <div className="w-20 flex flex-col items-center justify-start gap-0 overflow-hidden">
                                                <Avatar
                                                    size="md"
                                                    img={userData?.avatar}
                                                    userName = {userData?.name}
                                                    //onAvatarClick={() => console.log('Clicked!')}
                                                />
                                                <p className="text-base w-fll  whitespace-nowrap truncate">Yun</p>
                                            </div>
                                            <div className="w-full text-center flex flex-col items-center justify-start -space-y-3">
                                                <p className="text-sm ">須還款</p>
                                                <div className="w-full flex items-center justify-start -space-x-4.5 text-sp-blue-500">
                                                    <div className="w-full h-0.5 bg-sp-blue-500"></div>
                                                    <Icon 
                                                        icon='solar:alt-arrow-right-outline'
                                                        size='xl'
                                                    />
                                                </div>
                                                <p className="text-sm font-semibold">$359.00</p>
                                                
                                            </div>
                                            <div className="w-20 flex flex-col items-center justify-start gap-0 overflow-hidden">
                                                <Avatar
                                                    size="md"
                                                    img={userData?.avatar}
                                                    userName = {userData?.name}
                                                    //onAvatarClick={() => console.log('Clicked!')}
                                                />
                                                <p className="text-base w-fll  whitespace-nowrap truncate">Yun</p>
                                            </div>                                       
                                        </div>
                                        <div id="over-view-bubble-spilt-token" className="w-full px-3 flex items-center justify-start gap-2">
                                            <div className="w-20 flex flex-col items-center justify-start gap-0 overflow-hidden">
                                                <Avatar
                                                    size="md"
                                                    img={userData?.avatar}
                                                    userName = {userData?.name}
                                                    //onAvatarClick={() => console.log('Clicked!')}
                                                />
                                                <p className="text-base w-fll  whitespace-nowrap truncate">Yun</p>
                                            </div>
                                            <div className="w-full text-center flex flex-col items-center justify-start -space-y-3">
                                                <p className="text-sm ">須還款</p>
                                                <div className="w-full flex items-center justify-start -space-x-4.5 text-sp-blue-500">
                                                    <div className="w-full h-0.5 bg-sp-blue-500"></div>
                                                    <Icon 
                                                        icon='solar:alt-arrow-right-outline'
                                                        size='xl'
                                                    />
                                                </div>
                                                <p className="text-sm font-semibold">$359.00</p>
                                                
                                            </div>
                                            <div className="w-20 flex flex-col items-center justify-start gap-0 overflow-hidden">
                                                <Avatar
                                                    size="md"
                                                    img={userData?.avatar}
                                                    userName = {userData?.name}
                                                    //onAvatarClick={() => console.log('Clicked!')}
                                                />
                                                <p className="text-base w-fll  whitespace-nowrap truncate">Yun</p>
                                            </div>                                       
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default withAuth(DashboardPage);