import ImageButton from "@/components/ui/ImageButton"
import clsx from "clsx";

interface ReceiptCardProps{
    payment_name: string;
    amount: number;
    payer_text:string;
    isBorrowed?: boolean;
    category: {
        imgURL: string;
        name_en: string;
    };
}

export default function ReceiptCard({
    payment_name,
    amount,
    payer_text,
    isBorrowed,
    category
}:ReceiptCardProps){
    // css
    const borrowText = clsx("text-sm whitespace-nowrap truncate font-semibold",
        {
            "text-sp-blue-500" : isBorrowed,
            "text-sp-green-400" : !isBorrowed,
        }
    )

    return( 
        <div className="flex items-center justify-start p-2 gap-2 h-16 rounded-lg hover:bg-sp-white-20 active:bg-sp-white-40 cursor-pointer">
            <div className="h-full">
                <ImageButton
                    image={category.imgURL}
                    size='md'
                    imageName= {category.name_en}
                    >
                </ImageButton> 
            </div>
            <div className="flex-1 overflow-hidden ">
                <p className="text-base font-semibold whitespace-nowrap truncate">{payment_name}</p>
                <p className="text-sm whitespace-nowrap truncate">{payer_text}</p>
            </div>
            <div className="shrink-0 text-right overflow-hidden ">
                <p className={borrowText}>{isBorrowed ? "借出" : "花費"}</p>
                <p className="text-base font-semibold whitespace-nowrap truncate">${amount}</p>
            </div>
        </div>
    )
}