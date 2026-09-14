import { z } from 'zod';
import { SUPPORTED_CURRENCY } from '@domain/entities/CurrencyCode';
import { CONVERSION_FORM_CONFIG } from './conversionForm.config';
import { MONEY_CONFIG } from '@domain/config/money.config';

export const conversionFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, CONVERSION_FORM_CONFIG.amount.messages.required)
    .refine(
      (val: string) => !Number.isNaN(Number(val)),
      CONVERSION_FORM_CONFIG.amount.messages.invalid,
    )
    .refine(
      (val: string) => Number(val) > 0,
      CONVERSION_FORM_CONFIG.amount.messages.positive,
    )
    .refine(
      (val: string) => Number(val) <= MONEY_CONFIG.MAX_SAFE_AMOUNT,
      CONVERSION_FORM_CONFIG.amount.messages.tooLarge,
    ),
  from: z.enum(SUPPORTED_CURRENCY, { errorMap: () => ({ message: CONVERSION_FORM_CONFIG.currency.messages.invalidFrom }) }),
  to: z.enum(SUPPORTED_CURRENCY, { errorMap: () => ({ message: CONVERSION_FORM_CONFIG.currency.messages.invalidTo }) }),
});

export type ConversionFormInput = z.infer<typeof conversionFormSchema>;

export type ConversionFormFieldErrors = Partial<Record<keyof ConversionFormInput, string>>;