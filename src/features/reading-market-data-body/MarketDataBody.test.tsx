import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { wording } from '@market-data/brand/wording'
import type { MarketDataViewModel } from '../../api/marketData/types'
import { getMessage, messages } from '../../i18n/messages'
import { MarketDataBody } from './MarketDataBody'

const successFixture: MarketDataViewModel = {
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

const emptyStructureFixture: MarketDataViewModel = {
  symbol: 'ETH/USDT',
  price: 3100,
  orderBook: { bids: [], asks: [] },
  candlesByTimeframe: [
    { timeframe: '1m', candles: [] },
    { timeframe: '1h', candles: [] },
  ],
}

function unitEl(id: string) {
  const el = document.querySelector(`[data-unit-id="${id}"]`)
  expect(el).not.toBeNull()
  return el as HTMLElement
}

describe('MarketDataBody', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders Price, Order book Bids/Asks, and Candles grouped by timeframe', () => {
    render(<MarketDataBody data={successFixture} />)

    const body = screen.getByTestId('market-data-composition')
    expect(body).toHaveAttribute('data-unit-id', 'market-data-composition')
    expect(body).toHaveAttribute('data-prominence', 'supporting')
    expect(body).not.toHaveAttribute('data-prominence', 'primary')

    const price = within(unitEl('price'))
    expect(price.getByText(wording.labels.price)).toBeInTheDocument()
    expect(price.getByText('42000.5')).toBeInTheDocument()

    const orderBook = within(unitEl('order-book'))
    expect(orderBook.getByText(wording.labels.orderBook)).toBeInTheDocument()
    expect(within(unitEl('order-book-bids')).getByText(wording.labels.bids)).toBe(
      within(unitEl('order-book-bids')).getByText(wording.labels.bids),
    )
    expect(within(unitEl('order-book-asks')).getByText(wording.labels.asks)).toBe(
      within(unitEl('order-book-asks')).getByText(wording.labels.asks),
    )
    expect(within(unitEl('order-book-bids')).getByText('41999')).toBeInTheDocument()
    expect(within(unitEl('order-book-asks')).getByText('42001')).toBeInTheDocument()

    const candles = within(unitEl('candles'))
    expect(candles.getByText(wording.labels.candles)).toBeInTheDocument()
    expect(
      candles.getByLabelText(`${getMessage('viewMarketData.timeframe')} 1m`),
    ).toBeInTheDocument()
    expect(
      candles.getByLabelText(`${getMessage('viewMarketData.timeframe')} 1h`),
    ).toBeInTheDocument()
    expect(candles.getByText('41900')).toBeInTheDocument()
    expect(candles.getByText('41000')).toBeInTheDocument()

    const timeframeGroups = body.querySelectorAll(
      '[data-unit-id="candles-timeframe"]',
    )
    expect(timeframeGroups).toHaveLength(2)
    expect(timeframeGroups[0]).toHaveAttribute('data-timeframe', '1m')
    expect(timeframeGroups[1]).toHaveAttribute('data-timeframe', '1h')
  })

  it('keeps labeled Price / Order book / Candles structure when book and candles are empty', () => {
    render(<MarketDataBody data={emptyStructureFixture} />)

    const body = screen.getByTestId('market-data-composition')
    expect(within(unitEl('price')).getByText('3100')).toBeInTheDocument()
    expect(
      within(unitEl('order-book-bids')).getByText(
        getMessage('readingMarketData.emptyBids'),
      ),
    ).toBeInTheDocument()
    expect(
      within(unitEl('order-book-asks')).getByText(
        getMessage('readingMarketData.emptyAsks'),
      ),
    ).toBeInTheDocument()
    expect(
      within(unitEl('candles')).getByText(wording.labels.candles),
    ).toBeInTheDocument()
    expect(
      within(unitEl('candles')).getAllByText(
        getMessage('readingMarketData.emptyCandles'),
      ),
    ).toHaveLength(2)

    expect(screen.queryByText(wording.common.error)).not.toBeInTheDocument()
    expect(body.querySelector('[data-evidence-kind]')).toBeNull()
  })

  it('resolves labels from brand wording and feature locale; omits Evidence kinds', () => {
    render(<MarketDataBody data={successFixture} />)

    const body = screen.getByTestId('market-data-composition')
    expect(within(unitEl('price')).getByText(wording.labels.price)).toBeInTheDocument()
    expect(within(unitEl('order-book')).getByText(wording.labels.orderBook)).toBeInTheDocument()
    expect(within(unitEl('candles')).getByText(wording.labels.candles)).toBeInTheDocument()
    expect(within(body).getAllByText(getMessage('viewMarketData.timeframe'))[0]).toBe(
      within(body).getAllByText(messages.viewMarketData.timeframe)[0],
    )

    expect(messages.readingMarketData).toEqual({
      emptyBids: 'No Bids levels.',
      emptyAsks: 'No Asks levels.',
      emptyCandles: 'No Candles for this timeframe.',
      sectionPlaceholder: 'Market observation for this section will appear here.',
    })
    expect(getMessage('readingMarketData.emptyBids')).toBe(
      messages.readingMarketData.emptyBids,
    )

    expect(within(body).queryByText(getMessage('readingEvidence.drivers'))).not.toBeInTheDocument()
    expect(within(body).queryByText(getMessage('readingEvidence.features'))).not.toBeInTheDocument()
    expect(
      within(body).queryByText(getMessage('readingEvidence.contributions')),
    ).not.toBeInTheDocument()
    expect(body.querySelector('[data-evidence-kind="drivers"]')).toBeNull()
    expect(body.querySelector('[data-unit-id="drivers"]')).toBeNull()
  })

  it('shows Candles structure with section placeholder when no timeframe series exist', () => {
    render(
      <MarketDataBody
        data={{
          ...emptyStructureFixture,
          candlesByTimeframe: [],
        }}
      />,
    )

    expect(
      within(unitEl('candles')).getByText(
        getMessage('readingMarketData.sectionPlaceholder'),
      ),
    ).toBeInTheDocument()
    expect(
      document.querySelector('[data-unit-id="candles-timeframe"]'),
    ).toBeNull()
  })
})
