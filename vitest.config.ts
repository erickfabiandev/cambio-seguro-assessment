import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@domain': fileURLToPath(new URL('./core/domain', import.meta.url)),
      '@application': fileURLToPath(new URL('./core/application', import.meta.url)),
      '@infrastructure': fileURLToPath(new URL('./core/infrastructure', import.meta.url)),
      '@schemas': fileURLToPath(new URL('./core/schemas', import.meta.url))
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true
  }
})