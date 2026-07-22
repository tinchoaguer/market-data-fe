import type { CodeRegistryEntry } from '../registry'

/** Analysis narrative MessageRef codes (analysis-message-refs inventory). */
export const ANALYSIS_CODES = [
  'catalog.wait',
  'catalog.strategy_allowed',
  'catalog.no_strategy_allowed',
  'catalog.hard_gate.extreme_regime',
  'catalog.hard_gate.risk_too_high',
  'catalog.hard_gate.negative_edge',
  'catalog.hard_gate.no_capacity',
] as const

export type AnalysisCode = (typeof ANALYSIS_CODES)[number]

/** Analysis narrative CodeRegistry entries for v1. */
export const analysisCatalogEntries: Readonly<
  Record<AnalysisCode, CodeRegistryEntry>
> = {
  'catalog.wait': {
    code: 'catalog.wait',
    paramsSchema: [
      { name: 'gate', kind: 'string', required: true },
      { name: 'regime', kind: 'string', required: false },
      { name: 'risk_score', kind: 'number', required: false },
      { name: 'edge', kind: 'number', required: false },
    ],
    defaultSeverity: 'warning',
  },
  'catalog.strategy_allowed': {
    code: 'catalog.strategy_allowed',
    paramsSchema: [
      { name: 'strategy', kind: 'string', required: true },
      { name: 'regime', kind: 'string', required: true },
      { name: 'risk_score', kind: 'number', required: true },
      { name: 'edge', kind: 'number', required: true },
    ],
    defaultSeverity: 'info',
  },
  'catalog.no_strategy_allowed': {
    code: 'catalog.no_strategy_allowed',
    paramsSchema: [
      { name: 'regime', kind: 'string', required: true },
      { name: 'risk_score', kind: 'number', required: true },
      { name: 'edge', kind: 'number', required: true },
    ],
    defaultSeverity: 'warning',
  },
  'catalog.hard_gate.extreme_regime': {
    code: 'catalog.hard_gate.extreme_regime',
    paramsSchema: [{ name: 'regime', kind: 'string', required: true }],
    defaultSeverity: 'error',
  },
  'catalog.hard_gate.risk_too_high': {
    code: 'catalog.hard_gate.risk_too_high',
    paramsSchema: [{ name: 'risk_score', kind: 'number', required: true }],
    defaultSeverity: 'error',
  },
  'catalog.hard_gate.negative_edge': {
    code: 'catalog.hard_gate.negative_edge',
    paramsSchema: [{ name: 'edge', kind: 'number', required: true }],
    defaultSeverity: 'error',
  },
  'catalog.hard_gate.no_capacity': {
    code: 'catalog.hard_gate.no_capacity',
    paramsSchema: [],
    defaultSeverity: 'error',
  },
}
