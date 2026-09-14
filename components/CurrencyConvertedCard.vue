<script setup lang="ts">
import { cardStyles } from '../composables/useConverterTheme';

const {
  supportedCurrencies,
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
  swapCurrencies
} = useCurrencyConverter()

const isModalOpen = ref(false)

const canConfirm = computed(
  () =>
    isReady.value &&
    !hasRatesError.value &&
    originAmount.value.trim() !== '' &&
    destinationAmount.value.trim() !== '' &&
    !originFieldError.value &&
    !destinationFieldError.value
)

function onConfirm() {
  if (!canConfirm.value) return
  isModalOpen.value = true
}
</script>

<template>
  <section
    :class="cardStyles({ error: hasRatesError && !!ratesErrorMessage })"
    aria-labelledby="converter-heading"
  >
    <h1 id="converter-heading" class="sr-only">Conversor de monedas</h1>

    <RateTabs
      :model-value="activeTab"
      :compra-rate="compraRate"
      :venta-rate="ventaRate"
      :loading="isLoadingRates"
      @update:model-value="selectTab"
    />

    <div class="mt-6 flex flex-col gap-8">
      <div class="relative flex flex-col gap-3">
        <CurrencyRow
          role="origin"
          :currency="from"
          :currencies="supportedCurrencies"
          :model-value="originAmount"
          :disabled="isLoadingRates"
          :has-error="Boolean(originFieldError)"
          @update:currency="from = $event"
          @update:model-value="onOriginAmountInput"
        />

        <div class="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
          <SwapButton class="pointer-events-auto" :disabled="isLoadingRates" @swap="swapCurrencies" />
        </div>

        <CurrencyRow
          role="destination"
          :currency="to"
          :currencies="supportedCurrencies"
          :model-value="destinationAmount"
          :disabled="isLoadingRates"
          :has-error="Boolean(destinationFieldError)"
          @update:currency="to = $event"
          @update:model-value="onDestinationAmountInput"
        />

        <p v-if="destinationFieldError" class="px-1 text-sm text-danger-600">{{ destinationFieldError }}</p>
        <ErrorBanner v-if="hasRatesError && ratesErrorMessage" :message="ratesErrorMessage" />
      </div>

      <p v-if="originFieldError" class="-mt-2 px-1 text-sm text-danger-600">{{ originFieldError }}</p>

      <ConfirmButton @click="onConfirm" />
    </div>

    <ThankYouModal :open="isModalOpen" @close="isModalOpen = false" />
  </section>
</template>