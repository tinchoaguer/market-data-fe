/** Thin presentation adapter: map existing Analysis VM fields onto card slots. */

export type AssessmentCardSlots = {
  badge: string | null
  score: string | null
}

const NUMERIC_OUTCOME = /^-?\d+(\.\d+)?%?$/

export function isNumericOutcome(value: string): boolean {
  return NUMERIC_OUTCOME.test(value.trim())
}

/**
 * Bind a mapped outcome token into badge (label/level) or score (numeric).
 * Empty / missing outcomes omit both slots (REQ-004, REQ-017).
 */
export function bindOutcomeSlots(
  outcome: string | null | undefined,
): AssessmentCardSlots {
  const value = outcome?.trim() ?? ''
  if (!value) {
    return { badge: null, score: null }
  }
  if (isNumericOutcome(value)) {
    return { badge: null, score: value }
  }
  return { badge: value, score: null }
}
