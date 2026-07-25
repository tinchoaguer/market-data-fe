import type { ReactNode } from 'react'
import { Stack, Text, Label } from '@market-data/brand/ui'
import { wording } from '@market-data/brand/wording'
import { getMessage } from '../../i18n/messages'
import { ReadingRegion } from './ReadingRegion'
import { READING_REGIONS, type RegionId } from './regions'

export type ReadingWorkspaceProps = {
  /** Selected Symbol identity for the Context Region. */
  symbol: string
  /** Optional composed bodies keyed by Region id. Unset Regions render gray-box placeholders. */
  regionBodies?: Partial<Record<RegionId, ReactNode>>
}

/**
 * Symbol Reading workspace shell: six Regions with primary vs supporting hierarchy.
 */
export function ReadingWorkspace({ symbol, regionBodies = {} }: ReadingWorkspaceProps) {
  const bodies: Partial<Record<RegionId, ReactNode>> = {
    context: (
      <Stack gap="sm">
        <Label>{wording.labels.symbol}</Label>
        <Text as="p" size="lg" weight="medium">
          {symbol}
        </Text>
      </Stack>
    ),
    ...regionBodies,
  }

  const primary = READING_REGIONS.filter((region) => region.band === 'primary')
  const associated = READING_REGIONS.filter((region) => region.band === 'associated')
  const supporting = READING_REGIONS.filter((region) => region.band === 'supporting')
  const crossCutting = READING_REGIONS.filter(
    (region) => region.band === 'cross-cutting',
  )

  return (
    <Stack gap="xl" data-testid="reading-workspace">
      <Stack gap="lg" data-reading-band="primary" data-testid="reading-band-primary">
        {primary.map((region) => (
          <ReadingRegion
            key={region.id}
            id={region.id}
            label={getMessage(region.labelKey)}
            band={region.band}
            prominence={region.prominence}
          >
            {bodies[region.id]}
          </ReadingRegion>
        ))}
        {associated.map((region) => (
          <ReadingRegion
            key={region.id}
            id={region.id}
            label={getMessage(region.labelKey)}
            band={region.band}
            prominence={region.prominence}
          >
            {bodies[region.id]}
          </ReadingRegion>
        ))}
      </Stack>

      <Stack gap="md" data-reading-band="supporting" data-testid="reading-band-supporting">
        {supporting.map((region) => (
          <ReadingRegion
            key={region.id}
            id={region.id}
            label={getMessage(region.labelKey)}
            band={region.band}
            prominence={region.prominence}
          >
            {bodies[region.id]}
          </ReadingRegion>
        ))}
      </Stack>

      <Stack gap="sm" data-reading-band="cross-cutting" data-testid="reading-band-diagnostics">
        {crossCutting.map((region) => (
          <ReadingRegion
            key={region.id}
            id={region.id}
            label={getMessage(region.labelKey)}
            band={region.band}
            prominence={region.prominence}
          >
            {bodies[region.id]}
          </ReadingRegion>
        ))}
      </Stack>
    </Stack>
  )
}
