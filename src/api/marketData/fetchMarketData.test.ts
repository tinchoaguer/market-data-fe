import { describe, expect, it, vi, afterEach } from 'vitest'
import { fetchMarketData, MarketDataRequestError } from './fetchMarketData'
import { MarketDataMappingError } from './mapMarketData'

describe('fetchMarketData', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('calls GET /markets/{symbol}/market-data with a path-encoded symbol', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        price: 10,
        orderBook: { bids: [], asks: [] },
        candles: {},
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchMarketData('BTC/USDT')

    expect(fetchMock).toHaveBeenCalledWith(
      '/markets/BTC-USDT/market-data',
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

    await expect(fetchMarketData('BTC/USDT')).rejects.toBeInstanceOf(MarketDataRequestError)
  })

  it('throws on unusable JSON payloads', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ unexpected: true }),
      }),
    )

    await expect(fetchMarketData('BTC/USDT')).rejects.toBeInstanceOf(MarketDataMappingError)
  })
})
