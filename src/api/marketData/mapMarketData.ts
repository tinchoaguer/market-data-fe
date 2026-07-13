import type {
  Candle,
  CandleSeries,
  MarketDataApiPayload,
  MarketDataBackendPayload,
  MarketDataViewModel,
  OrderBookLevel,
} from './types'

export class MarketDataMappingError extends Error {
  constructor(message = 'Invalid market data payload') {
    super(message)
    this.name = 'MarketDataMappingError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseNumber(value: unknown, field: string): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  throw new MarketDataMappingError(`Invalid number for ${field}`)
}

function parseLevel(value: unknown, field: string): OrderBookLevel {
  if (!isRecord(value)) {
    throw new MarketDataMappingError(`Invalid order book level at ${field}`)
  }
  return {
    price: parseNumber(value.price, `${field}.price`),
    quantity: parseNumber(value.quantity, `${field}.quantity`),
  }
}

function parseLevels(value: unknown, field: string): OrderBookLevel[] {
  if (!Array.isArray(value)) {
    throw new MarketDataMappingError(`Expected array at ${field}`)
  }
  return value.map((level, index) => parseLevel(level, `${field}[${index}]`))
}

function parseCandleDesign(value: unknown, field: string): Candle {
  if (!isRecord(value)) {
    throw new MarketDataMappingError(`Invalid candle at ${field}`)
  }
  if (typeof value.timestamp !== 'string') {
    throw new MarketDataMappingError(`Invalid timestamp at ${field}`)
  }
  return {
    open: parseNumber(value.open, `${field}.open`),
    high: parseNumber(value.high, `${field}.high`),
    low: parseNumber(value.low, `${field}.low`),
    close: parseNumber(value.close, `${field}.close`),
    timestamp: value.timestamp,
  }
}

function parseCandleBackend(value: unknown, field: string): Candle {
  if (!isRecord(value)) {
    throw new MarketDataMappingError(`Invalid candle at ${field}`)
  }
  if (typeof value.start_time !== 'string') {
    throw new MarketDataMappingError(`Invalid start_time at ${field}`)
  }
  return {
    open: parseNumber(value.open, `${field}.open`),
    high: parseNumber(value.high, `${field}.high`),
    low: parseNumber(value.low, `${field}.low`),
    close: parseNumber(value.close, `${field}.close`),
    timestamp: value.start_time,
  }
}

function isBackendPayload(value: Record<string, unknown>): value is MarketDataBackendPayload &
  Record<string, unknown> {
  return 'current_price' in value || 'order_book' in value || 'series' in value
}

function isDesignPayload(value: Record<string, unknown>): value is MarketDataApiPayload &
  Record<string, unknown> {
  return 'price' in value || 'orderBook' in value || 'candles' in value
}

function mapDesignPayload(
  payload: MarketDataApiPayload,
  fallbackSymbol: string,
): MarketDataViewModel {
  if (!isRecord(payload.orderBook)) {
    throw new MarketDataMappingError('Missing orderBook')
  }
  if (!isRecord(payload.candles)) {
    throw new MarketDataMappingError('Missing candles')
  }

  const candlesByTimeframe: CandleSeries[] = Object.entries(payload.candles).map(
    ([timeframe, candles]) => {
      if (!Array.isArray(candles)) {
        throw new MarketDataMappingError(`Invalid candles for timeframe ${timeframe}`)
      }
      return {
        timeframe,
        candles: candles.map((candle, index) =>
          parseCandleDesign(candle, `candles.${timeframe}[${index}]`),
        ),
      }
    },
  )

  return {
    symbol:
      typeof payload.symbol === 'string' && payload.symbol.length > 0
        ? payload.symbol
        : fallbackSymbol,
    price: parseNumber(payload.price, 'price'),
    orderBook: {
      bids: parseLevels(payload.orderBook.bids, 'orderBook.bids'),
      asks: parseLevels(payload.orderBook.asks, 'orderBook.asks'),
    },
    candlesByTimeframe,
  }
}

function mapBackendPayload(
  payload: MarketDataBackendPayload,
  fallbackSymbol: string,
): MarketDataViewModel {
  if (!isRecord(payload.order_book)) {
    throw new MarketDataMappingError('Missing order_book')
  }
  if (!Array.isArray(payload.series)) {
    throw new MarketDataMappingError('Missing series')
  }

  const candlesByTimeframe: CandleSeries[] = payload.series.map((series, seriesIndex) => {
    if (!isRecord(series) || typeof series.timeframe !== 'string') {
      throw new MarketDataMappingError(`Invalid series at series[${seriesIndex}]`)
    }
    if (!Array.isArray(series.candles)) {
      throw new MarketDataMappingError(`Invalid candles at series[${seriesIndex}]`)
    }
    return {
      timeframe: series.timeframe,
      candles: series.candles.map((candle, index) =>
        parseCandleBackend(candle, `series[${seriesIndex}].candles[${index}]`),
      ),
    }
  })

  return {
    symbol:
      typeof payload.symbol === 'string' && payload.symbol.length > 0
        ? payload.symbol
        : fallbackSymbol,
    price: parseNumber(payload.current_price, 'current_price'),
    orderBook: {
      bids: parseLevels(payload.order_book.bids, 'order_book.bids'),
      asks: parseLevels(payload.order_book.asks, 'order_book.asks'),
    },
    candlesByTimeframe,
  }
}

/**
 * Maps a JSON market-data payload to the screen view model.
 * Accepts the design success shape or the backend HTTP DTO; fails closed otherwise.
 */
export function mapMarketDataPayload(
  payload: unknown,
  fallbackSymbol: string,
): MarketDataViewModel {
  if (!isRecord(payload)) {
    throw new MarketDataMappingError('Payload must be an object')
  }

  if (isBackendPayload(payload)) {
    return mapBackendPayload(payload as MarketDataBackendPayload, fallbackSymbol)
  }

  if (isDesignPayload(payload)) {
    return mapDesignPayload(payload as MarketDataApiPayload, fallbackSymbol)
  }

  throw new MarketDataMappingError('Unrecognized market data payload shape')
}
