import { describe, expect, it } from 'vitest'
import { getMessage } from './messages'
import {
  getAnalysisRegimeLabel,
  getAnalysisRegimeReasonLabel,
  getClassificationEconomicReasonLabel,
  getClassificationExposureReasonLabel,
  getClassificationRegimeReasonLabel,
  getClassificationRiskReasonLabel,
  getEconomicComponentLabel,
  getExposureFactorLabel,
  getRiskComponentLabel,
  getStrategyLabel,
  resolveLabel,
} from './labels'

/** Closed set: AnalysisRegimeLabel (API OpenAPI / analysis contract). */
const ANALYSIS_REGIME_LABELS = [
  'TREND_UP',
  'TREND_DOWN',
  'RANGE',
  'CHAOTIC',
  'NEWS_SPIKE',
] as const

/** Closed set: AnalysisRegimeReasonCode (API OpenAPI / analysis contract). */
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

/** OpenAPI RegimeReasonCode closed set. */
const CLASSIFICATION_REGIME_REASONS = [
  'trend_up',
  'trend_down',
  'range',
  'chaotic',
  'news_spike',
] as const

/** OpenAPI RiskReasonCode closed set. */
const CLASSIFICATION_RISK_REASONS = [
  'low_risk',
  'moderate_risk',
  'elevated_risk',
  'high_risk',
] as const

/** OpenAPI EconomicReasonCode closed set. */
const CLASSIFICATION_ECONOMIC_REASONS = [
  'strong_edge',
  'moderate_edge',
  'neutral_edge',
  'negative_edge',
] as const

/** OpenAPI ExposureReasonCode closed set. */
const CLASSIFICATION_EXPOSURE_REASONS = [
  'ample_capacity',
  'limited_capacity',
  'constrained_capacity',
] as const

/** Backend StrategyType closed set. */
const STRATEGY_TOKENS = [
  'TREND_FOLLOWING',
  'RANGE_BOUNDING',
  'PING_PONG',
  'NEWS_TRADING',
  'OTHER',
] as const

/** ExposureComponentsResponse factor keys. */
const EXPOSURE_FACTORS = ['vol_budget_pct', 'liquidity_cap_value'] as const

/** Analysis risk component names used in summaries. */
const RISK_COMPONENTS = [
  'volatility',
  'atr_expansion',
  'regime',
  'liquidity_stress',
] as const

