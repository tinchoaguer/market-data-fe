/** Supported trading symbols offered in the market data symbol selector. */
export const SUPPORTED_SYMBOLS = ['BTC/USDT', 'ETH/USDT'] as const

export type SupportedSymbol = (typeof SUPPORTED_SYMBOLS)[number]

/** Encode an internal `BASE/QUOTE` symbol for the markets URL path (`BASE-QUOTE`). */
export function toMarketPathSymbol(symbol: string): string {
  return symbol.replace('/', '-')
}
