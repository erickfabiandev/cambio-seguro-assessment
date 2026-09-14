import { MONEY_CONFIG } from '@domain/config/money.config';

export function sanitizeAmountInput(raw: string, previousValue = ''): string {
  const digitsAndDot = raw.replace(/[^\d.]/g, '')

  const firstDotIndex = digitsAndDot.indexOf('.')
  const withSingleDot =
    firstDotIndex === -1
      ? digitsAndDot
      : digitsAndDot.slice(0, firstDotIndex + 1) + digitsAndDot.slice(firstDotIndex + 1).replace(/\./g, '')

  const [integerPart, decimalPart] = withSingleDot.split('.')
  const truncatedInteger = (integerPart ?? '').slice(0, MONEY_CONFIG.MAX_INTEGER_DIGITS)

  const candidate = decimalPart === undefined ? truncatedInteger : `${truncatedInteger}.${decimalPart.slice(0, MONEY_CONFIG.MAX_DECIMAL_DIGITS)}`

  if (candidate !== '' && candidate !== '.' && Number(candidate) > MONEY_CONFIG.MAX_SAFE_AMOUNT) {
    return previousValue
  }

  return candidate
}