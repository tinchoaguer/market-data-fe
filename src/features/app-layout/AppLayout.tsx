import { useLayoutEffect, useState, type ReactNode } from 'react'
import { Logo } from '@maguer/market-data-brand/logo'
import { defaultLogoConfig } from '@maguer/market-data-brand/logo-config'
import {
  AppBrand,
  AppBrandMark,
  AppBrandName,
  AppHeader,
  AppHeaderBar,
  AppMain,
  AppNav,
  AppShell,
  Button,
  Inline,
  StatusFooter,
  Text,
  ThemeToggle,
  type ThemeAppearance,
} from '@maguer/market-data-brand/ui'
import { wording } from '@maguer/market-data-brand/wording'
import { getMessage } from '../../i18n/messages'
import { ReadingScreen } from '../reading-layout-shell/ReadingScreen'
import {
  DEFAULT_DESTINATION,
  PRIMARY_DESTINATION,
  type DestinationId,
  type PrimaryDestinationId,
  resolveActiveDestination,
} from './destinations'
import {
  applyDocumentTheme,
  DEFAULT_THEME,
  readThemePreference,
  writeThemePreference,
} from './themePreference'

export type AppLayoutProps = {
  /**
   * Optional initial destination. Legacy peer ids (`market-data`, `analysis`,
   * `classification`) redirect into Symbol Reading.
   */
  initialDestination?: DestinationId
  /** Optional Reading screen override for tests. */
  readingScreen?: ReactNode
  /**
   * Optional calendar date for quiet footer chrome.
   * Defaults to today in the runtime locale.
   */
  statusDate?: Date
  /** Optional Live/status kind for quiet footer chrome. */
  statusLive?: 'live' | 'idle'
}

const NAV_ITEMS: { id: PrimaryDestinationId; labelKey: string }[] = [
  { id: PRIMARY_DESTINATION, labelKey: 'appLayout.navReading' },
]

function formatStatusDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function AppLayout({
  initialDestination,
  readingScreen,
  statusDate,
  statusLive = 'live',
}: AppLayoutProps) {
  const [activeDestination, setActiveDestination] =
    useState<PrimaryDestinationId>(() =>
      resolveActiveDestination(initialDestination ?? DEFAULT_DESTINATION),
    )
  const [theme, setTheme] = useState<ThemeAppearance>(
    () => readThemePreference() ?? DEFAULT_THEME,
  )

  useLayoutEffect(() => {
    applyDocumentTheme(theme)
  }, [theme])

  const handleThemeChange = (next: ThemeAppearance) => {
    setTheme(next)
    writeThemePreference(next)
    applyDocumentTheme(next)
  }

  const resolvedStatusDate = statusDate ?? new Date()
  const dateValue = formatStatusDate(resolvedStatusDate)

  return (
    <AppShell>
      <AppHeader data-testid="app-layout-chrome">
        <AppHeaderBar density="slim" data-testid="app-layout-header-bar">
          <AppBrand data-testid="app-layout-brand">
            <AppBrandMark aria-hidden>
              <Logo config={defaultLogoConfig} size={28} />
            </AppBrandMark>
            <AppBrandName>{wording.product.name}</AppBrandName>
          </AppBrand>

          <AppNav
            data-testid="app-layout-nav"
            aria-label={wording.product.name}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeDestination === item.id
              return (
                <Button
                  key={item.id}
                  type="button"
                  size="sm"
                  variant={isActive ? 'primary' : 'ghost'}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActiveDestination(item.id)}
                >
                  {getMessage(item.labelKey)}
                </Button>
              )
            })}
          </AppNav>

          <ThemeToggle
            value={theme}
            onValueChange={handleThemeChange}
            data-testid="app-layout-theme-toggle"
          />
        </AppHeaderBar>
      </AppHeader>

      <AppMain data-testid="app-layout-outlet">
        {activeDestination === PRIMARY_DESTINATION
          ? (readingScreen ?? <ReadingScreen />)
          : null}
      </AppMain>

      <StatusFooter
        data-testid="app-layout-status-footer"
        status={statusLive}
        meta={
          <Inline gap="md" data-testid="app-layout-status-meta">
            <Text size="xs" tone="muted">
              {getMessage('appLayout.statusDate')}: {dateValue}
            </Text>
            <Text size="xs" tone="muted">
              {getMessage('appLayout.statusSource')}: {wording.product.name}
            </Text>
          </Inline>
        }
      />
    </AppShell>
  )
}
