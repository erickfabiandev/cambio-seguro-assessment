export default defineEventHandler((event) => {
  const query = getQuery(event)

  const from = String(query.from || '')
  const to = String(query.to || '')

  const rates: Record<string, number> = {
    'USD-PEN': 3.48,
    'PEN-USD': 0.287,
    'USD-EUR': 0.85,
    'EUR-USD': 1.17,
    'PEN-EUR': 0.245,
    'EUR-PEN': 4.08
  }

  if (from === to) {
    return {
      rate: 1
    }
  }

  const rate = rates[`${from}-${to}`]

  if (!rate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Currency pair not supported'
    })
  }

  return {
    rate
  }
})