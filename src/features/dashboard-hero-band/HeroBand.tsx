import { useState, type ReactNode } from 'react'
import { Cluster, ClusterItem } from '@maguer/market-data-brand/ui'
import type { MarketDataViewModel } from '../../api/marketData/types'
import { HeroObservationStrip } from './HeroObservationStrip'
import { mapHeroObservation } from './mapHeroObservation'

export type HeroBandProps = {
  /** Context-owned Identity Region (already wrapped by the Reading shell). */
  identitySlot: ReactNode
  /** Existing Market Data VM; null when observation is not available. */
  marketData: MarketDataViewModel | null
}

/**
 * Top Reading hero: Context Identity adjacent to a Market Data observation strip.
 *
 * Brand kit (@maguer/market-data-brand@^0.2.0): ChartFrame, TimeframeControl
 * (SegmentedControl alias), Text tone positive|negative, Badge variant
 * positive|negative, and `--chart-*` CSS variables are all exported. No ad-hoc
 * FE chart chrome library.
 */
export function HeroBand({ identitySlot, marketData }: HeroBandProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string | null>(null)
  const observation =
    marketData != null
      ? mapHeroObservation(marketData, selectedTimeframe)
      : null

  return (
    <Cluster data-testid="reading-hero-band" data-reading-hero="true">
      <ClusterItem share="aside" data-hero-slot="identity">
        {identitySlot}
      </ClusterItem>
      {observation != null ? (
        <ClusterItem share="fill" data-hero-slot="observation">
          <HeroObservationStrip
            observation={observation}
            onTimeframeChange={setSelectedTimeframe}
          />
        </ClusterItem>
      ) : null}
    </Cluster>
  )
}
