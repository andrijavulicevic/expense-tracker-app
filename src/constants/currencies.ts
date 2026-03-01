export interface Currency {
  code: string;
  symbol: string;
  label: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'RSD', symbol: 'RSD', label: 'Serbian Dinar (RSD)', locale: 'sr-RS' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)', locale: 'de-DE' },
  { code: 'USD', symbol: '$', label: 'US Dollar (USD)', locale: 'en-US' },
];

export const CURRENCY_MAP = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c])
) as Record<string, Currency>;
