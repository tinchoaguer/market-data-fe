import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { wording } from '@market-data/brand/wording'
import { getMessage, messages } from '../../i18n/messages'

const featureSourceFiles = [
  'MarketClassificationScreen.tsx',
  'SignalGroupSections.tsx',
]

const forbiddenHardcoded = [
  'Loading…',
  'Something went wrong',
  'Try again',
  'Select a symbol to view classification.',
  'Classification',
  'Source',
  'Score',
  'Reason',
  'Regime',
  'Risk',
  'Economic',
  'Exposure',
]

describe('view-market-classification copy sourcing', () => {
  it('exposes required feature locale keys', () => {
    expect(getMessage('viewMarketClassification.title')).toBe(
      messages.viewMarketClassification.title,
    )
    expect(getMessage('viewMarketClassification.empty')).toBe(
      messages.viewMarketClassification.empty,
    )
    expect(getMessage('viewMarketClassification.source')).toBe(
      messages.viewMarketClassification.source,
    )
    expect(getMessage('viewMarketClassification.score')).toBe(
      messages.viewMarketClassification.score,
    )
    expect(getMessage('viewMarketClassification.reason')).toBe(
      messages.viewMarketClassification.reason,
    )
  })

  it('reuses brand wording keys required by the design', () => {
    expect(wording.common.loading).toBeTruthy()
    expect(wording.common.error).toBeTruthy()
    expect(wording.common.retry).toBeTruthy()
    expect(wording.labels.symbol).toBeTruthy()
    expect(wording.labels.regime).toBeTruthy()
    expect(wording.labels.risk).toBeTruthy()
    expect(wording.labels.economic).toBeTruthy()
    expect(wording.labels.exposure).toBeTruthy()
    expect(wording.cta.viewClassification).toBeTruthy()
    expect(wording.product.name).toBeTruthy()
  })

  it('does not hardcode designed English strings in feature components', () => {
    for (const file of featureSourceFiles) {
      const source = readFileSync(resolve(import.meta.dirname, file), 'utf8')
      for (const phrase of forbiddenHardcoded) {
        expect(source, `${file} must not hardcode "${phrase}"`).not.toContain(
          `'${phrase}'`,
        )
        expect(source, `${file} must not hardcode "${phrase}"`).not.toContain(
          `"${phrase}"`,
        )
      }
    }
  })
})
