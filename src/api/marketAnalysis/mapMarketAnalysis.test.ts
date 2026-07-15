import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getMessage } from '../../i18n/messages'
import {
  mapMarketAnalysisPayload,
  MarketAnalysisMappingError,
} from './mapMarketAnalysis'

const designPayload = {
  symbol: 'BTC/USDT',
  regime: {
    summary: 'Strong directional bid flow',
    level: 'TREND_UP',
  },
  risk: {
    summary: 'Moderate volatility pressure',
    level: 'moderate',
  },
  economic: {
    summary: 'Positive expected edge',
    level: 'favorable',
  },
  exposure: {
    summary: 'Capacity available for allocation',
    factors: [
      { name: 'vol_budget_pct', weight: 0.35 },
      { name: 'liquidity_cap_value', weight: 186197.09 },
    ],
  },
  recommendation: {
    catalogId: 'TREND_FOLLOWING',
    name: 'TREND_FOLLOWING',
    rationale: 'Preferred for TREND_UP with acceptable risk',
  },
}

const backendPayload = {
  symbol: 'ETH/USDT',
  regime: {
    regime: 'TREND_UP',
    reasons: ['adx_strong', 'plus_di_dominant'],
    insufficient_data: false,
  },
  risk: {
    score: 0.17,
    components: [
      ['atr_expansion', 0.0],
      ['liquidity_stress', 0.12],
    ],
    insufficient_data: false,
  },
  economic: {
    edge: 0.42,
    components: [
      ['activity', 0.88],
      ['cost_drag', 0.1],
    ],
    insufficient_data: false,
  },
  exposure: {
    symbol: 'ETH/USDT',
    total_value: 10000.0,
    exposure_pct: 0.0,
    allocated_value: 0.0,
    portfolio_exposure_pct: 0.0,
    available_capacity_pct: 1.0,
    symbol_weight_cap_pct: 0.35,
    recommended_allocation_pct: 0.35,
    recommended_allocation_value: 3500.0,
    components: {
      vol_budget_pct: 0.35,
      liquidity_cap_value: 1000.5,
    },
    insufficient_data: false,
  },
  catalog: {
    allowed_strategies: ['TREND_FOLLOWING'],
    forbidden_strategies: ['RANGE_BOUNDING'],
    preferred_strategy: 'TREND_FOLLOWING',
    catalog_reason: 'Allowed TREND_FOLLOWING for regime=TREND_UP',
    hard_gate_reason: null,
  },
}

