import { wording } from '@market-data/brand/wording'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Inline,
  Label,
  Stack,
  Text,
} from '@market-data/brand/ui'
import { getMessage } from '../../i18n/messages'
import type { Assessment } from '../../api/marketAnalysis/types'

export type AssessmentSectionProps = {
  title: string
  assessment: Assessment
}

export function AssessmentSection({ title, assessment }: AssessmentSectionProps) {
  const hasSummary = assessment.summary.trim().length > 0
  const hasComponents =
    assessment.components != null && assessment.components.length > 0

  return (
    <Card>
      <CardHeader>
        <Inline gap="sm">
          <CardTitle>{title}</CardTitle>
          <Badge variant="secondary" aria-label={getMessage('viewMarketAnalysis.level')}>
            {assessment.level}
          </Badge>
        </Inline>
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          {hasSummary ? (
            <Stack gap="xs">
              <Label>{getMessage('viewMarketAnalysis.summary')}</Label>
              <Text as="p" tone="muted">
                {assessment.summary}
              </Text>
            </Stack>
          ) : null}
          {hasComponents ? (
            <Stack gap="xs">
              <Label>{getMessage('viewMarketAnalysis.factors')}</Label>
              {assessment.components!.map((component) => (
                <Inline key={component.name} gap="sm">
                  <Text as="span" tone="muted">
                    {component.name}
                  </Text>
                  <Text as="span" mono tabular>
                    {component.displayValue}
                  </Text>
                </Inline>
              ))}
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}

export function RegimeSection({ assessment }: { assessment: Assessment }) {
  return <AssessmentSection title={wording.labels.regime} assessment={assessment} />
}

export function RiskSection({ assessment }: { assessment: Assessment }) {
  return <AssessmentSection title={wording.labels.risk} assessment={assessment} />
}

export function EconomicSection({ assessment }: { assessment: Assessment }) {
  return (
    <AssessmentSection title={wording.labels.economic} assessment={assessment} />
  )
}
