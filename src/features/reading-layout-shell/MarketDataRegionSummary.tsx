import { Stack } from '@market-data/brand/ui'
import type { MarketDataViewModel } from '../../api/marketData/types'
import { PriceSection } from '../view-market-data/PriceSection'

export type MarketDataRegionSummaryProps = {
  data: MarketDataViewModel
}

/**
 * Compact Market Data Region body — price only (supporting, not primary interpretation).
 */
export function MarketDataRegionSummary({ data }: MarketDataRegionSummaryProps) {
  return (
    <Stack gap="sm" data-testid="market-data-region-summary">
      <PriceSection price={data.price} />
    </Stack>
  )
}
