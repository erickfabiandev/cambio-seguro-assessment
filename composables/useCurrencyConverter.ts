export interface ExchangeRateResponse {
  rate: number
}

export function useCurrencyConverter() {
  const result = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function convert(
    amount: number,
    from: string,
    to: string
  ) {
    // TODO:
    // Implementar la conversión.
  }

  return {
    result,
    loading,
    error,
    convert
  }
}