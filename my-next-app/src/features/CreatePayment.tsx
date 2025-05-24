import clsx from "clsx";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from "react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textArea";
import Select from "@/components/ui/Select";
import { fetchCategoriesForSelect } from "@/lib/categoryApi";
import SplitPayer from "./CreatePaymentSections/SplitPayerDialog";
import SplitByPerson from "./CreatePaymentSections/SplitByPersonDialog";
import SplitByItem from "./CreatePaymentSections/SplitByItemDialog";
import DebtPayer from "./CreatePaymentSections/DebtPayerDialog";
import DebtReceiver from "./CreatePaymentSections/DebtReceiverDialog";
import { SplitDetail, SplitMap, PayerMap } from "./CreatePaymentSections/types";
import { formatPercent, formatNumber } from "./CreatePaymentSections/utils";


interface CreatePaymentProps {
    userData: {
      avatar?: string;
      name?: string;
    } | null;
    onClose: () => void;
    open?: boolean;
}

const userList = [
    { avatar: "https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/1.jpg", name: "Alice", uid: "4kjf39480fjlk" },
    { avatar: "https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/2.jpg", name: "Bob", uid: "92jf20fkk29jf" },
    { avatar: "https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/3.jpg", name: "Charlie", uid: "fj30fj39d9s0d" },
];

