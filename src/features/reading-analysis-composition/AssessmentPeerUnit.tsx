import {
  Badge,
  Button,
  Inline,
  Label,
  Stack,
  Text,
} from '@market-data/brand/ui'
import { getMessage } from '../../i18n/messages'
import type { Assessment, ExposureProfile } from '../../api/marketAnalysis/types'
import type { AssessmentPeerId } from './types'

export type AssessmentPeerUnitProps = {
  id: AssessmentPeerId
  label: string
  assessment?: Assessment | null
  exposure?: ExposureProfile | null
  narrative?: string | null
}

function ClaimNarrative({
  unitId,
  narrative,
}: {
  unitId: AssessmentPeerId
  narrative?: string | null
}) {
  if (narrative === undefined) {
    return null
  }

  return (
    <Text
      as="p"
      tone="muted"
      data-claim-narrative={unitId}
      data-bound-to={unitId}
    >
      {narrative ?? getMessage('readingAnalysis.narrativePlaceholder')}
    </Text>
  )
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

function AssessmentOutcomeBody({ assessment }: { assessment: Assessment }) {
  const hasSummary = assessment.summary.trim().length > 0

  return (
    <Stack gap="sm">
      <Inline gap="sm">
        <Label>{getMessage('viewMarketAnalysis.level')}</Label>
        <Badge variant="secondary">{assessment.level}</Badge>
      </Inline>
      {hasSummary ? (
        <Stack gap="xs">
          <Label>{getMessage('viewMarketAnalysis.summary')}</Label>
          <Text as="p" tone="muted">
            {assessment.summary}
          </Text>
        </Stack>
      ) : null}
    </Stack>
  )
}

function ExposureOutcomeBody({ exposure }: { exposure: ExposureProfile }) {
  return (
    <Stack gap="sm">
      <Inline gap="sm">
        <Label>{getMessage('viewMarketAnalysis.level')}</Label>
        <Badge variant="secondary">{exposure.summary}</Badge>
      </Inline>
    </Stack>
  )
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

/**
 * Independent Assessment peer unit (Regime | Risk | Economic | Exposure).
 * Outcome + claim-bound Narrative + Evidence reference only — no primary
 * components/factors tables (those live in Evidence).
 */
export function AssessmentPeerUnit({
  id,
  label,
  assessment,
  exposure,
  narrative,
}: AssessmentPeerUnitProps) {
  const headingId = `assessment-unit-${id}-label`
  const hasAssessment = assessment != null
  const hasExposure = id === 'exposure' && exposure != null
  const hasOutcome = id === 'exposure' ? hasExposure : hasAssessment
  const showEvidenceReference = hasExplainability(id, assessment, exposure)

  return (
    <section
      aria-labelledby={headingId}
      data-unit-id={id}
      data-unit-role="assessment-peer"
    >
      <Stack gap="sm">
        <Label id={headingId}>{label}</Label>
        {hasOutcome ? (
          id === 'exposure' && exposure != null ? (
            <ExposureOutcomeBody exposure={exposure} />
          ) : assessment != null ? (
            <AssessmentOutcomeBody assessment={assessment} />
          ) : null
        ) : (
          <Text tone="muted" data-unit-placeholder={id}>
            {getMessage('readingAnalysis.unitPlaceholder')}
          </Text>
        )}
        <ClaimNarrative unitId={id} narrative={narrative} />
        {showEvidenceReference ? <EvidenceReference claimId={id} /> : null}
      </Stack>
    </section>
  )
}
