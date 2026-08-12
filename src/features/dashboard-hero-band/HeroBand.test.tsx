import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wording } from '@maguer/market-data-brand/wording'
import type { MarketDataViewModel } from '../../api/marketData/types'
import { getMessage, messages } from '../../i18n/messages'
import { composeSymbolIdentity } from '../reading-context-identity'
import { ContextIdentity } from '../reading-context-identity'
import { HeroBand } from './HeroBand'

const candleSeriesFixture: MarketDataViewModel = {
  symbol: 'BTC/USDT',
  price: 42000.5,
  orderBook: { bids: [], asks: [] },
  candlesByTimeframe: [
    {
      timeframe: '1m',
      candles: [
        {
          open: 40000,
          high: 41000,
          low: 39000,
          close: 40500,
          timestamp: '2024-01-01T00:00:00Z',
        },
        {
          open: 40500,
          high: 43000,
          low: 40000,
          close: 42000.5,
          timestamp: '2024-01-01T00:01:00Z',
        },
      ],
    },
    {
      timeframe: '1h',
      candles: [
        {
          open: 38000,
          high: 45000,
          low: 37000,
          close: 39000,
          timestamp: '2024-01-01T00:00:00Z',
        },
        {
          open: 39000,
          high: 44000,
          low: 38500,
          close: 41000,
          timestamp: '2024-01-01T01:00:00Z',
        },
      ],
    },
  ],
}

const priceOnlyFixture: MarketDataViewModel = {
  symbol: 'ETH/USDT',
  price: 3100,
  orderBook: { bids: [], asks: [] },
  candlesByTimeframe: [],
}

function renderHero(
  marketData: MarketDataViewModel | null,
  symbol = 'BTC/USDT',
) {
  const identity = composeSymbolIdentity(symbol)
  return render(
    <HeroBand
      marketData={marketData}
      identitySlot={<ContextIdentity identity={identity} />}
    />,
  )
}

describe('HeroBand', () => {
  afterEach(() => {
    cleanup()
  })

  it('shows Identity adjacent to price in one hero band on success', () => {
    renderHero(candleSeriesFixture)

    const hero = screen.getByTestId('reading-hero-band')
    const identity = within(hero).getByTestId('context-identity')
    const observation = within(hero).getByTestId('reading-hero-observation')

    expect(hero.querySelector('[data-hero-slot="identity"]')).toContainElement(
      identity,
    )
    expect(
      hero.querySelector('[data-hero-slot="observation"]'),
    ).toContainElement(observation)

    expect(
      within(identity).getByText(
        getMessage('readingContext.symbols.BTC_USDT.displayName'),
      ),
    ).toBeInTheDocument()
    expect(within(identity).getAllByText('BTC/USDT').length).toBeGreaterThanOrEqual(
      2,
    )
    expect(within(observation).getByText(wording.labels.price)).toBeInTheDocument()
    expect(within(observation).getByText('42000.5')).toBeInTheDocument()
  })

  it('keeps Context Identity free of Recommendation, scores, signals, and observation fields', () => {
    renderHero(candleSeriesFixture)

    const identity = screen.getByTestId('context-identity')
    expect(identity).toHaveAttribute('data-identity-body', 'true')
    expect(
      within(identity).queryByText(wording.labels.recommendation),
    ).not.toBeInTheDocument()
    expect(
      within(identity).queryByText(wording.labels.regime),
    ).not.toBeInTheDocument()
    expect(
      within(identity).queryByText(wording.labels.risk),
    ).not.toBeInTheDocument()
    expect(
      within(identity).queryByText(getMessage('viewMarketClassification.score')),
    ).not.toBeInTheDocument()
    expect(within(identity).queryByText(wording.labels.price)).not.toBeInTheDocument()
    expect(
      within(identity).queryByText(getMessage('readingHero.change')),
    ).not.toBeInTheDocument()
    expect(
      within(identity).queryByText(getMessage('readingHero.timeframe')),
    ).not.toBeInTheDocument()
    expect(identity.querySelector('[data-chart-frame]')).toBeNull()
    expect(
      screen.getByTestId('reading-hero-observation').contains(identity),
    ).toBe(false)
    expect(
      identity.contains(screen.getByTestId('reading-hero-observation')),
    ).toBe(false)
  })

  it('renders catalog-linked observation labels and supporting fields from the fixture', () => {
    renderHero(candleSeriesFixture)

    const observation = screen.getByTestId('reading-hero-observation')
    expect(within(observation).getByText(wording.labels.price)).toBeInTheDocument()
    expect(
      within(observation).getByText(getMessage('readingHero.change')),
    ).toBeInTheDocument()
    expect(
      within(observation).getByText(getMessage('readingHero.high24h')),
    ).toBeInTheDocument()
    expect(
      within(observation).getByText(getMessage('readingHero.low24h')),
    ).toBeInTheDocument()
    expect(
      within(observation).getByText(getMessage('readingHero.lastUpdate')),
    ).toBeInTheDocument()
    expect(
      within(observation).queryByText(getMessage('readingHero.volume24h')),
    ).not.toBeInTheDocument()

    expect(getMessage('readingHero.change')).toBe(messages.readingHero.change)
    expect(getMessage('readingHero.high24h')).toBe(messages.readingHero.high24h)
    expect(within(observation).getByText('43000')).toBeInTheDocument()
    expect(within(observation).getByText('39000')).toBeInTheDocument()
  })

  it('emphasizes change with brand semantic tone, not ad-hoc hex', () => {
    renderHero(candleSeriesFixture)

    const observation = screen.getByTestId('reading-hero-observation')
    const changeValue = within(observation).getAllByText(/\+/).find((el) =>
      el.hasAttribute('data-change-direction'),
    )
    expect(changeValue).toBeDefined()
    expect(changeValue).toHaveAttribute('data-change-direction', 'positive')
    expect(changeValue).toHaveAttribute('data-change-tone', 'positive')
    expect(changeValue?.getAttribute('style') ?? '').not.toMatch(/#[0-9a-fA-F]{3,8}/)
  })

  it('frames the sparkline with ChartFrame and uses TimeframeControl when series exist', async () => {
    const user = userEvent.setup()
    renderHero(candleSeriesFixture)

    expect(
      screen.getByLabelText(getMessage('readingHero.sparkline')),
    ).toBeInTheDocument()
    expect(document.querySelector('[data-chart-frame]')).not.toBeNull()
    expect(screen.getByTestId('hero-sparkline-plot')).toBeInTheDocument()

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
    expect(screen.getByTestId('hero-sparkline-plot')).toBeInTheDocument()
  })

  it('omits observation when Market Data is unavailable', () => {
    renderHero(null)

    expect(screen.getByTestId('reading-hero-band')).toBeInTheDocument()
    expect(screen.getByTestId('context-identity')).toBeInTheDocument()
    expect(
      screen.queryByTestId('reading-hero-observation'),
    ).not.toBeInTheDocument()
  })

  it('shows price without sparkline or change when candles are absent', () => {
    renderHero(priceOnlyFixture, 'ETH/USDT')

    const observation = screen.getByTestId('reading-hero-observation')
    expect(within(observation).getByText('3100')).toBeInTheDocument()
    expect(
      within(observation).queryByText(getMessage('readingHero.change')),
    ).not.toBeInTheDocument()
    expect(document.querySelector('[data-chart-frame]')).toBeNull()
    expect(
      screen.queryByRole('radiogroup', {
        name: getMessage('readingHero.timeframe'),
      }),
    ).not.toBeInTheDocument()
  })
})
