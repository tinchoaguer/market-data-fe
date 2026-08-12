import { useState } from 'react'
import { Cluster, ClusterItem } from '@maguer/market-data-brand/ui'
import type { MarketDataViewModel } from '../../api/marketData/types'
import { ChartPanel } from './ChartPanel'
import { mapObservationRow } from './mapObservationRow'
import { MarketStats24hCard } from './MarketStats24hCard'

export type ObservationRowProps = {
  data: MarketDataViewModel
}

/**
 * Dashboard middle observation row: chart panel (left) + Market Stats 24H card (right).
 * Supporting observation only — not primary interpretive content or Evidence.
 */
export function ObservationRow({ data }: ObservationRowProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string | null>(null)
  const observation = mapObservationRow(data, selectedTimeframe)

  function handleTimeframeChange(timeframe: string) {
    setSelectedTimeframe(timeframe)
  }

  return (
    <section
      data-unit-id="observation-row"
      data-unit-role="observation-row"
      data-testid="observation-row"
    >
      <Cluster>
        <ClusterItem>
          <ChartPanel
            observation={observation}
            onTimeframeChange={handleTimeframeChange}
          />
        </ClusterItem>
        <ClusterItem>
          <MarketStats24hCard observation={observation} />
        </ClusterItem>
      </Cluster>
    </section>
  )
}
