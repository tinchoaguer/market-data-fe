import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { wording } from '@maguer/market-data-brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import { resolveUiMessages } from '../../content'
import { SUPPORTED_SYMBOLS } from '../../config/symbols'
import type { MarketClassificationViewModel } from '../../api/marketClassification/types'
import { MarketClassificationScreen } from './MarketClassificationScreen'

function contentText(code: string): string {
  return resolveUiMessages([{ code }])[0]!.text
}

const fixtureViewModel: MarketClassificationViewModel = {
  symbol: 'BTC/USDT',
  regime: [
    {
      source: 'regime',
      score: 0.92,
      reason: contentText('trend_up'),
    },
  ],
  risk: [
    {
      source: 'risk',
      score: 0.31,
      reason: contentText('moderate_risk'),
    },
  ],
  economic: [
    {
      source: 'economic',
      score: 0.64,
      reason: contentText('strong_edge'),
    },
  ],
  exposure: [
    {
      source: 'exposure',
      score: 0.4,
      reason: contentText('ample_capacity'),
    },
  ],
}

async function selectSymbol(symbol: string) {
  const user = userEvent.setup()
  await user.click(screen.getByRole('combobox', { name: wording.labels.symbol }))
  await user.click(await screen.findByRole('option', { name: symbol }))
}

