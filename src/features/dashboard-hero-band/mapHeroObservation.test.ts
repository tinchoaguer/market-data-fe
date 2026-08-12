import { describe, expect, it } from 'vitest'
import type { Candle, MarketDataViewModel } from '../../api/marketData/types'
import { mapHeroObservation } from './mapHeroObservation'

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

describe('mapHeroObservation', () => {
  it('maps price from the Market Data view-model', () => {
    const result = mapHeroObservation(fixture({ price: 42000.5 }))

    expect(result.price).toBe(42000.5)
  })

  it('derives positive change from first vs last close on the selected timeframe', () => {
    const result = mapHeroObservation(
      fixture({
        candlesByTimeframe: [
          {
            timeframe: '1h',
            candles: [
              candle({
                open: 100,
                high: 110,
                low: 90,
                close: 100,
                timestamp: '2024-01-01T00:00:00Z',
              }),
              candle({
                open: 100,
                high: 130,
                low: 100,
                close: 125,
                timestamp: '2024-01-01T01:00:00Z',
              }),
            ],
          },
        ],
      }),
    )

    expect(result.changeAbsolute).toBe(25)
    expect(result.changePercent).toBe(25)
    expect(result.changeDirection).toBe('positive')
    expect(result.selectedTimeframe).toBe('1h')
  })

  it('derives negative change and percent from a falling series', () => {
    const result = mapHeroObservation(
      fixture({
        candlesByTimeframe: [
          {
            timeframe: '1h',
            candles: [
              candle({ open: 200, high: 200, low: 150, close: 200 }),
              candle({ open: 200, high: 200, low: 140, close: 150 }),
            ],
          },
        ],
      }),
    )

    expect(result.changeAbsolute).toBe(-50)
    expect(result.changePercent).toBe(-25)
    expect(result.changeDirection).toBe('negative')
  })

  it('derives neutral change from a single candle with equal open and close', () => {
    const result = mapHeroObservation(
      fixture({
        candlesByTimeframe: [
          {
            timeframe: '1m',
            candles: [candle({ open: 50, high: 51, low: 49, close: 50 })],
          },
        ],
      }),
    )

    expect(result.changeAbsolute).toBe(0)
    expect(result.changePercent).toBe(0)
    expect(result.changeDirection).toBe('neutral')
  })

  it('omits change when candles are empty and still maps price', () => {
    const result = mapHeroObservation(
      fixture({
        price: 3100,
        candlesByTimeframe: [{ timeframe: '1h', candles: [] }],
      }),
    )

    expect(result.price).toBe(3100)
    expect(result.changeAbsolute).toBeNull()
    expect(result.changePercent).toBeNull()
    expect(result.changeDirection).toBeNull()
    expect(result.high24h).toBeNull()
    expect(result.low24h).toBeNull()
    expect(result.sparklinePoints).toEqual([])
  })

  it('derives 24H high/low from OHLC of a 1d series when present', () => {
    const result = mapHeroObservation(
      fixture({
        candlesByTimeframe: [
          {
            timeframe: '1h',
            candles: [
              candle({ open: 10, high: 12, low: 9, close: 11 }),
            ],
          },
          {
            timeframe: '1d',
            candles: [
              candle({
                open: 100,
                high: 180,
                low: 70,
                close: 120,
                timestamp: '2024-01-01T00:00:00Z',
              }),
              candle({
                open: 120,
                high: 160,
                low: 80,
                close: 150,
                timestamp: '2024-01-02T00:00:00Z',
              }),
            ],
          },
        ],
      }),
    )

    expect(result.high24h).toBe(180)
    expect(result.low24h).toBe(70)
  })

  it('falls back to selected timeframe OHLC for 24H high/low when no 1d series exists', () => {
    const result = mapHeroObservation(
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

    expect(result.high24h).toBe(40)
    expect(result.low24h).toBe(5)
  })

  it('omits volume when the Market Data view-model does not expose it', () => {
    const result = mapHeroObservation(
      fixture({
        candlesByTimeframe: [
          {
            timeframe: '1h',
            candles: [candle({ open: 1, high: 2, low: 1, close: 2 })],
          },
        ],
      }),
    )

    expect(result.volume24h).toBeNull()
  })

  it('sets lastUpdatedAt from the latest selected-timeframe candle timestamp', () => {
    const result = mapHeroObservation(
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

    expect(result.lastUpdatedAt).toBe('2024-01-01T03:00:00Z')
  })

  it('omits lastUpdatedAt when no candle timestamps exist', () => {
    const result = mapHeroObservation(fixture({ candlesByTimeframe: [] }))

    expect(result.lastUpdatedAt).toBeNull()
  })

  it('builds sparkline points from selected timeframe closes and switches with timeframe', () => {
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

    const defaultTf = mapHeroObservation(data)
    expect(defaultTf.availableTimeframes).toEqual(['1m', '1h'])
    expect(defaultTf.selectedTimeframe).toBe('1m')
    expect(defaultTf.sparklinePoints).toEqual([10, 20, 30])

    const hourly = mapHeroObservation(data, '1h')
    expect(hourly.selectedTimeframe).toBe('1h')
    expect(hourly.sparklinePoints).toEqual([100, 200])
  })

  it('falls back to the first available timeframe when the selection is unknown', () => {
    const result = mapHeroObservation(
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
    expect(result.sparklinePoints).toEqual([42])
  })
})
