<script setup lang="ts">
import { bannerStyles } from '../composables/useConverterTheme'

defineProps<{ message: string }>()
</script>

<template>
  <div role="alert" :class="bannerStyles({ tone: 'error' })">
    <IconAlert />
    <span>{{ message }}</span>
  </div>
</template>