import { z } from 'zod';
import { SUPPORTED_CURRENCIES } from '@domain/entities/CurrencyCode';

const RATES: Record<string, number> = {
  'USD-PEN': 3.48,
  'PEN-USD': 0.287,
  'USD-EUR': 0.85,
  'EUR-USD': 1.17,
  'PEN-EUR': 0.245,
  'EUR-PEN': 4.08,
};

const querySchema = z.object({
  from: z.enum(SUPPORTED_CURRENCIES),
  to: z.enum(SUPPORTED_CURRENCIES)
});

export interface ExchangeRateApiResponse {
  rate: number;
};


export default defineEventHandler((event): ExchangeRateApiResponse => {
  const parsedQuery = querySchema.safeParse(getQuery(event));

  if (!parsedQuery.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing currency codes',
    });
  }

  const { from, to } = parsedQuery.data;

  if (from === to) {
    return { rate: 1 };
  }

  const rateKey = `${from}-${to}`;
  const rate = RATES[rateKey];

  if (!rate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Currency pair not supported'
    });
  }

  return { rate };
})