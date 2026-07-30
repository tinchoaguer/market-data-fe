import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Inline,
  Label,
  Stack,
  Text,
} from '@maguer/market-data-brand/ui'
import { getMessage } from '../../i18n/messages'
import type {
  ClaimAttachment,
  EvidenceClaimId,
  EvidenceKindDepth,
  EvidenceRow,
} from './types'

function formatClaimAttachmentLabel(claimLabel: string): string {
  return getMessage('readingEvidence.claimAttachment').replace(
    '{claim}',
    claimLabel,
  )
}

function EvidenceRows({ rows }: { rows: EvidenceRow[] }) {
  return (
    <Stack gap="xs" data-evidence-rows>
      {rows.map((row, index) => (
        <Inline key={`${row.name}-${index}`} gap="sm">
          <Text as="span" tone="muted">
            {row.name}
          </Text>
          {row.value != null ? (
            <Text as="span" mono tabular>
              {row.value}
            </Text>
          ) : null}
        </Inline>
      ))}
    </Stack>
  )
}

function KindBody({ kind }: { kind: EvidenceKindDepth }) {
  if (kind.rows.length === 0) {
    return (
      <Text tone="muted" data-kind-placeholder={kind.id}>
        {getMessage('readingEvidence.kindPlaceholder')}
      </Text>
    )
  }

  return <EvidenceRows rows={kind.rows} />
}

function DriversKind({
  claimId,
  kind,
}: {
  claimId: EvidenceClaimId
  kind: EvidenceKindDepth
}) {
  const headingId = `evidence-kind-${claimId}-drivers-label`
  return (
    <section
      aria-labelledby={headingId}
      data-unit-id="drivers"
      data-evidence-kind="drivers"
      data-prominence="primary"
    >
      <Stack gap="sm">
        <Label id={headingId}>{getMessage('readingEvidence.drivers')}</Label>
        <KindBody kind={kind} />
      </Stack>
    </section>
  )
}

function DisclosableKind({
  claimId,
  kind,
  labelKey,
  showKey,
  unitId,
}: {
  claimId: EvidenceClaimId
  kind: EvidenceKindDepth
  labelKey: 'readingEvidence.features' | 'readingEvidence.contributions'
  showKey: 'readingEvidence.showFeatures' | 'readingEvidence.showContributions'
  unitId: 'features' | 'contributions'
}) {
  const [open, setOpen] = useState(false)
  const headingId = `evidence-kind-${claimId}-${unitId}-label`
  const showLabel = getMessage(showKey)
  const hideLabel = getMessage('readingEvidence.hideDepth')

  return (
    <section
      aria-labelledby={headingId}
      data-unit-id={unitId}
      data-evidence-kind={unitId}
      data-prominence={kind.prominence}
      data-disclosure={open ? 'visible' : 'collapsed'}
    >
      <Stack gap="sm">
        <Inline gap="sm">
          <Label id={headingId}>{getMessage(labelKey)}</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? hideLabel : showLabel}
          </Button>
        </Inline>
        {open ? <KindBody kind={kind} /> : null}
      </Stack>
    </section>
  )
}

export type ClaimAttachmentBlockProps = {
  attachment: ClaimAttachment
}

/**
 * Claim-attached Evidence depth: Drivers (visible) â†’ Features / Contributions (on demand).
 */
export function ClaimAttachmentBlock({ attachment }: ClaimAttachmentBlockProps) {
  const headingId = `claim-attachment-${attachment.claimId}-label`
  const hasAnyRows =
    attachment.drivers.rows.length > 0 ||
    attachment.features.rows.length > 0 ||
    attachment.contributions.rows.length > 0

  return (
    <Card
      data-unit-id="claim-attachment"
      data-claim-id={attachment.claimId}
      data-testid={`claim-attachment-${attachment.claimId}`}
    >
      <CardHeader>
        <Inline gap="sm">
          <CardTitle id={headingId}>
            {formatClaimAttachmentLabel(attachment.claimLabel)}
          </CardTitle>
          <Badge variant="secondary">{attachment.claimLabel}</Badge>
        </Inline>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          {!hasAnyRows ? (
            <Text tone="muted" data-empty-for-claim={attachment.claimId}>
              {getMessage('readingEvidence.emptyForClaim')}
            </Text>
          ) : null}
          <DriversKind claimId={attachment.claimId} kind={attachment.drivers} />
          <DisclosableKind
            claimId={attachment.claimId}
            kind={attachment.features}
            labelKey="readingEvidence.features"
            showKey="readingEvidence.showFeatures"
            unitId="features"
          />
          <DisclosableKind
            claimId={attachment.claimId}
            kind={attachment.contributions}
            labelKey="readingEvidence.contributions"
            showKey="readingEvidence.showContributions"
            unitId="contributions"
          />
        </Stack>
      </CardContent>
    </Card>
  )
}
