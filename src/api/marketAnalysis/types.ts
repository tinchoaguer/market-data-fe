/** View-model types for the market analysis screen (design.md). */

export type Assessment = {
  summary: string
  level: string
}

export type ExposureFactor = {
  name: string
  weight: number
}

export type ExposureProfile = {
  summary: string
  factors: ExposureFactor[]
}

export type CatalogRecommendation = {
  catalogId: string
  name: string
  rationale: string
}

export type MarketAnalysisViewModel = {
  symbol: string
  regime: Assessment
  risk: Assessment
  economic: Assessment
  exposure: ExposureProfile
  recommendation: CatalogRecommendation
}

/** Design-documented success payload shape. */
export type MarketAnalysisApiPayload = {
  symbol?: string
  regime: { summary: string; level: string }
  risk: { summary: string; level: string }
  economic: { summary: string; level: string }
  exposure: {
    summary: string
    factors: Array<{ name: string; weight: number }>
  }
  recommendation: {
    catalogId: string
    name: string
    rationale: string
  }
}

/** Backend HTTP DTO shape for GET /markets/{symbol}/analysis. */
export type MarketAnalysisBackendPayload = {
  symbol: string
  regime: {
    regime: string
    reasons: string[]
    insufficient_data?: boolean
  }
  risk: {
    score: number
    components: Array<[string, number] | { 0: string; 1: number }>
    insufficient_data?: boolean
  }
  economic: {
    edge: number
    components: Array<[string, number] | { 0: string; 1: number }>
    insufficient_data?: boolean
  }
  exposure: {
    symbol?: string
    total_value?: number
    exposure_pct?: number
    allocated_value?: number
    portfolio_exposure_pct?: number
    available_capacity_pct?: number
    symbol_weight_cap_pct?: number
    recommended_allocation_pct?: number
    recommended_allocation_value?: number
    components: Record<string, number>
    insufficient_data?: boolean
  }
  catalog: {
    allowed_strategies?: string[]
    forbidden_strategies?: string[]
    preferred_strategy: string
    catalog_reason: string
    hard_gate_reason?: string | null
  }
}
