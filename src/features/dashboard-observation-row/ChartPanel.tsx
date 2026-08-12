import { ChartFrame, Stack, Text, TimeframeControl } from '@maguer/market-data-brand/ui'
import { getMessage } from '../../i18n/messages'
import { AreaPlot } from './AreaPlot'
import type { ObservationRowViewModel } from './types'

export type ChartPanelProps = {
  observation: ObservationRowViewModel
  onTimeframeChange: (timeframe: string) => void
}

/**
 * Left panel: brand ChartFrame with consumer-owned area plot and timeframe control.
 */
export function ChartPanel({ observation, onTimeframeChange }: ChartPanelProps) {
  const hasTimeframes =
    observation.availableTimeframes.length > 0 &&
    observation.selectedTimeframe != null
  const hasPlot = observation.areaChartPoints.length > 0

  return (
    <section
      data-unit-id="observation-chart"
      data-unit-role="observation-chart"
      data-testid="observation-chart"
    >
      <Stack gap="sm">
        {hasTimeframes ? (
          <TimeframeControl
            aria-label={getMessage('readingHero.timeframe')}
            options={observation.availableTimeframes.map((timeframe) => ({
              value: timeframe,
              label: timeframe,
            }))}
            value={observation.selectedTimeframe!}
            onValueChange={onTimeframeChange}
          />
        ) : null}

        <ChartFrame aria-label={getMessage('readingObservationRow.chartTitle')}>
          {hasPlot ? (
            <AreaPlot points={observation.areaChartPoints} />
          ) : (
            <Text tone="muted">
              {getMessage('readingObservationRow.emptyChart')}
            </Text>
          )}
        </ChartFrame>
      </Stack>
    </section>
  )
}
