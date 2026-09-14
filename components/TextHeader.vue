<script setup lang="ts">
import { textHeaderStyles } from '../composables/useConverterTheme'

const { content, title, subtitle } = textHeaderStyles()
</script>

<template>
  <section
    :class="content()"
    aria-labelledby="text-heading"
  >
    <h1
      id="text-heading"
      :class="title()"
    >
      El mejor <br> tipo de cambio
    </h1>

    <p :class="subtitle()">
      para cambiar dólares y soles online en Perú
    </p>
  </section>
</template>