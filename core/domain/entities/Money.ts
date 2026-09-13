import { type CurrencyCode, isSupportedCurrency } from './CurrencyCode';
import { InvalidAmountError, UnsupportedCurrencyError } from '../errors/DomainErrors';

const MAX_SAFE_AMOUNT = 1_000_000_000;

export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: CurrencyCode
  ){}

  static create(rawAmount: number, rawCurrency: string): Money {
    if (!isSupportedCurrency(rawCurrency)) {
      throw new UnsupportedCurrencyError(rawCurrency);
    }

    if (typeof rawAmount !== 'number' || isNaN(rawAmount) || !Number.isFinite(rawAmount)) {
      throw new InvalidAmountError('not_a_number');
    }

    if (rawAmount <= 0) {
      throw new InvalidAmountError('not_positive');
    }

    if (rawAmount > MAX_SAFE_AMOUNT) {
      throw new InvalidAmountError('too_large');
    }

    return new Money(rawAmount, rawCurrency);
  }

  convertedAt(rate: number): Money {
    return new Money(this.amount * rate, this.currency);
  }

  withCurrency(currency: CurrencyCode, amount: number): Money {
    return Money.create(amount, currency);
  }

  format(): string {
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(this.amount);
  }
}