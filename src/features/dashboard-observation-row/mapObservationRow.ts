import type { MarketDataViewModel } from '../../api/marketData/types'
import { mapHeroObservation } from '../dashboard-hero-band/mapHeroObservation'
import type { ObservationRowViewModel } from './types'

/**
 * Maps existing MarketDataViewModel into observation-row fields.
 * Reuses hero derivation for 24H stats and candle series; no new API.
 * Volume is omitted when the Market Data view-model does not expose it.
 */
export function mapObservationRow(
  data: MarketDataViewModel,
  selectedTimeframe: string | null = null,
): ObservationRowViewModel {
  const hero = mapHeroObservation(data, selectedTimeframe)

  return {
    areaChartPoints: hero.sparklinePoints,
    availableTimeframes: hero.availableTimeframes,
    selectedTimeframe: hero.selectedTimeframe,
    high24h: hero.high24h,
    low24h: hero.low24h,
    volume24h: hero.volume24h,
    lastUpdatedAt: hero.lastUpdatedAt,
  }
}
