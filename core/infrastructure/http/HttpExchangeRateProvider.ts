import type { FetchError } from 'ofetch';
import type { CurrencyCode } from '@domain/entities/CurrencyCode';
import  { ExchangeRate } from '@domain/entities/ExchangeRate';
import type { ExchangeRateProvider } from '@domain/ports/ExchangeRateProvider';
import { UnsupportedCurrencyPairError, ExchangeRateUnavailableError, InvalidExchangeRateResponseError } from '@domain/errors/DomainErrors';
import { exchangeRateResponseSchema } from '@schemas/exchangeRateResponse.schema';

export class HttpExchangeRateProvider implements ExchangeRateProvider {
  constructor(private readonly apiUrl: string = '/api/exchange-rate') {}

  async getRate(from: CurrencyCode, to: CurrencyCode): Promise<ExchangeRate> {
    let rawResponse: unknown;

    try {
      rawResponse = await $fetch(this.apiUrl, {
        method: 'GET',
        params: { from, to },
      });
    } catch (error) {
      throw this.mapFetchError(error, from, to);
    }

    const parsedResponse = exchangeRateResponseSchema.safeParse(rawResponse);

    if (!parsedResponse.success) {
      throw new InvalidExchangeRateResponseError();
    }

    return ExchangeRate.create(from, to, parsedResponse.data.rate);
  }

  private mapFetchError(error: unknown, from: CurrencyCode, to: CurrencyCode): Error {
    const fetchError = error as Partial<FetchError>;

    if (fetchError?.response?.status === 400) {
      return new UnsupportedCurrencyPairError(from, to);
    }

    return new ExchangeRateUnavailableError(error);
  }
}