import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wording } from '@maguer/market-data-brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import { SUPPORTED_SYMBOLS } from '../../config/symbols'
import type { MarketDataViewModel } from '../../api/marketData/types'
import { MarketDataScreen } from './MarketDataScreen'

const fixtureViewModel: MarketDataViewModel = {
  symbol: 'BTC/USDT',
  price: 42000.5,
  orderBook: {
    bids: [{ price: 41999, quantity: 1.2 }],
    asks: [{ price: 42001, quantity: 0.8 }],
  },
  candlesByTimeframe: [
    {
      timeframe: '1m',
      candles: [
        {
          open: 41900,
          high: 42100,
          low: 41800,
          close: 42000,
          timestamp: '2024-01-01T00:00:00Z',
        },
      ],
    },
    {
      timeframe: '1h',
      candles: [
        {
          open: 41000,
          high: 43000,
          low: 40500,
          close: 42001.5,
          timestamp: '2024-01-01T01:00:00Z',
        },
      ],
    },
  ],
}

async function selectSymbol(symbol: string) {
  const user = userEvent.setup()
  await user.click(screen.getByRole('combobox', { name: wording.labels.symbol }))
  await user.click(await screen.findByRole('option', { name: symbol }))
}

describe('MarketDataScreen', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows an empty state and does not fetch until a symbol is selected', () => {
    const loadMarketData = vi.fn()
    render(<MarketDataScreen loadMarketData={loadMarketData} />)

    expect(screen.getByText(getMessage('viewMarketData.empty'))).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: getMessage('viewMarketData.title') })).toBeInTheDocument()
    expect(loadMarketData).not.toHaveBeenCalled()
  })

  it('offers only configured supported symbols', async () => {
    const user = userEvent.setup()
    render(
      <MarketDataScreen
        loadMarketData={vi.fn(() => new Promise<MarketDataViewModel>(() => {}))}
      />,
    )

    await user.click(screen.getByRole('combobox', { name: wording.labels.symbol }))
    const optionLabels = (await screen.findAllByRole('option')).map(
      (option) => option.textContent,
    )

    expect(optionLabels).toEqual([...SUPPORTED_SYMBOLS])
  })

  it('shows loading while a request is in flight', async () => {
    let resolveRequest!: (value: MarketDataViewModel) => void
    const loadMarketData = vi.fn(
      () =>
        new Promise<MarketDataViewModel>((resolve) => {
          resolveRequest = resolve
        }),
    )

    render(<MarketDataScreen loadMarketData={loadMarketData} />)
    await selectSymbol('BTC/USDT')

    expect(await screen.findByText(wording.common.loading)).toBeInTheDocument()
    expect(loadMarketData).toHaveBeenCalledWith(
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

  it('renders price, order book, and candle series on success', async () => {
    const loadMarketData = vi.fn().mockResolvedValue(fixtureViewModel)
    render(<MarketDataScreen loadMarketData={loadMarketData} />)
    await selectSymbol('BTC/USDT')

    expect(await screen.findByRole('heading', { name: wording.labels.price })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: wording.labels.orderBook })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: wording.labels.bids })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: wording.labels.asks })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: wording.labels.candles })).toBeInTheDocument()

    const priceCard = screen.getByRole('heading', { name: wording.labels.price }).closest('div')!
      .parentElement!
    expect(within(priceCard).getByText('42000.5')).toBeInTheDocument()
    expect(screen.getByText('41999')).toBeInTheDocument()
    expect(screen.getByText('42001')).toBeInTheDocument()
    expect(
      screen.getByLabelText(`${getMessage('viewMarketData.timeframe')} 1m`),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(`${getMessage('viewMarketData.timeframe')} 1h`),
    ).toBeInTheDocument()
    expect(screen.getByText('41900')).toBeInTheDocument()
    expect(screen.getByText('41000')).toBeInTheDocument()
  })

  it('shows an error state with retry that re-requests the selected symbol', async () => {
    const user = userEvent.setup()
    const loadMarketData = vi
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(fixtureViewModel)

    render(<MarketDataScreen loadMarketData={loadMarketData} />)
    await selectSymbol('BTC/USDT')

    expect(await screen.findByText(wording.common.error)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: wording.common.retry }))

    const priceCard = (
      await screen.findByRole('heading', { name: wording.labels.price })
    ).closest('div')!.parentElement!
    expect(within(priceCard).getByText('42000.5')).toBeInTheDocument()
    expect(loadMarketData).toHaveBeenCalledTimes(2)
    expect(loadMarketData).toHaveBeenNthCalledWith(
      2,
      'BTC/USDT',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('ignores stale responses when the selection changes', async () => {
    let resolveFirst!: (value: MarketDataViewModel) => void
    let resolveSecond!: (value: MarketDataViewModel) => void

    const loadMarketData = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<MarketDataViewModel>((resolve) => {
            resolveFirst = resolve
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<MarketDataViewModel>((resolve) => {
            resolveSecond = resolve
          }),
      )

    render(<MarketDataScreen loadMarketData={loadMarketData} />)
    await selectSymbol('BTC/USDT')
    await selectSymbol('ETH/USDT')

    resolveFirst({ ...fixtureViewModel, symbol: 'BTC/USDT', price: 111 })
    resolveSecond({ ...fixtureViewModel, symbol: 'ETH/USDT', price: 3500 })

    const priceCard = (
      await screen.findByRole('heading', { name: wording.labels.price })
    ).closest('div')!.parentElement!
    expect(within(priceCard).getByText('3500')).toBeInTheDocument()
    expect(within(priceCard).queryByText('111')).not.toBeInTheDocument()
  })

  it('resolves user-facing copy from brand wording and feature locale keys', () => {
    render(<MarketDataScreen loadMarketData={vi.fn()} />)

    expect(screen.getByRole('heading', { name: messages.viewMarketData.title })).toBeInTheDocument()
    expect(screen.getByText(messages.viewMarketData.empty)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: wording.labels.symbol })).toBeInTheDocument()

    expect(messages.viewMarketData).toEqual({
      title: 'Market data',
      empty: 'Select a symbol to view market data.',
      timeframe: 'Timeframe',
    })
  })

  it('does not leave idle empty copy visible after a successful load', async () => {
    const loadMarketData = vi.fn().mockResolvedValue(fixtureViewModel)
    render(<MarketDataScreen loadMarketData={loadMarketData} />)
    await selectSymbol('BTC/USDT')

    const priceHeading = await screen.findByRole('heading', { name: wording.labels.price })
    expect(screen.queryByText(getMessage('viewMarketData.empty'))).not.toBeInTheDocument()
    expect(within(priceHeading.closest('div')!.parentElement!).getByText('42000.5')).toBeInTheDocument()
  })
})
