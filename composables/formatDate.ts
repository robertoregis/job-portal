export const formatDate = (dateObj: Date, type: any) => {
  if (!(dateObj instanceof Date)) {
    return null; // ou lance erro, se preferir
  }

  const pad = (n: any) => n.toString().padStart(2, '0');

  const day = pad(dateObj.getDate());
  const month = pad(dateObj.getMonth() + 1);
  const year = dateObj.getFullYear();

  const hours = pad(dateObj.getHours());
  const minutes = pad(dateObj.getMinutes());

  switch(type) {
    case 1:
      // DD/MM/YYYY
      return `${day}/${month}/${year}`;
    case 2:
      // HH:MM
      return `${hours}:${minutes}`;
    case 3:
      // HH:MM - DD/MM/YYYY
      return `${hours}:${minutes} - ${day}/${month}/${year}`;
    default:
      return null; // tipo inválido
  }
}

export const formatDateTimestamp = (dateStr: string, type: any) => {
  const dateObj = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(dateObj.getDate());
  const month = pad(dateObj.getMonth() + 1);
  const year = dateObj.getFullYear();

  const hours = pad(dateObj.getHours());
  const minutes = pad(dateObj.getMinutes());

  switch (type) {
    case 1: return `${day}/${month}/${year}`; // DD/MM/YYYY
    case 2: return `${hours}:${minutes}`; // HH:MM
    case 3: return `${hours}:${minutes} - ${day}/${month}/${year}`; // HH:MM - DD/MM/YYYY
    default: return null;
  }
}