export default function CreatePayment({
    userData,
    onClose,
    open = true,
    }:CreatePaymentProps){

        // receipt-way
        const [receiptWay, setReceiptWay] = useState<"split" | "debt">("split");

        // receipt-split
        const [selectCurrencyValue, setSelectedCurrencyValue] = useState("TWD");
        const [inputAmountValue, setInputAmountValue] = useState("");
        const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string; disabled: boolean }[]>([]);
        const [selectCategoryValue, setSelectedCategoryValue] = useState("");
        const [inputItemValue, setInputItemValue] = useState("");
        const [inputTimeValue, setInputTimeValue] = useState("");
        const [inputDescValue, setInputDescValue] = useState("");

        const [splitWay, setSplitWay] = useState<"item" | "person">("person");
        const [chooseSplitByPerson, setChooseSplitByPerson] = useState<"percentage" | "actual" | "adjusted">("percentage");
        const [isSplitPayerOpen, setIsSplitPayerOpen] = useState(false);
        const [isSplitByPersonOpen, setIsSplitByPersonOpen] = useState(false);
        const [isSplitByItemOpen, setIsSplitByItemOpen] = useState(false);

        //  付款人
        const [splitPayerMap, setSplitPayerMap] = useState<PayerMap>({
            ["4kjf39480fjlk"]: parseFloat(inputAmountValue || "0") || 0
        });

        useEffect(() => {
            if(receiptWay === 'split' && userList.length > 0 && Number(inputAmountValue) > 0){
                const amount = parseFloat(inputAmountValue || "0");
                setSplitPayerMap({ ["4kjf39480fjlk"]: amount });
            }
        }, [inputAmountValue, receiptWay]);


        // 還款 by person
        const [splitByPersonMap, setSplitByPersonMap] = useState<SplitMap>(() => {
            const total = Number(inputAmountValue) || 0;
            const percentValue = parseFloat((1 / userList.length).toFixed(4));;
            const average = Math.floor((total * percentValue) * 10000) / 10000;
            return Object.fromEntries(userList.map(user => [user.uid, {
                fixed: 0,
                percent: percentValue,
                total: average
            }]));
        });

        useEffect(() => {
            if ( receiptWay === "split" && splitWay === "person" && chooseSplitByPerson === "percentage" && userList.length > 0 && Number(inputAmountValue) > 0) {
                const amount = parseFloat(inputAmountValue || "0");
                const percent = parseFloat((1 / userList.length).toFixed(4));
                const total = Math.floor((amount * percent) * 10000) / 10000;
                const map: SplitMap = Object.fromEntries(
                    userList.map(user => [user.uid, {
                        fixed: 0,
                        percent: percent,
                        total: total
                    }])
                );
                setSplitByPersonMap(map);
            }
        }, [inputAmountValue, receiptWay, splitWay, chooseSplitByPerson]);

        console.log("付款預設", splitPayerMap)
        console.log("分帳方式", chooseSplitByPerson, "分帳預設", splitByPersonMap)

        // 金額輸入限制
        const handleSplitAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;
          
            // 允許：空字串、整數、小數最多兩位
            const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
          
            if (isValid) {
              setInputAmountValue(rawValue);
            }
        };
          
        
        // receipt-debt
        const [inputDebtAmountValue, setInputDebtAmountValue] = useState("");
        const [isDebtPayerOpen, setIsDebtPayerOpen] = useState(false);
        const [selectedDebtPayerUid, setSelectedDebtPayerUid] = useState("4kjf39480fjlk")
        const [isDebtReceiverOpen, setIsDebtReceiverOpen] = useState(false);
        const [selectedDebtReceiverUid, setSelectedDebtReceiverUid] = useState("4kjf39480fjlk")


        const handleDebtAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;
          
            // 允許：空字串、整數、小數最多兩位
            const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
          
            if (isValid) {
                setInputDebtAmountValue(rawValue);
            }
        };
        
        useEffect(() => {
            if (open) document.body.style.overflow = 'hidden';
            else document.body.style.overflow = 'auto';
            return () => {
                document.body.style.overflow = 'auto';
            };
        }, [open]);


        // render category
        useEffect(() => {
            fetchCategoriesForSelect().then(setCategoryOptions);
        }, []);

        // 假資料
        const selectedDebtPayer = userList.find(user => user.uid === selectedDebtPayerUid);
        const selectedDebtReceiver = userList.find(user => user.uid === selectedDebtReceiverUid);






        // receipt-debt


        // css
        //const tokenCount: [number, number] = [inputAmountValue.length, 40];
        //const errorMessage = inputAmountValue.length > 40 ? '最多只能輸入 200 字最多只能輸入 200 字' : '';
  
        const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
        const labelClass = clsx("w-full font-medium truncate")
        const formSpan1CLass = clsx("col-span-1 flex flex-col gap-2 items-start justify-end")
        const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end")
        const formSpan3CLass = clsx("col-span-3 flex flex-col gap-2 items-start justify-end")
        const tagDescMap: Record<string, (entry: SplitDetail, allEntries: SplitMap) => string> = {
            percentage: (entry, allEntries) => {
              const uniquePercents = new Set(
                Object.values(allEntries).map(e => e.percent.toFixed(4))
              );
              const isEvenSplit = uniquePercents.size === 1;
              return isEvenSplit ? '均分' : formatPercent(entry.percent);
            },
            actual: () => '實際支出',
            adjusted: () => '',
        };
          
          
        const getTagDesc = tagDescMap[chooseSplitByPerson] || (() => '');
          
        
        return(
            <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50">
                <div>
                    {isSplitPayerOpen &&
                        <SplitPayer
                            isSplitPayerOpen = {isSplitPayerOpen}
                            onClose={() => setIsSplitPayerOpen(false)}
                            userList={userList}
                            inputAmountValue={inputAmountValue}
                            splitPayerMap={splitPayerMap}
                            setSplitPayerMap={setSplitPayerMap}
                        />
                    }
                    {isSplitByPersonOpen &&
                        <SplitByPerson
                            isSplitByPersonOpen = {isSplitByPersonOpen}
                            onClose={() => setIsSplitByPersonOpen(false)}
                            userList={userList}
                            inputAmountValue={inputAmountValue}
                            chooseSplitByPerson = {chooseSplitByPerson}
                            setChooseSplitByPerson = {setChooseSplitByPerson}
                            splitByPersonMap={splitByPersonMap}
                            setSplitByPersonMap={setSplitByPersonMap}
                        />
                    }
                    {isSplitByItemOpen &&
                        <SplitByItem
                            isSplitByItemOpen = {isSplitByItemOpen}
                            userData={userData} 
                            onClose={() => setIsSplitByItemOpen(false)}
                        />
                    }
                    {isDebtPayerOpen &&
                        <DebtPayer
                            isDebtPayerOpen = {isDebtPayerOpen}
                            onClose={() => setIsDebtPayerOpen(false)}
                            selectedDebtPayerUid={selectedDebtPayerUid}
                            setSelectedDebtPayerUid={setSelectedDebtPayerUid}
                            userList={userList}
                        />
                    }
                    {isDebtReceiverOpen &&
                        <DebtReceiver
                            isDebtReceiverOpen = {isDebtReceiverOpen}
                            onClose={() => setIsDebtReceiverOpen(false)}
                            selectedDebtReceiverUid={selectedDebtReceiverUid}
                            setSelectedDebtReceiverUid={setSelectedDebtReceiverUid}
                            userList={userList}
                        />
                    }
                </div>
                <div className="w-full h-fit pl-17 max-w-520 flex flex-col items-center justify-bottom">
                    <div id="receipt-form" className="w-full h-screen px-6 py-6 rounded-2xl overflow-hidden shadow-md flex flex-col items-start justify-bottom  bg-sp-green-300 text-zinc-700 text-base">
                        <div id="receipt-form-header"  className="w-full max-w-xl flex pt-1 pb-4 items-center gap-2 justify-start overflow-hidden">
                            <IconButton icon='solar:alt-arrow-left-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />
                            <p className="w-full text-xl font-medium truncate min-w-0"> 新增{receiptWay == 'split' ? '支出' : '轉帳'}</p>
                            <Button
                                size='sm'
                                width='fit'
                                variant='solid'
                                color='primary'
                                //disabled={isdisabled} 
                                //isLoading={isLoading}
                                // onClick={()=> setIsSelfExpenseDialogOpen(true)}
                                >
                                    儲存
                            </Button>
                        </div>
                        <div id="receipt-way" className="w-full my-4 flex max-w-xl bg-sp-white-20 rounded-xl">
                            <Button
                                size='sm'
                                width='full'
                                variant= {receiptWay == 'split' ? 'solid' : 'text-button'}
                                color= 'primary'
                                //disabled={isdisabled} 
                                //isLoading={isLoading}
                                onClick={() => setReceiptWay("split")}
                                >
                                    支出
                            </Button>
                            <Button
                                size='sm'
                                width='full'
                                variant={receiptWay == 'debt' ? 'solid' : 'text-button'}
                                color='primary'
                                //disabled={isdisabled} 
                                //isLoading={isLoading}
                                onClick={() => setReceiptWay("debt")}
                                >
                                    轉帳
                            </Button>
                        </div>
                        {receiptWay === "split" && (
                            <section id="receipt-split"  className={`w-full h-full pb-20 flex items-start justify-start gap-5 ${scrollClass}`}>
                                <div id="receipt-form-frame" className="max-w-xl w-full grid grid-cols-3 gap-2">
                                    <div className={formSpan1CLass}>
                                        <span className={labelClass}>費用</span>
                                        <Select
                                            value={selectCurrencyValue}
                                            required={true}
                                            placeholder="點擊選擇"
                                            onChange={(e) => setSelectedCurrencyValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            disabled = {true}
                                            options={[
                                                { label: "TWD", value: "TWD" , disabled: true}
                                            ]}
                                        />
                                    </div>
                                    <div className={formSpan2CLass}>
                                        <Input
                                        value={inputAmountValue}
                                        type="number"
                                        onChange={handleSplitAmountChange}
                                        flexDirection="row"
                                        width="full"
                                        placeholder="點擊編輯"
                                        step="0.01"
                                        inputMode="decimal"                                          
                                        />
                                    </div>
                                    <div className={formSpan1CLass}>
                                        <span className={labelClass}>類別</span>
                                        <Select
                                            value={selectCategoryValue}
                                            required = {true}
                                            onChange={(e) => setSelectedCategoryValue(e.target.value)}
                                            flexDirection= "row"
                                            width= "full"
                                            options={categoryOptions}
                                        />
                                    </div>
                                    <div className={formSpan2CLass}>
                                        <span className={labelClass}>名稱</span>
                                        <Input
                                            value={inputItemValue}
                                            type="text"
                                            onChange={(e) => setInputItemValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="點擊編輯"
                                        />
                                    </div>
                                    <div className={`pb-5 ${formSpan3CLass}`}>
                                        <div className="w-full flex items-center justify-start gap-2">
                                            <span className={labelClass}>付款人</span>
                                            <Button
                                                size='sm'
                                                width='fit'
                                                variant='text-button'
                                                color='primary'
                                                onClick={() => setIsSplitPayerOpen(true)}
                                                >
                                                    多位付款人
                                            </Button>
                                        </div>
                                        <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                            {Object.entries(splitPayerMap).map(([uid, amount]) => {
                                                const user = userList.find(user => user.uid === uid);
                                                if (!user) return null;
                                                return (
                                                <div key={uid} className="px-3 py-3 flex items-center justify-start gap-2">
                                                    <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div className="shrink-0 flex items-center justify-center">
                                                        <Avatar
                                                        size="md"
                                                        img={user.avatar}
                                                        userName={user.name}
                                                        />
                                                    </div>
                                                    <p className="text-base truncate">{user.name}</p>
                                                    </div>
                                                    <div className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                    <p className="shrink-0 text-xl font-lg">${amount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className={`pb-5 ${formSpan3CLass}`}>
                                        <div className="w-full flex items-center justify-start gap-2">
                                            <span className={labelClass}>分帳方式</span>
                                            <div id="receipt-way" className="w-full my-4 flex max-w-xl bg-sp-white-20 rounded-xl">
                                                <Button
                                                    size='sm'
                                                    width='full'
                                                    variant= {splitWay == 'item' ? 'solid' : 'text-button'}
                                                    color= 'primary'
                                                    //disabled={isdisabled} 
                                                    //isLoading={isLoading}
                                                    onClick={() => {
                                                        setIsSplitByItemOpen(true)
                                                        setSplitWay('item')
                                                    }}
                                                    >
                                                        項目分帳
                                                </Button>
                                                <Button
                                                    size='sm'
                                                    width='full'
                                                    variant={splitWay == 'person' ? 'solid' : 'text-button'}
                                                    color='primary'
                                                    //disabled={isdisabled} 
                                                    //isLoading={isLoading}
                                                    onClick={() => {
                                                        setIsSplitByPersonOpen(true)
                                                        setSplitWay('person')
                                                    }}
                                                    >
                                                        成員分帳
                                                </Button>
                                            </div>
                                        </div>
                                        <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                            {userList
                                                .filter(user => !!splitByPersonMap[user.uid])
                                                .map(user => {
                                                const entry = splitByPersonMap[user.uid];

                                                return(<div key={user.uid} className="px-3 py-3 flex items-center justify-start gap-2">
                                                    <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                        <div className="shrink-0  flex items-center justify-center ">
                                                            <Avatar
                                                            size="md"
                                                            img={user.avatar}
                                                            userName={user.name}
                                                            />
                                                        </div>
                                                        <p className="text-base truncate">{user.name}</p>
                                                    </div>
                                                    <div className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                        <p className="shrink-0 text-xl font-lg">
                                                            ${formatNumber(entry.total) || '0.00'}
                                                        </p>
                                                        <div className="p-1 rounded-sm bg-sp-blue-300 text-sp-blue-500">{getTagDesc(entry, splitByPersonMap)}</div>
                                                    </div>
                                                </div>
                                            )})}                                                                                                                            
                                        </div>
                                    </div>
                                    <div className={formSpan3CLass}>
                                        <span className={labelClass}>時間</span>
                                        <Input
                                            value={inputTimeValue}
                                            type="datetime-local"
                                            onChange={(e) => setInputTimeValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="點擊選擇"
                                        />
                                    </div>
                                    <div className={formSpan3CLass}>
                                        <span className={labelClass}>備忘錄</span>
                                        <TextArea
                                            value={inputDescValue}
                                            rows={2}
                                            maxRows={4}
                                            required={true}
                                            onChange={(e) => setInputDescValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="點擊編輯"
                                        />
                                    </div>
                                </div>
                            </section>
                        )}
                        {receiptWay === "debt" && (
                            <section id="receipt-debt"  className={`w-full h-full pb-20 flex items-start justify-start gap-5 ${scrollClass}`}>
                                <div id="receipt-form-frame" className="max-w-xl w-full grid grid-cols-3 gap-2">
                                    <div className={`pb-5 ${formSpan3CLass}`}>
                                        <div className="w-full flex items-center justify-start gap-2">
                                            <span className={labelClass}>匯款人</span>
                                        </div>
                                        <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                            <div className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div className="shrink-0  flex items-center justify-center ">
                                                        <Avatar
                                                            size="md"
                                                            img={selectedDebtPayer?.avatar}
                                                            userName = {selectedDebtPayer?.name}
                                                        />
                                                    </div>
                                                    <p className="text-base truncate">{selectedDebtPayer?.name}</p>
                                                </div>
                                                <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                    <Button
                                                        size='sm'
                                                        width='fit'
                                                        variant='text-button'
                                                        color='zinc'
                                                        //disabled={isdisabled} 
                                                        //isLoading={isLoading}
                                                        onClick={()=> setIsDebtPayerOpen(true)}
                                                        >
                                                            其他人
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={formSpan1CLass}>
                                        <span className={labelClass}>費用</span>
                                        <Select
                                            value={selectCurrencyValue}
                                            required={true}
                                            placeholder="點擊選擇"
                                            onChange={(e) => setSelectedCurrencyValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            disabled = {true}
                                            options={[
                                                { label: "TWD", value: "TWD" , disabled: true}
                                            ]}
                                        />
                                    </div>
                                    <div className={formSpan2CLass}>
                                        <Input
                                        value={inputDebtAmountValue}
                                        type="number"
                                        onChange={handleDebtAmountChange}
                                        flexDirection="row"
                                        width="full"
                                        placeholder="點擊編輯"
                                        step="0.01"
                                        inputMode="decimal"                                         
                                        />
                                    </div>
                                    <div className={`pb-5 ${formSpan3CLass}`}>
                                        <div className="w-full flex items-center justify-start gap-2">
                                            <span className={labelClass}>收款人</span>
                                        </div>
                                        <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                            <div className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div className="shrink-0  flex items-center justify-center ">
                                                        <Avatar
                                                            size="md"
                                                            img={selectedDebtReceiver?.avatar}
                                                            userName = {selectedDebtReceiver?.name}
                                                        />
                                                    </div>
                                                    <p className="text-base truncate">{selectedDebtReceiver?.name}</p>
                                                </div>
                                                <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                    <Button
                                                        size='sm'
                                                        width='fit'
                                                        variant='text-button'
                                                        color='zinc'
                                                        //disabled={isdisabled} 
                                                        //isLoading={isLoading}
                                                        onClick={()=> setIsDebtReceiverOpen(true)}
                                                        >
                                                            其他人
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={formSpan3CLass}>
                                        <span className={labelClass}>時間</span>
                                        <Input
                                            value={inputTimeValue}
                                            type="datetime-local"
                                            onChange={(e) => setInputTimeValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="點擊選擇"
                                        />
                                    </div>
                                    <div className={formSpan3CLass}>
                                        <span className={labelClass}>備忘錄</span>
                                        <TextArea
                                            value={inputDescValue}
                                            rows={2}
                                            maxRows={4}
                                            required={true}
                                            onChange={(e) => setInputDescValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="點擊編輯"
                                        />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        )
}