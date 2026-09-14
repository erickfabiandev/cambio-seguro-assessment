import { z } from 'zod'
import { SUPPORTED_CURRENCIES } from '../domain/entities/CurrencyCode'

export const amountFieldSchema = z
  .string()
  .trim()
  .min(1, 'Ingresa un monto.')
  .refine((value) => Number(value) > 0, 'El monto debe ser mayor a cero.')

export const currencyFieldSchema = z.enum(SUPPORTED_CURRENCIES, {
  errorMap: () => ({ message: 'Selecciona una moneda válida.' })
})

export type AmountFieldError = string | undefined