type MoneyILS = number;
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
