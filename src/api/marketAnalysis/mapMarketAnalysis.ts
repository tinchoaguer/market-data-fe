import {
  getAnalysisRegimeLabel,
  getAnalysisRegimeReasonLabel,
  getEconomicComponentLabel,
  getExposureFactorLabel,
  getRiskComponentLabel,
  getStrategyLabel,
} from '../../i18n/labels'
import type {
  Assessment,
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
  return {
    name: getExposureFactorLabel(parseString(value.name, `${field}.name`)),
    weight: parseNumber(value.weight, `${field}.weight`),
  }
}

function parseFactors(value: unknown, field: string): ExposureFactor[] {
  if (!Array.isArray(value)) {
    throw new MarketAnalysisMappingError(`Expected array at ${field}`)
  }
  return value.map((factor, index) => parseFactor(factor, `${field}[${index}]`))
}

function formatComponentPair(
  value: unknown,
  field: string,
  resolveName: (name: string) => string,
): string {
  if (Array.isArray(value) && value.length >= 2) {
    const name = resolveName(parseString(value[0], `${field}[0]`))
    const weight = parseNumber(value[1], `${field}[1]`)
    return `${name}=${weight}`
  }
  if (isRecord(value) && '0' in value && '1' in value) {
    const name = resolveName(parseString(value[0], `${field}.0`))
    const weight = parseNumber(value[1], `${field}.1`)
    return `${name}=${weight}`
  }
  throw new MarketAnalysisMappingError(`Invalid component pair at ${field}`)
}

function formatComponentsSummary(
  value: unknown,
  field: string,
  resolveName: (name: string) => string,
): string {
  if (!Array.isArray(value)) {
    throw new MarketAnalysisMappingError(`Expected array at ${field}`)
  }
  return value
    .map((entry, index) =>
      formatComponentPair(entry, `${field}[${index}]`, resolveName),
    )
    .join(', ')
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
      rationale: parseString(
        payload.recommendation.rationale,
        'recommendation.rationale',
      ),
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
    ([name, weight]) => ({
      name: getExposureFactorLabel(name),
      weight: parseNumber(weight, `exposure.components.${name}`),
    }),
  )

  const allocation = parseNumber(
    value.recommended_allocation_pct ?? value.available_capacity_pct ?? 0,
    'exposure.recommended_allocation_pct',
  )

  return {
    summary: String(allocation),
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
      level: String(parseNumber(payload.risk.score, 'risk.score')),
      summary: formatComponentsSummary(
        payload.risk.components,
        'risk.components',
        getRiskComponentLabel,
      ),
    },
    economic: {
      level: String(parseNumber(payload.economic.edge, 'economic.edge')),
      summary: formatComponentsSummary(
        payload.economic.components,
        'economic.components',
        getEconomicComponentLabel,
      ),
    },
    exposure: mapBackendExposure(payload.exposure),
    recommendation: {
      catalogId: preferred,
      name: preferred,
      rationale: parseString(
        payload.catalog.catalog_reason,
        'catalog.catalog_reason',
      ),
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
