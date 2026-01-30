type MoneyILS = number;
type ISODateTime = string;

/**
 * Formats a number as ILS currency (₪)
 */
export const currencyILS = (amount: MoneyILS): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats an ISO string into a localized readable date and time
 */
export const formatDateTime = (iso: ISODateTime): string => {
  if (!iso) return 'N/A';
  return new Intl.DateTimeFormat('he-IL', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso));
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
