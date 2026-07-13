import { toMarketPathSymbol } from '../../config/symbols'
import {
  mapMarketAnalysisPayload,
  MarketAnalysisMappingError,
} from './mapMarketAnalysis'
import type { MarketAnalysisViewModel } from './types'

export class MarketAnalysisRequestError extends Error {
  constructor(message = 'Failed to fetch market analysis') {
    super(message)
    this.name = 'MarketAnalysisRequestError'
  }
}

function apiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL
  return typeof base === 'string' ? base.replace(/\/$/, '') : ''
}

export type FetchMarketAnalysisOptions = {
  signal?: AbortSignal
}

/**
 * Fetches GET /markets/{symbol}/analysis and maps the body to MarketAnalysisViewModel.
 */
export async function fetchMarketAnalysis(
  symbol: string,
  options: FetchMarketAnalysisOptions = {},
): Promise<MarketAnalysisViewModel> {
  const pathSymbol = encodeURIComponent(toMarketPathSymbol(symbol))
  const url = `${apiBaseUrl()}/markets/${pathSymbol}/analysis`

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
    throw new MarketAnalysisRequestError(
      'Network error while fetching market analysis',
    )
  }

  if (!response.ok) {
    throw new MarketAnalysisRequestError(
      `Market analysis request failed (${response.status})`,
    )
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new MarketAnalysisMappingError('Response body is not valid JSON')
  }

  return mapMarketAnalysisPayload(body, symbol)
}
