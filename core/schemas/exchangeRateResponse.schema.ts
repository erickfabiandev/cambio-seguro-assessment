import { z } from 'zod';

export const exchangeRateResponseSchema = z.object({
  rate: z.number({ invalid_type_error: 'El campo "rate" no es numérico.' }).positive({ message: 'El campo "rate" debe ser mayor a cero.' })
});

export type ExchangeRateResponse = z.infer<typeof exchangeRateResponseSchema>;

export const apiErrorSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
  statusCode: z.number().optional(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;