import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { resolveUiMessages } from '../../content'
import {
  mapMarketClassificationPayload,
  MarketClassificationMappingError,
} from './mapMarketClassification'

function contentText(code: string): string {
  return resolveUiMessages([{ code }])[0]!.text
}

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
  it('maps a valid payload with Content-resolved signal reasons', () => {
    const result = mapMarketClassificationPayload(validPayload, 'BTC/USDT')

    expect(result).toEqual({
      symbol: 'BTC/USDT',
      regime: [
        {
          source: 'regime',
          score: 0.92,
          reason: contentText('trend_up'),
        },
      ],
      risk: [
        {
          source: 'risk',
          score: 0.31,
          reason: contentText('moderate_risk'),
        },
      ],
      economic: [
        {
          source: 'economic',
          score: 0.64,
          reason: contentText('strong_edge'),
        },
      ],
      exposure: [
        {
          source: 'exposure',
          score: 0.4,
          reason: contentText('ample_capacity'),
        },
      ],
    })
    expect(result.regime[0].reason).not.toBe('trend_up')
    expect(result.risk[0].reason).not.toBe('moderate_risk')
    expect(result.economic[0].reason).not.toBe('strong_edge')
    expect(result.exposure[0].reason).not.toBe('ample_capacity')
  })

  it('resolves MessageRef-shaped reasons via the Content boundary adapter', () => {
    const result = mapMarketClassificationPayload(
      {
        symbol: 'BTC/USDT',
        regime: [
          {
            source: 'regime',
            score: 0.9,
            reason: { code: 'trend_up', params: {} },
          },
        ],
        risk: [
          {
            source: 'risk',
            score: 0.2,
            reason: { code: 'low_risk' },
          },
        ],
        economic: [
          {
            source: 'economic',
            score: 0.3,
            reason: { code: 'neutral_edge', params: {} },
          },
        ],
        exposure: [
          {
            source: 'exposure',
            score: 0.1,
            reason: { code: 'limited_capacity', params: {} },
          },
        ],
      },
      'BTC/USDT',
    )

    expect(result.regime[0].reason).toBe(contentText('trend_up'))
    expect(result.risk[0].reason).toBe(contentText('low_risk'))
    expect(result.economic[0].reason).toBe(contentText('neutral_edge'))
    expect(result.exposure[0].reason).toBe(contentText('limited_capacity'))
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
    expect(result.risk[0].reason).toBe(contentText('low_risk'))
    expect(result.economic[0].reason).toBe('mystery_edge')
    expect(result.exposure[0].reason).toBe(contentText('limited_capacity'))
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
    expect(source).not.toContain('classificationLabels')
    expect(source).not.toContain('getClassification')
  })
})
