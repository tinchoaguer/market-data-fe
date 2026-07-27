import {
  Badge,
  Inline,
  Label,
  Stack,
  Text,
} from '@market-data/brand/ui'
import { wording } from '@market-data/brand/wording'
import { getMessage } from '../../i18n/messages'
import type { CatalogRecommendation } from '../../api/marketAnalysis/types'

export type RecommendationUnitProps = {
  recommendation?: CatalogRecommendation | null
  narrative?: string | null
}

/**
 * Compact Recommendation stance composed inside Assessments (not a Reading Region).
 */
export function RecommendationUnit({
  recommendation,
  narrative,
}: RecommendationUnitProps) {
  const headingId = 'assessment-unit-recommendation-label'
  const hasStance = recommendation != null

  return (
    <section
      aria-labelledby={headingId}
      data-unit-id="recommendation"
      data-unit-role="recommendation"
      data-compact="true"
    >
      <Stack gap="sm">
        <Inline gap="sm">
          <Label id={headingId}>{wording.labels.recommendation}</Label>
          {hasStance ? (
            <Badge variant="secondary" data-recommendation-stance>
              {recommendation.name}
            </Badge>
          ) : null}
        </Inline>

        {hasStance ? (
          <Stack gap="xs">
            <Text as="p" tone="muted">
              {recommendation.rationale}
            </Text>
            {recommendation.hardGateReason ? (
              <Text as="p" tone="muted" data-hard-gate-reason>
                {recommendation.hardGateReason}
              </Text>
            ) : null}
          </Stack>
        ) : (
          <Text tone="muted" data-unit-placeholder="recommendation">
            {getMessage('readingAnalysis.recommendationPlaceholder')}
          </Text>
        )}

        {narrative !== undefined ? (
          <Text
            as="p"
            tone="muted"
            data-claim-narrative="recommendation"
            data-bound-to="recommendation"
          >
            {narrative ?? getMessage('readingAnalysis.narrativePlaceholder')}
          </Text>
        ) : null}
      </Stack>
    </section>
  )
}
