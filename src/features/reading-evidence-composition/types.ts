import type {
  Assessment,
  CatalogRecommendation,
  ExposureProfile,
} from '../../api/marketAnalysis/types'

export type EvidenceClaimId =
  | 'regime'
  | 'risk'
  | 'economic'
  | 'exposure'
  | 'recommendation'

export type EvidenceKindId = 'drivers' | 'features' | 'contributions'

export type EvidenceRowSource =
  | 'assessment-component'
  | 'exposure-factor'
  | 'cited-feature'
  | 'placeholder'

export type EvidenceRow = {
  name: string
  value: string | number | null
  source: EvidenceRowSource
}

export type EvidenceKindDepth = {
  id: EvidenceKindId
  prominence: 'primary' | 'secondary' | 'deep'
  disclosure: 'visible' | 'collapsed' | 'placeholder'
  rows: EvidenceRow[]
}

export type ClaimAttachment = {
  claimId: EvidenceClaimId
  claimLabel: string
  drivers: EvidenceKindDepth
  features: EvidenceKindDepth
  contributions: EvidenceKindDepth
}

export type EvidenceCompositionModel = {
  claimAttachments: ClaimAttachment[]
}

export type EvidenceCompositionProps = {
  regime?: Assessment | null
  risk?: Assessment | null
  economic?: Assessment | null
  exposure?: ExposureProfile | null
  recommendation?: CatalogRecommendation | null
}
