import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
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
    summary: '',
    level: '0.17',
    components: [
      {
        name: getMessage('analysisLabels.riskComponent.volatility'),
        value: 0.1,
        displayValue: '10%',
      },
    ],
  },
  economic: {
    summary: '',
    level: '0.42',
    components: [
      {
        name: getMessage('analysisLabels.economicComponent.activity'),
        value: 0.88,
        displayValue: '88%',
      },
    ],
  },
  exposure: {
    summary: '35%',
    factors: [
      {
        name: getMessage('analysisLabels.exposureFactor.vol_budget_pct'),
        weight: 0.35,
        displayWeight: '35%',
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

const idleSupportingLoaders = {
  loadClassification: vi.fn().mockResolvedValue(null),
  loadMarketData: vi.fn().mockResolvedValue(null),
} as const

describe('ReadingScreen', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows idle Symbol prompt and does not fetch until a Symbol is selected', () => {
    const loadReading = vi.fn()
    render(
      <ReadingScreen loadReading={loadReading} {...idleSupportingLoaders} />,
    )

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
        {...idleSupportingLoaders}
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

    render(
      <ReadingScreen loadReading={loadReading} {...idleSupportingLoaders} />,
    )
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

    render(
      <ReadingScreen loadReading={loadReading} {...idleSupportingLoaders} />,
    )
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
    render(
      <ReadingScreen loadReading={loadReading} {...idleSupportingLoaders} />,
    )
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
    render(
      <ReadingScreen loadReading={vi.fn()} {...idleSupportingLoaders} />,
    )

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
      classificationSummaryLabel: 'Signal counts',
    })
  })

  it('mounts Assessments composition inside Analysis with Evidence outside in document order', async () => {
    const loadReading = vi.fn().mockResolvedValue(fixtureViewModel)
    render(
      <ReadingScreen loadReading={loadReading} {...idleSupportingLoaders} />,
    )
    await selectSymbol('BTC/USDT')

    const analysisRegion = await screen.findByTestId('reading-region-analysis')
    const assessments = within(analysisRegion).getByTestId(
      'assessments-workspace',
    )
    expect(assessments).toBeInTheDocument()
    expect(
      within(assessments).getByText(wording.labels.regime),
    ).toBeInTheDocument()
    expect(
      within(assessments).getByText(wording.labels.recommendation),
    ).toBeInTheDocument()
    expect(
      within(assessments).queryByText(messages.readingLayout.regionEvidence),
    ).not.toBeInTheDocument()
    expect(
      within(assessments).queryByText(
        messages.readingLayout.regionClassification,
      ),
    ).not.toBeInTheDocument()

    const workspace = screen.getByTestId('reading-workspace')
    const regionIds = Array.from(
      workspace.querySelectorAll('[data-region-id]'),
    ).map((node) => node.getAttribute('data-region-id'))

    expect(regionIds.indexOf('analysis')).toBeLessThan(
      regionIds.indexOf('evidence'),
    )
    expect(
      screen.getByTestId('reading-region-evidence').contains(assessments),
    ).toBe(false)
  })

  it('wires claim Narrative and supporting Classification/Market Data summaries when loaders succeed', async () => {
    const loadReading = vi.fn().mockResolvedValue(fixtureViewModel)
    const loadClassification = vi.fn().mockResolvedValue({
      symbol: 'BTC/USDT',
      regime: [{ source: 'a', score: 1, reason: 'r' }],
      risk: [],
      economic: [],
      exposure: [],
    })
    const loadMarketData = vi.fn().mockResolvedValue({
      symbol: 'BTC/USDT',
      price: 42000,
      orderBook: { bids: [], asks: [] },
      candlesByTimeframe: [],
    })

    render(
      <ReadingScreen
        loadReading={loadReading}
        loadClassification={loadClassification}
        loadMarketData={loadMarketData}
      />,
    )
    await selectSymbol('BTC/USDT')

    const analysisRegion = await screen.findByTestId('reading-region-analysis')
    expect(
      within(analysisRegion).getByText(fixtureViewModel.regime.summary),
    ).toBeInTheDocument()
    expect(
      analysisRegion.querySelector('[data-claim-narrative="regime"]'),
    ).not.toBeNull()

    expect(
      await screen.findByTestId('classification-region-summary'),
    ).toBeInTheDocument()
    expect(
      await screen.findByTestId('market-data-region-summary'),
    ).toBeInTheDocument()
    expect(screen.getByText('42000')).toBeInTheDocument()
  })
})
