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
import {
  mapSignalToTableRow,
  visibleSignals,
} from './classificationTableRow'
import { mapClassificationBody } from './mapClassificationBody'
import type {
  ClassificationBodyProps,
  ClassificationSignalGroup,
} from './types'

function ClassificationSignalRow({
  signal,
  index,
}: {
  signal: ClassificationSignalGroup['signals'][number]
  index: number
}) {
  const row = mapSignalToTableRow(signal)

  return (
    <TableRow
      key={`${signal.source}-${index}`}
      data-unit-id="classification-signal"
      data-unit-role="classification-signal"
    >
      <TableCell>{row.factor ?? ''}</TableCell>
      <TableCell variant="mono">
        {row.score != null ? String(row.score) : ''}
      </TableCell>
      <TableCell>{row.reason ?? ''}</TableCell>
    </TableRow>
  )
}

function DimensionSignalGroup({ group }: { group: ClassificationSignalGroup }) {
  const headingId = `${group.id}-label`
  const signals = visibleSignals(group.signals)

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
        {signals.length === 0 ? (
          <Text tone="muted">{getMessage('readingClassification.emptyGroup')}</Text>
        ) : (
          <Table
            data-unit-id="classification-table"
            data-unit-role="classification-signal-table"
          >
            <TableHeader>
              <TableRow>
                <TableHead>
                  {getMessage('readingClassification.factor')}
                </TableHead>
                <TableHead>
                  {getMessage('readingClassification.score')}
                </TableHead>
                <TableHead>
                  {getMessage('readingClassification.reason')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signals.map((signal, index) => (
                <ClassificationSignalRow
                  key={`${signal.source}-${index}`}
                  signal={signal}
                  index={index}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </Stack>
    </section>
  )
}

/**
 * Classification Region body: compact Factor / Score / Reason tabular packaging
 * per dimension group. Subordinate and adjacent to Analysis — not a count-only summary.
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
