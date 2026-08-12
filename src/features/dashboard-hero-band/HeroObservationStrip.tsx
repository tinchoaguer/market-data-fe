import type { ReactNode } from 'react'
import {
  Badge,
  ChartFrame,
  Inline,
  Label,
  Stack,
  Text,
  TimeframeControl,
} from '@maguer/market-data-brand/ui'
import { wording } from '@maguer/market-data-brand/wording'
import { getMessage } from '../../i18n/messages'
import { SparklinePlot } from './SparklinePlot'
import type { ChangeDirection, HeroObservationViewModel } from './types'

export type HeroObservationStripProps = {
  observation: HeroObservationViewModel
  onTimeframeChange: (timeframe: string) => void
}

function formatSigned(value: number): string {
  if (value > 0) {
    return `+${value}`
  }
  return String(value)
}

function changeTone(
  direction: ChangeDirection | null,
): 'positive' | 'negative' | 'default' {
  if (direction === 'positive' || direction === 'negative') {
    return direction
  }
  return 'default'
}

function changeBadgeVariant(
  direction: ChangeDirection | null,
): 'positive' | 'negative' | 'outline' {
  if (direction === 'positive' || direction === 'negative') {
    return direction
  }
  return 'outline'
}

function ObservationField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <Stack gap="xs">
      <Label>{label}</Label>
      {children}
    </Stack>
  )
}

/**
 * Market Data–sourced observation strip. Not Context-owned.
 */
export function HeroObservationStrip({
  observation,
  onTimeframeChange,
}: HeroObservationStripProps) {
  const direction = observation.changeDirection
  const tone = changeTone(direction)
  const hasChange =
    observation.changeAbsolute != null || observation.changePercent != null
  const changeDisplay =
    observation.changePercent != null
      ? `${formatSigned(observation.changePercent)}%`
      : observation.changeAbsolute != null
        ? formatSigned(observation.changeAbsolute)
        : null

  return (
    <section
      data-testid="reading-hero-observation"
      data-ownership="observation"
      data-hero-observation="true"
    >
      <Stack gap="md">
        <Inline gap="lg" wrap>
          <ObservationField label={wording.labels.price}>
            <Text as="p" size="2xl" weight="semibold" mono tabular>
              {observation.price}
            </Text>
          </ObservationField>

          {hasChange && changeDisplay != null ? (
            <ObservationField label={getMessage('readingHero.change')}>
              <Inline gap="sm">
                <Text
                  as="span"
                  size="lg"
                  weight="semibold"
                  mono
                  tabular
                  tone={tone}
                  data-change-direction={direction}
                  data-change-tone={tone}
                >
                  {changeDisplay}
                </Text>
                {direction != null ? (
                  <Badge
                    variant={changeBadgeVariant(direction)}
                    data-change-direction={direction}
                  >
                    {changeDisplay}
                  </Badge>
                ) : null}
              </Inline>
            </ObservationField>
          ) : null}

          {observation.high24h != null ? (
            <ObservationField label={getMessage('readingHero.high24h')}>
              <Text as="p" size="md" weight="medium" mono tabular>
                {observation.high24h}
              </Text>
            </ObservationField>
          ) : null}

          {observation.low24h != null ? (
            <ObservationField label={getMessage('readingHero.low24h')}>
              <Text as="p" size="md" weight="medium" mono tabular>
                {observation.low24h}
              </Text>
            </ObservationField>
          ) : null}

          {observation.volume24h != null ? (
            <ObservationField label={getMessage('readingHero.volume24h')}>
              <Text as="p" size="md" weight="medium" mono tabular>
                {observation.volume24h}
              </Text>
            </ObservationField>
          ) : null}

          {observation.lastUpdatedAt != null ? (
            <ObservationField label={getMessage('readingHero.lastUpdate')}>
              <Text as="p" size="sm" tone="muted" mono>
                {observation.lastUpdatedAt}
              </Text>
            </ObservationField>
          ) : null}
        </Inline>

        {observation.availableTimeframes.length > 0 ||
        observation.sparklinePoints.length > 0 ? (
          <Stack gap="sm">
            {observation.availableTimeframes.length > 0 &&
            observation.selectedTimeframe != null ? (
              <TimeframeControl
                aria-label={getMessage('readingHero.timeframe')}
                options={observation.availableTimeframes.map((timeframe) => ({
                  value: timeframe,
                  label: timeframe,
                }))}
                value={observation.selectedTimeframe}
                onValueChange={onTimeframeChange}
              />
            ) : null}

            {observation.sparklinePoints.length > 0 ? (
              <ChartFrame aria-label={getMessage('readingHero.sparkline')}>
                <SparklinePlot points={observation.sparklinePoints} />
              </ChartFrame>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </section>
  )
}
