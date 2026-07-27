import type {
  Assessment,
  CatalogRecommendation,
  ExposureProfile,
} from '../../api/marketAnalysis/types'

export type DiagnosticsSeverity = 'healthy' | 'qualifying' | 'blocking'

export type DiagnosticsPresentation = 'quiet' | 'elevated'

export type DiagnosticSignalKind =
  | 'insufficient'
  | 'partial'
  | 'stale'
  | 'equivalent'

export type DiagnosticSignalSeverity = 'qualifying' | 'blocking'

export type DiagnosticSignal = {
  id: string
  kind: DiagnosticSignalKind
  severity: DiagnosticSignalSeverity
  label: string
  detail: string | null
  sourceRef: string | null
}

export type DiagnosticsCompositionModel = {
  severity: DiagnosticsSeverity
  presentation: DiagnosticsPresentation
  signals: DiagnosticSignal[]
}

/** Explicit mapping inputs when raw codes / flags are available (tests + future VM fields). */
export type DiagnosticsMappingInput = {
  /** Raw regime reason codes (preferred when present). */
  regimeReasonCodes?: string[]
  /** Humanized regime reason labels (e.g. split from regime.summary). */
  regimeReasonLabels?: string[]
  hardGateReason?: string | null
  /** Incomplete claim / missing-series style gap already detectable on mapped content. */
  hasPartialCoverage?: boolean
  /** Explicit stale / freshness indicator already present on mapped content. */
  isStale?: boolean
  /** Assessment-level insufficient_data flag already detectable. */
  hasInsufficientDataFlag?: boolean
}

export type DiagnosticsCompositionProps = {
  regime?: Assessment | null
  risk?: Assessment | null
  economic?: Assessment | null
  exposure?: ExposureProfile | null
  recommendation?: CatalogRecommendation | null
  /** Optional precomputed model (tests / host overrides). */
  model?: DiagnosticsCompositionModel
  /** Optional explicit mapping hints beyond Analysis VM fields. */
  mappingInput?: DiagnosticsMappingInput
}
