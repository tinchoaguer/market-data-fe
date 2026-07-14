import type {
  ClassificationSignal,
  MarketClassificationViewModel,
} from './types'

export class MarketClassificationMappingError extends Error {
  constructor(message = 'Invalid market classification payload') {
    super(message)
    this.name = 'MarketClassificationMappingError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseString(value: unknown, field: string): string {
  if (typeof value !== 'string') {
    throw new MarketClassificationMappingError(`Invalid string for ${field}`)
  }
  return value
}

function parseNumber(value: unknown, field: string): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  throw new MarketClassificationMappingError(`Invalid number for ${field}`)
}

function parseSignal(value: unknown, field: string): ClassificationSignal {
  if (!isRecord(value)) {
    throw new MarketClassificationMappingError(`Invalid signal at ${field}`)
  }
  return {
    source: parseString(value.source, `${field}.source`),
    score: parseNumber(value.score, `${field}.score`),
    reason: parseString(value.reason, `${field}.reason`),
  }
}

function parseSignalArray(value: unknown, field: string): ClassificationSignal[] {
  if (!Array.isArray(value)) {
    throw new MarketClassificationMappingError(`Expected array at ${field}`)
  }
  return value.map((signal, index) => parseSignal(signal, `${field}[${index}]`))
}

/**
 * Maps a JSON market-classification payload to the screen view model.
 * Fails closed on missing groups, wrong types, or incomplete signals.
 */
export function mapMarketClassificationPayload(
  payload: unknown,
  fallbackSymbol: string,
): MarketClassificationViewModel {
  if (!isRecord(payload)) {
    throw new MarketClassificationMappingError('Payload must be an object')
  }

  if (
    !('regime' in payload) ||
    !('risk' in payload) ||
    !('economic' in payload) ||
    !('exposure' in payload)
  ) {
    throw new MarketClassificationMappingError(
      'Missing required classification signal groups',
    )
  }

  return {
    symbol:
      typeof payload.symbol === 'string' && payload.symbol.length > 0
        ? payload.symbol
        : fallbackSymbol,
    regime: parseSignalArray(payload.regime, 'regime'),
    risk: parseSignalArray(payload.risk, 'risk'),
    economic: parseSignalArray(payload.economic, 'economic'),
    exposure: parseSignalArray(payload.exposure, 'exposure'),
  }
}
