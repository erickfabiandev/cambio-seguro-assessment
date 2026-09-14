<script setup lang="ts">
defineProps<{}>()
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    class="w-full rounded-md border bg-brand-secondary transition-colors px-4 py-2 text-white text-base hover:bg-brand-700"
    @click="emit('click')"
  >
    Iniciar operación
  </button>
</template>