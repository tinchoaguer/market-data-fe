import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { wording } from '@market-data/brand/wording'
import { getMessage, messages } from '../../i18n/messages'

const featureSourceFiles = [
  'AppLayout.tsx',
  'destinations.ts',
]

const forbiddenHardcoded = [
  'Reading',
  'Market Data',
  'Analysis',
  'Classification',
  'Analysis is not available yet.',
  'Classification is not available yet.',
]

describe('app-layout copy sourcing', () => {
  it('exposes Reading nav locale key for primary destination', () => {
    expect(getMessage('appLayout.navReading')).toBe(
      messages.appLayout.navReading,
    )
    expect(messages.appLayout.navReading).toBe('Reading')
  })

  it('reuses brand wording for product identity', () => {
    expect(wording.product.name).toBe('Market Data')
    expect(wording.product.nameShort).toBeTruthy()
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
