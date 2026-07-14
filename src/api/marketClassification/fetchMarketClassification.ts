import { toMarketPathSymbol } from '../../config/symbols'
import {
  mapMarketClassificationPayload,
  MarketClassificationMappingError,
} from './mapMarketClassification'
import type { MarketClassificationViewModel } from './types'

export class MarketClassificationRequestError extends Error {
  constructor(message = 'Failed to fetch market classification') {
    super(message)
    this.name = 'MarketClassificationRequestError'
  }
}

function apiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL
  return typeof base === 'string' ? base.replace(/\/$/, '') : ''
}

export type FetchMarketClassificationOptions = {
  signal?: AbortSignal
}

/**
 * Fetches GET /markets/{symbol}/classification and maps the body to MarketClassificationViewModel.
 */
export async function fetchMarketClassification(
  symbol: string,
  options: FetchMarketClassificationOptions = {},
): Promise<MarketClassificationViewModel> {
  const pathSymbol = encodeURIComponent(toMarketPathSymbol(symbol))
  const url = `${apiBaseUrl()}/markets/${pathSymbol}/classification`

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
    throw new MarketClassificationRequestError(
      'Network error while fetching market classification',
    )
  }

  if (!response.ok) {
    throw new MarketClassificationRequestError(
      `Market classification request failed (${response.status})`,
    )
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new MarketClassificationMappingError('Response body is not valid JSON')
  }

  return mapMarketClassificationPayload(body, symbol)
}
