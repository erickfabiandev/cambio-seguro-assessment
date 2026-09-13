import type { CurrencyCode } from './entities/CurrencyCode';
import type { ExchangeRate } from './entities/ExchangeRate';

export interface ExchangeRateProvider {
  getRate(from: CurrencyCode, to: CurrencyCode): Promise<ExchangeRate>;
}
