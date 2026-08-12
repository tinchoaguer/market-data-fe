import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wording } from '@maguer/market-data-brand/wording'
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
        {
          open: 42000,
          high: 42200,
          low: 41900,
          close: 42100,
          timestamp: '2024-01-01T00:01:00Z',
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

  it('renders dashboard observation row with chart panel and Market Stats 24H card', () => {
    render(<MarketDataBody data={successFixture} />)

    const body = screen.getByTestId('market-data-composition')
    expect(body).toHaveAttribute('data-unit-id', 'market-data-composition')
    expect(body).toHaveAttribute('data-prominence', 'supporting')
    expect(body).not.toHaveAttribute('data-prominence', 'primary')

    expect(screen.getByTestId('observation-row')).toBeInTheDocument()
    expect(screen.getByTestId('observation-chart')).toBeInTheDocument()
    expect(screen.getByTestId('market-stats-24h')).toBeInTheDocument()

    expect(
      within(unitEl('market-stats-24h')).getByText(
        getMessage('readingObservationRow.statsTitle'),
      ),
    ).toBeInTheDocument()
    expect(
      within(unitEl('market-stats-24h')).getByText(
        getMessage('readingHero.high24h'),
      ),
    ).toBeInTheDocument()
    expect(
      within(unitEl('market-stats-24h')).getByText('42200'),
    ).toBeInTheDocument()
    expect(
      within(unitEl('market-stats-24h')).getByText('41800'),
    ).toBeInTheDocument()

    expect(
      within(unitEl('observation-chart')).getByLabelText(
        getMessage('readingObservationRow.chartTitle'),
      ),
    ).toBeInTheDocument()
    expect(document.querySelector('[data-chart-frame]')).not.toBeNull()
    expect(screen.getByTestId('observation-area-plot')).toBeInTheDocument()
  })

  it('does not present gray-box Price / Order book / tabular Candles as the primary body', () => {
    render(<MarketDataBody data={successFixture} />)

    const body = screen.getByTestId('market-data-composition')
    expect(within(body).queryByText(wording.labels.orderBook)).not.toBeInTheDocument()
    expect(within(body).queryByText(wording.labels.bids)).not.toBeInTheDocument()
    expect(within(body).queryByText(wording.labels.asks)).not.toBeInTheDocument()
    expect(within(body).queryByText(wording.labels.candles)).not.toBeInTheDocument()
    expect(body.querySelector('[data-unit-id="order-book"]')).toBeNull()
    expect(body.querySelector('[data-unit-id="price"]')).toBeNull()
    expect(body.querySelector('[data-unit-id="candles"]')).toBeNull()
    expect(body.querySelector('[data-unit-id="candles-timeframe"]')).toBeNull()
  })

  it('frames the area chart with ChartFrame and TimeframeControl when series exist', async () => {
    const user = userEvent.setup()
    render(<MarketDataBody data={successFixture} />)

    const timeframe = screen.getByRole('radiogroup', {
      name: getMessage('readingHero.timeframe'),
    })
    expect(timeframe).toBeInTheDocument()
    expect(
      within(timeframe).getByRole('radio', { name: '1m' }),
    ).toHaveAttribute('aria-checked', 'true')

    await user.click(within(timeframe).getByRole('radio', { name: '1h' }))

    expect(
      within(timeframe).getByRole('radio', { name: '1h' }),
    ).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByTestId('observation-area-plot')).toBeInTheDocument()
  })

  it('keeps observation row structure when candle series are empty', () => {
    render(<MarketDataBody data={emptyStructureFixture} />)

    const body = screen.getByTestId('market-data-composition')
    expect(screen.getByTestId('observation-row')).toBeInTheDocument()
    expect(screen.getByTestId('observation-chart')).toBeInTheDocument()
    expect(screen.getByTestId('market-stats-24h')).toBeInTheDocument()
    expect(
      within(unitEl('observation-chart')).getByText(
        getMessage('readingObservationRow.emptyChart'),
      ),
    ).toBeInTheDocument()
    expect(
      within(unitEl('market-stats-24h')).queryByText(
        getMessage('readingHero.high24h'),
      ),
    ).not.toBeInTheDocument()

    expect(screen.queryByText(wording.common.error)).not.toBeInTheDocument()
    expect(body.querySelector('[data-evidence-kind]')).toBeNull()
  })

  it('resolves labels from locale catalogs; omits Evidence kinds', () => {
    render(<MarketDataBody data={successFixture} />)

    const body = screen.getByTestId('market-data-composition')
    expect(
      within(body).getByText(getMessage('readingObservationRow.statsTitle')),
    ).toBeInTheDocument()
    expect(getMessage('readingObservationRow.chartTitle')).toBe(
      messages.readingObservationRow.chartTitle,
    )
    expect(getMessage('readingHero.high24h')).toBe(messages.readingHero.high24h)

    expect(within(body).queryByText(getMessage('readingEvidence.drivers'))).not.toBeInTheDocument()
    expect(within(body).queryByText(getMessage('readingEvidence.features'))).not.toBeInTheDocument()
    expect(
      within(body).queryByText(getMessage('readingEvidence.contributions')),
    ).not.toBeInTheDocument()
    expect(body.querySelector('[data-evidence-kind="drivers"]')).toBeNull()
    expect(body.querySelector('[data-unit-id="drivers"]')).toBeNull()
  })

  it('shows observation row shell with empty chart message when no timeframe series exist', () => {
    render(
      <MarketDataBody
        data={{
          ...emptyStructureFixture,
          candlesByTimeframe: [],
        }}
      />,
    )

    expect(screen.getByTestId('observation-row')).toBeInTheDocument()
    expect(
      within(unitEl('observation-chart')).getByText(
        getMessage('readingObservationRow.emptyChart'),
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('radiogroup', {
        name: getMessage('readingHero.timeframe'),
      }),
    ).not.toBeInTheDocument()
  })
})
