import { ConvertCurrency } from '@application/use-cases/ConvertCurrency';
import { HttpExchangeRateProvider } from '@infrastructure/http/HttpExchangeRateProvider';
import { DomainError } from '@domain/errors/DomainErrors';
import { SUPPORTED_CURRENCIES, type CurrencyCode } from '@domain/entities/CurrencyCode';
import { amountFieldSchema} from '@schemas/conversionForm.schema';
import { ExchangeRate } from '@domain/entities/ExchangeRate'
import type { RateTab } from '../components/RateTabs.vue'

export type RatesStatus = 'idle' | 'loading' | 'success' | 'error'
export type EditedField = 'origin' | 'destination'
const DEFAULT_ORIGIN_AMOUNT = '100'

export function useCurrencyConverter() {
  const config = useRuntimeConfig()
  const exchangeRateProvider = new HttpExchangeRateProvider(config.public.exchangeRateEndpoint)
  const convertCurrency = new ConvertCurrency()

  const from = ref<CurrencyCode>('USD')
  const to = ref<CurrencyCode>('PEN')

  const anchorFrom = ref<CurrencyCode>(from.value)
  const anchorTo = ref<CurrencyCode>(to.value)
  const compraRate = ref<number | null>(null)
  const ventaRate = ref<number | null>(null)

  const originAmount = ref(DEFAULT_ORIGIN_AMOUNT)
  const destinationAmount = ref('')
  const lastEdited = ref<EditedField>('origin')

  const ratesStatus = ref<RatesStatus>('idle')
  const ratesErrorMessage = ref<string | null>(null)

  const originFieldError = ref<string | undefined>(undefined)
  const destinationFieldError = ref<string | undefined>(undefined)

  const isLoadingRates = computed(() => ratesStatus.value === 'loading')
  const hasRatesError = computed(() => ratesStatus.value === 'error')


  const isCompraDirection = computed(() => from.value === anchorFrom.value)
  const activeTab = computed<RateTab>(() => (isCompraDirection.value ? 'compra' : 'venta'))

  const forwardRate = computed<number | null>(() => (isCompraDirection.value ? compraRate.value : ventaRate.value))
  const backwardRate = computed<number | null>(() => (isCompraDirection.value ? ventaRate.value : compraRate.value))

  const isReady = computed(() => from.value !== to.value && forwardRate.value !== null)

  function validateAmount(value: string): string | undefined {
    if (value.trim() === '') return undefined
    const parsed = amountFieldSchema.safeParse(value)
    return parsed.success ? undefined : parsed.error.issues[0]?.message
  }

  async function fetchRates() {
    anchorFrom.value = from.value
    anchorTo.value = to.value

    if (from.value === to.value) {
      compraRate.value = 1
      ventaRate.value = 1
      ratesStatus.value = 'success'
      ratesErrorMessage.value = null
      recalculate()
      return
    }

    ratesStatus.value = 'loading'
    ratesErrorMessage.value = null

    const [compraResult, ventaResult] = await Promise.allSettled([
      exchangeRateProvider.getRate(from.value, to.value),
      exchangeRateProvider.getRate(to.value, from.value)
    ])

    if (compraResult.status === 'fulfilled' && ventaResult.status === 'fulfilled') {
      compraRate.value = compraResult.value.rate
      ventaRate.value = ventaResult.value.rate
      ratesStatus.value = 'success'
      recalculate()
      return
    }

    compraRate.value = null
    ventaRate.value = null
    ratesStatus.value = 'error'
    const failure = compraResult.status === 'rejected' ? compraResult.reason : (ventaResult as PromiseRejectedResult).reason
    ratesErrorMessage.value =
      failure instanceof DomainError
        ? failure.message
        : 'No se pudo obtener el tipo de cambio. Intenta nuevamente más tarde.'
  }

  function recalculate() {
    if (forwardRate.value === null) return

    if (lastEdited.value === 'origin') {
      computeDestinationFromOrigin()
    } else {
      computeOriginFromDestination()
    }
  }

  function computeDestinationFromOrigin() {
    destinationFieldError.value = undefined
    if (originAmount.value.trim() === '') {
      destinationAmount.value = ''
      return
    }

    originFieldError.value = validateAmount(originAmount.value)
    if (originFieldError.value || forwardRate.value === null) {
      destinationAmount.value = ''
      return
    }

    try {
      const rate = ExchangeRate.create(from.value, to.value, forwardRate.value)
      const result = convertCurrency.execute({
        amount: Number(originAmount.value),
        from: from.value,
        to: to.value,
        rate
      })
      destinationAmount.value = result.output.amount.toFixed(2)
    } catch {
      destinationAmount.value = ''
    }
  }

  function computeOriginFromDestination() {
    originFieldError.value = undefined
    if (destinationAmount.value.trim() === '') {
      originAmount.value = ''
      return
    }

    destinationFieldError.value = validateAmount(destinationAmount.value)
    if (destinationFieldError.value || backwardRate.value === null) {
      originAmount.value = ''
      return
    }

    try {
      const rate = ExchangeRate.create(to.value, from.value, backwardRate.value)
      const result = convertCurrency.execute({
        amount: Number(destinationAmount.value),
        from: to.value,
        to: from.value,
        rate
      })
      originAmount.value = result.output.amount.toFixed(2)
    } catch {
      originAmount.value = ''
    }
  }

  function onOriginAmountInput(value: string) {
    originAmount.value = value
    lastEdited.value = 'origin'
    computeDestinationFromOrigin()
  }

  function onDestinationAmountInput(value: string) {
    destinationAmount.value = value
    lastEdited.value = 'destination'
    computeOriginFromDestination()
  }

  function swapCurrencies() {
    const previousFrom = from.value
    const previousOrigin = originAmount.value
    const previousDestination = destinationAmount.value

    from.value = to.value
    to.value = previousFrom

    originAmount.value = previousDestination
    destinationAmount.value = previousOrigin
    lastEdited.value = originAmount.value.trim() !== '' ? 'origin' : 'destination'

    recalculate()
  }

  function selectTab(tab: RateTab) {
    const alreadyThere = tab === activeTab.value
    if (!alreadyThere) {
      swapCurrencies()
    }
  }

  watch([from, to], () => {
    const isSamePairAsAnchor =
      (from.value === anchorFrom.value && to.value === anchorTo.value) ||
      (from.value === anchorTo.value && to.value === anchorFrom.value)

    if (isSamePairAsAnchor && compraRate.value !== null) return

    void fetchRates()
  }, { immediate: true })

  return {
    supportedCurrencies: SUPPORTED_CURRENCIES,
    from,
    to,
    originAmount,
    destinationAmount,
    originFieldError,
    destinationFieldError,
    activeTab,
    compraRate,
    ventaRate,
    isLoadingRates,
    hasRatesError,
    ratesErrorMessage,
    isReady,
    onOriginAmountInput,
    onDestinationAmountInput,
    selectTab,
    swapCurrencies,
    retryFetchRates: fetchRates
  }
}