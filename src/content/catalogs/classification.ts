import type { CodeRegistryEntry } from '../registry'

/** Classification signal-reason MessageRef codes (classification-message-refs). */
export const CLASSIFICATION_CODES = [
  'trend_up',
  'trend_down',
  'range',
  'chaotic',
  'news_spike',
  'low_risk',
  'moderate_risk',
  'elevated_risk',
  'high_risk',
  'strong_edge',
  'moderate_edge',
  'neutral_edge',
  'negative_edge',
  'ample_capacity',
  'limited_capacity',
  'constrained_capacity',
] as const

export type ClassificationCode = (typeof CLASSIFICATION_CODES)[number]

function signalEntry(code: ClassificationCode): CodeRegistryEntry {
  return {
    code,
    paramsSchema: [],
    defaultSeverity: 'info',
  }
}

/** Classification signal-reason CodeRegistry entries for v1. */
export const classificationCatalogEntries: Readonly<
  Record<ClassificationCode, CodeRegistryEntry>
> = {
  trend_up: signalEntry('trend_up'),
  trend_down: signalEntry('trend_down'),
  range: signalEntry('range'),
  chaotic: signalEntry('chaotic'),
  news_spike: signalEntry('news_spike'),
  low_risk: signalEntry('low_risk'),
  moderate_risk: signalEntry('moderate_risk'),
  elevated_risk: signalEntry('elevated_risk'),
  high_risk: signalEntry('high_risk'),
  strong_edge: signalEntry('strong_edge'),
  moderate_edge: signalEntry('moderate_edge'),
  neutral_edge: signalEntry('neutral_edge'),
  negative_edge: signalEntry('negative_edge'),
  ample_capacity: signalEntry('ample_capacity'),
  limited_capacity: signalEntry('limited_capacity'),
  constrained_capacity: signalEntry('constrained_capacity'),
}
