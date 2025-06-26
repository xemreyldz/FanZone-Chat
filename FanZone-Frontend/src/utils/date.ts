export const formatDateForChat = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);

  const isToday = now.toDateString() === date.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  if (isToday) return "Bugün";
  if (isYesterday) return "Dün";

  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};