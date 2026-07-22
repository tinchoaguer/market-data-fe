import { describe, expect, it } from 'vitest'
import {
  ANALYSIS_CODES,
  analysisCatalogEntries,
  CLASSIFICATION_CODES,
  classificationCatalogEntries,
  v1CodeRegistry,
} from './index'
import type { CodeParamSchema } from '../registry'

/** Designed closed set: 7 analysis + 16 classification = 23. */
const DESIGNED_V1_CODES = [
  ...ANALYSIS_CODES,
  ...CLASSIFICATION_CODES,
] as const

const ANALYSIS_PARAMS: Record<
  (typeof ANALYSIS_CODES)[number],
  CodeParamSchema[]
> = {
  'catalog.wait': [
    { name: 'gate', kind: 'string', required: true },
    { name: 'regime', kind: 'string', required: false },
    { name: 'risk_score', kind: 'number', required: false },
    { name: 'edge', kind: 'number', required: false },
  ],
  'catalog.strategy_allowed': [
    { name: 'strategy', kind: 'string', required: true },
    { name: 'regime', kind: 'string', required: true },
    { name: 'risk_score', kind: 'number', required: true },
    { name: 'edge', kind: 'number', required: true },
  ],
  'catalog.no_strategy_allowed': [
    { name: 'regime', kind: 'string', required: true },
    { name: 'risk_score', kind: 'number', required: true },
    { name: 'edge', kind: 'number', required: true },
  ],
  'catalog.hard_gate.extreme_regime': [
    { name: 'regime', kind: 'string', required: true },
  ],
  'catalog.hard_gate.risk_too_high': [
    { name: 'risk_score', kind: 'number', required: true },
  ],
  'catalog.hard_gate.negative_edge': [
    { name: 'edge', kind: 'number', required: true },
  ],
  'catalog.hard_gate.no_capacity': [],
}

describe('v1CodeRegistry closed-set completeness', () => {
  it('contains exactly the designed 23 codes with matching keys', () => {
    const keys = Object.keys(v1CodeRegistry).sort()
    const designed = [...DESIGNED_V1_CODES].sort()

    expect(keys).toEqual(designed)
    expect(keys).toHaveLength(23)
    expect(Object.isFrozen(v1CodeRegistry)).toBe(true)

    for (const code of DESIGNED_V1_CODES) {
      expect(v1CodeRegistry[code]?.code).toBe(code)
    }
  })

  it('registers analysis entries with designed paramsSchema and severity', () => {
    expect(ANALYSIS_CODES).toHaveLength(7)

    for (const code of ANALYSIS_CODES) {
      const entry = analysisCatalogEntries[code]
      expect(entry.code).toBe(code)
      expect(entry.paramsSchema).toEqual(ANALYSIS_PARAMS[code])
    }

    expect(analysisCatalogEntries['catalog.wait'].defaultSeverity).toBe(
      'warning',
    )
    expect(
      analysisCatalogEntries['catalog.strategy_allowed'].defaultSeverity,
    ).toBe('info')
    expect(
      analysisCatalogEntries['catalog.no_strategy_allowed'].defaultSeverity,
    ).toBe('warning')
    expect(
      analysisCatalogEntries['catalog.hard_gate.extreme_regime']
        .defaultSeverity,
    ).toBe('error')
    expect(
      analysisCatalogEntries['catalog.hard_gate.risk_too_high'].defaultSeverity,
    ).toBe('error')
    expect(
      analysisCatalogEntries['catalog.hard_gate.negative_edge'].defaultSeverity,
    ).toBe('error')
    expect(
      analysisCatalogEntries['catalog.hard_gate.no_capacity'].defaultSeverity,
    ).toBe('error')
  })

  it('registers classification entries with empty paramsSchema and info severity', () => {
    expect(CLASSIFICATION_CODES).toHaveLength(16)

    for (const code of CLASSIFICATION_CODES) {
      const entry = classificationCatalogEntries[code]
      expect(entry.code).toBe(code)
      expect(entry.paramsSchema).toEqual([])
      expect(entry.defaultSeverity).toBe('info')
      expect(v1CodeRegistry[code]).toEqual(entry)
    }
  })
})
