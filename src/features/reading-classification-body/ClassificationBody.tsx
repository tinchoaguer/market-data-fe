import {
  Card,
  CardContent,
  CardHeader,
  SectionHeading,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@market-data/brand/ui'
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
      <Card>
        <CardHeader>
          <SectionHeading id={headingId}>{group.identityLabel}</SectionHeading>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </section>
  )
}

/**
 * Classification Region body: compact per-dimension signal packaging
 * (source / score / reason). Subordinate and adjacent to Analysis — not a count-only summary.
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
        <Text as="p" weight="medium" id={headingId}>
          {getMessage('readingClassification.bodyLabel')}
        </Text>
        {model.groups.map((group) => (
          <DimensionSignalGroup key={group.id} group={group} />
        ))}
      </Stack>
    </section>
  )
}
