import { getMessage } from './messages'

/**
 * Resolves an API code to display text from a locale catalog prefix.
 * On missing/empty catalog entries, returns the raw code (safe fallback).
 */
export function resolveLabel(catalogPrefix: string, code: string): string {
  try {
    const value = getMessage(`${catalogPrefix}.${code}`)
    if (value.trim() === '') {
      return code
    }
    return value
  } catch {
    return code
  }
}

const ANALYSIS_REGIME_PREFIX = 'analysisLabels.regime'
const ANALYSIS_REGIME_REASON_PREFIX = 'analysisLabels.regimeReason'
const ANALYSIS_STRATEGY_PREFIX = 'analysisLabels.strategy'
const ANALYSIS_EXPOSURE_FACTOR_PREFIX = 'analysisLabels.exposureFactor'
const ANALYSIS_RISK_COMPONENT_PREFIX = 'analysisLabels.riskComponent'
const ANALYSIS_ECONOMIC_COMPONENT_PREFIX = 'analysisLabels.economicComponent'

const CLASSIFICATION_REGIME_REASON_PREFIX = 'classificationLabels.regimeReason'
const CLASSIFICATION_RISK_REASON_PREFIX = 'classificationLabels.riskReason'
const CLASSIFICATION_ECONOMIC_REASON_PREFIX =
  'classificationLabels.economicReason'
const CLASSIFICATION_EXPOSURE_REASON_PREFIX =
  'classificationLabels.exposureReason'

/** Human-readable AnalysisRegimeLabel from the analysis locale catalog. */
export function getAnalysisRegimeLabel(code: string): string {
  return resolveLabel(ANALYSIS_REGIME_PREFIX, code)
}

/** Human-readable AnalysisRegimeReasonCode from the analysis locale catalog. */
export function getAnalysisRegimeReasonLabel(code: string): string {
  return resolveLabel(ANALYSIS_REGIME_REASON_PREFIX, code)
}

/** Human-readable StrategyType token from the analysis locale catalog. */
export function getStrategyLabel(code: string): string {
  return resolveLabel(ANALYSIS_STRATEGY_PREFIX, code)
}

/** Human-readable exposure factor key from the analysis locale catalog. */
export function getExposureFactorLabel(code: string): string {
  return resolveLabel(ANALYSIS_EXPOSURE_FACTOR_PREFIX, code)
}

/** Human-readable risk component name from the analysis locale catalog. */
export function getRiskComponentLabel(code: string): string {
  return resolveLabel(ANALYSIS_RISK_COMPONENT_PREFIX, code)
}

/** Human-readable economic component name from the analysis locale catalog. */
export function getEconomicComponentLabel(code: string): string {
  return resolveLabel(ANALYSIS_ECONOMIC_COMPONENT_PREFIX, code)
}

/** Human-readable RegimeReasonCode from the classification locale catalog. */
export function getClassificationRegimeReasonLabel(code: string): string {
  return resolveLabel(CLASSIFICATION_REGIME_REASON_PREFIX, code)
}

/** Human-readable RiskReasonCode from the classification locale catalog. */
export function getClassificationRiskReasonLabel(code: string): string {
  return resolveLabel(CLASSIFICATION_RISK_REASON_PREFIX, code)
}

/** Human-readable EconomicReasonCode from the classification locale catalog. */
export function getClassificationEconomicReasonLabel(code: string): string {
  return resolveLabel(CLASSIFICATION_ECONOMIC_REASON_PREFIX, code)
}

/** Human-readable ExposureReasonCode from the classification locale catalog. */
export function getClassificationExposureReasonLabel(code: string): string {
  return resolveLabel(CLASSIFICATION_EXPOSURE_REASON_PREFIX, code)
}
