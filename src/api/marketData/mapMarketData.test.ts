import { describe, expect, it } from 'vitest'
import { mapMarketDataPayload, MarketDataMappingError } from './mapMarketData'

const designPayload = {
  symbol: 'BTC/USDT',
  price: 42000.5,
  orderBook: {
    bids: [{ price: 41999, quantity: 1.2 }],
    asks: [{ price: 42001, quantity: 0.8 }],
  },
  candles: {
    '1m': [
      {
        open: 41900,
        high: 42100,
        low: 41800,
        close: 42000,
        timestamp: '2024-01-01T00:00:00Z',
      },
    ],
    '1h': [
      {
        open: 41000,
        high: 43000,
        low: 40500,
        close: 42000,
        timestamp: '2024-01-01T00:00:00Z',
      },
    ],
  },
}

const backendPayload = {
  symbol: 'ETH/USDT',
  current_price: '3500.25',
  order_book: {
    bids: [{ price: '3499.5', quantity: '2.0' }],
    asks: [{ price: '3501.0', quantity: '1.5' }],
  },
  series: [
    {
      timeframe: '1m',
      candles: [
        {
          start_time: '2024-06-01T12:00:00Z',
          end_time: '2024-06-01T12:01:00Z',
          open: '3490',
          high: '3510',
          low: '3480',
          close: '3500',
          base_volume: '10',
        },
      ],
    },
  ],
}

describe('mapMarketDataPayload', () => {
  it('maps a valid design-shaped payload to the view model', () => {
    const result = mapMarketDataPayload(designPayload, 'BTC/USDT')

    expect(result).toEqual({
      symbol: 'BTC/USDT',
      price: 42000.5,
      orderBook: {
        bids: [{ price: 41999, quantity: 1.2 }],
        asks: [{ price: 42001, quantity: 0.8 }],
      },
      candlesByTimeframe: [
        {
          timeframe: '1m',
          candles: [
            {
              open: 41900,
              high: 42100,
              low: 41800,
              close: 42000,
              timestamp: '2024-01-01T00:00:00Z',
            },
          ],
        },
        {
          timeframe: '1h',
          candles: [
            {
              open: 41000,
              high: 43000,
              low: 40500,
              close: 42000,
              timestamp: '2024-01-01T00:00:00Z',
            },
          ],
        },
      ],
    })
  })

  it('maps a valid backend payload to the view model', () => {
    const result = mapMarketDataPayload(backendPayload, 'ETH/USDT')

    expect(result.symbol).toBe('ETH/USDT')
    expect(result.price).toBe(3500.25)
    expect(result.orderBook.bids).toEqual([{ price: 3499.5, quantity: 2 }])
    expect(result.orderBook.asks).toEqual([{ price: 3501, quantity: 1.5 }])
    expect(result.candlesByTimeframe).toEqual([
      {
        timeframe: '1m',
        candles: [
          {
            open: 3490,
            high: 3510,
            low: 3480,
            close: 3500,
            timestamp: '2024-06-01T12:00:00Z',
          },
        ],
      },
    ])
  })

  it('treats empty bids, asks, and candle series as success', () => {
    const result = mapMarketDataPayload(
      {
        price: 1,
        orderBook: { bids: [], asks: [] },
        candles: { '1m': [] },
      },
      'BTC/USDT',
    )

    expect(result.orderBook.bids).toEqual([])
    expect(result.orderBook.asks).toEqual([])
    expect(result.candlesByTimeframe).toEqual([{ timeframe: '1m', candles: [] }])
  })

  it('fails closed on non-object payloads', () => {
    expect(() => mapMarketDataPayload(null, 'BTC/USDT')).toThrow(MarketDataMappingError)
    expect(() => mapMarketDataPayload('x', 'BTC/USDT')).toThrow(MarketDataMappingError)
  })

  it('fails closed when required design fields are missing or invalid', () => {
    expect(() =>
      mapMarketDataPayload({ price: 1, orderBook: { bids: [], asks: [] } }, 'BTC/USDT'),
    ).toThrow(MarketDataMappingError)

    expect(() =>
      mapMarketDataPayload(
        { price: 'bad', orderBook: { bids: [], asks: [] }, candles: {} },
        'BTC/USDT',
      ),
    ).toThrow(MarketDataMappingError)

    expect(() =>
      mapMarketDataPayload(
        {
          price: 1,
          orderBook: { bids: [{ price: 1 }], asks: [] },
          candles: {},
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketDataMappingError)
  })

  it('fails closed when backend fields are incomplete', () => {
    expect(() =>
      mapMarketDataPayload(
        {
          symbol: 'BTC/USDT',
          current_price: '100',
          order_book: { bids: [], asks: [] },
        },
        'BTC/USDT',
      ),
    ).toThrow(MarketDataMappingError)
  })
})
