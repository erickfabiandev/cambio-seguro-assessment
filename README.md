# Cambio Seguro — Conversor de monedas

Reto técnico: completar la funcionalidad de conversión de monedas sobre el
proyecto proporcionado (Nuxt 3 + un server route de tipo de cambio ya
existente), respetando el diseño de referencia y agregando estados de
carga, validación y manejo de errores.

## Stack

- **Nuxt 3** (Vue 3, TypeScript estricto)
- **Tailwind CSS** + **tailwind-variants** (estilos centralizados, ver
  [Theming](#theming))
- **Zod** para validación de datos (formulario y respuesta de la API)
- **Vitest** + **@vue/test-utils** para tests
- **Docker** multi-stage para producción

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm test           # corre toda la suite una vez
npm run test:watch # modo watch
npm run typecheck  # chequeo de tipos con vue-tsc
npm run build      # build de producción -> .output/
```

### Con Docker

```bash
docker compose up --build
# o directo:
docker build -t cambio-seguro-assessment .
docker run -p 3000:3000 cambio-seguro-assessment
```

La imagen final solo contiene `.output` (Nitro empaqueta sus propias
dependencias de runtime ahí dentro) — no lleva `node_modules` del proyecto
ni el código fuente. Corre como usuario sin privilegios (`nuxt`), no como
root.

## Arquitectura

El código de negocio vive en `core/`, separado en tres capas con
inversión de dependencias (hexagonal, sin la ceremonia completa de un
puerto por cada cosa — para el tamaño de este dominio, un puerto único
alcanza y sobra):

```
core/
├── domain/              
│   ├── entities/         
│   ├── errors/            
│   └── ports/              
│
├── application/
│   └── use-cases/
│       └── ConvertCurrency.ts 
│
├── infrastructure/
│   └── http/
│       └── HttpExchangeRateProvider.ts  
│
└── schemas/ 
```

La capa de **presentación** (el adaptador *driving*, en términos
hexagonales) son `composables/`, `components/` y `pages/` en la raíz —
viven ahí y no dentro de `core/` porque estas sí están, por definición,
acopladas al framework (Vue: `ref`, `computed`, SFC), y porque Nuxt las
auto-importa por convención desde esas carpetas. Forzarlas a vivir en
otro lado no compraría ninguna pureza extra.

`composables/useCurrencyConverter.ts` es el corazón de esta capa: cablea
`HttpExchangeRateProvider` + `ConvertCurrency` a estado reactivo
(loading/error/montos) y contiene la única lógica de negocio que sí es
específica de esta UI en particular.

### Por qué el server route no cambió de lógica

Se conservan los datos originales del reto (`server/api/exchange-rate.get.ts`),
solo se le agregó validación de query params con Zod y tipado explícito
de la respuesta. Aunque el endpoint viva junto, el cliente lo trata
como una fuente no confiable (puede devolver 400, un payload con forma
distinta, etc.) — de ahí el schema de validación en
`core/schemas/exchangeRateResponse.schema.ts`.

## Theming

Todos los estilos de Tailwind pasan por `composables/useConverterTheme.ts`
usando `tailwind-variants` — ningún componente tiene clases de color o
variantes de estado sueltas en su template. Para un tema oscuro o marca
blanca, ese es el único archivo que habría que tocar.

## Estructura de carpetas

```
core/                  dominio + aplicación + infraestructura (ver arriba)
composables/            adaptador de UI: useCurrencyConverter, useConverterTheme,
                         useAmountSanitizer
components/              CurrencyConverterCard, CurrencyRow, RateTabs, SwapButton,
                          ConfirmButton, ErrorBanner, ThankYouModal, icons/
pages/                   index.vue
server/api/               exchange-rate.get.ts (dato original del reto + Zod)
assets/css/               main.css (Tailwind + fuente Rubik self-hosted vía
                          @fontsource, sin dependencia de red en runtime)
```

