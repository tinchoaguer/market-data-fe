import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wording } from '@market-data/brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import { SUPPORTED_SYMBOLS } from '../../config/symbols'
import type { MarketAnalysisViewModel } from '../../api/marketAnalysis/types'
import { ReadingScreen } from './ReadingScreen'

const fixtureViewModel: MarketAnalysisViewModel = {
  symbol: 'BTC/USDT',
  regime: {
    summary: getMessage('analysisLabels.regimeReason.adx_strong'),
    level: getMessage('analysisLabels.regime.TREND_UP'),
  },
  risk: {
    summary: `${getMessage('analysisLabels.riskComponent.volatility')}=0.1`,
    level: '0.17',
  },
  economic: {
    summary: `${getMessage('analysisLabels.economicComponent.activity')}=0.88`,
    level: '0.42',
  },
  exposure: {
    summary: '0.35',
    factors: [
      {
        name: getMessage('analysisLabels.exposureFactor.vol_budget_pct'),
        weight: 0.35,
      },
    ],
  },
  recommendation: {
    catalogId: getMessage('analysisLabels.strategy.TREND_FOLLOWING'),
    name: getMessage('analysisLabels.strategy.TREND_FOLLOWING'),
    rationale: 'Preferred for TREND_UP with acceptable risk',
    hardGateReason: null,
  },
}

async function selectSymbol(symbol: string) {
  const user = userEvent.setup()
  await user.click(screen.getByRole('combobox', { name: wording.labels.symbol }))
  await user.click(await screen.findByRole('option', { name: symbol }))
}

describe('ReadingScreen', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows idle Symbol prompt and does not fetch until a Symbol is selected', () => {
    const loadReading = vi.fn()
    render(<ReadingScreen loadReading={loadReading} />)

    expect(
      screen.getByText(getMessage('readingLayout.selectSymbolPrompt')),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('reading-workspace')).not.toBeInTheDocument()
    expect(loadReading).not.toHaveBeenCalled()
  })

  it('offers only configured supported Symbols', async () => {
    const user = userEvent.setup()
    render(
      <ReadingScreen
        loadReading={vi.fn(() => new Promise<MarketAnalysisViewModel>(() => {}))}
      />,
    )

    await user.click(screen.getByRole('combobox', { name: wording.labels.symbol }))
    const optionLabels = (await screen.findAllByRole('option')).map(
      (option) => option.textContent,
    )

    expect(optionLabels).toEqual([...SUPPORTED_SYMBOLS])
  })

  it('shows loading while a Reading request is in flight', async () => {
    let resolveRequest!: (value: MarketAnalysisViewModel) => void
    const loadReading = vi.fn(
      () =>
        new Promise<MarketAnalysisViewModel>((resolve) => {
          resolveRequest = resolve
        }),
    )

    render(<ReadingScreen loadReading={loadReading} />)
    await selectSymbol('BTC/USDT')

    expect(await screen.findByText(wording.common.loading)).toBeInTheDocument()
    expect(loadReading).toHaveBeenCalledWith(
      'BTC/USDT',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    )
    expect(screen.queryByTestId('reading-workspace')).not.toBeInTheDocument()

    resolveRequest(fixtureViewModel)
    await waitFor(() => {
      expect(screen.queryByText(wording.common.loading)).not.toBeInTheDocument()
    })
  })

  it('shows error with retry that re-invokes the loader for the selected Symbol', async () => {
    const user = userEvent.setup()
    const loadReading = vi
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(fixtureViewModel)

    render(<ReadingScreen loadReading={loadReading} />)
    await selectSymbol('BTC/USDT')

    expect(await screen.findByText(wording.common.error)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: wording.common.retry }))

    expect(await screen.findByTestId('reading-workspace')).toBeInTheDocument()
    expect(loadReading).toHaveBeenCalledTimes(2)
    expect(loadReading).toHaveBeenNthCalledWith(
      2,
      'BTC/USDT',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('renders the Reading workspace with six Regions on success', async () => {
    const loadReading = vi.fn().mockResolvedValue(fixtureViewModel)
    render(<ReadingScreen loadReading={loadReading} />)
    await selectSymbol('BTC/USDT')

    expect(await screen.findByTestId('reading-workspace')).toBeInTheDocument()
    expect(
      screen.getByText(messages.readingLayout.regionContext),
    ).toBeInTheDocument()
    expect(
      screen.getByText(messages.readingLayout.regionAnalysis),
    ).toBeInTheDocument()
    expect(
      screen.getByText(messages.readingLayout.regionClassification),
    ).toBeInTheDocument()
    expect(
      screen.getByText(messages.readingLayout.regionEvidence),
    ).toBeInTheDocument()
    expect(
      screen.getByText(messages.readingLayout.regionMarketData),
    ).toBeInTheDocument()
    expect(
      screen.getByText(messages.readingLayout.regionDiagnostics),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(getMessage('readingLayout.selectSymbolPrompt')),
    ).not.toBeInTheDocument()
  })

  it('resolves Reading chrome copy from feature locale and brand wording', () => {
    render(<ReadingScreen loadReading={vi.fn()} />)

    expect(
      screen.getByText(messages.readingLayout.selectSymbolPrompt),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: wording.labels.symbol }),
    ).toBeInTheDocument()
    expect(messages.readingLayout).toEqual({
      regionContext: 'Context',
      regionAnalysis: 'Analysis',
      regionClassification: 'Classification',
      regionEvidence: 'Evidence',
      regionMarketData: 'Market Data',
      regionDiagnostics: 'Diagnostics',
      selectSymbolPrompt: 'Select a Symbol to open a Reading.',
      regionPlaceholder: 'Content for this Region will appear here.',
    })
  })
})
