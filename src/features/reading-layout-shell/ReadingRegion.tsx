import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  SectionHeading,
  Stack,
  Text,
} from '@maguer/market-data-brand/ui'
import { getMessage } from '../../i18n/messages'
import type { RegionId, RegionProminence, RegionBand } from './regions'

export type ReadingRegionProps = {
  id: RegionId
  label: string
  band: RegionBand
  prominence: RegionProminence
  children?: ReactNode
}

function RegionHeading({
  label,
  prominence,
  headingId,
}: {
  label: string
  prominence: RegionProminence
  headingId: string
}) {
  // Card Regions in the primary band share the same title type scale.
  if (prominence === 'primary' || prominence === 'associated') {
    return (
      <Text as="div" size="xl" weight="semibold" id={headingId}>
        {label}
      </Text>
    )
  }

  return <SectionHeading id={headingId}>{label}</SectionHeading>
}

/**
 * Labeled Region slot for the Symbol Reading workspace.
 * Gray-box body when children are omitted.
 * Primary and associated (Classification) use a Card; Card titles share Analysis type scale.
 */
export function ReadingRegion({
  id,
  label,
  band,
  prominence,
  children,
}: ReadingRegionProps) {
  const headingId = `reading-region-${id}-label`
  const body = children ?? (
    <Text tone="muted">{getMessage('readingLayout.regionPlaceholder')}</Text>
  )

  return (
    <section
      aria-labelledby={headingId}
      data-region-id={id}
      data-reading-band={band}
      data-prominence={prominence}
    >
      {prominence === 'primary' ? (
        <Card data-testid={`reading-region-${id}`}>
          <CardHeader>
            <RegionHeading
              label={label}
              prominence={prominence}
              headingId={headingId}
            />
          </CardHeader>
          <CardContent>
            <Stack gap="lg">{body}</Stack>
          </CardContent>
        </Card>
      ) : prominence === 'associated' ? (
        <Card data-testid={`reading-region-${id}`}>
          <CardHeader>
            <RegionHeading
              label={label}
              prominence={prominence}
              headingId={headingId}
            />
          </CardHeader>
          <CardContent>
            <Stack gap="sm">{body}</Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack gap="md" data-testid={`reading-region-${id}`}>
          <RegionHeading
            label={label}
            prominence={prominence}
            headingId={headingId}
          />
          {body}
        </Stack>
      )}
    </section>
  )
}
