import type {
  Assessment,
  CatalogRecommendation,
  ExposureProfile,
  MarketAnalysisViewModel,
} from '../../api/marketAnalysis/types'
import { getAnalysisRegimeReasonLabel } from '../../i18n/labels'
import { getMessage } from '../../i18n/messages'
import type {
  DiagnosticSignal,
  DiagnosticSignalKind,
  DiagnosticsCompositionModel,
  DiagnosticsMappingInput,
  DiagnosticsSeverity,
} from './types'

const INSUFFICIENT_REASON_CODES = ['insufficient_candles'] as const

const SEVERITY_RANK: Record<DiagnosticsSeverity, number> = {
  healthy: 0,
  qualifying: 1,
  blocking: 2,
}

function kindLabel(kind: DiagnosticSignalKind): string {
  switch (kind) {
    case 'insufficient':
      return getMessage('readingDiagnostics.kindInsufficient')
    case 'partial':
      return getMessage('readingDiagnostics.kindPartial')
    case 'stale':
      return getMessage('readingDiagnostics.kindStale')
    case 'equivalent':
      return getMessage('readingDiagnostics.kindEquivalent')
  }
}

function maxSeverity(
  current: DiagnosticsSeverity,
  next: DiagnosticsSeverity,
): DiagnosticsSeverity {
  return SEVERITY_RANK[next] > SEVERITY_RANK[current] ? next : current
}

function splitRegimeSummary(summary: string): string[] {
  return summary
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

function hasEmptyStructuredComponents(assessment: Assessment | null | undefined): boolean {
  return (
    assessment != null &&
    Array.isArray(assessment.components) &&
    assessment.components.length === 0
  )
}

function hasEmptyExposureFactors(
  exposure: ExposureProfile | null | undefined,
): boolean {
  return exposure != null && exposure.factors.length === 0
}

/**
 * Derives Diagnostics mapping input from an Analysis / Reading view-model.
 * Uses only fields already present on the FE view-model (no new OpenAPI).
 */
export function deriveDiagnosticsMappingInput(analysis: {
  regime?: Assessment | null
  risk?: Assessment | null
  economic?: Assessment | null
  exposure?: ExposureProfile | null
  recommendation?: CatalogRecommendation | null
}): DiagnosticsMappingInput {
  const regimeReasonLabels = splitRegimeSummary(analysis.regime?.summary ?? '')
  const insufficientLabel = getAnalysisRegimeReasonLabel('insufficient_candles')
  const hasInsufficientFromSummary = regimeReasonLabels.includes(insufficientLabel)

  const hasPartialCoverage =
    hasEmptyStructuredComponents(analysis.risk) ||
    hasEmptyStructuredComponents(analysis.economic) ||
    hasEmptyExposureFactors(analysis.exposure)

  return {
    regimeReasonLabels,
    hardGateReason: analysis.recommendation?.hardGateReason ?? null,
    hasInsufficientDataFlag: hasInsufficientFromSummary,
    hasPartialCoverage,
    isStale: false,
  }
}

/**
 * Maps trust-qualification signals into a Diagnostics composition model.
 */
export function mapDiagnosticsSignals(
  input: DiagnosticsMappingInput,
): DiagnosticsCompositionModel {
  const signals: DiagnosticSignal[] = []
  let severity: DiagnosticsSeverity = 'healthy'

  const insufficientCodes = new Set<string>()
  for (const code of input.regimeReasonCodes ?? []) {
    if (
      (INSUFFICIENT_REASON_CODES as readonly string[]).includes(code) ||
      code.toLowerCase().includes('insufficient')
    ) {
      insufficientCodes.add(code)
    }
  }

  const insufficientLabel = getAnalysisRegimeReasonLabel('insufficient_candles')
  const hasInsufficientLabel = (input.regimeReasonLabels ?? []).includes(
    insufficientLabel,
  )
  const hasInsufficient =
    input.hasInsufficientDataFlag === true ||
    insufficientCodes.size > 0 ||
    hasInsufficientLabel

  if (hasInsufficient) {
    const primaryCode =
      [...insufficientCodes][0] ??
      (hasInsufficientLabel ? 'insufficient_candles' : 'insufficient_data')
    const detail =
      primaryCode === 'insufficient_candles' || hasInsufficientLabel
        ? getAnalysisRegimeReasonLabel('insufficient_candles')
        : primaryCode
    signals.push({
      id: `insufficient:${primaryCode}`,
      kind: 'insufficient',
      severity: 'blocking',
      label: kindLabel('insufficient'),
      detail,
      sourceRef: 'regime.summary',
    })
    severity = maxSeverity(severity, 'blocking')
  }

  if (input.hasPartialCoverage === true) {
    signals.push({
      id: 'partial:coverage',
      kind: 'partial',
      severity: 'qualifying',
      label: kindLabel('partial'),
      detail: null,
      sourceRef: 'risk|economic|exposure',
    })
    severity = maxSeverity(severity, 'qualifying')
  }

  if (input.isStale === true) {
    signals.push({
      id: 'stale:freshness',
      kind: 'stale',
      severity: 'qualifying',
      label: kindLabel('stale'),
      detail: null,
      sourceRef: 'freshness',
    })
    severity = maxSeverity(severity, 'qualifying')
  }

  const hardGate = input.hardGateReason
  if (typeof hardGate === 'string' && hardGate.trim().length > 0) {
    signals.push({
      id: 'equivalent:hard_gate',
      kind: 'equivalent',
      severity: 'blocking',
      label: kindLabel('equivalent'),
      detail: hardGate,
      sourceRef: 'recommendation.hardGateReason',
    })
    severity = maxSeverity(severity, 'blocking')
  }

  return {
    severity,
    presentation: severity === 'healthy' ? 'quiet' : 'elevated',
    signals,
  }
}

/**
 * Convenience: derive Diagnostics model from Analysis view-model slices.
 */
export function mapDiagnosticsFromAnalysis(
  analysis:
    | Pick<
        MarketAnalysisViewModel,
        'regime' | 'risk' | 'economic' | 'exposure' | 'recommendation'
      >
    | {
        regime?: Assessment | null
        risk?: Assessment | null
        economic?: Assessment | null
        exposure?: ExposureProfile | null
        recommendation?: CatalogRecommendation | null
      },
  overrides?: DiagnosticsMappingInput,
): DiagnosticsCompositionModel {
  return mapDiagnosticsSignals({
    ...deriveDiagnosticsMappingInput(analysis),
    ...overrides,
  })
}
