import { CURRENCY_MAP } from '@/constants/currencies';

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCY_MAP[currencyCode];
  if (!currency) return `${amount.toFixed(2)} ${currencyCode}`;

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback for environments without full Intl support
    const formatted = amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${formatted} ${currency.symbol}`;
  }
}
