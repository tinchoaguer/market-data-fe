import type { MarketDataViewModel } from '../../api/marketData/types'
import type { SymbolIdentityViewModel } from '../reading-context-identity'

export type ChangeDirection = 'positive' | 'negative' | 'neutral'

/**
 * Compact observation strip view-model derived from existing Market Data.
 * Unavailable fields are null / empty — never invented.
 */
export type HeroObservationViewModel = {
  price: number
  changeAbsolute: number | null
  changePercent: number | null
  changeDirection: ChangeDirection | null
  high24h: number | null
  low24h: number | null
  volume24h: number | null
  lastUpdatedAt: string | null
  availableTimeframes: string[]
  selectedTimeframe: string | null
  sparklinePoints: number[]
}

export type { MarketDataViewModel, SymbolIdentityViewModel }
