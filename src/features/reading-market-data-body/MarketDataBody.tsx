import { getMessage } from '../../i18n/messages'
import { ObservationRow } from '../dashboard-observation-row'
import type { MarketDataBodyProps } from './types'

/**
 * Market Data Region body: dashboard middle observation row (chart + Market Stats 24H).
 * Supporting observation only — never primary interpretive content or Evidence.
 */
export function MarketDataBody({ data }: MarketDataBodyProps) {
  return (
    <section
      aria-label={getMessage('readingLayout.regionMarketData')}
      data-unit-id="market-data-composition"
      data-unit-role="market-data-composition"
      data-testid="market-data-composition"
      data-prominence="supporting"
      data-supporting="true"
    >
      <ObservationRow data={data} />
    </section>
  )
}
