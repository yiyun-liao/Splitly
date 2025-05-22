import Button from "@/components/ui/Button"
import ImageButton from "@/components/ui/ImageButton"
import { useState } from "react";

interface PaymentOverviewProps {
    userData: {
      avatar?: string;
      name?: string;
    } | null;
  }

export default function PaymentOverview({}:PaymentOverviewProps){
    // receipt-way
    const [viewExpenseWay, setViewExpenseWay] = useState<"shared" | "personal">("shared");

    return(
        <div id="project-analysis" className="shrink-0 w-xl pb-3 h-full overflow-hidden">
            <div id="Expense-splitting" className="w-full mb-4 flex max-w-xl shrink-0 bg-sp-blue-300 rounded-xl">
                <Button
                    size='sm'
                    width='full'
                    leftIcon='solar:waterdrops-bold'
                    variant= {viewExpenseWay == 'shared' ? 'solid' : 'text-button'}
                    color= 'primary'
                    //disabled={isdisabled} 
                    //isLoading={isLoading}
                    onClick={() => setViewExpenseWay("shared")}
                    >
                        專案支出
                </Button>
                <Button
                    size='sm'
                    width='full'
                    leftIcon='solar:waterdrop-bold'
                    variant={viewExpenseWay == 'personal' ? 'solid' : 'text-button'}
                    color='primary'
                    //disabled={isdisabled} 
                    //isLoading={isLoading}
                    onClick={() => setViewExpenseWay("personal")}
                    >
                        個人支出
                </Button>
            </div>
            {viewExpenseWay === "shared" && (
                <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth">
                    <div id="project-analysis-chart" className="px-3 py-3 mb-4 rounded-2xl h-100 overflow-hidden bg-sp-blue-300 ">
                        <div id="project-analysis-chart"  className="py-2 px-4 w-full overflow-hidden">
                            <p className="text-xl font-medium truncate min-w-0 max-w-100 pb-2"> 開銷總覽</p>
                            <img src="https://res.cloudinary.com/ddkkhfzuk/image/upload/test.JPG" width={480} height={200} alt="圖" />
                        </div>
                    </div>
                    <div id="expense-list" className="px-3 py-3 mb-4 rounded-2xl h-100 overflow-hidden bg-sp-blue-200">
                        <div id="expense-list-header"  className="py-2 px-4 flex items-center gap-2 w-full justify-between overflow-hidden">
                            <p className="text-xl font-medium truncate min-w-0 max-w-100 pb-2"> 類別檢視</p>
                        </div>
                        <div id="expense-list-frame" className="py-2 px-4 ">
                            <div id="expense-list-token" className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
                                <div className="h-full w-full flex items-center justify-start gap-2">
                                    <ImageButton
                                        image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                        size='md'
                                        imageName= "Splitly"
                                        >
                                    </ImageButton> 
                                    <p className="text-base font-semibold truncate">類別開銷</p>
                                </div>
                                <div className="shrink-0 text-right overflow-hidden ">
                                    <p className="text-base font-semibold  truncate">$2453.00</p>
                                    <p className="text-sm truncate">32.4%</p>
                                </div>
                            </div>
                            <div className="w-full h-0.25 bg-sp-blue-300"></div>
                            <div id="expense-list-token" className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
                                <div className="h-full w-full flex items-center justify-start gap-2">
                                    <ImageButton
                                        image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                        size='md'
                                        imageName= "Splitly"
                                        >
                                    </ImageButton> 
                                    <p className="text-base font-semibold truncate">類別開銷</p>
                                </div>
                                <div className="shrink-0 text-right overflow-hidden ">
                                    <p className="text-base font-semibold  truncate">$2453.00</p>
                                    <p className="text-sm truncate">32.4%</p>
                                </div>
                            </div>
                            <div className="w-full h-0.25 bg-sp-blue-300"></div>
                            <div id="expense-list-token" className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
                                <div className="h-full w-full flex items-center justify-start gap-2">
                                    <ImageButton
                                        image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                        size='md'
                                        imageName= "Splitly"
                                        >
                                    </ImageButton> 
                                    <p className="text-base font-semibold truncate">類別開銷</p>
                                </div>
                                <div className="shrink-0 text-right overflow-hidden ">
                                    <p className="text-base font-semibold  truncate">$2453.00</p>
                                    <p className="text-sm truncate">32.4%</p>
                                </div>
                            </div>
                            <div className="w-full h-0.25 bg-sp-blue-300"></div>
                        </div>
                    </div>
                </div>
            )}
            {viewExpenseWay === "personal" && (
                <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth">
                    <div>personal</div>
                    <div id="project-analysis-chart" className="px-3 py-3 mb-4 rounded-2xl h-100 overflow-hidden bg-sp-blue-300 ">
                        <div id="project-analysis-chart"  className="py-2 px-4 w-full overflow-hidden">
                            <p className="text-xl font-medium truncate min-w-0 max-w-100 pb-2"> 開銷總覽</p>
                            <img src="https://res.cloudinary.com/ddkkhfzuk/image/upload/test.JPG" width={480} height={200} alt="圖" />
                        </div>
                    </div>
                    <div id="expense-list" className="px-3 py-3 mb-4 rounded-2xl h-100 overflow-hidden bg-sp-blue-200">
                        <div id="expense-list-header"  className="py-2 px-4 flex items-center gap-2 w-full justify-between overflow-hidden">
                            <p className="text-xl font-medium truncate min-w-0 max-w-100 pb-2"> 類別檢視</p>
                        </div>
                        <div id="expense-list-frame" className="py-2 px-4 ">
                            <div id="expense-list-token" className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
                                <div className="h-full w-full flex items-center justify-start gap-2">
                                    <ImageButton
                                        image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                        size='md'
                                        imageName= "Splitly"
                                        >
                                    </ImageButton> 
                                    <p className="text-base font-semibold truncate">類別開銷</p>
                                </div>
                                <div className="shrink-0 text-right overflow-hidden ">
                                    <p className="text-base font-semibold  truncate">$2453.00</p>
                                    <p className="text-sm truncate">32.4%</p>
                                </div>
                            </div>
                            <div className="w-full h-0.25 bg-sp-blue-300"></div>
                            <div id="expense-list-token" className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
                                <div className="h-full w-full flex items-center justify-start gap-2">
                                    <ImageButton
                                        image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                        size='md'
                                        imageName= "Splitly"
                                        >
                                    </ImageButton> 
                                    <p className="text-base font-semibold truncate">類別開銷</p>
                                </div>
                                <div className="shrink-0 text-right overflow-hidden ">
                                    <p className="text-base font-semibold  truncate">$2453.00</p>
                                    <p className="text-sm truncate">32.4%</p>
                                </div>
                            </div>
                            <div className="w-full h-0.25 bg-sp-blue-300"></div>
                            <div id="expense-list-token" className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
                                <div className="h-full w-full flex items-center justify-start gap-2">
                                    <ImageButton
                                        image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                        size='md'
                                        imageName= "Splitly"
                                        >
                                    </ImageButton> 
                                    <p className="text-base font-semibold truncate">類別開銷</p>
                                </div>
                                <div className="shrink-0 text-right overflow-hidden ">
                                    <p className="text-base font-semibold  truncate">$2453.00</p>
                                    <p className="text-sm truncate">32.4%</p>
                                </div>
                            </div>
                            <div className="w-full h-0.25 bg-sp-blue-300"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}