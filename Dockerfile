# syntax=docker/dockerfile:experimental

#DEPS
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

#BUILD
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

#RUNTIME
FROM node:22-alpine AS runtime
WORKDIR /app

# Usuario sin privilegios — no corras el server como root.
RUN addgroup -S nuxt && adduser -S nuxt -G nuxt
COPY --from=build --chown=nuxt:nuxt /app/.output ./.output
USER nuxt

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/exchange-rate?from=USD&to=PEN').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
