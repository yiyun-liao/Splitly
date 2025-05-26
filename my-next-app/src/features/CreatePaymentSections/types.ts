// 型別定義

export interface User {
    avatar?: string;
    name?: string;
    uid:string;
}
//{ avatar: "https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/1.jpg", name: "Alice", uid: "4kjf39480fjlk" },

export interface SplitDetail {
    fixed: number;
    percent: number;
    total: number;
    inputValue?: string; // 只用於輸入中
}


// 功能區分
export type ReceiptWay = "split" | "debt";

// 分帳方式
export type SplitWay = "item" | "person";

// person 下再分三種
export type SplitMethod = "percentage" | "actual" | "adjusted";

// 付款人 db
export type PayerMap = Record<string, number>;
// {4kjf39480fjlk: 500, 92jf20fkk29jf: 500}

// 還款人 db
export type SplitMap = Record<string, SplitDetail>;
// {
//   "4kjf39480fjlk": {
//     "fixed": 20,
//     "percent": "0.50",
//     "total": 60
//   },
//   "fj30fj39d9s0d": {
//     "fixed": 0,
//     "percent": "0.50",
//     "total": 40
//   }
// }

// SplitWay =  "person" 送出資料
export interface CreatePaymentPayload {
    paymentName: string;
    receiptWay: ReceiptWay;    // "split" | "debt"
    splitWay: SplitWay | null;       // "item" | "person"
    splitMethod: SplitMethod | null; // "percentage" | "actual" | "adjusted"
    currency: string;
    amount: number;
    categoryId: string | null;
    time: string;
    desc: string | null;
    payerMap: PayerMap;
    splitMap: SplitMap; // "splitByPersonMap" | "splitByItemMap"
}

// paymentName : "rental"
// receiptWay : "split"
// splitWay : "person"
// splitMethod : "adjusted"
// currency : "TWD"
// amount : 100
// categoryId : "2"
// time : "2025-05-26T15:06"
// desc : "4/10"
// payerMap : {4kjf39480fjlk: 50, 92jf20fkk29jf:50}
// splitMap : {
//     4kjf39480fjlk : {fixed: 10, total: 39.997, percent: 0.3333}
//     92jf20fkk29jf : {fixed: 0, total: 29.997, percent: 0.3333}
//     fj30fj39d9s0d: {fixed: 0, total: 29.997, percent: 0.3333}
// }


// SplitWay = "item"送出子資料資料
export interface CreateItemPayload {
    amount: number;
    paymentName: string;
    splitMethod: SplitMethod;
    splitMap: SplitMap;
}

// {
//     amount :  100
//     paymentName : "beef"
//     splitMethod : "adjusted"
//     splitMap : {
//         4kjf39480fjlk : {fixed: 10, total: 39.997, percent: 0.3333}
//         92jf20fkk29jf : {fixed: 0, total: 29.997, percent: 0.3333}
//         fj30fj39d9s0d: {fixed: 0, total: 29.997, percent: 0.3333}
//     }
// }