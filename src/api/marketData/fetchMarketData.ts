import { toMarketPathSymbol } from '../../config/symbols'
import { mapMarketDataPayload, MarketDataMappingError } from './mapMarketData'
import type { MarketDataViewModel } from './types'

export class MarketDataRequestError extends Error {
  constructor(message = 'Failed to fetch market data') {
    super(message)
    this.name = 'MarketDataRequestError'
  }
}

function apiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL
  return typeof base === 'string' ? base.replace(/\/$/, '') : ''
}

export type FetchMarketDataOptions = {
  signal?: AbortSignal
}

/**
 * Fetches GET /markets/{symbol}/market-data and maps the body to MarketDataViewModel.
 */
export async function fetchMarketData(
  symbol: string,
  options: FetchMarketDataOptions = {},
): Promise<MarketDataViewModel> {
  const pathSymbol = encodeURIComponent(toMarketPathSymbol(symbol))
  const url = `${apiBaseUrl()}/markets/${pathSymbol}/market-data`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new MarketDataRequestError('Network error while fetching market data')
  }

  if (!response.ok) {
    throw new MarketDataRequestError(`Market data request failed (${response.status})`)
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new MarketDataMappingError('Response body is not valid JSON')
  }

  return mapMarketDataPayload(body, symbol)
}
