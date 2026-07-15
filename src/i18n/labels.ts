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

/** Human-readable AnalysisRegimeLabel from the analysis locale catalog. */
export function getAnalysisRegimeLabel(code: string): string {
  return resolveLabel(ANALYSIS_REGIME_PREFIX, code)
}

/** Human-readable AnalysisRegimeReasonCode from the analysis locale catalog. */
export function getAnalysisRegimeReasonLabel(code: string): string {
  return resolveLabel(ANALYSIS_REGIME_REASON_PREFIX, code)
}
