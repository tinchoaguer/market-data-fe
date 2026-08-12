import type { ClassificationSignal } from '../../api/marketClassification/types'

export type ClassificationTableRow = {
  factor: string | null
  score: number | null
  reason: string | null
}

function hasText(value: string | undefined | null): boolean {
  return value != null && value.trim().length > 0
}

function hasScore(score: number | undefined | null): boolean {
  return score != null && Number.isFinite(score)
}

/** Map an existing Classification signal into dashboard table row cells. */
export function mapSignalToTableRow(
  signal: ClassificationSignal,
): ClassificationTableRow {
  return {
    factor: hasText(signal.source) ? signal.source : null,
    score: hasScore(signal.score) ? signal.score : null,
    reason: hasText(signal.reason) ? signal.reason : null,
  }
}

/** Omit signal rows when factor, score, and reason are all absent. */
export function shouldDisplaySignal(row: ClassificationTableRow): boolean {
  return row.factor != null || row.score != null || row.reason != null
}

export function visibleSignals(signals: ClassificationSignal[]): ClassificationSignal[] {
  return signals.filter((signal) =>
    shouldDisplaySignal(mapSignalToTableRow(signal)),
  )
}
