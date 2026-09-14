import { Money } from '@domain/entities/Money';
import { ExchangeRate } from '@domain/entities/ExchangeRate';
import { isSupportedCurrency } from '@domain/entities/CurrencyCode';
import {UnsupportedCurrencyError, DomainError} from '@domain/errors/DomainErrors';
import type { ExchangeRateProvider } from '@domain/ports/ExchangeRateProvider';

export interface ConvertCurrencInput {
  from: string;
  to: string;
  amount: number;
  rate?: ExchangeRate;
}

export interface ConvertCurrencyResult {
  input: Money;
  output: Money;
  rate: ExchangeRate;
}

export class ConvertCurrency {
  execute(input: ConvertCurrencInput): ConvertCurrencyResult {
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

    if (!input.rate) {
      throw new DomainError('Se requiere una tasa de cambio para convertir entre monedas distintas.')
    }

    if (input.rate.from !== sourceMoney.currency || input.rate.to !== targetCurrency) {
      throw new DomainError('La tasa provista no corresponde al par de monedas solicitado.')
    }

    const convertedMoney = sourceMoney.withCurrency(targetCurrency, sourceMoney.amount * input.rate.rate)

    return { input: sourceMoney, output: convertedMoney, rate: input.rate }
  }
}