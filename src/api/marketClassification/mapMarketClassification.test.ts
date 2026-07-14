import { describe, expect, it } from 'vitest'
import {
  mapMarketClassificationPayload,
  MarketClassificationMappingError,
} from './mapMarketClassification'

const validPayload = {
  symbol: 'BTC/USDT',
  regime: [
    {
      source: 'regime',
      score: 0.92,
      reason: 'Strong directional regime',
    },
  ],
  risk: [
    {
      source: 'risk',
      score: 0.31,
      reason: 'Moderate volatility pressure',
    },
  ],
  economic: [
    {
      source: 'economic',
      score: 0.64,
      reason: 'Positive expected edge',
    },
  ],
  exposure: [
    {
      source: 'exposure',
      score: 0.4,
      reason: 'Capacity available for allocation',
    },
  ],
}

describe('mapMarketClassificationPayload', () => {
  it('maps a valid payload to the view model', () => {
    const result = mapMarketClassificationPayload(validPayload, 'BTC/USDT')

    expect(result).toEqual({
      symbol: 'BTC/USDT',
      regime: [
        {
          source: 'regime',
          score: 0.92,
          reason: 'Strong directional regime',
        },
      ],
      risk: [
        {
          source: 'risk',
          score: 0.31,
          reason: 'Moderate volatility pressure',
        },
      ],
      economic: [
        {
          source: 'economic',
          score: 0.64,
          reason: 'Positive expected edge',
        },
      ],
      exposure: [
        {
          source: 'exposure',
          score: 0.4,
          reason: 'Capacity available for allocation',
        },
      ],
    })
  })

  it('maps empty signal arrays as success', () => {
    const result = mapMarketClassificationPayload(
      {
        regime: [],
        risk: [],
        economic: [],
        exposure: [],
      },
      'ETH/USDT',
    )

    expect(result).toEqual({
      symbol: 'ETH/USDT',
      regime: [],
      risk: [],
      economic: [],
      exposure: [],
    })
  })

  it('uses fallback symbol when payload symbol is absent', () => {
    const result = mapMarketClassificationPayload(
      {
        regime: [],
        risk: [],
        economic: [],
        exposure: [],
      },
      'ETH/USDT',
    )

    expect(result.symbol).toBe('ETH/USDT')
  })

  it('fails closed when a required group is missing', () => {
    expect(() =>
      mapMarketClassificationPayload(
        {
          symbol: 'BTC/USDT',
          regime: [],
          risk: [],
          economic: [],
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketClassificationMappingError)
  })

  it('fails closed when a signal is incomplete', () => {
    expect(() =>
      mapMarketClassificationPayload(
        {
          ...validPayload,
          risk: [{ source: 'risk', score: 0.2 }],
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketClassificationMappingError)
  })

  it('fails closed when a signal score is not numeric', () => {
    expect(() =>
      mapMarketClassificationPayload(
        {
          ...validPayload,
          economic: [
            {
              source: 'economic',
              score: 'high',
              reason: 'invalid',
            },
          ],
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketClassificationMappingError)
  })

  it('fails closed when groups are not arrays', () => {
    expect(() =>
      mapMarketClassificationPayload(
        {
          ...validPayload,
          regime: { source: 'regime', score: 1, reason: 'nope' },
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketClassificationMappingError)
  })

  it('fails closed for non-object payloads', () => {
    expect(() => mapMarketClassificationPayload(null, 'BTC/USDT')).toThrow(
      MarketClassificationMappingError,
    )
  })
})
