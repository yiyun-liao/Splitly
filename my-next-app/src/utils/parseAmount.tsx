
// input 數字只多小數點後兩位，當空值設定為 0
export function sanitizeDecimalInput(input: string): number {
    const sanitized = input.replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2');
    return sanitized === "" ? 0 : parseFloat(sanitized);
}