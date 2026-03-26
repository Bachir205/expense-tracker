export const CATEGORIES = [
  { value: 'Food',          label: 'Food',          emoji: '🍔', color: '#E85D24' },
  { value: 'Transport',     label: 'Transport',     emoji: '🚗', color: '#3B8BD4' },
  { value: 'Housing',       label: 'Housing',       emoji: '🏠', color: '#7F77DD' },
  { value: 'Entertainment', label: 'Entertainment', emoji: '🎬', color: '#D4537E' },
  { value: 'Health',        label: 'Health',        emoji: '💊', color: '#1D9E75' },
  { value: 'Shopping',      label: 'Shopping',      emoji: '🛍️', color: '#BA7517' },
  { value: 'Education',     label: 'Education',     emoji: '📚', color: '#534AB7' },
  { value: 'Travel',        label: 'Travel',        emoji: '✈️', color: '#0F6E56' },
  { value: 'Other',         label: 'Other',         emoji: '📦', color: '#5F5E5A' },
];

export const CURRENCIES = [
  { value: 'USD', symbol: '$' },
  { value: 'EUR', symbol: '€' },
  { value: 'GBP', symbol: '£' },
  { value: 'JPY', symbol: '¥' },
  { value: 'XOF', symbol: 'CFA' },
  { value: 'CAD', symbol: 'CA$' },
  { value: 'AUD', symbol: 'A$' },
];

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export const getCategoryMeta = (value) =>
  CATEGORIES.find(c => c.value === value) || CATEGORIES[CATEGORIES.length - 1];

export const formatCurrency = (amount, currency = 'USD') => {
  const sym = CURRENCIES.find(c => c.value === currency)?.symbol || '$';
  return `${sym}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
