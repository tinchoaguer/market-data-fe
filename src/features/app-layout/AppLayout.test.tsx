import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wording } from '@market-data/brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import { AppLayout } from './AppLayout'

describe('AppLayout', () => {
  afterEach(() => {
    cleanup()
  })

  it('presents brand name and logo region in chrome', () => {
    render(<AppLayout marketDataScreen={<div>Market data content</div>} />)

    const brand = screen.getByTestId('app-layout-brand')
    expect(within(brand).getByText(wording.product.name)).toBeInTheDocument()
    expect(brand.querySelector('svg')).not.toBeNull()
  })

  it('exposes navigation for Market Data, Analysis, and Classification', () => {
    render(<AppLayout marketDataScreen={<div>Market data content</div>} />)

    expect(
      screen.getByRole('button', { name: getMessage('appLayout.navMarketData') }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: getMessage('appLayout.navAnalysis') }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: getMessage('appLayout.navClassification'),
      }),
    ).toBeInTheDocument()
  })

  it('defaults to Market Data and marks it active', () => {
    render(<AppLayout marketDataScreen={<div>Market data content</div>} />)

    expect(screen.getByText('Market data content')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: getMessage('appLayout.navMarketData') }),
    ).toHaveAttribute('aria-current', 'page')
    expect(
      screen.getByRole('button', { name: getMessage('appLayout.navAnalysis') }),
    ).not.toHaveAttribute('aria-current')
  })

  it('updates outlet content when navigating between destinations', async () => {
    const user = userEvent.setup()
    render(<AppLayout marketDataScreen={<div>Market data content</div>} />)

    await user.click(
      screen.getByRole('button', { name: getMessage('appLayout.navAnalysis') }),
    )
    expect(
      screen.getByText(getMessage('appLayout.analysisPlaceholder')),
    ).toBeInTheDocument()
    expect(screen.queryByText('Market data content')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: getMessage('appLayout.navClassification'),
      }),
    )
    expect(
      screen.getByText(getMessage('appLayout.classificationPlaceholder')),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(getMessage('appLayout.analysisPlaceholder')),
    ).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: getMessage('appLayout.navMarketData') }),
    )
    expect(screen.getByText('Market data content')).toBeInTheDocument()
  })

  it('visually indicates the active destination via aria-current', async () => {
    const user = userEvent.setup()
    render(<AppLayout marketDataScreen={<div>Market data content</div>} />)

    const analysis = screen.getByRole('button', {
      name: getMessage('appLayout.navAnalysis'),
    })
    await user.click(analysis)

    expect(analysis).toHaveAttribute('aria-current', 'page')
    expect(
      screen.getByRole('button', { name: getMessage('appLayout.navMarketData') }),
    ).not.toHaveAttribute('aria-current')
    expect(
      screen.getByRole('button', {
        name: getMessage('appLayout.navClassification'),
      }),
    ).not.toHaveAttribute('aria-current')
  })

  it('keeps chrome structure mounted when switching destinations', async () => {
    const user = userEvent.setup()
    render(<AppLayout marketDataScreen={<div>Market data content</div>} />)

    const chrome = screen.getByTestId('app-layout-chrome')
    const nav = screen.getByTestId('app-layout-nav')

    await user.click(
      screen.getByRole('button', { name: getMessage('appLayout.navAnalysis') }),
    )
    expect(screen.getByTestId('app-layout-chrome')).toBe(chrome)
    expect(screen.getByTestId('app-layout-nav')).toBe(nav)
    expect(within(chrome).getByTestId('app-layout-brand')).toBeInTheDocument()
    expect(
      within(screen.getByTestId('app-layout-brand')).getByText(
        wording.product.name,
      ),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: getMessage('appLayout.navClassification'),
      }),
    )
    expect(screen.getByTestId('app-layout-chrome')).toBe(chrome)
    expect(screen.getByTestId('app-layout-nav')).toBe(nav)
    expect(
      within(screen.getByTestId('app-layout-brand')).getByText(
        wording.product.name,
      ),
    ).toBeInTheDocument()
  })

  it('renders Analysis and Classification stub placeholders', async () => {
    const user = userEvent.setup()
    render(<AppLayout marketDataScreen={<div>Market data content</div>} />)

    await user.click(
      screen.getByRole('button', { name: getMessage('appLayout.navAnalysis') }),
    )
    expect(messages.appLayout.analysisPlaceholder).toBe(
      'Analysis is not available yet.',
    )
    expect(
      screen.getByText(messages.appLayout.analysisPlaceholder),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: getMessage('appLayout.navClassification'),
      }),
    )
    expect(messages.appLayout.classificationPlaceholder).toBe(
      'Classification is not available yet.',
    )
    expect(
      screen.getByText(messages.appLayout.classificationPlaceholder),
    ).toBeInTheDocument()
  })

  it('resolves nav and stub copy from brand wording and feature locale keys', async () => {
    const user = userEvent.setup()
    render(<AppLayout marketDataScreen={<div>Market data content</div>} />)

    expect(
      within(screen.getByTestId('app-layout-brand')).getByText(
        wording.product.name,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: messages.appLayout.navMarketData }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: messages.appLayout.navAnalysis }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: messages.appLayout.navClassification }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: messages.appLayout.navAnalysis }),
    )
    expect(
      screen.getByText(messages.appLayout.analysisPlaceholder),
    ).toBeInTheDocument()
  })
})
