import { describe, expect, it } from 'vitest'
import { ConvertCurrency } from './ConvertCurrency'
import { ExchangeRate } from '@domain/entities/ExchangeRate'
import { InvalidAmountError, UnsupportedCurrencyError } from '@domain//errors/DomainErrors'

describe('ConvertCurrency', () => {
  const convertCurrency = new ConvertCurrency()

  it('convierte usando la tasa directa (compra: origen -> destino)', () => {
    const rate = ExchangeRate.create('USD', 'PEN', 3.48)
    const result = convertCurrency.execute({ amount: 100, from: 'USD', to: 'PEN', rate })

    expect(result.output.amount).toBeCloseTo(348, 5)
    expect(result.output.currency).toBe('PEN')
  })

  it('convierte usando una tasa invertida (venta: recalcular origen desde destino)', () => {
    const effectiveRate = 1 / 0.287
    const rate = ExchangeRate.create('USD', 'PEN', effectiveRate)
    const result = convertCurrency.execute({ amount: 100, from: 'USD', to: 'PEN', rate })

    expect(result.output.amount).toBeCloseTo(100 * effectiveRate, 5)
  })

  it('no requiere tasa cuando origen y destino son la misma moneda', () => {
    const result = convertCurrency.execute({ amount: 50, from: 'USD', to: 'USD' })

    expect(result.output.amount).toBe(50)
    expect(result.rate.rate).toBe(1)
  })

  it('lanza InvalidAmountError si el monto es <= 0', () => {
    const rate = ExchangeRate.create('USD', 'PEN', 3.48)
    expect(() => convertCurrency.execute({ amount: 0, from: 'USD', to: 'PEN', rate })).toThrow(InvalidAmountError)
  })

  it('lanza UnsupportedCurrencyError si la moneda destino no existe', () => {
    expect(() => convertCurrency.execute({ amount: 10, from: 'USD', to: 'XXX' })).toThrow(UnsupportedCurrencyError)
  })

  it('lanza si la tasa provista no corresponde al par solicitado', () => {
    const wrongRate = ExchangeRate.create('EUR', 'PEN', 4.08)
    expect(() => convertCurrency.execute({ amount: 10, from: 'USD', to: 'PEN', rate: wrongRate })).toThrow()
  })
})
