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
  