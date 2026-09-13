import { Money } from '@domain/entities/Money';
import { ExchangeRate } from '@domain/entities/ExchangeRate';
import { isSupportedCurrency } from '@domain/entities/CurrencyCode';
import {UnsupportedCurrencyError} from '@domain/errors/DomainErrors';
import type { ExchangeRateProvider } from '@domain/ports/ExchangeRateProvider';

export interface ConvertCurrencInput {
  from: string;
  to: string;
  amount: number;
}

export interface ConvertCurrencyResult {
  input: Money;
  output: Money;
  rate: ExchangeRate;
}

export class ConvertCurrency {
  constructor(private readonly exchangeRateProvider: ExchangeRateProvider) {}

  async execute(input: ConvertCurrencInput): Promise<ConvertCurrencyResult> {
    if (!isSupportedCurrency(input.to)) {
      throw new UnsupportedCurrencyError(input.to);
    }

    const sourceMoney = Money.create(input.amount, input.from);
    const targetCurrency = input.to;

    if (sourceMoney.currency === targetCurrency) {
      const itentityRate = ExchangeRate.identity(sourceMoney.currency);
      return {
        input: sourceMoney,
        output: sourceMoney,
        rate: itentityRate,
      };
    }

    const rate = await this.exchangeRateProvider.getRate(sourceMoney.currency, targetCurrency);
    const convertedMoney = sourceMoney.withCurrency(targetCurrency, sourceMoney.amount * rate.rate);

    return {
      input: sourceMoney,
      output: convertedMoney,
      rate,
    };
  }
}