describe('mapMarketAnalysisPayload', () => {
  it('maps a valid design-shaped payload with humanized strategy and factors', () => {
    const result = mapMarketAnalysisPayload(designPayload, 'BTC/USDT')

    expect(result).toEqual({
      symbol: 'BTC/USDT',
      regime: {
        summary: 'Strong directional bid flow',
        level: 'TREND_UP',
      },
      risk: {
        summary: 'Moderate volatility pressure',
        level: 'moderate',
      },
      economic: {
        summary: 'Positive expected edge',
        level: 'favorable',
      },
      exposure: {
        summary: 'Capacity available for allocation',
        factors: [
          {
            name: getMessage('analysisLabels.exposureFactor.vol_budget_pct'),
            weight: 0.35,
          },
          {
            name: getMessage(
              'analysisLabels.exposureFactor.liquidity_cap_value',
            ),
            weight: 186197.09,
          },
        ],
      },
      recommendation: {
        catalogId: getMessage('analysisLabels.strategy.TREND_FOLLOWING'),
        name: getMessage('analysisLabels.strategy.TREND_FOLLOWING'),
        rationale: 'Preferred for TREND_UP with acceptable risk',
      },
    })
  })

  it('maps a valid backend payload with humanized labels', () => {
    const result = mapMarketAnalysisPayload(backendPayload, 'ETH/USDT')

    expect(result.symbol).toBe('ETH/USDT')
    expect(result.regime).toEqual({
      level: getMessage('analysisLabels.regime.TREND_UP'),
      summary: [
        getMessage('analysisLabels.regimeReason.adx_strong'),
        getMessage('analysisLabels.regimeReason.plus_di_dominant'),
      ].join(', '),
    })
    expect(result.regime.level).not.toBe('TREND_UP')
    expect(result.regime.summary).not.toContain('adx_strong')
    expect(result.risk).toEqual({
      level: '0.17',
      summary: [
        `${getMessage('analysisLabels.riskComponent.atr_expansion')}=0`,
        `${getMessage('analysisLabels.riskComponent.liquidity_stress')}=0.12`,
      ].join(', '),
    })
    expect(result.economic).toEqual({
      level: '0.42',
      summary: [
        `${getMessage('analysisLabels.economicComponent.activity')}=0.88`,
        `${getMessage('analysisLabels.economicComponent.cost_drag')}=0.1`,
      ].join(', '),
    })
    expect(result.exposure).toEqual({
      summary: '0.35',
      factors: [
        {
          name: getMessage('analysisLabels.exposureFactor.vol_budget_pct'),
          weight: 0.35,
        },
        {
          name: getMessage(
            'analysisLabels.exposureFactor.liquidity_cap_value',
          ),
          weight: 1000.5,
        },
      ],
    })
    expect(result.recommendation).toEqual({
      catalogId: getMessage('analysisLabels.strategy.TREND_FOLLOWING'),
      name: getMessage('analysisLabels.strategy.TREND_FOLLOWING'),
      rationale: 'Allowed TREND_FOLLOWING for regime=TREND_UP',
    })
    expect(result.recommendation.catalogId).not.toBe('TREND_FOLLOWING')
    expect(result.exposure.factors[0].name).not.toBe('vol_budget_pct')
    expect(result.risk.summary).not.toContain('atr_expansion=')
  })

  it('falls back to raw codes for unknown regime label and reason without failing mapping', () => {
    const result = mapMarketAnalysisPayload(
      {
        ...backendPayload,
        regime: {
          regime: 'MYSTERY_REGIME',
          reasons: ['adx_strong', 'totally_unknown_reason'],
          insufficient_data: false,
        },
      },
      'ETH/USDT',
    )

    expect(result.regime.level).toBe('MYSTERY_REGIME')
    expect(result.regime.summary).toBe(
      [
        getMessage('analysisLabels.regimeReason.adx_strong'),
        'totally_unknown_reason',
      ].join(', '),
    )
    expect(result.risk.level).toBe('0.17')
    expect(result.recommendation.catalogId).toBe(
      getMessage('analysisLabels.strategy.TREND_FOLLOWING'),
    )
  })

  it('falls back to raw codes for unknown strategy, factors, and components', () => {
    const result = mapMarketAnalysisPayload(
      {
        ...backendPayload,
        risk: {
          score: 0.2,
          components: [
            ['atr_expansion', 0.1],
            ['mystery_risk_component', 0.5],
          ],
          insufficient_data: false,
        },
        economic: {
          edge: 0.3,
          components: [['unknown_econ', 0.9]],
          insufficient_data: false,
        },
        exposure: {
          ...backendPayload.exposure,
          components: {
            vol_budget_pct: 0.2,
            weird_factor: 1.5,
          },
        },
        catalog: {
          ...backendPayload.catalog,
          preferred_strategy: 'MYSTERY_STRATEGY',
        },
      },
      'ETH/USDT',
    )

    expect(result.recommendation.catalogId).toBe('MYSTERY_STRATEGY')
    expect(result.recommendation.name).toBe('MYSTERY_STRATEGY')
    expect(result.risk.summary).toBe(
      [
        `${getMessage('analysisLabels.riskComponent.atr_expansion')}=0.1`,
        'mystery_risk_component=0.5',
      ].join(', '),
    )
    expect(result.economic.summary).toBe('unknown_econ=0.9')
    expect(result.exposure.factors).toEqual([
      {
        name: getMessage('analysisLabels.exposureFactor.vol_budget_pct'),
        weight: 0.2,
      },
      { name: 'weird_factor', weight: 1.5 },
    ])
  })

  it('does not rewrite free-text catalog_reason through strategy catalogs', () => {
    const result = mapMarketAnalysisPayload(backendPayload, 'ETH/USDT')

    expect(result.recommendation.rationale).toBe(
      'Allowed TREND_FOLLOWING for regime=TREND_UP',
    )
  })

  it('treats an empty regime.reasons array as success with an empty summary', () => {
    const result = mapMarketAnalysisPayload(
      {
        ...backendPayload,
        regime: {
          regime: 'RANGE',
          reasons: [],
          insufficient_data: false,
        },
      },
      'ETH/USDT',
    )

    expect(result.regime.level).toBe(getMessage('analysisLabels.regime.RANGE'))
    expect(result.regime.summary).toBe('')
  })

  it('treats an empty exposure.factors array as success', () => {
    const result = mapMarketAnalysisPayload(
      {
        ...designPayload,
        exposure: { summary: 'No factors', factors: [] },
      },
      'BTC/USDT',
    )

    expect(result.exposure.factors).toEqual([])
    expect(result.exposure.summary).toBe('No factors')
  })

  it('fails closed on non-object payloads', () => {
    expect(() => mapMarketAnalysisPayload(null, 'BTC/USDT')).toThrow(
      MarketAnalysisMappingError,
    )
    expect(() => mapMarketAnalysisPayload('x', 'BTC/USDT')).toThrow(
      MarketAnalysisMappingError,
    )
  })

  it('fails closed when required design fields are missing or invalid', () => {
    expect(() =>
      mapMarketAnalysisPayload(
        {
          regime: { summary: 'a', level: 'b' },
          risk: { summary: 'a', level: 'b' },
          economic: { summary: 'a', level: 'b' },
          exposure: { summary: 'a', factors: [] },
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketAnalysisMappingError)

    expect(() =>
      mapMarketAnalysisPayload(
        {
          ...designPayload,
          regime: { summary: 'a' },
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketAnalysisMappingError)

    expect(() =>
      mapMarketAnalysisPayload(
        {
          ...designPayload,
          exposure: {
            summary: 'ok',
            factors: [{ name: 'x', weight: 'bad' }],
          },
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketAnalysisMappingError)
  })

  it('fails closed when backend fields are incomplete', () => {
    expect(() =>
      mapMarketAnalysisPayload(
        {
          symbol: 'BTC/USDT',
          catalog: {
            preferred_strategy: 'TREND_FOLLOWING',
            catalog_reason: 'reason',
          },
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketAnalysisMappingError)

    expect(() =>
      mapMarketAnalysisPayload(
        {
          ...backendPayload,
          regime: {
            regime: 'TREND_UP',
            reasons: [1],
          },
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketAnalysisMappingError)
  })

  it('does not hardcode analysis display English in the mapper source', () => {
    const source = readFileSync(
      resolve(import.meta.dirname, 'mapMarketAnalysis.ts'),
      'utf8',
    )
    const forbiddenDisplayPhrases = [
      'Trend up',
      'Trend down',
      'News spike',
      'Strong ADX',
      'Plus DI dominant',
      'Insufficient candles',
      'ADX in low band',
      'Trend following',
      'Vol budget %',
      'ATR expansion',
      'Liquidity stress',
      'Cost drag',
    ]
    for (const phrase of forbiddenDisplayPhrases) {
      expect(source, `mapper must not hardcode "${phrase}"`).not.toContain(
        `'${phrase}'`,
      )
      expect(source, `mapper must not hardcode "${phrase}"`).not.toContain(
        `"${phrase}"`,
      )
    }
  })
})
