import currency from 'currency.js';

export const formatCurrency = (value: number): string => {
  return currency(value, { symbol: '€', separator: ',', decimal: '.', precision: 2 }).format();
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(value);
};

export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatTimeAgo = (date: Date | string): string => {
  if (!date) return '';

  const diffInMs = Date.now() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) return `${diffInDays}d ago`;
  if (diffInHours > 0) return `${diffInHours}h ago`;
  if (diffInMinutes > 0) return `${diffInMinutes}m ago`;
  return 'just now';
};
