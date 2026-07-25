import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Label,
  SectionHeading,
  Stack,
  Text,
} from '@market-data/brand/ui'
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
  if (prominence === 'primary') {
    return (
      <Text as="div" size="xl" weight="semibold" id={headingId}>
        {label}
      </Text>
    )
  }

  if (prominence === 'associated' || prominence === 'cross-cutting') {
    return (
      <Label id={headingId}>
        {label}
      </Label>
    )
  }

  return <SectionHeading id={headingId}>{label}</SectionHeading>
}

/**
 * Labeled Region slot for the Symbol Reading workspace.
 * Gray-box body when children are omitted.
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
      ) : (
        <Stack gap={prominence === 'associated' ? 'sm' : 'md'} data-testid={`reading-region-${id}`}>
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
