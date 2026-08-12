import { describe, expect, it } from 'vitest'
import type { Candle, MarketDataViewModel } from '../../api/marketData/types'
import { mapObservationRow } from './mapObservationRow'

function candle(
  overrides: Partial<Candle> & Pick<Candle, 'open' | 'high' | 'low' | 'close'>,
): Candle {
  return {
    timestamp: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}

function fixture(
  overrides: Partial<MarketDataViewModel> = {},
): MarketDataViewModel {
  return {
    symbol: 'BTC/USDT',
    price: 42000,
    orderBook: { bids: [], asks: [] },
    candlesByTimeframe: [],
    ...overrides,
  }
}

describe('mapObservationRow', () => {
  it('builds area chart points from selected timeframe closes and switches with timeframe', () => {
    const data = fixture({
      candlesByTimeframe: [
        {
          timeframe: '1m',
          candles: [
            candle({ open: 1, high: 1, low: 1, close: 10 }),
            candle({ open: 1, high: 1, low: 1, close: 20 }),
            candle({ open: 1, high: 1, low: 1, close: 30 }),
          ],
        },
        {
          timeframe: '1h',
          candles: [
            candle({ open: 1, high: 1, low: 1, close: 100 }),
            candle({ open: 1, high: 1, low: 1, close: 200 }),
          ],
        },
      ],
    })

    const defaultTf = mapObservationRow(data)
    expect(defaultTf.availableTimeframes).toEqual(['1m', '1h'])
    expect(defaultTf.selectedTimeframe).toBe('1m')
    expect(defaultTf.areaChartPoints).toEqual([10, 20, 30])

    const hourly = mapObservationRow(data, '1h')
    expect(hourly.selectedTimeframe).toBe('1h')
    expect(hourly.areaChartPoints).toEqual([100, 200])
  })

  it('derives 24H high/low from OHLC or omits when candles are empty', () => {
    const withCandles = mapObservationRow(
      fixture({
        candlesByTimeframe: [
          {
            timeframe: '1h',
            candles: [
              candle({ open: 10, high: 40, low: 5, close: 20 }),
              candle({ open: 20, high: 30, low: 8, close: 25 }),
            ],
          },
        ],
      }),
    )

    expect(withCandles.high24h).toBe(40)
    expect(withCandles.low24h).toBe(5)

    const empty = mapObservationRow(
      fixture({
        candlesByTimeframe: [{ timeframe: '1h', candles: [] }],
      }),
    )

    expect(empty.high24h).toBeNull()
    expect(empty.low24h).toBeNull()
    expect(empty.areaChartPoints).toEqual([])
  })

  it('omits volume and last update when unavailable on the Market Data view-model', () => {
    const withTimestamps = mapObservationRow(
      fixture({
        candlesByTimeframe: [
          {
            timeframe: '1h',
            candles: [
              candle({
                open: 1,
                high: 2,
                low: 1,
                close: 2,
                timestamp: '2024-01-01T00:00:00Z',
              }),
              candle({
                open: 2,
                high: 3,
                low: 2,
                close: 3,
                timestamp: '2024-01-01T03:00:00Z',
              }),
            ],
          },
        ],
      }),
    )

    expect(withTimestamps.volume24h).toBeNull()
    expect(withTimestamps.lastUpdatedAt).toBe('2024-01-01T03:00:00Z')

    const noCandles = mapObservationRow(fixture())
    expect(noCandles.volume24h).toBeNull()
    expect(noCandles.lastUpdatedAt).toBeNull()
  })

  it('falls back to the first available timeframe when the selection is unknown', () => {
    const result = mapObservationRow(
      fixture({
        candlesByTimeframe: [
          {
            timeframe: '1h',
            candles: [candle({ open: 1, high: 1, low: 1, close: 42 })],
          },
        ],
      }),
      'not-a-timeframe',
    )

    expect(result.selectedTimeframe).toBe('1h')
    expect(result.areaChartPoints).toEqual([42])
  })
})
