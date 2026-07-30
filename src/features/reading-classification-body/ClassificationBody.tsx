import {
  SectionHeading,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@maguer/market-data-brand/ui'
import { getMessage } from '../../i18n/messages'
import { mapClassificationBody } from './mapClassificationBody'
import type {
  ClassificationBodyProps,
  ClassificationSignalGroup,
} from './types'

function DimensionSignalGroup({ group }: { group: ClassificationSignalGroup }) {
  const headingId = `${group.id}-label`

  return (
    <section
      aria-labelledby={headingId}
      data-unit-id={group.id}
      data-unit-role="classification-dimension-group"
      data-dimension={group.dimensionId}
      data-testid={group.id}
    >
      <Stack gap="xs">
        <SectionHeading id={headingId}>{group.identityLabel}</SectionHeading>
        {group.signals.length === 0 ? (
          <Text tone="muted">{getMessage('readingClassification.emptyGroup')}</Text>
        ) : (
          <Table data-unit-role="classification-signal-table">
            <TableHeader>
              <TableRow>
                <TableHead>
                  {getMessage('viewMarketClassification.source')}
                </TableHead>
                <TableHead>
                  {getMessage('viewMarketClassification.score')}
                </TableHead>
                <TableHead>
                  {getMessage('viewMarketClassification.reason')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.signals.map((signal, index) => (
                <TableRow
                  key={`${signal.source}-${index}`}
                  data-unit-id="classification-signal"
                  data-unit-role="classification-signal"
                >
                  <TableCell>{signal.source}</TableCell>
                  <TableCell variant="mono">{signal.score}</TableCell>
                  <TableCell>{signal.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Stack>
    </section>
  )
}

/**
 * Classification Region body: compact per-dimension signal packaging
 * (source / score / reason). Subordinate and adjacent to Analysis â€” not a count-only summary.
 * Typography matches other Regions (SectionHeading + Text).
 */
export function ClassificationBody({ data }: ClassificationBodyProps) {
  const model = mapClassificationBody(data)
  const headingId = 'classification-body-label'

  return (
    <section
      aria-labelledby={headingId}
      data-unit-id="classification-body"
      data-unit-role="classification-body"
      data-testid="classification-body"
      data-compact="true"
      data-prominence="associated"
    >
      <Stack gap="sm">
        <SectionHeading id={headingId}>
          {getMessage('readingClassification.bodyLabel')}
        </SectionHeading>
        {model.groups.map((group) => (
          <DimensionSignalGroup key={group.id} group={group} />
        ))}
      </Stack>
    </section>
  )
}
