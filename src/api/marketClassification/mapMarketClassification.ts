import { resolveUiMessages } from '../../content'
import type { MessageParams, MessageRef } from '../../content'
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
  if (typeof value === 'string') {
    return value
  }
  throw new MarketClassificationMappingError(`Invalid string for ${field}`)
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

function parseMessageParams(
  value: unknown,
  field: string,
): MessageParams | undefined {
  if (value === undefined) {
    return undefined
  }
  if (!isRecord(value)) {
    throw new MarketClassificationMappingError(`Invalid params at ${field}`)
  }
  const params: MessageParams = {}
  for (const [key, entry] of Object.entries(value)) {
    if (
      typeof entry !== 'string' &&
      typeof entry !== 'number' &&
      typeof entry !== 'boolean'
    ) {
      throw new MarketClassificationMappingError(
        `Invalid param value at ${field}.${key}`,
      )
    }
    params[key] = entry
  }
  return params
}

/**
 * Normalizes a wire reason (bare code string or MessageRef object) to MessageRef.
 */
function parseReasonRef(value: unknown, field: string): MessageRef {
  if (typeof value === 'string') {
    return { code: value }
  }
  if (!isRecord(value) || typeof value.code !== 'string') {
    throw new MarketClassificationMappingError(`Invalid reason at ${field}`)
  }
  const ref: MessageRef = { code: value.code }
  const params = parseMessageParams(value.params, `${field}.params`)
  if (params !== undefined) {
    ref.params = params
  }
  return ref
}

function resolveReasonText(value: unknown, field: string): string {
  const ref = parseReasonRef(value, field)
  const [resolved] = resolveUiMessages([ref])
  return resolved!.text
}

function parseSignal(value: unknown, field: string): ClassificationSignal {
  if (!isRecord(value)) {
    throw new MarketClassificationMappingError(`Invalid signal at ${field}`)
  }
  return {
    source: parseString(value.source, `${field}.source`),
    score: parseNumber(value.score, `${field}.score`),
    reason: resolveReasonText(value.reason, `${field}.reason`),
  }
}

function parseSignalArray(
  value: unknown,
  field: string,
): ClassificationSignal[] {
  if (!Array.isArray(value)) {
    throw new MarketClassificationMappingError(`Expected array at ${field}`)
  }
  return value.map((signal, index) =>
    parseSignal(signal, `${field}[${index}]`),
  )
}

/**
 * Maps a JSON market-classification payload to the screen view model.
 * Fails closed on missing groups, wrong types, or incomplete signals.
 * Signal reasons (MessageRef or raw v1 codes) resolve via Content boundary adapter.
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
