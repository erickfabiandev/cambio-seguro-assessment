export const SUPPORTED_CURRENCY = [ 'PEN', 'USD', 'EUR' ] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCY)[number];

export function isSupportedCurrency(value: string): value is CurrencyCode {
  return (SUPPORTED_CURRENCY as readonly string[]).includes(value);
}

export const CURRENCY_METADATA: Record<CurrencyCode, {label: string, symbol: string}> = {
  PEN: { label: 'Soles', symbol: 'S/' },
  USD: { label: 'Dólares', symbol: '$' },
  EUR: { label: 'Euros', symbol: '€' }
}