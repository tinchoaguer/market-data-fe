import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { wording } from '@market-data/brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import { SUPPORTED_SYMBOLS } from '../../config/symbols'
import type { MarketAnalysisViewModel } from '../../api/marketAnalysis/types'
import { MarketAnalysisScreen } from './MarketAnalysisScreen'

const fixtureViewModel: MarketAnalysisViewModel = {
  symbol: 'BTC/USDT',
  regime: {
    summary: [
      getMessage('analysisLabels.regimeReason.adx_strong'),
      getMessage('analysisLabels.regimeReason.plus_di_dominant'),
    ].join(', '),
    level: getMessage('analysisLabels.regime.TREND_UP'),
  },
  risk: {
    summary: '',
    level: '0.17',
    components: [
      {
        name: getMessage('analysisLabels.riskComponent.atr_expansion'),
        value: 0,
        displayValue: '0%',
      },
      {
        name: getMessage('analysisLabels.riskComponent.liquidity_stress'),
        value: 0.12,
        displayValue: '12%',
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
      {
        name: getMessage('analysisLabels.economicComponent.cost_drag'),
        value: 0.1,
        displayValue: '10%',
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
      {
        name: getMessage('analysisLabels.exposureFactor.liquidity_cap_value'),
        weight: 186197.09,
        displayWeight: '186197.09',
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

describe('MarketAnalysisScreen', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows an empty state and does not fetch until a symbol is selected', () => {
    const loadMarketAnalysis = vi.fn()
    render(<MarketAnalysisScreen loadMarketAnalysis={loadMarketAnalysis} />)

    expect(
      screen.getByText(getMessage('viewMarketAnalysis.empty')),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: getMessage('viewMarketAnalysis.title') }),
    ).toBeInTheDocument()
    expect(loadMarketAnalysis).not.toHaveBeenCalled()
  })

  it('offers only configured supported symbols', async () => {
    const user = userEvent.setup()
    render(
      <MarketAnalysisScreen
        loadMarketAnalysis={vi.fn(() => new Promise<MarketAnalysisViewModel>(() => {}))}
      />,
    )

    await user.click(screen.getByRole('combobox', { name: wording.labels.symbol }))
    const optionLabels = (await screen.findAllByRole('option')).map(
      (option) => option.textContent,
    )

    expect(optionLabels).toEqual([...SUPPORTED_SYMBOLS])
  })

  it('shows loading while a request is in flight', async () => {
    let resolveRequest!: (value: MarketAnalysisViewModel) => void
    const loadMarketAnalysis = vi.fn(
      () =>
        new Promise<MarketAnalysisViewModel>((resolve) => {
          resolveRequest = resolve
        }),
    )

    render(<MarketAnalysisScreen loadMarketAnalysis={loadMarketAnalysis} />)
    await selectSymbol('BTC/USDT')

    expect(await screen.findByText(wording.common.loading)).toBeInTheDocument()
    expect(loadMarketAnalysis).toHaveBeenCalledWith(
      'BTC/USDT',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    )

    resolveRequest(fixtureViewModel)
    await waitFor(() => {
      expect(screen.queryByText(wording.common.loading)).not.toBeInTheDocument()
    })
  })

  it('renders regime, risk, economic, exposure, and recommendation on success', async () => {
    const loadMarketAnalysis = vi.fn().mockResolvedValue(fixtureViewModel)
    render(<MarketAnalysisScreen loadMarketAnalysis={loadMarketAnalysis} />)
    await selectSymbol('BTC/USDT')

    expect(
      await screen.findByRole('heading', { name: wording.labels.regime }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: wording.labels.risk })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: wording.labels.economic }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: wording.labels.exposure }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: wording.labels.recommendation }),
    ).toBeInTheDocument()

    expect(screen.getByText(getMessage('analysisLabels.regime.TREND_UP'))).toBeInTheDocument()
    expect(
      screen.getByText(
        [
          getMessage('analysisLabels.regimeReason.adx_strong'),
          getMessage('analysisLabels.regimeReason.plus_di_dominant'),
        ].join(', '),
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText('TREND_UP')).not.toBeInTheDocument()
    expect(screen.queryByText('adx_strong')).not.toBeInTheDocument()
    expect(screen.getByText('0.17')).toBeInTheDocument()
    expect(
      screen.getByText(getMessage('analysisLabels.riskComponent.atr_expansion')),
    ).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(
      screen.getByText(
        getMessage('analysisLabels.riskComponent.liquidity_stress'),
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('12%')).toBeInTheDocument()
    expect(screen.getByText('0.42')).toBeInTheDocument()
    expect(
      screen.getByText(getMessage('analysisLabels.economicComponent.activity')),
    ).toBeInTheDocument()
    expect(screen.getByText('88%')).toBeInTheDocument()
    expect(
      screen.getByText(getMessage('analysisLabels.economicComponent.cost_drag')),
    ).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
    expect(
      screen.getByText(getMessage('analysisLabels.exposureFactor.vol_budget_pct')),
    ).toBeInTheDocument()
    expect(screen.queryByText('vol_budget_pct')).not.toBeInTheDocument()
    expect(screen.getAllByText('35%').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('186197.09')).toBeInTheDocument()
    expect(
      screen.getAllByText(getMessage('analysisLabels.strategy.TREND_FOLLOWING'))
        .length,
    ).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('TREND_FOLLOWING')).not.toBeInTheDocument()
    expect(
      screen.getByText('Preferred for TREND_UP with acceptable risk'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(getMessage('viewMarketAnalysis.hardGateReason')),
    ).not.toBeInTheDocument()
  })

  it('renders Content-resolved rationale and hard-gate narrative when present', async () => {
    const hardGateText = 'Hard gate: risk score 0.91 is too high.'
    const loadMarketAnalysis = vi.fn().mockResolvedValue({
      ...fixtureViewModel,
      recommendation: {
        ...fixtureViewModel.recommendation,
        rationale: 'Strategy TREND_FOLLOWING is allowed for regime TREND_UP.',
        hardGateReason: hardGateText,
      },
    } satisfies MarketAnalysisViewModel)

    render(<MarketAnalysisScreen loadMarketAnalysis={loadMarketAnalysis} />)
    await selectSymbol('BTC/USDT')

    expect(
      await screen.findByText(
        'Strategy TREND_FOLLOWING is allowed for regime TREND_UP.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(getMessage('viewMarketAnalysis.hardGateReason')),
    ).toBeInTheDocument()
    expect(screen.getByText(hardGateText)).toBeInTheDocument()
    expect(screen.queryByText('catalog.hard_gate.risk_too_high')).not.toBeInTheDocument()
    expect(screen.queryByText(/"code"\s*:/)).not.toBeInTheDocument()
  })

  it('omits hard-gate narrative when hardGateReason is null', async () => {
    const loadMarketAnalysis = vi.fn().mockResolvedValue(fixtureViewModel)
    render(<MarketAnalysisScreen loadMarketAnalysis={loadMarketAnalysis} />)
    await selectSymbol('BTC/USDT')

    expect(
      await screen.findByText('Preferred for TREND_UP with acceptable risk'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(getMessage('viewMarketAnalysis.hardGateReason')),
    ).not.toBeInTheDocument()
  })

  it('does not map raw DTO codes inside analysis screen components', () => {
    const componentFiles = [
      'MarketAnalysisScreen.tsx',
      'AssessmentSections.tsx',
      'ExposureSection.tsx',
      'RecommendationSection.tsx',
    ]
    for (const file of componentFiles) {
      const source = readFileSync(resolve(import.meta.dirname, file), 'utf8')
      expect(source).not.toContain('getAnalysisRegimeLabel')
      expect(source).not.toContain('getAnalysisRegimeReasonLabel')
      expect(source).not.toContain('getStrategyLabel')
      expect(source).not.toContain('getExposureFactorLabel')
      expect(source).not.toContain('getRiskComponentLabel')
      expect(source).not.toContain('getEconomicComponentLabel')
      expect(source).not.toContain('analysisLabels.regime')
      expect(source).not.toContain('TREND_UP')
      expect(source).not.toContain('TREND_FOLLOWING')
      expect(source).not.toContain('vol_budget_pct')
      expect(source).not.toContain('resolveUiMessages')
      expect(source).not.toContain('v1CodeRegistry')
      expect(source).not.toContain('catalog.strategy_allowed')
      expect(source).not.toContain('catalog.hard_gate')
    }
  })

  it('shows an error state with retry that re-requests the selected symbol', async () => {
    const user = userEvent.setup()
    const loadMarketAnalysis = vi
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(fixtureViewModel)

    render(<MarketAnalysisScreen loadMarketAnalysis={loadMarketAnalysis} />)
    await selectSymbol('BTC/USDT')

    expect(await screen.findByText(wording.common.error)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: wording.common.retry }))

    expect(
      await screen.findByRole('heading', { name: wording.labels.regime }),
    ).toBeInTheDocument()
    expect(loadMarketAnalysis).toHaveBeenCalledTimes(2)
    expect(loadMarketAnalysis).toHaveBeenNthCalledWith(
      2,
      'BTC/USDT',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('ignores stale responses when the selection changes', async () => {
    let resolveFirst!: (value: MarketAnalysisViewModel) => void
    let resolveSecond!: (value: MarketAnalysisViewModel) => void

    const loadMarketAnalysis = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<MarketAnalysisViewModel>((resolve) => {
            resolveFirst = resolve
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<MarketAnalysisViewModel>((resolve) => {
            resolveSecond = resolve
          }),
      )

    render(<MarketAnalysisScreen loadMarketAnalysis={loadMarketAnalysis} />)
    await selectSymbol('BTC/USDT')
    await selectSymbol('ETH/USDT')

    resolveFirst({
      ...fixtureViewModel,
      symbol: 'BTC/USDT',
      regime: { ...fixtureViewModel.regime, level: 'STALE_BTC' },
    })
    resolveSecond({
      ...fixtureViewModel,
      symbol: 'ETH/USDT',
      regime: { ...fixtureViewModel.regime, level: 'FRESH_ETH' },
    })

    expect(await screen.findByText('FRESH_ETH')).toBeInTheDocument()
    expect(screen.queryByText('STALE_BTC')).not.toBeInTheDocument()
  })

  it('resolves user-facing copy from brand wording and feature locale keys', () => {
    render(<MarketAnalysisScreen loadMarketAnalysis={vi.fn()} />)

    expect(
      screen.getByRole('heading', { name: messages.viewMarketAnalysis.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(messages.viewMarketAnalysis.empty)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: wording.labels.symbol })).toBeInTheDocument()

    expect(messages.viewMarketAnalysis).toEqual({
      title: 'Analysis',
      empty: 'Select a symbol to view analysis.',
      summary: 'Summary',
      level: 'Level',
      factors: 'Factors',
      factorName: 'Factor',
      factorWeight: 'Weight',
      catalogId: 'Catalog ID',
      rationale: 'Rationale',
      hardGateReason: 'Hard gate',
    })
  })

  it('does not leave idle empty copy visible after a successful load', async () => {
    const loadMarketAnalysis = vi.fn().mockResolvedValue(fixtureViewModel)
    render(<MarketAnalysisScreen loadMarketAnalysis={loadMarketAnalysis} />)
    await selectSymbol('BTC/USDT')

    expect(
      await screen.findByRole('heading', { name: wording.labels.regime }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(getMessage('viewMarketAnalysis.empty')),
    ).not.toBeInTheDocument()
  })
})
