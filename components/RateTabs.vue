<script setup lang="ts">
import { tabsStyles } from '../composables/useConverterTheme';
export type RateTab = 'compra' | 'venta'

const props = defineProps<{
  modelValue: RateTab
  compraRate: number | null
  ventaRate: number | null
  loading: boolean
}>();

const emit = defineEmits<{ 'update:modelValue': [value: RateTab] }>();

const { list, tab: tabSlot, label, value } = tabsStyles();

function formatRate(rate: number | null): string {
  if (rate === null) return '—'
  return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(rate)
}

function select(tab: RateTab) {
  emit('update:modelValue', tab)
}
</script>

<template>
  <div :class="list()" role="tablist" aria-label="Tipo de cambio">
    <button
      v-for="tab in (['compra', 'venta'] as const)"
      :key="tab"
      type="button"
      role="tab"
      :aria-selected="modelValue === tab"
      :class="tabSlot({ active: modelValue === tab })"
      @click="select(tab)"
    >
      <span
        :class="label()"
      >
        {{ tab === 'compra' ? 'Dólar compra' : 'Dólar venta' }}
      </span>
      <span
        :class="value()"
      >
        <span v-if="loading" class="inline-block h-5 w-16 animate-pulse rounded bg-surface-border align-middle" />
        <template v-else>{{ formatRate(tab === 'compra' ? compraRate : ventaRate) }}</template>
      </span>
    </button>
  </div>
</template>
