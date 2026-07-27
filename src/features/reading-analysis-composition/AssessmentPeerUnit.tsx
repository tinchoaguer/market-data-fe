import {
  Badge,
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

function ComponentRows({
  components,
}: {
  components: NonNullable<Assessment['components']>
}) {
  return (
    <Stack gap="xs" data-assessment-components>
      <Label>{getMessage('viewMarketAnalysis.factors')}</Label>
      {components.map((component) => (
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
  )
}

function AssessmentOutcomeBody({ assessment }: { assessment: Assessment }) {
  const hasSummary = assessment.summary.trim().length > 0
  const hasComponents =
    assessment.components != null && assessment.components.length > 0

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
      {hasComponents ? <ComponentRows components={assessment.components!} /> : null}
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
      {exposure.factors.length > 0 ? (
        <Stack gap="xs" data-assessment-components>
          <Label>{getMessage('viewMarketAnalysis.factors')}</Label>
          {exposure.factors.map((factor, index) => (
            <Inline key={`${factor.name}-${index}`} gap="sm">
              <Text as="span" tone="muted">
                {factor.name}
              </Text>
              <Text as="span" mono tabular>
                {factor.displayWeight}
              </Text>
            </Inline>
          ))}
        </Stack>
      ) : null}
    </Stack>
  )
}

/**
 * Independent Assessment peer unit (Regime | Risk | Economic | Exposure).
 * Light peer chrome (not a competing hero Card wall). Gray-box when empty.
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
      </Stack>
    </section>
  )
}
