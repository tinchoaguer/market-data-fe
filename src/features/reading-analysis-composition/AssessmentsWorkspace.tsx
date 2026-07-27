import {
  Cluster,
  ClusterItem,
  SectionHeading,
  Stack,
} from '@market-data/brand/ui'
import { wording } from '@market-data/brand/wording'
import { getMessage } from '../../i18n/messages'
import { AssessmentPeerUnit } from './AssessmentPeerUnit'
import { RecommendationUnit } from './RecommendationUnit'
import type { AssessmentPeerId, AssessmentsWorkspaceProps } from './types'

const PEER_ORDER: AssessmentPeerId[] = [
  'regime',
  'risk',
  'economic',
  'exposure',
]

const PEER_LABELS: Record<AssessmentPeerId, string> = {
  regime: wording.labels.regime,
  risk: wording.labels.risk,
  economic: wording.labels.economic,
  exposure: wording.labels.exposure,
}

/**
 * Single Assessments workspace for the Analysis Region:
 * four peer Assessment units, then compact Recommendation.
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

        <Cluster data-assessment-peers>
          {PEER_ORDER.map((id) => (
            <ClusterItem key={id}>
              <AssessmentPeerUnit
                id={id}
                label={PEER_LABELS[id]}
                assessment={
                  id === 'regime'
                    ? regime
                    : id === 'risk'
                      ? risk
                      : id === 'economic'
                        ? economic
                        : null
                }
                exposure={id === 'exposure' ? exposure : null}
                narrative={narratives?.[id]}
              />
            </ClusterItem>
          ))}
        </Cluster>

        <RecommendationUnit
          recommendation={recommendation}
          narrative={narratives?.recommendation}
        />
      </Stack>
    </section>
  )
}
