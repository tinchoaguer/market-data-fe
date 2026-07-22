/** View-model types for the market classification screen (design.md). */

/** Wire MessageRef (or bare code string) for classification signal reasons. */
export type ClassificationReasonWire =
  | string
  | {
      code: string
      params?: Record<string, string | number | boolean>
      severity?: string
      channel?: string
    }

export type ClassificationSignal = {
  source: string
  score: number
  /** Resolved display text on the view model. */
  reason: string
}

export type MarketClassificationViewModel = {
  symbol: string
  regime: ClassificationSignal[]
  risk: ClassificationSignal[]
  economic: ClassificationSignal[]
  exposure: ClassificationSignal[]
}

/** Wire signal before boundary resolve (reason may be MessageRef or code string). */
export type ClassificationSignalWire = {
  source: string
  score: number
  reason: ClassificationReasonWire
}

/** Design-documented / backend success payload shape. */
export type MarketClassificationApiPayload = {
  symbol?: string
  regime: ClassificationSignalWire[]
  risk: ClassificationSignalWire[]
  economic: ClassificationSignalWire[]
  exposure: ClassificationSignalWire[]
}
