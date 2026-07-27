import { Badge, Inline, Label, Stack, Text } from '@market-data/brand/ui'
import { wording } from '@market-data/brand/wording'
import type { MarketClassificationViewModel } from '../../api/marketClassification/types'
import { getMessage } from '../../i18n/messages'

export type ClassificationRegionSummaryProps = {
  data: MarketClassificationViewModel
}

function SignalCountRow({
  label,
  count,
}: {
  label: string
  count: number
}) {
  return (
    <Inline gap="sm">
      <Text as="span" tone="muted">
        {label}
      </Text>
      <Badge variant="secondary">{String(count)}</Badge>
    </Inline>
  )
}

/**
 * Compact Classification Region body — signal counts by Assessment axis (not full tables).
 */
export function ClassificationRegionSummary({
  data,
}: ClassificationRegionSummaryProps) {
  return (
    <Stack gap="sm" data-testid="classification-region-summary">
      <Label>{getMessage('readingLayout.classificationSummaryLabel')}</Label>
      <SignalCountRow label={wording.labels.regime} count={data.regime.length} />
      <SignalCountRow label={wording.labels.risk} count={data.risk.length} />
      <SignalCountRow
        label={wording.labels.economic}
        count={data.economic.length}
      />
      <SignalCountRow
        label={wording.labels.exposure}
        count={data.exposure.length}
      />
    </Stack>
  )
}
