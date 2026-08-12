import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { wording } from '@maguer/market-data-brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import { composeSymbolIdentity } from './composeSymbolIdentity'
import { ContextIdentity } from './ContextIdentity'

describe('ContextIdentity', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders Identity beyond a bare ticker with catalog-linked field labels', () => {
    const identity = composeSymbolIdentity('BTC/USDT')
    render(<ContextIdentity identity={identity} />)

    const body = screen.getByTestId('context-identity')
    expect(
      within(body).getByText(wording.labels.symbol),
    ).toBeInTheDocument()
    expect(
      within(body).getByText(getMessage('readingContext.displayName')),
    ).toBeInTheDocument()
    expect(
      within(body).getByText(getMessage('readingContext.pair')),
    ).toBeInTheDocument()
    expect(
      within(body).getByText(getMessage('readingContext.base')),
    ).toBeInTheDocument()
    expect(
      within(body).getByText(getMessage('readingContext.quote')),
    ).toBeInTheDocument()

    expect(
      within(body).getByText(
        getMessage('readingContext.symbols.BTC_USDT.displayName'),
      ),
    ).toBeInTheDocument()
    expect(within(body).getAllByText('BTC/USDT').length).toBeGreaterThanOrEqual(2)
    expect(within(body).getByText('BTC', { exact: true })).toBeInTheDocument()
    expect(within(body).getByText('USDT', { exact: true })).toBeInTheDocument()

    // Labels resolve through locale catalog (not unbound literals alone).
    expect(getMessage('readingContext.displayName')).toBe(
      messages.readingContext.displayName,
    )
    expect(getMessage('readingContext.pair')).toBe(messages.readingContext.pair)
  })

  it('omits venue when absent and shows venue with catalog label when present', () => {
    const withoutVenue = composeSymbolIdentity('ETH/USDT')
    const { rerender } = render(<ContextIdentity identity={withoutVenue} />)

    expect(
      screen.queryByText(getMessage('readingContext.venue')),
    ).not.toBeInTheDocument()

    rerender(
      <ContextIdentity
        identity={composeSymbolIdentity('ETH/USDT', { venue: 'Binance' })}
      />,
    )
    expect(
      screen.getByText(getMessage('readingContext.venue')),
    ).toBeInTheDocument()
    expect(screen.getByText('Binance')).toBeInTheDocument()
  })

  it('renders a Symbol logo when cataloged and omits it when unavailable', () => {
    const { rerender } = render(
      <ContextIdentity identity={composeSymbolIdentity('BTC/USDT')} />,
    )

    const logo = screen.getByTestId('context-identity-logo')
    expect(logo).toHaveAttribute('src', '/symbols/btc.svg')
    expect(logo).toHaveAttribute(
      'alt',
      getMessage('readingContext.symbols.BTC_USDT.displayName'),
    )

    rerender(
      <ContextIdentity identity={composeSymbolIdentity('SOL/USDT')} />,
    )
    expect(screen.queryByTestId('context-identity-logo')).not.toBeInTheDocument()
  })

  it('does not render price, scores, signals, recommendation, or timeframe in Identity', () => {
    render(<ContextIdentity identity={composeSymbolIdentity('BTC/USDT')} />)

    const body = screen.getByTestId('context-identity')
    expect(within(body).queryByText(wording.labels.price)).not.toBeInTheDocument()
    expect(
      within(body).queryByText(wording.labels.recommendation),
    ).not.toBeInTheDocument()
    expect(within(body).queryByText(wording.labels.regime)).not.toBeInTheDocument()
    expect(within(body).queryByText(wording.labels.risk)).not.toBeInTheDocument()
    expect(
      within(body).queryByText(wording.labels.economic),
    ).not.toBeInTheDocument()
    expect(
      within(body).queryByText(wording.labels.exposure),
    ).not.toBeInTheDocument()
    expect(
      within(body).queryByText(getMessage('viewMarketData.timeframe')),
    ).not.toBeInTheDocument()
    expect(within(body).queryByText('Timeframe')).not.toBeInTheDocument()
  })
})
