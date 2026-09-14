export const CONVERSION_FORM_CONFIG = {
  amount: {
    messages: {
      required: 'Ingresa un monto.',
      invalid: 'Ingresa solo números.',
      positive: 'El monto debe ser mayor a cero.',
      tooLarge: 'El monto es demasiado grande.',
    },
  },
  currency: {
    messages: {
      invalidFrom: 'Selecciona una moneda de origen válida.',
      invalidTo: 'Selecciona una moneda de destino válida.',
    },
  },
} as const