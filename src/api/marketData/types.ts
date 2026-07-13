/** View-model types for the market data screen (design.md). */

export type OrderBookLevel = {
  price: number
  quantity: number
}

export type Candle = {
  open: number
  high: number
  low: number
  close: number
  timestamp: string
}

export type CandleSeries = {
  timeframe: string
  candles: Candle[]
}

export type MarketDataViewModel = {
  symbol: string
  price: number
  orderBook: {
    bids: OrderBookLevel[]
    asks: OrderBookLevel[]
  }
  candlesByTimeframe: CandleSeries[]
}

/** Design-documented success payload shape. */
export type MarketDataApiPayload = {
  price: number
  orderBook: {
    bids: Array<{ price: number; quantity: number }>
    asks: Array<{ price: number; quantity: number }>
  }
  candles: Record<string, Array<{
    open: number
    high: number
    low: number
    close: number
    timestamp: string
  }>>
  symbol?: string
}

/** Backend HTTP DTO shape (snake_case, decimal strings). */
export type MarketDataBackendPayload = {
  symbol: string
  current_price: string
  order_book: {
    bids: Array<{ price: string; quantity: string }>
    asks: Array<{ price: string; quantity: string }>
  }
  series: Array<{
    timeframe: string
    candles: Array<{
      start_time: string
      end_time: string
      open: string
      high: string
      low: string
      close: string
      base_volume: string
      quote_volume?: string | null
      trade_count?: number | null
      buy_volume?: string | null
      buy_quote_volume?: string | null
    }>
  }>
}
