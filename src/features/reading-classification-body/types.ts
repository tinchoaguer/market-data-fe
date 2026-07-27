import type {
  ClassificationSignal,
  MarketClassificationViewModel,
} from '../../api/marketClassification/types'

export type ClassificationDimensionId =
  | 'regime'
  | 'risk'
  | 'economic'
  | 'exposure'

export type ClassificationGroupUnitId =
  | 'classification-regime'
  | 'classification-risk'
  | 'classification-economic'
  | 'classification-exposure'

export type ClassificationSignalGroup = {
  id: ClassificationGroupUnitId
  dimensionId: ClassificationDimensionId
  identityLabel: string
  signals: ClassificationSignal[]
}

export type ClassificationBodyModel = {
  groups: ClassificationSignalGroup[]
}

export type ClassificationBodyProps = {
  data: MarketClassificationViewModel
}
