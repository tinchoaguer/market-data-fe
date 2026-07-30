import { useState, type ReactNode } from 'react'
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

export type AppLayoutProps = {
  /**
   * Optional initial destination. Legacy peer ids (`market-data`, `analysis`,
   * `classification`) redirect into Symbol Reading.
   */
  initialDestination?: DestinationId
  /** Optional Reading screen override for tests. */
  readingScreen?: ReactNode
}

const NAV_ITEMS: { id: PrimaryDestinationId; labelKey: string }[] = [
  { id: PRIMARY_DESTINATION, labelKey: 'appLayout.navReading' },
]

export function AppLayout({
  initialDestination,
  readingScreen,
}: AppLayoutProps) {
  const [activeDestination, setActiveDestination] =
    useState<PrimaryDestinationId>(() =>
      resolveActiveDestination(initialDestination ?? DEFAULT_DESTINATION),
    )

  return (
    <AppShell>
      <AppHeader data-testid="app-layout-chrome">
        <AppHeaderBar>
          <AppBrand data-testid="app-layout-brand">
            <AppBrandMark aria-hidden>
              <Logo config={defaultLogoConfig} size={40} />
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
        </AppHeaderBar>
      </AppHeader>

      <AppMain data-testid="app-layout-outlet">
        {activeDestination === PRIMARY_DESTINATION
          ? (readingScreen ?? <ReadingScreen />)
          : null}
      </AppMain>
    </AppShell>
  )
}
