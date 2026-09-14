<script setup lang="ts">
defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="thank-you-title"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-xs rounded-card bg-surface p-6 text-center shadow-card">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-pill bg-brand-50 text-brand-600">
          <IconCheck class="h-6 w-6" />
        </div>
        <h2 id="thank-you-title" class="mt-4 text-lg font-semibold text-ink">¡Gracias por tu operación!</h2>
        <p class="mt-1 text-sm text-ink-soft">
          Registramos tu solicitud de conversión. Nos pondremos en contacto contigo para continuar.
        </p>
        <button
          type="button"
          class="mt-5 w-full rounded-2xl bg-brand-600 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
          @click="emit('close')"
        >
          Entendido
        </button>
      </div>
    </div>
  </Teleport>
</template>
