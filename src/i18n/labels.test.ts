import { describe, expect, it } from 'vitest'
import { getMessage } from './messages'
import {
  getAnalysisRegimeLabel,
  getAnalysisRegimeReasonLabel,
  resolveLabel,
} from './labels'

/** OpenAPI AnalysisRegimeLabel closed set (shared/openapi.json). */
const ANALYSIS_REGIME_LABELS = [
  'TREND_UP',
  'TREND_DOWN',
  'RANGE',
  'CHAOTIC',
  'NEWS_SPIKE',
] as const

/** OpenAPI AnalysisRegimeReasonCode closed set (shared/openapi.json). */
const ANALYSIS_REGIME_REASON_CODES = [
  'insufficient_candles',
  'adx_low_band',
  'default',
  'abnormal_range_or_body',
  'relative_volume_spike',
  'relative_trades_spike',
  'volatility_expansion',
  'low_adx_high_atr',
  'frequent_direction_changes',
  'sma_whipsaw',
  'adx_strong',
  'plus_di_dominant',
  'minus_di_dominant',
  'hh_hl_structure',
  'lh_ll_structure',
  'above_sma_rising',
  'below_sma_falling',
  'taker_buy_flow',
  'taker_sell_flow',
] as const

describe('resolveLabel', () => {
  it('returns catalog text for a known prefix + code', () => {
    expect(resolveLabel('analysisLabels.regime', 'TREND_UP')).toBe(
      getMessage('analysisLabels.regime.TREND_UP'),
    )
  })

  it('returns the raw code when the catalog key is missing', () => {
    expect(resolveLabel('analysisLabels.regime', 'NOT_A_REAL_REGIME')).toBe(
      'NOT_A_REAL_REGIME',
    )
  })
})

describe('getAnalysisRegimeLabel', () => {
  it.each(ANALYSIS_REGIME_LABELS)(
    'resolves OpenAPI AnalysisRegimeLabel %s via the locale catalog',
    (code) => {
      expect(getAnalysisRegimeLabel(code)).toBe(
        getMessage(`analysisLabels.regime.${code}`),
      )
      expect(getAnalysisRegimeLabel(code)).not.toBe(code)
    },
  )

  it('falls back to the raw code for an unknown regime label', () => {
    expect(getAnalysisRegimeLabel('UNKNOWN_REGIME')).toBe('UNKNOWN_REGIME')
  })
})

describe('getAnalysisRegimeReasonLabel', () => {
  it.each(ANALYSIS_REGIME_REASON_CODES)(
    'resolves OpenAPI AnalysisRegimeReasonCode %s via the locale catalog',
    (code) => {
      expect(getAnalysisRegimeReasonLabel(code)).toBe(
        getMessage(`analysisLabels.regimeReason.${code}`),
      )
      expect(getAnalysisRegimeReasonLabel(code)).not.toBe(code)
    },
  )

  it('falls back to the raw code for an unknown reason code', () => {
    expect(getAnalysisRegimeReasonLabel('not_a_documented_reason')).toBe(
      'not_a_documented_reason',
    )
  })
})

describe('analysisLabels locale catalog completeness', () => {
  it('includes every OpenAPI AnalysisRegimeLabel member', () => {
    for (const code of ANALYSIS_REGIME_LABELS) {
      expect(getMessage(`analysisLabels.regime.${code}`).length).toBeGreaterThan(
        0,
      )
    }
  })

  it('includes every OpenAPI AnalysisRegimeReasonCode member', () => {
    for (const code of ANALYSIS_REGIME_REASON_CODES) {
      expect(
        getMessage(`analysisLabels.regimeReason.${code}`).length,
      ).toBeGreaterThan(0)
    }
  })
})
