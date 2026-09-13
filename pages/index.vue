<script setup lang="ts">
const amount = ref(100)
const fromCurrency = ref('USD')
const toCurrency = ref('PEN')

const result = ref<number | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const currencies = [
  { code: 'USD', name: 'Dólar estadounidense' },
  { code: 'PEN', name: 'Sol peruano' },
  { code: 'EUR', name: 'Euro' }
]

async function convertCurrency() {
  // TODO:
  // 1. Validar el monto
  // 2. Obtener el tipo de cambio
  // 3. Calcular el resultado
  // 4. Manejar loading y errores
}
</script>

<template>
  <section class="mx-auto max-w-xl">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900">
        Conversor de monedas
      </h2>

      <p class="mt-2 text-gray-600">
        Consulta el tipo de cambio y realiza una conversión.
      </p>
    </div>

    <div class="rounded-xl bg-white p-6 shadow-sm">
      <div class="space-y-5">

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Monto
          </label>

          <input
            v-model.number="amount"
            type="number"
            min="0"
            class="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            De
          </label>

          <select
            v-model="fromCurrency"
            class="w-full rounded-lg border px-4 py-3"
          >
            <option
              v-for="currency in currencies"
              :key="currency.code"
              :value="currency.code"
            >
              {{ currency.code }} — {{ currency.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            A
          </label>

          <select
            v-model="toCurrency"
            class="w-full rounded-lg border px-4 py-3"
          >
            <option
              v-for="currency in currencies"
              :key="currency.code"
              :value="currency.code"
            >
              {{ currency.code }} — {{ currency.name }}
            </option>
          </select>
        </div>

        <button
          class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
          @click="convertCurrency"
        >
          Convertir
        </button>

        <div
          v-if="loading"
          class="rounded-lg bg-gray-100 p-4 text-center"
        >
          Consultando tipo de cambio...
        </div>

        <div
          v-if="error"
          class="rounded-lg bg-red-50 p-4 text-red-700"
        >
          {{ error }}
        </div>

        <div
          v-if="result !== null"
          class="rounded-lg bg-green-50 p-4"
        >
          <p class="text-sm text-gray-600">
            Resultado
          </p>

          <p class="text-2xl font-bold text-gray-900">
            {{ result.toFixed(2) }} {{ toCurrency }}
          </p>
        </div>

      </div>
    </div>
  </section>
</template>