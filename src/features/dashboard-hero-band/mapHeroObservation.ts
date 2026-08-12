import type { Candle, CandleSeries, MarketDataViewModel } from '../../api/marketData/types'
import type { ChangeDirection, HeroObservationViewModel } from './types'

/** Timeframe keys treated as a 24H summary series when present. */
const TWENTY_FOUR_H_TIMEFRAMES = new Set(['1d', '1D', '24h', '24H', '1day'])

function resolveTimeframe(
  available: string[],
  selected: string | null,
): string | null {
  if (available.length === 0) {
    return null
  }
  if (selected != null && available.includes(selected)) {
    return selected
  }
  return available[0] ?? null
}

function seriesByTimeframe(
  groups: CandleSeries[],
  timeframe: string | null,
): Candle[] {
  if (timeframe == null) {
    return []
  }
  return groups.find((group) => group.timeframe === timeframe)?.candles ?? []
}

/**
 * 24H high/low series: prefer a 1d/24h timeframe when present with candles;
 * otherwise the selected sparkline timeframe; otherwise the first non-empty series.
 */
function pick24hCandles(
  groups: CandleSeries[],
  selectedTimeframe: string | null,
): Candle[] {
  const named = groups.find(
    (group) =>
      TWENTY_FOUR_H_TIMEFRAMES.has(group.timeframe) && group.candles.length > 0,
  )
  if (named) {
    return named.candles
  }

  const selected = seriesByTimeframe(groups, selectedTimeframe)
  if (selected.length > 0) {
    return selected
  }

  return groups.find((group) => group.candles.length > 0)?.candles ?? []
}

function deriveChange(candles: Candle[]): {
  changeAbsolute: number | null
  changePercent: number | null
  changeDirection: ChangeDirection | null
} {
  if (candles.length === 0) {
    return {
      changeAbsolute: null,
      changePercent: null,
      changeDirection: null,
    }
  }

  const first = candles[0]
  const last = candles[candles.length - 1]
  if (first == null || last == null) {
    return {
      changeAbsolute: null,
      changePercent: null,
      changeDirection: null,
    }
  }

  const base = candles.length === 1 ? first.open : first.close
  const next = last.close
  const changeAbsolute = next - base
  const changePercent = base !== 0 ? (changeAbsolute / base) * 100 : null
  const changeDirection: ChangeDirection =
    changeAbsolute > 0 ? 'positive' : changeAbsolute < 0 ? 'negative' : 'neutral'

  return { changeAbsolute, changePercent, changeDirection }
}

function deriveLastUpdate(
  selectedCandles: Candle[],
  groups: CandleSeries[],
): string | null {
  if (selectedCandles.length > 0) {
    return selectedCandles[selectedCandles.length - 1]?.timestamp ?? null
  }

  let latest: string | null = null
  for (const group of groups) {
    for (const candle of group.candles) {
      if (latest == null || candle.timestamp > latest) {
        latest = candle.timestamp
      }
    }
  }
  return latest
}

/**
 * Maps existing MarketDataViewModel into hero observation fields.
 * No new API: price from VM; change / 24H / last update / sparkline derived or omitted.
 * Volume is omitted — MarketDataViewModel does not expose it.
 */
export function mapHeroObservation(
  data: MarketDataViewModel,
  selectedTimeframe: string | null = null,
): HeroObservationViewModel {
  const availableTimeframes = data.candlesByTimeframe.map(
    (group) => group.timeframe,
  )
  const resolvedTimeframe = resolveTimeframe(
    availableTimeframes,
    selectedTimeframe,
  )
  const selectedCandles = seriesByTimeframe(
    data.candlesByTimeframe,
    resolvedTimeframe,
  )
  const window24h = pick24hCandles(data.candlesByTimeframe, resolvedTimeframe)
  const change = deriveChange(selectedCandles)

  return {
    price: data.price,
    changeAbsolute: change.changeAbsolute,
    changePercent: change.changePercent,
    changeDirection: change.changeDirection,
    high24h:
      window24h.length > 0 ? Math.max(...window24h.map((c) => c.high)) : null,
    low24h:
      window24h.length > 0 ? Math.min(...window24h.map((c) => c.low)) : null,
    volume24h: null,
    lastUpdatedAt: deriveLastUpdate(selectedCandles, data.candlesByTimeframe),
    availableTimeframes,
    selectedTimeframe: resolvedTimeframe,
    sparklinePoints: selectedCandles.map((candle) => candle.close),
  }
}
