export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidAmountError extends DomainError {
  constructor(reason: 'not_a_number' | 'not_positive' | 'too_large') {
    const message: Record<typeof reason, string> = {
      not_a_number: 'El monto ingresado no es un número válido.',
      not_positive: 'El monto debe ser mayor a cero.',
      too_large: 'El monto ingresado es demasiado grande para convertir.'
    }
    super(message[reason]);
  }
}

export class UnsupportedCurrencyError extends DomainError {
  constructor(currency: string) {
    super(`La moneda ${currency} no esta soportada.`);
  }
}

export class UnsupportedCurrencyPairError extends DomainError {
  constructor(from: string, to: string) {
    super(`La conversión de ${from} a ${to} no esta soportada.`);
  }
}

export class ExchangeRateUnavailableError extends DomainError {
  constructor(cause?: unknown) {
    super('No se pudo obtener el tipo de cambio en este momento. Intenta nuevamente.')
    if (cause instanceof Error) this.cause = cause
  }
}

export class InvalidExchangeRateResponseError extends DomainError {
  constructor(){
    super('El servicio de tipo de cambio devolvió una respuesta inesperada.')
  }
}