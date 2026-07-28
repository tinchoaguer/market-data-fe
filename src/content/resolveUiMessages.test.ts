import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve as resolvePath } from 'node:path'
import { DEFAULT_LOCALE, resolve, resolveUiMessages } from './index'
import type { MessageRef } from './types'

describe('resolveUiMessages', () => {
  it('delegates to Content resolve with en locale and ui channel', () => {
    const messages: MessageRef[] = [
      {
        code: 'catalog.strategy_allowed',
        params: {
          strategy: 'TREND_FOLLOWING',
          regime: 'TREND_UP',
          risk_score: 0.42,
          edge: 0.75,
        },
      },
      { code: 'trend_up', params: {} },
    ]

    const viaAdapter = resolveUiMessages(messages)
    const viaResolve = resolve({
      locale: DEFAULT_LOCALE,
      channel: 'ui',
      messages,
    })

    expect(viaAdapter).toHaveLength(viaResolve.length)
    expect(viaAdapter[0]).toEqual({
      code: 'catalog.strategy_allowed',
      locale: 'en',
      text: 'Strategy Trend following is allowed for regime Trend up.',
    })
    // Raw Content resolve keeps API tokens; UI adapter humanizes strategy/regime.
    expect(viaResolve[0]!.text).toContain('TREND_FOLLOWING')
    expect(viaAdapter[1]).toEqual({
      code: 'trend_up',
      locale: 'en',
      text: 'Trend up',
    })
  })

  it('does not mutate the input messages array or refs', () => {
    const messages: MessageRef[] = [
      { code: 'low_risk', params: { keep: true } },
    ]
    const snapshot = structuredClone(messages)

    resolveUiMessages(messages)

    expect(messages).toEqual(snapshot)
  })

  it('does not import brand wording on the boundary path', () => {
    const adapterSource = readFileSync(
      resolvePath(import.meta.dirname, 'resolveUiMessages.ts'),
      'utf8',
    )
    expect(adapterSource).not.toContain('@market-data/brand')
  })

  it('humanizes strategy and regime params via analysis locale wordings', () => {
    const [resolved] = resolveUiMessages([
      {
        code: 'catalog.strategy_allowed',
        params: {
          strategy: 'TREND_FOLLOWING',
          regime: 'TREND_UP',
        },
      },
    ])

    expect(resolved!.text).toBe(
      'Strategy Trend following is allowed for regime Trend up.',
    )
    expect(resolved!.text).not.toContain('TREND_FOLLOWING')
    expect(resolved!.text).not.toContain('TREND_UP')
  })
})
