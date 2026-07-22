import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { wording } from '@market-data/brand/wording'
import { getMessage, messages } from '../../i18n/messages'

const featureSourceFiles = [
  'MarketAnalysisScreen.tsx',
  'AssessmentSections.tsx',
  'ExposureSection.tsx',
  'RecommendationSection.tsx',
]

const forbiddenHardcoded = [
  'Loading…',
  'Something went wrong',
  'Try again',
  'Select a symbol to view analysis.',
  'Analysis',
  'Summary',
  'Level',
  'Factors',
  'Factor',
  'Weight',
  'Catalog ID',
  'Rationale',
  'Hard gate',
  'Regime',
  'Risk',
  'Economic',
  'Exposure',
  'Recommendation',
]

describe('view-market-analysis copy sourcing', () => {
  it('exposes required feature locale keys', () => {
    expect(getMessage('viewMarketAnalysis.title')).toBe(
      messages.viewMarketAnalysis.title,
    )
    expect(getMessage('viewMarketAnalysis.empty')).toBe(
      messages.viewMarketAnalysis.empty,
    )
    expect(getMessage('viewMarketAnalysis.summary')).toBe(
      messages.viewMarketAnalysis.summary,
    )
    expect(getMessage('viewMarketAnalysis.level')).toBe(
      messages.viewMarketAnalysis.level,
    )
    expect(getMessage('viewMarketAnalysis.factors')).toBe(
      messages.viewMarketAnalysis.factors,
    )
    expect(getMessage('viewMarketAnalysis.factorName')).toBe(
      messages.viewMarketAnalysis.factorName,
    )
    expect(getMessage('viewMarketAnalysis.factorWeight')).toBe(
      messages.viewMarketAnalysis.factorWeight,
    )
    expect(getMessage('viewMarketAnalysis.catalogId')).toBe(
      messages.viewMarketAnalysis.catalogId,
    )
    expect(getMessage('viewMarketAnalysis.rationale')).toBe(
      messages.viewMarketAnalysis.rationale,
    )
    expect(getMessage('viewMarketAnalysis.hardGateReason')).toBe(
      messages.viewMarketAnalysis.hardGateReason,
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
    expect(wording.labels.recommendation).toBeTruthy()
    expect(wording.cta.viewAnalysis).toBeTruthy()
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
