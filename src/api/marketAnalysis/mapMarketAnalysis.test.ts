import { describe, expect, it } from 'vitest'
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
    name: 'Trend following',
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
  it('maps a valid design-shaped payload to the view model', () => {
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
          { name: 'vol_budget_pct', weight: 0.35 },
          { name: 'liquidity_cap_value', weight: 186197.09 },
        ],
      },
      recommendation: {
        catalogId: 'TREND_FOLLOWING',
        name: 'Trend following',
        rationale: 'Preferred for TREND_UP with acceptable risk',
      },
    })
  })

  it('maps a valid backend payload to the view model', () => {
    const result = mapMarketAnalysisPayload(backendPayload, 'ETH/USDT')

    expect(result.symbol).toBe('ETH/USDT')
    expect(result.regime).toEqual({
      level: 'TREND_UP',
      summary: 'adx_strong, plus_di_dominant',
    })
    expect(result.risk).toEqual({
      level: '0.17',
      summary: 'atr_expansion=0, liquidity_stress=0.12',
    })
    expect(result.economic).toEqual({
      level: '0.42',
      summary: 'activity=0.88, cost_drag=0.1',
    })
    expect(result.exposure).toEqual({
      summary: '0.35',
      factors: [
        { name: 'vol_budget_pct', weight: 0.35 },
        { name: 'liquidity_cap_value', weight: 1000.5 },
      ],
    })
    expect(result.recommendation).toEqual({
      catalogId: 'TREND_FOLLOWING',
      name: 'TREND_FOLLOWING',
      rationale: 'Allowed TREND_FOLLOWING for regime=TREND_UP',
    })
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
})
