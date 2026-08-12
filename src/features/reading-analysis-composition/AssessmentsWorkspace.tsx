import {
  Cluster,
  ClusterItem,
  SectionHeading,
  Stack,
} from '@maguer/market-data-brand/ui'
import { wording } from '@maguer/market-data-brand/wording'
import { getMessage } from '../../i18n/messages'
import { AssessmentPeerUnit } from './AssessmentPeerUnit'
import { RecommendationUnit } from './RecommendationUnit'
import type { AssessmentPeerId, AssessmentsWorkspaceProps } from './types'

const PEER_ROWS: AssessmentPeerId[][] = [
  ['regime', 'risk'],
  ['economic', 'exposure'],
]

const PEER_LABELS: Record<AssessmentPeerId, string> = {
  regime: wording.labels.regime,
  risk: wording.labels.risk,
  economic: wording.labels.economic,
  exposure: wording.labels.exposure,
}

function peerModel(
  id: AssessmentPeerId,
  props: AssessmentsWorkspaceProps,
) {
  return {
    assessment:
      id === 'regime'
        ? props.regime
        : id === 'risk'
          ? props.risk
          : id === 'economic'
            ? props.economic
            : null,
    exposure: id === 'exposure' ? props.exposure : null,
    narrative: props.narratives?.[id],
  }
}

/**
 * Single Assessments workspace for the Analysis Region:
 * four vertical Assessment cards, then compact Recommendation.
 */
export function AssessmentsWorkspace({
  regime = null,
  risk = null,
  economic = null,
  exposure = null,
  recommendation = null,
  narratives,
}: AssessmentsWorkspaceProps) {
  const headingId = 'assessments-workspace-label'
  const props: AssessmentsWorkspaceProps = {
    regime,
    risk,
    economic,
    exposure,
    recommendation,
    narratives,
  }

  return (
    <section
      aria-labelledby={headingId}
      data-unit-id="assessments"
      data-unit-role="assessments-workspace"
      data-testid="assessments-workspace"
    >
      <Stack gap="lg">
        <SectionHeading id={headingId}>
          {getMessage('readingAnalysis.assessmentsLabel')}
        </SectionHeading>

        <Stack gap="md" data-assessment-peers>
          {PEER_ROWS.map((row) => (
            <Cluster key={row.join('-')}>
              {row.map((id) => {
                const model = peerModel(id, props)
                return (
                  <ClusterItem key={id}>
                    <AssessmentPeerUnit
                      id={id}
                      label={PEER_LABELS[id]}
                      assessment={model.assessment}
                      exposure={model.exposure}
                      narrative={model.narrative}
                    />
                  </ClusterItem>
                )
              })}
            </Cluster>
          ))}
        </Stack>

        <RecommendationUnit
          recommendation={recommendation}
          narrative={narratives?.recommendation}
        />
      </Stack>
    </section>
  )
}
