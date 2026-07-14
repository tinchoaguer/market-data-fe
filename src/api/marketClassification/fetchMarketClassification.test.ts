import { describe, expect, it, vi, afterEach } from 'vitest'
import {
  fetchMarketClassification,
  MarketClassificationRequestError,
} from './fetchMarketClassification'
import { MarketClassificationMappingError } from './mapMarketClassification'

describe('fetchMarketClassification', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('calls GET /markets/{symbol}/classification with a path-encoded symbol', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        symbol: 'BTC/USDT',
        regime: [{ source: 'regime', score: 1, reason: 'ok' }],
        risk: [],
        economic: [],
        exposure: [],
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchMarketClassification('BTC/USDT')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/markets\/BTC-USDT\/classification$/),
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('throws on non-ok responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    await expect(fetchMarketClassification('BTC/USDT')).rejects.toBeInstanceOf(
      MarketClassificationRequestError,
    )
  })

  it('throws on unusable JSON payloads', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ unexpected: true }),
      }),
    )

    await expect(fetchMarketClassification('BTC/USDT')).rejects.toBeInstanceOf(
      MarketClassificationMappingError,
    )
  })
})
