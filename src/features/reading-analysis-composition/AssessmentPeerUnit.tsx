import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Stack,
  Text,
} from '@maguer/market-data-brand/ui'
import { getMessage } from '../../i18n/messages'
import type { Assessment, ExposureProfile } from '../../api/marketAnalysis/types'
import { AssessmentDimensionMark } from './AssessmentDimensionMark'
import { bindOutcomeSlots } from './assessmentCardSlots'
import type { AssessmentPeerId } from './types'

export type AssessmentPeerUnitProps = {
  id: AssessmentPeerId
  label: string
  assessment?: Assessment | null
  exposure?: ExposureProfile | null
  narrative?: string | null
}

function hasExplainability(
  id: AssessmentPeerId,
  assessment?: Assessment | null,
  exposure?: ExposureProfile | null,
): boolean {
  if (id === 'exposure') {
    return (exposure?.factors.length ?? 0) > 0
  }
  return (assessment?.components?.length ?? 0) > 0
}

function EvidenceReference({ claimId }: { claimId: AssessmentPeerId }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-evidence-reference={claimId}
      onClick={() => {
        document
          .getElementById('reading-region-evidence-anchor')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
    >
      {getMessage('readingLayout.regionEvidence')}
    </Button>
  )
}

function mappedSummaryText(
  id: AssessmentPeerId,
  assessment?: Assessment | null,
): string | null {
  if (id === 'exposure') {
    return null
  }
  const summary = assessment?.summary.trim() ?? ''
  return summary.length > 0 ? summary : null
}

/**
 * Independent Assessment peer as a vertical brand Card:
 * icon → label → badge → score → summary (omit empty slots).
 */
export function AssessmentPeerUnit({
  id,
  label,
  assessment,
  exposure,
  narrative,
}: AssessmentPeerUnitProps) {
  const headingId = `assessment-unit-${id}-label`
  const showEvidenceReference = hasExplainability(id, assessment, exposure)

  const outcome =
    id === 'exposure' ? exposure?.summary : assessment?.level
  const { badge, score } = bindOutcomeSlots(outcome)

  const mappedSummary = mappedSummaryText(id, assessment)
  const summary =
    narrative !== undefined
      ? (narrative ?? getMessage('readingAnalysis.narrativePlaceholder'))
      : mappedSummary
  const showSummary = summary != null && summary.length > 0
  const showPlaceholder = badge == null && score == null && !showSummary

  return (
    <section
      aria-labelledby={headingId}
      data-unit-id={id}
      data-unit-role="assessment-peer"
      data-presentation="vertical-card"
    >
      <Card data-assessment-card={id}>
        <CardHeader>
          <Stack gap="sm">
            <AssessmentDimensionMark dimension={id} />
            <CardTitle id={headingId} data-card-slot="label">
              {label}
            </CardTitle>
          </Stack>
        </CardHeader>
        <CardContent>
          <Stack gap="sm">
            {badge != null ? (
              <Badge variant="secondary" data-card-slot="badge">
                {badge}
              </Badge>
            ) : null}
            {score != null ? (
              <Text
                as="p"
                size="lg"
                weight="semibold"
                mono
                tabular
                data-card-slot="score"
              >
                {score}
              </Text>
            ) : null}
            {showPlaceholder ? (
              <Text tone="muted" data-unit-placeholder={id}>
                {getMessage('readingAnalysis.unitPlaceholder')}
              </Text>
            ) : null}
            {showSummary ? (
              <Text
                as="p"
                tone="muted"
                data-card-slot="summary"
                data-claim-narrative={id}
                data-bound-to={id}
              >
                {summary}
              </Text>
            ) : null}
            {showEvidenceReference ? <EvidenceReference claimId={id} /> : null}
          </Stack>
        </CardContent>
      </Card>
    </section>
  )
}
