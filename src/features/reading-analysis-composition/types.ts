import type {
  Assessment,
  CatalogRecommendation,
  ExposureProfile,
} from '../../api/marketAnalysis/types'

export type AssessmentPeerId = 'regime' | 'risk' | 'economic' | 'exposure'

export type ClaimBoundNarrative = {
  boundTo: AssessmentPeerId | 'recommendation'
  text: string
}

export type AssessmentsWorkspaceProps = {
  regime?: Assessment | null
  risk?: Assessment | null
  economic?: Assessment | null
  exposure?: ExposureProfile | null
  recommendation?: CatalogRecommendation | null
  /** Optional claim-bound narratives keyed by unit id. */
  narratives?: Partial<Record<AssessmentPeerId | 'recommendation', string>>
}
