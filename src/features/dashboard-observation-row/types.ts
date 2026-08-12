/** View-model for the Market Data middle observation row (design.md). */

export type ObservationRowViewModel = {
  areaChartPoints: number[]
  availableTimeframes: string[]
  selectedTimeframe: string | null
  high24h: number | null
  low24h: number | null
  volume24h: number | null
  lastUpdatedAt: string | null
}
