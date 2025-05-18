import ImageButton from "../lib/ImageButton"


export default function ReceiptCard(){
    return(
        <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
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
    )
}