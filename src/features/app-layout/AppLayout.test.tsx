import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wording } from '@maguer/market-data-brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import { ReadingWorkspace } from '../reading-layout-shell/ReadingWorkspace'
import { AppLayout } from './AppLayout'
import { LEGACY_DESTINATIONS } from './destinations'

describe('AppLayout', () => {
  afterEach(() => {
    cleanup()
  })

  it('presents brand name and logo region in chrome', () => {
    render(<AppLayout readingScreen={<div>Reading content</div>} />)

    const brand = screen.getByTestId('app-layout-brand')
    expect(within(brand).getByText(wording.product.name)).toBeInTheDocument()
    expect(brand.querySelector('svg')).not.toBeNull()
  })

  it('exposes Reading as the sole primary Symbol-inspection nav destination', () => {
    render(<AppLayout readingScreen={<div>Reading content</div>} />)

    const nav = screen.getByTestId('app-layout-nav')
    expect(
      within(nav).getByRole('button', {
        name: getMessage('appLayout.navReading'),
      }),
    ).toBeInTheDocument()
    expect(
      within(nav).queryByRole('button', {
        name: getMessage('appLayout.navMarketData'),
      }),
    ).not.toBeInTheDocument()
    expect(
      within(nav).queryByRole('button', {
        name: getMessage('appLayout.navAnalysis'),
      }),
    ).not.toBeInTheDocument()
    expect(
      within(nav).queryByRole('button', {
        name: getMessage('appLayout.navClassification'),
      }),
    ).not.toBeInTheDocument()
    expect(within(nav).getAllByRole('button')).toHaveLength(1)
  })

  it('defaults to Symbol Reading and marks Reading active', () => {
    render(<AppLayout readingScreen={<div>Reading content</div>} />)

    expect(screen.getByText('Reading content')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: getMessage('appLayout.navReading') }),
    ).toHaveAttribute('aria-current', 'page')
  })

  it('shows the Reading workspace when the Reading nav control is activated', async () => {
    const user = userEvent.setup()
    render(<AppLayout readingScreen={<div>Reading content</div>} />)

    await user.click(
      screen.getByRole('button', { name: getMessage('appLayout.navReading') }),
    )
    expect(screen.getByText('Reading content')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: getMessage('appLayout.navReading') }),
    ).toHaveAttribute('aria-current', 'page')
  })

  it('redirects legacy peer destination ids into Symbol Reading', () => {
    for (const legacyId of LEGACY_DESTINATIONS) {
      cleanup()
      render(
        <AppLayout
          initialDestination={legacyId}
          readingScreen={<div data-testid="reading-surface">Reading content</div>}
        />,
      )

      expect(screen.getByTestId('reading-surface')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: getMessage('appLayout.navReading') }),
      ).toHaveAttribute('aria-current', 'page')
      expect(
        screen.queryByRole('button', {
          name: getMessage('appLayout.navMarketData'),
        }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', {
          name: getMessage('appLayout.navAnalysis'),
        }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', {
          name: getMessage('appLayout.navClassification'),
        }),
      ).not.toBeInTheDocument()
    }
  })

  it('keeps chrome structure mounted while Reading is shown', () => {
    render(<AppLayout readingScreen={<div>Reading content</div>} />)

    const chrome = screen.getByTestId('app-layout-chrome')
    const nav = screen.getByTestId('app-layout-nav')

    expect(screen.getByTestId('app-layout-chrome')).toBe(chrome)
    expect(screen.getByTestId('app-layout-nav')).toBe(nav)
    expect(within(chrome).getByTestId('app-layout-brand')).toBeInTheDocument()
    expect(
      within(screen.getByTestId('app-layout-brand')).getByText(
        wording.product.name,
      ),
    ).toBeInTheDocument()
  })

  it('mounts ReadingScreen by default with Symbol selection idle prompt', () => {
    render(<AppLayout />)

    expect(
      screen.getByText(getMessage('readingLayout.selectSymbolPrompt')),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: wording.labels.symbol }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(messages.appLayout.analysisPlaceholder),
    ).not.toBeInTheDocument()
  })

  it('preserves Reading Region hierarchy when the Reading host is mounted', () => {
    render(
      <AppLayout
        readingScreen={<ReadingWorkspace symbol="BTC/USDT" />}
      />,
    )

    const workspace = screen.getByTestId('reading-workspace')
    const analysis = workspace.querySelector('[data-region-id="analysis"]')
    const marketData = workspace.querySelector('[data-region-id="market-data"]')
    const context = workspace.querySelector('[data-region-id="context"]')

    expect(analysis).toHaveAttribute('data-prominence', 'primary')
    expect(marketData).not.toHaveAttribute('data-prominence', 'primary')

    const regions = Array.from(
      workspace.querySelectorAll('[data-region-id]'),
    ).map((node) => node.getAttribute('data-region-id'))
    expect(regions.indexOf('context')).toBeLessThan(
      regions.indexOf('market-data'),
    )
    expect(regions.indexOf('analysis')).toBeLessThan(
      regions.indexOf('market-data'),
    )
    expect(context).not.toBeNull()
  })

  it('resolves Reading nav label and brand name from catalogs', () => {
    render(<AppLayout readingScreen={<div>Reading content</div>} />)

    expect(
      within(screen.getByTestId('app-layout-brand')).getByText(
        wording.product.name,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: messages.appLayout.navReading }),
    ).toBeInTheDocument()
    expect(getMessage('appLayout.navReading')).toBe(
      messages.appLayout.navReading,
    )
    expect(messages.appLayout.navReading).toBe('Reading')
  })
})
