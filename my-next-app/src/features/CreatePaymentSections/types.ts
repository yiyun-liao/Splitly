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
}


// 紀錄類型：分帳還是借還帳
export type RecordMode = "split" | "debt";

// 帳本類型：私人 or 團體
export type AccountType= "personal" | "group" ;

// 分帳方式：以人或品項為單位
export type SplitWay = "item" | "person";

// 以人分帳的進階方式
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

// 如果有 "item"送出子資料資料
export interface CreateItemPayload {
    payment_id:string;
    amount: number;
    payment_name: string;
    split_method: SplitMethod;
    split_map: SplitMap;
}



// SplitWay =  "payment" 送出資料
export interface CreatePaymentPayload {
    payment_name: string; 
    account_type: AccountType; // "personal" | "group"
    record_mode?: RecordMode ;    // "split" | "debt" 
    split_way?: SplitWay ;  // "item" | "person" 
    split_method?: SplitMethod ; // "percentage" | "actual" | "adjusted"
    owner:string;
    currency: string;
    amount: number;
    category_Id?: string;
    time: string;
    desc?: string;
    payer_map: PayerMap;
    split_map: SplitMap; // "splitByPersonMap" | "splitByItemMap"
    items?: CreateItemPayload[];
}

// paymentName : "rental"
// accountType: "group"
// recordMode : "split"
// splitWay : "item"
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
// items : [
//     {
//         amount :  100
//         paymentName : "beef"
//         splitMethod : "adjusted"
//         splitMap : {
//             4kjf39480fjlk : {fixed: 10, total: 39.997, percent: 0.3333}
//             92jf20fkk29jf : {fixed: 0, total: 29.997, percent: 0.3333}
//             fj30fj39d9s0d: {fixed: 0, total: 29.997, percent: 0.3333}
//         }
//     }
// ]



export interface GetPaymentData {
    id:string;
    payment_name: string; 
    account_type: AccountType; // "personal" | "group"
    record_mode?: RecordMode ;    // "split" | "debt" 
    split_way?: SplitWay ;  // "item" | "person" 
    split_method?: SplitMethod ; // "percentage" | "actual" | "adjusted"
    owner:string;
    currency: string;
    amount: number;
    category_Id?: string;
    time: string;
    desc?: string;
    payer_map: PayerMap;
    split_map: SplitMap; // "splitByPersonMap" | "splitByItemMap"
    items?: CreateItemPayload[];
}