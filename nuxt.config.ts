export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  components: [{ path: '~/components', pathPrefix: false }],
  typescript: {
    strict: true,
    typeCheck: false
  },
  app: {
    head: {
      title: 'Conversor de Monedas - Reto CS',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Conversor de monedas CS' }
      ]
    }
  },
  css: [
    '@fontsource/rubik/400.css',
    '@fontsource/rubik/500.css',
    '@fontsource/rubik/600.css',
    '@fontsource/rubik/700.css',
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      exchangeRateEndpoint: '/api/exchange-rate'
    }
  }
})