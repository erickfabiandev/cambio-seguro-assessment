import type { CurrencyCode } from './CurrencyCode';

export class ExchangeRate {
  private constructor(
    public readonly from: CurrencyCode,
    public readonly to: CurrencyCode,
    public readonly rate: number,
    public readonly fetchedAt: Date,
  ){}

  static create(from: CurrencyCode, to: CurrencyCode, rate: number, fetchedAt: Date = new Date()): ExchangeRate {
    return new ExchangeRate(from, to, rate, fetchedAt);
  }

  static identity(currency: CurrencyCode): ExchangeRate {
    return new ExchangeRate(currency, currency, 1, new Date());
  }
}