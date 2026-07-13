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
import type { CatalogRecommendation } from '../../api/marketAnalysis/types'

export type RecommendationSectionProps = {
  recommendation: CatalogRecommendation
}

export function RecommendationSection({
  recommendation,
}: RecommendationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <Inline gap="sm">
          <CardTitle>{wording.labels.recommendation}</CardTitle>
          <Badge variant="secondary">{recommendation.name}</Badge>
        </Inline>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          <Stack gap="sm">
            <Label>{getMessage('viewMarketAnalysis.catalogId')}</Label>
            <Text as="p" mono>
              {recommendation.catalogId}
            </Text>
          </Stack>
          <Stack gap="sm">
            <Label>{getMessage('viewMarketAnalysis.rationale')}</Label>
            <Text as="p" tone="muted">
              {recommendation.rationale}
            </Text>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
