import { useState, type ReactNode } from 'react'
import { Logo } from '@market-data/brand/logo'
import { defaultLogoConfig } from '@market-data/brand/logo-config'
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
} from '@market-data/brand/ui'
import { wording } from '@market-data/brand/wording'
import { getMessage } from '../../i18n/messages'
import { MarketAnalysisScreen } from '../view-market-analysis/MarketAnalysisScreen'
import { MarketDataScreen } from '../view-market-data/MarketDataScreen'
import { ClassificationPlaceholder } from './ClassificationPlaceholder'
import {
  DEFAULT_DESTINATION,
  type DestinationId,
  isDestinationId,
} from './destinations'

export type AppLayoutProps = {
  /** Optional initial destination (defaults to market-data). */
  initialDestination?: DestinationId
  /** Optional Market Data screen override for tests. */
  marketDataScreen?: ReactNode
  /** Optional Analysis screen override for tests. */
  analysisScreen?: ReactNode
}

const NAV_ITEMS: { id: DestinationId; labelKey: string }[] = [
  { id: 'market-data', labelKey: 'appLayout.navMarketData' },
  { id: 'analysis', labelKey: 'appLayout.navAnalysis' },
  { id: 'classification', labelKey: 'appLayout.navClassification' },
]

function resolveInitialDestination(
  initialDestination: DestinationId | undefined,
): DestinationId {
  if (initialDestination && isDestinationId(initialDestination)) {
    return initialDestination
  }
  return DEFAULT_DESTINATION
}

export function AppLayout({
  initialDestination,
  marketDataScreen,
  analysisScreen,
}: AppLayoutProps) {
  const [activeDestination, setActiveDestination] = useState<DestinationId>(
    () => resolveInitialDestination(initialDestination),
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
        {activeDestination === 'market-data'
          ? (marketDataScreen ?? <MarketDataScreen />)
          : null}
        {activeDestination === 'analysis'
          ? (analysisScreen ?? <MarketAnalysisScreen />)
          : null}
        {activeDestination === 'classification' ? (
          <ClassificationPlaceholder />
        ) : null}
      </AppMain>
    </AppShell>
  )
}
