/** View-model types for the market classification screen (design.md). */

export type ClassificationSignal = {
  source: string
  score: number
  reason: string
}

export type MarketClassificationViewModel = {
  symbol: string
  regime: ClassificationSignal[]
  risk: ClassificationSignal[]
  economic: ClassificationSignal[]
  exposure: ClassificationSignal[]
}

/** Design-documented / backend success payload shape. */
export type MarketClassificationApiPayload = {
  symbol?: string
  regime: ClassificationSignal[]
  risk: ClassificationSignal[]
  economic: ClassificationSignal[]
  exposure: ClassificationSignal[]
}
