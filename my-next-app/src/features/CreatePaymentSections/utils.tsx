// 資料處理邏輯
// 放置任何純資料處理邏輯，如排序、過濾等等

export function formatPercent(p: number): string {
    return `${(p * 100).toFixed(2)}%`;
}
// 0.3333-> 33.33%

export function parsePercentToInt(p: number): string {
    return (p * 100).toFixed(2);
}
// 0.3333 → 33.33


export function formatNumber(p: number): string {
    return `${p.toFixed(2)}`;
}
// 33.3333 -> 33.33

export function formatNumberForData(p: number): string {
    return `${p.toFixed(6)}`;
}
// 33.3333333333 -> 33.3333

export function parsePercentToDecimal(p: number): number {
    return parseFloat((p / 100).toFixed(6));
  }

// 33.33 -> 0.3333