describe('MarketClassificationScreen', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows an empty state and does not fetch until a symbol is selected', () => {
    const loadMarketClassification = vi.fn()
    render(
      <MarketClassificationScreen
        loadMarketClassification={loadMarketClassification}
      />,
    )

    expect(
      screen.getByText(getMessage('viewMarketClassification.empty')),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: getMessage('viewMarketClassification.title'),
      }),
    ).toBeInTheDocument()
    expect(loadMarketClassification).not.toHaveBeenCalled()
  })

  it('offers only configured supported symbols', async () => {
    const user = userEvent.setup()
    render(
      <MarketClassificationScreen
        loadMarketClassification={vi.fn(
          () => new Promise<MarketClassificationViewModel>(() => {}),
        )}
      />,
    )

    await user.click(screen.getByRole('combobox', { name: wording.labels.symbol }))
    const optionLabels = (await screen.findAllByRole('option')).map(
      (option) => option.textContent,
    )

    expect(optionLabels).toEqual([...SUPPORTED_SYMBOLS])
  })

  it('shows loading while a request is in flight', async () => {
    let resolveRequest!: (value: MarketClassificationViewModel) => void
    const loadMarketClassification = vi.fn(
      () =>
        new Promise<MarketClassificationViewModel>((resolve) => {
          resolveRequest = resolve
        }),
    )

    render(
      <MarketClassificationScreen
        loadMarketClassification={loadMarketClassification}
      />,
    )
    await selectSymbol('BTC/USDT')

    expect(await screen.findByText(wording.common.loading)).toBeInTheDocument()
    expect(loadMarketClassification).toHaveBeenCalledWith(
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

  it('renders regime, risk, economic, and exposure signals with source, score, and reason', async () => {
    const loadMarketClassification = vi.fn().mockResolvedValue(fixtureViewModel)
    render(
      <MarketClassificationScreen
        loadMarketClassification={loadMarketClassification}
      />,
    )
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

    expect(screen.getByText('regime')).toBeInTheDocument()
    expect(screen.getByText('0.92')).toBeInTheDocument()
    expect(screen.getByText(contentText('trend_up'))).toBeInTheDocument()
    expect(screen.getByText('risk')).toBeInTheDocument()
    expect(screen.getByText('0.31')).toBeInTheDocument()
    expect(screen.getByText(contentText('moderate_risk'))).toBeInTheDocument()
    expect(screen.getByText('economic')).toBeInTheDocument()
    expect(screen.getByText('0.64')).toBeInTheDocument()
    expect(screen.getByText(contentText('strong_edge'))).toBeInTheDocument()
    expect(screen.getByText('exposure')).toBeInTheDocument()
    expect(screen.getByText('0.4')).toBeInTheDocument()
    expect(screen.getByText(contentText('ample_capacity'))).toBeInTheDocument()

    expect(screen.queryByText('trend_up')).not.toBeInTheDocument()
    expect(screen.queryByText('moderate_risk')).not.toBeInTheDocument()
    expect(screen.queryByText('strong_edge')).not.toBeInTheDocument()
    expect(screen.queryByText('ample_capacity')).not.toBeInTheDocument()

    expect(screen.getAllByText(getMessage('viewMarketClassification.source')).length).toBe(
      4,
    )
    expect(screen.getAllByText(getMessage('viewMarketClassification.score')).length).toBe(4)
    expect(screen.getAllByText(getMessage('viewMarketClassification.reason')).length).toBe(4)
  })

  it('does not map raw DTO reason codes inside classification screen components', () => {
    const componentFiles = [
      'MarketClassificationScreen.tsx',
      'SignalGroupSections.tsx',
    ]
    for (const file of componentFiles) {
      const source = readFileSync(resolve(import.meta.dirname, file), 'utf8')
      expect(source).not.toContain('getClassificationRegimeReasonLabel')
      expect(source).not.toContain('getClassificationRiskReasonLabel')
      expect(source).not.toContain('getClassificationEconomicReasonLabel')
      expect(source).not.toContain('getClassificationExposureReasonLabel')
      expect(source).not.toContain('classificationLabels.')
      expect(source).not.toContain('resolveUiMessages')
      expect(source).not.toContain('v1CodeRegistry')
      expect(source).not.toContain('trend_up')
    }
  })

  it('keeps empty signal groups in success state without treating as error', async () => {
    const loadMarketClassification = vi.fn().mockResolvedValue({
      symbol: 'BTC/USDT',
      regime: [],
      risk: [],
      economic: [],
      exposure: [],
    } satisfies MarketClassificationViewModel)

    render(
      <MarketClassificationScreen
        loadMarketClassification={loadMarketClassification}
      />,
    )
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
    expect(screen.queryByText(wording.common.error)).not.toBeInTheDocument()
  })

  it('shows an error state with retry that re-requests the selected symbol', async () => {
    const user = userEvent.setup()
    const loadMarketClassification = vi
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(fixtureViewModel)

    render(
      <MarketClassificationScreen
        loadMarketClassification={loadMarketClassification}
      />,
    )
    await selectSymbol('BTC/USDT')

    expect(await screen.findByText(wording.common.error)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: wording.common.retry }))

    expect(
      await screen.findByRole('heading', { name: wording.labels.regime }),
    ).toBeInTheDocument()
    expect(loadMarketClassification).toHaveBeenCalledTimes(2)
    expect(loadMarketClassification).toHaveBeenNthCalledWith(
      2,
      'BTC/USDT',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('ignores stale responses when the selection changes', async () => {
    let resolveFirst!: (value: MarketClassificationViewModel) => void
    let resolveSecond!: (value: MarketClassificationViewModel) => void

    const loadMarketClassification = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<MarketClassificationViewModel>((resolve) => {
            resolveFirst = resolve
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<MarketClassificationViewModel>((resolve) => {
            resolveSecond = resolve
          }),
      )

    render(
      <MarketClassificationScreen
        loadMarketClassification={loadMarketClassification}
      />,
    )
    await selectSymbol('BTC/USDT')
    await selectSymbol('ETH/USDT')

    resolveFirst({
      ...fixtureViewModel,
      symbol: 'BTC/USDT',
      regime: [
        {
          source: 'regime',
          score: 0.1,
          reason: 'STALE_BTC',
        },
      ],
    })
    resolveSecond({
      ...fixtureViewModel,
      symbol: 'ETH/USDT',
      regime: [
        {
          source: 'regime',
          score: 0.9,
          reason: 'FRESH_ETH',
        },
      ],
    })

    expect(await screen.findByText('FRESH_ETH')).toBeInTheDocument()
    expect(screen.queryByText('STALE_BTC')).not.toBeInTheDocument()
  })

  it('resolves user-facing copy from brand wording and feature locale keys', () => {
    render(<MarketClassificationScreen loadMarketClassification={vi.fn()} />)

    expect(
      screen.getByRole('heading', {
        name: messages.viewMarketClassification.title,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(messages.viewMarketClassification.empty),
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: wording.labels.symbol })).toBeInTheDocument()

    expect(messages.viewMarketClassification).toEqual({
      title: 'Classification',
      empty: 'Select a symbol to view classification.',
      source: 'Source',
      score: 'Score',
      reason: 'Reason',
    })
  })

  it('does not leave idle empty copy visible after a successful load', async () => {
    const loadMarketClassification = vi.fn().mockResolvedValue(fixtureViewModel)
    render(
      <MarketClassificationScreen
        loadMarketClassification={loadMarketClassification}
      />,
    )
    await selectSymbol('BTC/USDT')

    expect(
      await screen.findByRole('heading', { name: wording.labels.regime }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(getMessage('viewMarketClassification.empty')),
    ).not.toBeInTheDocument()
  })
})
