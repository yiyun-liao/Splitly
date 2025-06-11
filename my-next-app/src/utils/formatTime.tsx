export function formatToDatetimeLocal(datetime: string): string {
    const date = new Date(datetime);
    const pad = (n: number) => n.toString().padStart(2, "0");
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // month is 0-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
// 把 ISO key 再格式化成要顯示的 zh-TW
export function formatDate(input: string | Date): string {
    const date = typeof input === 'string' ? new Date(input) : input;
    return date.toLocaleDateString('zh-TW', {
      year:   'numeric',
      month:  '2-digit',
      day:    '2-digit',
    });
}