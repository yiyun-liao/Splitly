// 型別定義

export interface SplitDetail {
    fixed: number;
    percent: number;
    total: number;
    inputValue?: string; // 只用於輸入中
}

export type PayerMap = Record<string, number>;
// {4kjf39480fjlk: 500, 92jf20fkk29jf: 500}

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
