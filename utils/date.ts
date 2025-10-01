export function formatPersianDate(date: string | number | Date) {
    
const newDate = new Date(date)
return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
}).format(newDate)

}