/** Analysis economic component names used in summaries. */
const ECONOMIC_COMPONENTS = [
  'microstructure',
  'activity',
  'range_economics',
  'cost_drag',
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

describe('getClassificationRegimeReasonLabel', () => {
  it.each(CLASSIFICATION_REGIME_REASONS)(
    'resolves OpenAPI RegimeReasonCode %s via the locale catalog',
    (code) => {
      expect(getClassificationRegimeReasonLabel(code)).toBe(
        getMessage(`classificationLabels.regimeReason.${code}`),
      )
      expect(getClassificationRegimeReasonLabel(code)).not.toBe(code)
    },
  )

  it('falls back to the raw code for an unknown regime reason', () => {
    expect(getClassificationRegimeReasonLabel('unknown_regime_reason')).toBe(
      'unknown_regime_reason',
    )
  })
})

describe('getClassificationRiskReasonLabel', () => {
  it.each(CLASSIFICATION_RISK_REASONS)(
    'resolves OpenAPI RiskReasonCode %s via the locale catalog',
    (code) => {
      expect(getClassificationRiskReasonLabel(code)).toBe(
        getMessage(`classificationLabels.riskReason.${code}`),
      )
      expect(getClassificationRiskReasonLabel(code)).not.toBe(code)
    },
  )

  it('falls back to the raw code for an unknown risk reason', () => {
    expect(getClassificationRiskReasonLabel('unknown_risk_reason')).toBe(
      'unknown_risk_reason',
    )
  })
})

describe('getClassificationEconomicReasonLabel', () => {
  it.each(CLASSIFICATION_ECONOMIC_REASONS)(
    'resolves OpenAPI EconomicReasonCode %s via the locale catalog',
    (code) => {
      expect(getClassificationEconomicReasonLabel(code)).toBe(
        getMessage(`classificationLabels.economicReason.${code}`),
      )
      expect(getClassificationEconomicReasonLabel(code)).not.toBe(code)
    },
  )

  it('falls back to the raw code for an unknown economic reason', () => {
    expect(
      getClassificationEconomicReasonLabel('unknown_economic_reason'),
    ).toBe('unknown_economic_reason')
  })
})

describe('getClassificationExposureReasonLabel', () => {
  it.each(CLASSIFICATION_EXPOSURE_REASONS)(
    'resolves OpenAPI ExposureReasonCode %s via the locale catalog',
    (code) => {
      expect(getClassificationExposureReasonLabel(code)).toBe(
        getMessage(`classificationLabels.exposureReason.${code}`),
      )
      expect(getClassificationExposureReasonLabel(code)).not.toBe(code)
    },
  )

  it('falls back to the raw code for an unknown exposure reason', () => {
    expect(
      getClassificationExposureReasonLabel('unknown_exposure_reason'),
    ).toBe('unknown_exposure_reason')
  })
})

describe('getStrategyLabel', () => {
  it.each(STRATEGY_TOKENS)(
    'resolves StrategyType token %s via the locale catalog',
    (code) => {
      expect(getStrategyLabel(code)).toBe(
        getMessage(`analysisLabels.strategy.${code}`),
      )
      expect(getStrategyLabel(code)).not.toBe(code)
    },
  )

  it('falls back to the raw code for an unknown strategy token', () => {
    expect(getStrategyLabel('UNKNOWN_STRATEGY')).toBe('UNKNOWN_STRATEGY')
  })
})

describe('getExposureFactorLabel', () => {
  it.each(EXPOSURE_FACTORS)(
    'resolves exposure factor key %s via the locale catalog',
    (code) => {
      expect(getExposureFactorLabel(code)).toBe(
        getMessage(`analysisLabels.exposureFactor.${code}`),
      )
      expect(getExposureFactorLabel(code)).not.toBe(code)
    },
  )

  it('falls back to the raw key for an unknown exposure factor', () => {
    expect(getExposureFactorLabel('unknown_factor')).toBe('unknown_factor')
  })
})

describe('getRiskComponentLabel', () => {
  it.each(RISK_COMPONENTS)(
    'resolves risk component name %s via the locale catalog',
    (code) => {
      expect(getRiskComponentLabel(code)).toBe(
        getMessage(`analysisLabels.riskComponent.${code}`),
      )
      expect(getRiskComponentLabel(code)).not.toBe(code)
    },
  )

  it('falls back to the raw name for an unknown risk component', () => {
    expect(getRiskComponentLabel('unknown_risk_component')).toBe(
      'unknown_risk_component',
    )
  })
})

describe('getEconomicComponentLabel', () => {
  it.each(ECONOMIC_COMPONENTS)(
    'resolves economic component name %s via the locale catalog',
    (code) => {
      expect(getEconomicComponentLabel(code)).toBe(
        getMessage(`analysisLabels.economicComponent.${code}`),
      )
      expect(getEconomicComponentLabel(code)).not.toBe(code)
    },
  )

  it('falls back to the raw name for an unknown economic component', () => {
    expect(getEconomicComponentLabel('unknown_economic_component')).toBe(
      'unknown_economic_component',
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

  it('includes every StrategyType token', () => {
    for (const code of STRATEGY_TOKENS) {
      expect(
        getMessage(`analysisLabels.strategy.${code}`).length,
      ).toBeGreaterThan(0)
    }
  })

  it('includes every exposure factor key', () => {
    for (const code of EXPOSURE_FACTORS) {
      expect(
        getMessage(`analysisLabels.exposureFactor.${code}`).length,
      ).toBeGreaterThan(0)
    }
  })

  it('includes every risk component name', () => {
    for (const code of RISK_COMPONENTS) {
      expect(
        getMessage(`analysisLabels.riskComponent.${code}`).length,
      ).toBeGreaterThan(0)
    }
  })

  it('includes every economic component name', () => {
    for (const code of ECONOMIC_COMPONENTS) {
      expect(
        getMessage(`analysisLabels.economicComponent.${code}`).length,
      ).toBeGreaterThan(0)
    }
  })
})

describe('classificationLabels locale catalog completeness', () => {
  it('includes every OpenAPI RegimeReasonCode member', () => {
    for (const code of CLASSIFICATION_REGIME_REASONS) {
      expect(
        getMessage(`classificationLabels.regimeReason.${code}`).length,
      ).toBeGreaterThan(0)
    }
  })

  it('includes every OpenAPI RiskReasonCode member', () => {
    for (const code of CLASSIFICATION_RISK_REASONS) {
      expect(
        getMessage(`classificationLabels.riskReason.${code}`).length,
      ).toBeGreaterThan(0)
    }
  })

  it('includes every OpenAPI EconomicReasonCode member', () => {
    for (const code of CLASSIFICATION_ECONOMIC_REASONS) {
      expect(
        getMessage(`classificationLabels.economicReason.${code}`).length,
      ).toBeGreaterThan(0)
    }
  })

  it('includes every OpenAPI ExposureReasonCode member', () => {
    for (const code of CLASSIFICATION_EXPOSURE_REASONS) {
      expect(
        getMessage(`classificationLabels.exposureReason.${code}`).length,
      ).toBeGreaterThan(0)
    }
  })
})
