import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { wording } from '@maguer/market-data-brand/wording'
import { getMessage, messages } from '../../i18n/messages'

const featureSourceFiles = [
  'MarketDataScreen.tsx',
  'SymbolSelector.tsx',
  'PriceSection.tsx',
  'OrderBookSection.tsx',
  'CandlesSection.tsx',
]

const forbiddenHardcoded = [
  'Loadingâ€¦',
  'Something went wrong',
  'Try again',
  'Order book',
  'Select a symbol to view market data.',
  'Market data',
  'Timeframe',
]

describe('view-market-data copy sourcing', () => {
  it('exposes required feature locale keys', () => {
    expect(getMessage('viewMarketData.title')).toBe(messages.viewMarketData.title)
    expect(getMessage('viewMarketData.empty')).toBe(messages.viewMarketData.empty)
    expect(getMessage('viewMarketData.timeframe')).toBe(messages.viewMarketData.timeframe)
  })

  it('reuses brand wording keys required by the design', () => {
    expect(wording.common.loading).toBeTruthy()
    expect(wording.common.error).toBeTruthy()
    expect(wording.common.retry).toBeTruthy()
    expect(wording.labels.symbol).toBeTruthy()
    expect(wording.labels.price).toBeTruthy()
    expect(wording.labels.orderBook).toBeTruthy()
    expect(wording.labels.bids).toBeTruthy()
    expect(wording.labels.asks).toBeTruthy()
    expect(wording.labels.candles).toBeTruthy()
    expect(wording.cta.viewMarket).toBeTruthy()
  })

  it('does not hardcode designed English strings in feature components', () => {
    for (const file of featureSourceFiles) {
      const source = readFileSync(
        resolve(import.meta.dirname, file),
        'utf8',
      )
      for (const phrase of forbiddenHardcoded) {
        expect(source, `${file} must not hardcode "${phrase}"`).not.toContain(`'${phrase}'`)
        expect(source, `${file} must not hardcode "${phrase}"`).not.toContain(`"${phrase}"`)
      }
    }
  })
})
