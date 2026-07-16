import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getMessage } from '../../i18n/messages'
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
      reason: 'trend_up',
    },
  ],
  risk: [
    {
      source: 'risk',
      score: 0.31,
      reason: 'moderate_risk',
    },
  ],
  economic: [
    {
      source: 'economic',
      score: 0.64,
      reason: 'strong_edge',
    },
  ],
  exposure: [
    {
      source: 'exposure',
      score: 0.4,
      reason: 'ample_capacity',
    },
  ],
}

describe('mapMarketClassificationPayload', () => {
  it('maps a valid payload with humanized signal reasons', () => {
    const result = mapMarketClassificationPayload(validPayload, 'BTC/USDT')

    expect(result).toEqual({
      symbol: 'BTC/USDT',
      regime: [
        {
          source: 'regime',
          score: 0.92,
          reason: getMessage('classificationLabels.regimeReason.trend_up'),
        },
      ],
      risk: [
        {
          source: 'risk',
          score: 0.31,
          reason: getMessage('classificationLabels.riskReason.moderate_risk'),
        },
      ],
      economic: [
        {
          source: 'economic',
          score: 0.64,
          reason: getMessage('classificationLabels.economicReason.strong_edge'),
        },
      ],
      exposure: [
        {
          source: 'exposure',
          score: 0.4,
          reason: getMessage(
            'classificationLabels.exposureReason.ample_capacity',
          ),
        },
      ],
    })
    expect(result.regime[0].reason).not.toBe('trend_up')
    expect(result.risk[0].reason).not.toBe('moderate_risk')
    expect(result.economic[0].reason).not.toBe('strong_edge')
    expect(result.exposure[0].reason).not.toBe('ample_capacity')
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

  it('falls back to raw codes for unknown reasons without failing mapping', () => {
    const result = mapMarketClassificationPayload(
      {
        symbol: 'BTC/USDT',
        regime: [{ source: 'regime', score: 0.5, reason: 'totally_unknown' }],
        risk: [{ source: 'risk', score: 0.2, reason: 'low_risk' }],
        economic: [
          { source: 'economic', score: 0.3, reason: 'mystery_edge' },
        ],
        exposure: [
          { source: 'exposure', score: 0.1, reason: 'limited_capacity' },
        ],
      },
      'BTC/USDT',
    )

    expect(result.regime[0].reason).toBe('totally_unknown')
    expect(result.risk[0].reason).toBe(
      getMessage('classificationLabels.riskReason.low_risk'),
    )
    expect(result.economic[0].reason).toBe('mystery_edge')
    expect(result.exposure[0].reason).toBe(
      getMessage('classificationLabels.exposureReason.limited_capacity'),
    )
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

  it('does not hardcode classification display English in the mapper source', () => {
    const source = readFileSync(
      resolve(import.meta.dirname, 'mapMarketClassification.ts'),
      'utf8',
    )
    const forbiddenDisplayPhrases = [
      'Trend up',
      'Low risk',
      'Strong edge',
      'Ample capacity',
      'Moderate risk',
      'News spike',
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
