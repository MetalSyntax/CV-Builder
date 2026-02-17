export const formatDate = (dateStr: string, format: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthName = monthNames[date.getMonth()];

  switch (format) {
    case 'MM/YYYY': return `${month}/${year}`;
    case 'YYYY-MM': return `${year}-${month}`;
    case 'MMM YYYY': return `${monthName} ${year}`;
    case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
    default: return `${month}/${year}`;
  }
};
