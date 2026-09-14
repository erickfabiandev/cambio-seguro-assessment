<script setup lang="ts">
import { CURRENCY_METADATA, type CurrencyCode } from '../core/domain/entities/CurrencyCode'
import { currencyRowStyles } from '../composables/useConverterTheme'
import { sanitizeAmountInput } from '../composables/useAmountSanitizer'

const props = defineProps<{
  role: 'origin' | 'destination'
  currency: CurrencyCode
  currencies: readonly CurrencyCode[]
  modelValue: string
  disabled?: boolean
  hasError?: boolean
}>()

const emit = defineEmits<{
  'update:currency': [value: CurrencyCode]
  'update:modelValue': [value: string]
}>()

const roleLabel = computed(() => (props.role === 'origin' ? 'Envías' : 'Recibes'))
const labelCurrencyId = computed(() => `currency-${props.role}`)
const inputId = computed(() => `amount-${props.role}`)

const { base, currencyZone, amountZone } = currencyRowStyles()


function onAmountInput(event: Event) {
  const target = event.target as HTMLInputElement
  const sanitized = sanitizeAmountInput(target.value)
  target.value = sanitized
  emit('update:modelValue', sanitized)
}
</script>

<template>
  <div :class="base({ state: hasError ? 'error' : 'idle' })">
    <p :id="labelCurrencyId" :class="currencyZone({ role })">
      <span class="sr-only">Moneda ({{ roleLabel.toLowerCase() }})</span>
      <span>{{ CURRENCY_METADATA[currency].label }}</span>
    </p>

    <div :class="amountZone()">
      <label :for="inputId" class="text-xs text-ink-soft">{{ roleLabel }}</label>
      <div class="flex items-baseline gap-1">
        <span class="text-base text-ink">{{ CURRENCY_METADATA[currency].symbol }}</span>
        <input
          :id="inputId"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          placeholder="0"
          :value="modelValue"
          :disabled="disabled"
          :aria-invalid="hasError"
          class="w-full min-w-0 bg-transparent text-right text-base text-ink tabular-nums outline-none placeholder:text-ink disabled:cursor-not-allowed"
          @input="onAmountInput"
        />
      </div>
    </div>
  </div>
</template>