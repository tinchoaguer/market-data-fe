import {
  getAnalysisRegimeLabel,
  getAnalysisRegimeReasonLabel,
  getEconomicComponentLabel,
  getExposureFactorLabel,
  getRiskComponentLabel,
  getStrategyLabel,
} from '../../i18n/labels'
import { resolveUiMessages } from '../../content'
import type { MessageParams, MessageRef } from '../../content'
import type {
  Assessment,
  AssessmentComponent,
  ExposureFactor,
  MarketAnalysisApiPayload,
  MarketAnalysisBackendPayload,
  MarketAnalysisViewModel,
} from './types'

export class MarketAnalysisMappingError extends Error {
  constructor(message = 'Invalid market analysis payload') {
    super(message)
    this.name = 'MarketAnalysisMappingError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseString(value: unknown, field: string): string {
  if (typeof value !== 'string') {
    throw new MarketAnalysisMappingError(`Invalid string for ${field}`)
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
  throw new MarketAnalysisMappingError(`Invalid number for ${field}`)
}

/** Format a score/level number for Assessment display (2 decimal places). */
export function formatScoreDisplay(value: number): string {
  return value.toFixed(2)
}

/**
 * Format a factor/weight: ratios in [0, 1] as percent; otherwise fixed 2 decimals (locale-stable).
 */
export function formatFactorDisplay(value: number): string {
  if (value >= 0 && value <= 1) {
    return `${(value * 100).toFixed(0)}%`
  }
  return value.toFixed(2)
}

function parseMessageParams(
  value: unknown,
  field: string,
): MessageParams | undefined {
  if (value === undefined) {
    return undefined
  }
  if (!isRecord(value)) {
    throw new MarketAnalysisMappingError(`Invalid params at ${field}`)
  }
  const params: MessageParams = {}
  for (const [key, entry] of Object.entries(value)) {
    if (
      typeof entry !== 'string' &&
      typeof entry !== 'number' &&
      typeof entry !== 'boolean'
    ) {
      throw new MarketAnalysisMappingError(
        `Invalid param value at ${field}.${key}`,
      )
    }
    params[key] = entry
  }
  return params
}

/**
 * Accepts a MessageRef object or a bare string (v1 code or legacy free-text).
 * Resolves via Content boundary adapter; unknown codes / free-text fall back to the input string.
 */
function resolveNarrativeText(value: unknown, field: string): string {
  let ref: MessageRef

  if (typeof value === 'string') {
    ref = { code: value }
  } else if (isRecord(value) && typeof value.code === 'string') {
    ref = { code: value.code }
    const params = parseMessageParams(value.params, `${field}.params`)
    if (params !== undefined) {
      ref.params = params
    }
  } else {
    throw new MarketAnalysisMappingError(`Invalid narrative at ${field}`)
  }

  const [resolved] = resolveUiMessages([ref])
  return resolved!.text
}

/**
 * Resolves optional hard-gate narrative: null/undefined → null; MessageRef or string → Content text.
 */
function resolveOptionalNarrativeText(
  value: unknown,
  field: string,
): string | null {
  if (value === null || value === undefined) {
    return null
  }
  return resolveNarrativeText(value, field)
}

function parseAssessment(
  value: unknown,
  field: string,
): Assessment {
  if (!isRecord(value)) {
    throw new MarketAnalysisMappingError(`Invalid assessment at ${field}`)
  }
  return {
    summary: parseString(value.summary, `${field}.summary`),
    level: parseString(value.level, `${field}.level`),
  }
}

function parseFactor(value: unknown, field: string): ExposureFactor {
  if (!isRecord(value)) {
    throw new MarketAnalysisMappingError(`Invalid exposure factor at ${field}`)
  }
  const weight = parseNumber(value.weight, `${field}.weight`)
  return {
    name: getExposureFactorLabel(parseString(value.name, `${field}.name`)),
    weight,
    displayWeight: formatFactorDisplay(weight),
  }
}

function parseFactors(value: unknown, field: string): ExposureFactor[] {
  if (!Array.isArray(value)) {
    throw new MarketAnalysisMappingError(`Expected array at ${field}`)
  }
  return value.map((factor, index) => parseFactor(factor, `${field}[${index}]`))
}

function parseComponentPair(
  value: unknown,
  field: string,
  resolveName: (name: string) => string,
): AssessmentComponent {
  if (Array.isArray(value) && value.length >= 2) {
    const rawName = parseString(value[0], `${field}[0]`)
    const weight = parseNumber(value[1], `${field}[1]`)
    return {
      name: resolveName(rawName),
      value: weight,
      displayValue: formatFactorDisplay(weight),
    }
  }
  if (isRecord(value) && '0' in value && '1' in value) {
    const rawName = parseString(value[0], `${field}.0`)
    const weight = parseNumber(value[1], `${field}.1`)
    return {
      name: resolveName(rawName),
      value: weight,
      displayValue: formatFactorDisplay(weight),
    }
  }
  throw new MarketAnalysisMappingError(`Invalid component pair at ${field}`)
}

function parseComponents(
  value: unknown,
  field: string,
  resolveName: (name: string) => string,
): AssessmentComponent[] {
  if (!Array.isArray(value)) {
    throw new MarketAnalysisMappingError(`Expected array at ${field}`)
  }
  return value.map((entry, index) =>
    parseComponentPair(entry, `${field}[${index}]`, resolveName),
  )
}

function isBackendPayload(
  value: Record<string, unknown>,
): value is MarketAnalysisBackendPayload & Record<string, unknown> {
  return 'catalog' in value
}

function isDesignPayload(
  value: Record<string, unknown>,
): value is MarketAnalysisApiPayload & Record<string, unknown> {
  return 'recommendation' in value
}

function mapDesignPayload(
  payload: MarketAnalysisApiPayload,
  fallbackSymbol: string,
): MarketAnalysisViewModel {
  if (!isRecord(payload.exposure)) {
    throw new MarketAnalysisMappingError('Missing exposure')
  }
  if (!isRecord(payload.recommendation)) {
    throw new MarketAnalysisMappingError('Missing recommendation')
  }

  return {
    symbol:
      typeof payload.symbol === 'string' && payload.symbol.length > 0
        ? payload.symbol
        : fallbackSymbol,
    regime: parseAssessment(payload.regime, 'regime'),
    risk: parseAssessment(payload.risk, 'risk'),
    economic: parseAssessment(payload.economic, 'economic'),
    exposure: {
      summary: parseString(payload.exposure.summary, 'exposure.summary'),
      factors: parseFactors(payload.exposure.factors, 'exposure.factors'),
    },
    recommendation: {
      catalogId: getStrategyLabel(
        parseString(
          payload.recommendation.catalogId,
          'recommendation.catalogId',
        ),
      ),
      name: getStrategyLabel(
        parseString(payload.recommendation.name, 'recommendation.name'),
      ),
      rationale: resolveNarrativeText(
        payload.recommendation.rationale,
        'recommendation.rationale',
      ),
      hardGateReason: null,
    },
  }
}

function mapBackendExposure(
  value: unknown,
): MarketAnalysisViewModel['exposure'] {
  if (!isRecord(value)) {
    throw new MarketAnalysisMappingError('Invalid exposure')
  }
  if (!isRecord(value.components)) {
    throw new MarketAnalysisMappingError('Missing exposure.components')
  }

  const factors: ExposureFactor[] = Object.entries(value.components).map(
    ([name, weight]) => {
      const parsed = parseNumber(weight, `exposure.components.${name}`)
      return {
        name: getExposureFactorLabel(name),
        weight: parsed,
        displayWeight: formatFactorDisplay(parsed),
      }
    },
  )

  const allocation = parseNumber(
    value.recommended_allocation_pct ?? value.available_capacity_pct ?? 0,
    'exposure.recommended_allocation_pct',
  )

  return {
    summary: formatFactorDisplay(allocation),
    factors,
  }
}

function mapBackendPayload(
  payload: MarketAnalysisBackendPayload,
  fallbackSymbol: string,
): MarketAnalysisViewModel {
  if (!isRecord(payload.regime)) {
    throw new MarketAnalysisMappingError('Missing regime')
  }
  if (!isRecord(payload.risk)) {
    throw new MarketAnalysisMappingError('Missing risk')
  }
  if (!isRecord(payload.economic)) {
    throw new MarketAnalysisMappingError('Missing economic')
  }
  if (!isRecord(payload.catalog)) {
    throw new MarketAnalysisMappingError('Missing catalog')
  }

  const regimeReasons = payload.regime.reasons
  if (!Array.isArray(regimeReasons)) {
    throw new MarketAnalysisMappingError('Invalid regime.reasons')
  }
  const humanizedReasons = regimeReasons.map((reason, index) =>
    getAnalysisRegimeReasonLabel(
      parseString(reason, `regime.reasons[${index}]`),
    ),
  )

  const preferred = getStrategyLabel(
    parseString(payload.catalog.preferred_strategy, 'catalog.preferred_strategy'),
  )

  const rationale = resolveNarrativeText(
    payload.catalog.catalog_reason,
    'catalog.catalog_reason',
  )
  const hardGateReason = resolveOptionalNarrativeText(
    payload.catalog.hard_gate_reason,
    'catalog.hard_gate_reason',
  )

  const riskScore = parseNumber(payload.risk.score, 'risk.score')
  const economicEdge = parseNumber(payload.economic.edge, 'economic.edge')
  const riskComponents = parseComponents(
    payload.risk.components,
    'risk.components',
    getRiskComponentLabel,
  )
  const economicComponents = parseComponents(
    payload.economic.components,
    'economic.components',
    getEconomicComponentLabel,
  )

  return {
    symbol:
      typeof payload.symbol === 'string' && payload.symbol.length > 0
        ? payload.symbol
        : fallbackSymbol,
    regime: {
      level: getAnalysisRegimeLabel(
        parseString(payload.regime.regime, 'regime.regime'),
      ),
      summary: humanizedReasons.join(', '),
    },
    risk: {
      level: formatScoreDisplay(riskScore),
      summary: '',
      components: riskComponents,
    },
    economic: {
      level: formatScoreDisplay(economicEdge),
      summary: '',
      components: economicComponents,
    },
    exposure: mapBackendExposure(payload.exposure),
    recommendation: {
      catalogId: preferred,
      name: preferred,
      rationale,
      hardGateReason,
    },
  }
}

/**
 * Maps a JSON market-analysis payload to the screen view model.
 * Accepts the design success shape or the backend HTTP DTO; fails closed otherwise.
 */
export function mapMarketAnalysisPayload(
  payload: unknown,
  fallbackSymbol: string,
): MarketAnalysisViewModel {
  if (!isRecord(payload)) {
    throw new MarketAnalysisMappingError('Payload must be an object')
  }

  if (isBackendPayload(payload)) {
    return mapBackendPayload(
      payload as MarketAnalysisBackendPayload,
      fallbackSymbol,
    )
  }

  if (isDesignPayload(payload)) {
    return mapDesignPayload(payload as MarketAnalysisApiPayload, fallbackSymbol)
  }

  throw new MarketAnalysisMappingError('Unrecognized market analysis payload shape')
}
