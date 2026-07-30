import { wording } from '@maguer/market-data-brand/wording'
import type { MarketClassificationViewModel } from '../../api/marketClassification/types'
import type {
  ClassificationBodyModel,
  ClassificationDimensionId,
  ClassificationGroupUnitId,
  ClassificationSignalGroup,
} from './types'

const DIMENSION_ORDER: ClassificationDimensionId[] = [
  'regime',
  'risk',
  'economic',
  'exposure',
]

const GROUP_UNIT_IDS: Record<
  ClassificationDimensionId,
  ClassificationGroupUnitId
> = {
  regime: 'classification-regime',
  risk: 'classification-risk',
  economic: 'classification-economic',
  exposure: 'classification-exposure',
}

const GROUP_LABELS: Record<ClassificationDimensionId, string> = {
  regime: wording.labels.regime,
  risk: wording.labels.risk,
  economic: wording.labels.economic,
  exposure: wording.labels.exposure,
}

/**
 * Map an existing Classification view model into four dimension signal groups.
 * Empty arrays remain as visible groups (not an error).
 */
export function mapClassificationBody(
  data: MarketClassificationViewModel,
): ClassificationBodyModel {
  const groups: ClassificationSignalGroup[] = DIMENSION_ORDER.map(
    (dimensionId) => ({
      id: GROUP_UNIT_IDS[dimensionId],
      dimensionId,
      identityLabel: GROUP_LABELS[dimensionId],
      signals: data[dimensionId],
    }),
  )

  return { groups }
}
