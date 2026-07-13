import { describe, expect, it, vi, afterEach } from 'vitest'
import {
  fetchMarketAnalysis,
  MarketAnalysisRequestError,
} from './fetchMarketAnalysis'
import { MarketAnalysisMappingError } from './mapMarketAnalysis'

describe('fetchMarketAnalysis', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('calls GET /markets/{symbol}/analysis with a path-encoded symbol', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        regime: { summary: 'ok', level: 'TREND_UP' },
        risk: { summary: 'ok', level: 'low' },
        economic: { summary: 'ok', level: 'high' },
        exposure: { summary: 'ok', factors: [] },
        recommendation: {
          catalogId: 'A',
          name: 'A',
          rationale: 'because',
        },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchMarketAnalysis('BTC/USDT')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/markets\/BTC-USDT\/analysis$/),
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

    await expect(fetchMarketAnalysis('BTC/USDT')).rejects.toBeInstanceOf(
      MarketAnalysisRequestError,
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

    await expect(fetchMarketAnalysis('BTC/USDT')).rejects.toBeInstanceOf(
      MarketAnalysisMappingError,
    )
  })
})
