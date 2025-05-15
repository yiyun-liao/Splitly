import Button from "@/components/lib/Button"
import ImageButton from "@/components/lib/ImageButton"

interface DashboardExpenseListProps {
    userData: {
      avatar?: string;
      name?: string;
    } | null;
  }

export default function DashboardExpenseList({}:DashboardExpenseListProps){
    return(
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
    )
}