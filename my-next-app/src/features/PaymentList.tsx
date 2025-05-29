import ReceiptCard from "./PaymentListSections/ReceiptCard";

interface PaymentListProps {
    onCreateClick?: () => void;
  }

export default function PaymentList({
    }:PaymentListProps){
    
    
    return(
        <div id="receipt-list" className="shrink-0 w-xl px-3 py-3 rounded-2xl box-border h-full overflow-hidden bg-sp-green-300">
            <div id="receipt-list-header"  className="py-2 px-4 flex items-center gap-2 w-full justify-between overflow-hidden">
                <p className="text-xl font-medium whitespace-nowrap truncate min-w-0 max-w-100"> 收支紀錄</p>
            </div>
            <div id="receipt-list-frame" className="py-2 px-4 h-full overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth">
                <div id="receipt-list-frame-date" className="w-full pb-4">
                    <p className="text-sm pb-2 w-full font-semibold">05.11.2025</p>
                    <ReceiptCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ReceiptCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ReceiptCard/>
                </div>
                <div id="receipt-list-frame-date" className="w-full pb-4">
                    <p className="text-sm pb-2 w-full font-semibold">05.11.2025</p>
                    <ReceiptCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ReceiptCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ReceiptCard/>
                </div>
                <div id="receipt-list-frame-date" className="w-full pb-4">
                    <p className="text-sm pb-2 w-full font-semibold">05.11.2025</p>
                    <ReceiptCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ReceiptCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ReceiptCard/>
                </div>
            </div>
        </div>
    )
}