import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Stack,
  Text,
} from '@maguer/market-data-brand/ui'
import { getMessage } from '../../i18n/messages'
import type { ObservationRowViewModel } from './types'

export type MarketStats24hCardProps = {
  observation: ObservationRowViewModel
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <Stack gap="xs">
      <Label>{label}</Label>
      <Text as="p" size="md" weight="medium" mono tabular>
        {value}
      </Text>
    </Stack>
  )
}

/**
 * Right panel: 24H high, low, volume, and last update when available.
 */
export function MarketStats24hCard({ observation }: MarketStats24hCardProps) {
  return (
    <section
      aria-label={getMessage('readingObservationRow.statsTitle')}
      data-unit-id="market-stats-24h"
      data-unit-role="market-stats-24h"
      data-testid="market-stats-24h"
    >
      <Card>
        <CardHeader>
          <CardTitle>{getMessage('readingObservationRow.statsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            {observation.high24h != null ? (
              <StatRow
                label={getMessage('readingHero.high24h')}
                value={observation.high24h}
              />
            ) : null}
            {observation.low24h != null ? (
              <StatRow
                label={getMessage('readingHero.low24h')}
                value={observation.low24h}
              />
            ) : null}
            {observation.volume24h != null ? (
              <StatRow
                label={getMessage('readingHero.volume24h')}
                value={observation.volume24h}
              />
            ) : null}
            {observation.lastUpdatedAt != null ? (
              <StatRow
                label={getMessage('readingHero.lastUpdate')}
                value={observation.lastUpdatedAt}
              />
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </section>
  )
}
