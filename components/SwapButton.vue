<script setup lang="ts">
import { swapButtonStyles } from '../composables/useConverterTheme'

defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ swap: [] }>()
</script>

<template>
  <button
    type="button"
    :class="swapButtonStyles()"
    :disabled="disabled"
    aria-label="Intercambiar moneda de origen y destino"
    @click="emit('swap')"
  >
    <IconSwap />
  </button>
</template>