import { wording } from '@maguer/market-data-brand/wording'
import type {
  Assessment,
  CatalogRecommendation,
  ExposureProfile,
} from '../../api/marketAnalysis/types'
import type {
  ClaimAttachment,
  EvidenceClaimId,
  EvidenceCompositionModel,
  EvidenceKindDepth,
  EvidenceRow,
} from './types'

const CLAIM_LABELS: Record<EvidenceClaimId, string> = {
  regime: wording.labels.regime,
  risk: wording.labels.risk,
  economic: wording.labels.economic,
  exposure: wording.labels.exposure,
  recommendation: wording.labels.recommendation,
}

function emptyKind(
  id: EvidenceKindDepth['id'],
  prominence: EvidenceKindDepth['prominence'],
  disclosure: EvidenceKindDepth['disclosure'],
): EvidenceKindDepth {
  return { id, prominence, disclosure, rows: [] }
}

function kindWithRows(
  id: EvidenceKindDepth['id'],
  prominence: EvidenceKindDepth['prominence'],
  disclosure: EvidenceKindDepth['disclosure'],
  rows: EvidenceRow[],
): EvidenceKindDepth {
  if (rows.length === 0) {
    return emptyKind(id, prominence, 'placeholder')
  }
  return { id, prominence, disclosure, rows }
}

function attachmentFromRows(
  claimId: EvidenceClaimId,
  driverRows: EvidenceRow[],
  contributionRows: EvidenceRow[],
  featureRows: EvidenceRow[] = [],
): ClaimAttachment {
  return {
    claimId,
    claimLabel: CLAIM_LABELS[claimId],
    drivers: kindWithRows('drivers', 'primary', 'visible', driverRows),
    features: kindWithRows('features', 'secondary', 'collapsed', featureRows),
    contributions: kindWithRows(
      'contributions',
      'deep',
      'collapsed',
      contributionRows,
    ),
  }
}

function rowsFromAssessmentComponents(
  assessment: Assessment | null | undefined,
): { drivers: EvidenceRow[]; contributions: EvidenceRow[] } {
  const components = assessment?.components ?? []
  const drivers: EvidenceRow[] = components.map((component) => ({
    name: component.name,
    value: component.displayValue,
    source: 'assessment-component' as const,
  }))
  const contributions: EvidenceRow[] = components.map((component) => ({
    name: component.name,
    value: component.displayValue,
    source: 'assessment-component' as const,
  }))
  return { drivers, contributions }
}

function rowsFromExposureFactors(
  exposure: ExposureProfile | null | undefined,
): { drivers: EvidenceRow[]; contributions: EvidenceRow[] } {
  const factors = exposure?.factors ?? []
  const drivers: EvidenceRow[] = factors.map((factor) => ({
    name: factor.name,
    value: factor.displayWeight,
    source: 'exposure-factor' as const,
  }))
  const contributions: EvidenceRow[] = factors.map((factor) => ({
    name: factor.name,
    value: factor.displayWeight,
    source: 'exposure-factor' as const,
  }))
  return { drivers, contributions }
}

function emptyAttachment(claimId: EvidenceClaimId): ClaimAttachment {
  return attachmentFromRows(claimId, [], [])
}

/**
 * Bind existing Analysis-mapped assessment components / exposure factors into
 * claim-attached Evidence Drivers and Contributions (UI model only).
 */
export function mapEvidenceFromAnalysis(input: {
  regime?: Assessment | null
  risk?: Assessment | null
  economic?: Assessment | null
  exposure?: ExposureProfile | null
  recommendation?: CatalogRecommendation | null
}): EvidenceCompositionModel {
  const attachments: ClaimAttachment[] = []

  const riskRows = rowsFromAssessmentComponents(input.risk)
  if (riskRows.drivers.length > 0) {
    attachments.push(
      attachmentFromRows('risk', riskRows.drivers, riskRows.contributions),
    )
  }

  const economicRows = rowsFromAssessmentComponents(input.economic)
  if (economicRows.drivers.length > 0) {
    attachments.push(
      attachmentFromRows(
        'economic',
        economicRows.drivers,
        economicRows.contributions,
      ),
    )
  }

  const exposureRows = rowsFromExposureFactors(input.exposure)
  if (exposureRows.drivers.length > 0) {
    attachments.push(
      attachmentFromRows(
        'exposure',
        exposureRows.drivers,
        exposureRows.contributions,
      ),
    )
  }

  // Empty explainability still yields claim-context structure (REQ-015).
  if (attachments.length === 0) {
    if (input.risk != null) {
      attachments.push(emptyAttachment('risk'))
    } else if (input.exposure != null) {
      attachments.push(emptyAttachment('exposure'))
    } else if (input.economic != null) {
      attachments.push(emptyAttachment('economic'))
    } else if (input.regime != null) {
      attachments.push(emptyAttachment('regime'))
    } else if (input.recommendation != null) {
      attachments.push(emptyAttachment('recommendation'))
    }
  }

  return { claimAttachments: attachments }
}
