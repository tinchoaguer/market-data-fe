import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wording } from '@maguer/market-data-brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import { ReadingWorkspace } from '../reading-layout-shell/ReadingWorkspace'
import { ReadingScreen } from '../reading-layout-shell/ReadingScreen'
import { AppLayout } from './AppLayout'
import { LEGACY_DESTINATIONS } from './destinations'
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  applyDocumentTheme,
} from './themePreference'

describe('AppLayout', () => {
  beforeEach(() => {
    window.localStorage.clear()
    applyDocumentTheme(DEFAULT_THEME)
  })

  afterEach(() => {
    cleanup()
    window.localStorage.clear()
    applyDocumentTheme(DEFAULT_THEME)
  })

  it('presents slim header with brand mark and product name', () => {
    render(<AppLayout readingScreen={<div>Reading content</div>} />)

    const headerBar = screen.getByTestId('app-layout-header-bar')
    expect(headerBar).toHaveAttribute('data-header-density', 'slim')

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
    expect(screen.getByTestId('app-layout-theme-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('app-layout-status-footer')).toBeInTheDocument()
  })

  it('presents brand ThemeToggle and applies theme on the document root', async () => {
    const user = userEvent.setup()
    render(<AppLayout readingScreen={<div>Reading content</div>} />)

    const toggle = screen.getByRole('switch', {
      name: wording.common.themeToggle,
    })
    expect(toggle).toBe(screen.getByTestId('app-layout-theme-toggle'))
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-checked', 'false')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('persists theme preference across remount', async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <AppLayout readingScreen={<div>Reading content</div>} />,
    )

    await user.click(
      screen.getByRole('switch', { name: wording.common.themeToggle }),
    )
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')

    unmount()
    cleanup()

    render(<AppLayout readingScreen={<div>Reading content</div>} />)

    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(
      screen.getByRole('switch', { name: wording.common.themeToggle }),
    ).toHaveAttribute('aria-checked', 'false')
  })

  it('omits breadcrumb chrome so legacy peers cannot compete as crumbs', () => {
    render(<AppLayout readingScreen={<div>Reading content</div>} />)

    expect(screen.queryByTestId('app-layout-breadcrumb')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: /breadcrumb/i }),
    ).not.toBeInTheDocument()
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
  })

  it('shows quiet StatusFooter with date, source, and Live from catalogs', () => {
    const statusDate = new Date(2026, 7, 11)
    render(
      <AppLayout
        readingScreen={<div>Reading content</div>}
        statusDate={statusDate}
      />,
    )

    const footer = screen.getByTestId('app-layout-status-footer')
    expect(footer).toHaveAttribute('data-status', 'live')
    expect(
      within(footer).getByText(wording.common.live),
    ).toBeInTheDocument()

    const expectedDate = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(statusDate)

    expect(
      within(footer).getByText(
        `${getMessage('appLayout.statusDate')}: ${expectedDate}`,
      ),
    ).toBeInTheDocument()
    expect(
      within(footer).getByText(
        `${getMessage('appLayout.statusSource')}: ${wording.product.name}`,
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

  it('resolves chrome copy from brand wording and locale catalogs', () => {
    render(
      <AppLayout
        readingScreen={<div>Reading content</div>}
        statusDate={new Date(2026, 7, 11)}
      />,
    )

    expect(
      within(screen.getByTestId('app-layout-brand')).getByText(
        wording.product.name,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: messages.appLayout.navReading }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('switch', { name: wording.common.themeToggle }),
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('app-layout-status-footer')).getByText(
        wording.common.live,
      ),
    ).toBeInTheDocument()
    expect(getMessage('appLayout.navReading')).toBe(
      messages.appLayout.navReading,
    )
    expect(getMessage('appLayout.statusDate')).toBe(
      messages.appLayout.statusDate,
    )
    expect(getMessage('appLayout.statusSource')).toBe(
      messages.appLayout.statusSource,
    )
    expect(messages.appLayout.navReading).toBe('Reading')
  })

  it('keeps Reading idle/loading/error usable under updated chrome', async () => {
    const user = userEvent.setup()
    let rejectReading: (error: Error) => void = () => {}
    const loadReading = vi.fn(
      () =>
        new Promise((_, reject) => {
          rejectReading = reject
        }),
    )

    render(
      <AppLayout
        readingScreen={
          <ReadingScreen
            loadReading={loadReading as never}
            loadClassification={vi.fn().mockResolvedValue(null)}
            loadMarketData={vi.fn().mockResolvedValue(null)}
          />
        }
      />,
    )

    expect(screen.getByTestId('app-layout-chrome')).toBeInTheDocument()
    expect(
      screen.getByText(getMessage('readingLayout.selectSymbolPrompt')),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('combobox', { name: wording.labels.symbol }),
    )
    await user.click(await screen.findByRole('option', { name: 'BTC/USDT' }))

    expect(screen.getByText(wording.common.loading)).toBeInTheDocument()
    expect(screen.getByTestId('app-layout-theme-toggle')).toBeInTheDocument()

    rejectReading(new Error('network'))
    expect(
      await screen.findByText(wording.common.error),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: wording.common.retry }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('app-layout-status-footer')).toBeInTheDocument()
  })
})
