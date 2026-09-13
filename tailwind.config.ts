import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './composables/**/*.{js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './core/**/*.{vue,js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4A28AF',
          secondary: '#6E46E6'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F3F3F6',
          muted: '#F1F1F1'
        },
        ink: {
          DEFAULT: '#3D3D67',
          soft: '#717191',
          accent: '#2F00FF'
        },
        danger: {
          50: '#FEF2F2',
          500: '#DC2626',
          600: '#B91C1C'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 20px 45px -20px rgba(51, 32, 120, 0.35)'
      },
      borderRadius: {
        card: '1.75rem',
        pill: '9999px'
      }
    }
  },
  plugins: []
}