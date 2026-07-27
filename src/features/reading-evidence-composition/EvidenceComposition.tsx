import { Stack, Text } from '@market-data/brand/ui'
import { getMessage } from '../../i18n/messages'
import { ClaimAttachmentBlock } from './ClaimAttachmentBlock'
import { mapEvidenceFromAnalysis } from './mapEvidenceFromAnalysis'
import type { EvidenceCompositionProps } from './types'

/**
 * Evidence Region body: claim-attached Drivers → Features → Contributions.
 * Supporting explainability only — not the primary interpretive workspace.
 */
export function EvidenceComposition({
  regime = null,
  risk = null,
  economic = null,
  exposure = null,
  recommendation = null,
}: EvidenceCompositionProps) {
  const model = mapEvidenceFromAnalysis({
    regime,
    risk,
    economic,
    exposure,
    recommendation,
  })

  return (
    <section
      id="reading-region-evidence-anchor"
      data-unit-id="evidence-composition"
      data-unit-role="evidence-composition"
      data-testid="evidence-composition"
      data-supporting="true"
    >
      <Stack gap="lg">
        {model.claimAttachments.length === 0 ? (
          <Stack gap="md" data-empty-evidence-structure>
            <Text tone="muted">{getMessage('readingEvidence.emptyForClaim')}</Text>
            <EmptyKindStructure />
          </Stack>
        ) : (
          model.claimAttachments.map((attachment) => (
            <ClaimAttachmentBlock
              key={attachment.claimId}
              attachment={attachment}
            />
          ))
        )}
      </Stack>
    </section>
  )
}

function EmptyKindStructure() {
  return (
    <Stack gap="md" data-evidence-kinds-structure>
      <Text as="p" weight="medium">
        {getMessage('readingEvidence.drivers')}
      </Text>
      <Text tone="muted">{getMessage('readingEvidence.kindPlaceholder')}</Text>
      <Text as="p" weight="medium">
        {getMessage('readingEvidence.features')}
      </Text>
      <Text tone="muted">{getMessage('readingEvidence.kindPlaceholder')}</Text>
      <Text as="p" weight="medium">
        {getMessage('readingEvidence.contributions')}
      </Text>
      <Text tone="muted">{getMessage('readingEvidence.kindPlaceholder')}</Text>
    </Stack>
  )
}
