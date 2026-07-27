import { Inline, Label, Stack, Text } from '@market-data/brand/ui'
import { wording } from '@market-data/brand/wording'
import { getMessage } from '../../i18n/messages'
import type { SymbolIdentityViewModel } from './types'

export type ContextIdentityProps = {
  identity: SymbolIdentityViewModel
}

function IdentityField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <Stack gap="xs">
      <Label>{label}</Label>
      <Text as="p" size="md" weight="medium">
        {value}
      </Text>
    </Stack>
  )
}

/**
 * Context Region Identity body — display name / pair / base–quote / optional venue.
 * Identity-only: no price, scores, signals, recommendations, or timeframe.
 */
export function ContextIdentity({ identity }: ContextIdentityProps) {
  return (
    <section data-testid="context-identity" data-identity-body="true">
      <Inline gap="lg" wrap>
        <IdentityField label={wording.labels.symbol} value={identity.symbol} />
        {identity.displayName != null ? (
          <IdentityField
            label={getMessage('readingContext.displayName')}
            value={identity.displayName}
          />
        ) : null}
        {identity.pairForm != null ? (
          <IdentityField
            label={getMessage('readingContext.pair')}
            value={identity.pairForm}
          />
        ) : null}
        {identity.base != null ? (
          <IdentityField
            label={getMessage('readingContext.base')}
            value={identity.base}
          />
        ) : null}
        {identity.quote != null ? (
          <IdentityField
            label={getMessage('readingContext.quote')}
            value={identity.quote}
          />
        ) : null}
        {identity.venue != null ? (
          <IdentityField
            label={getMessage('readingContext.venue')}
            value={identity.venue}
          />
        ) : null}
      </Inline>
    </section>
  )
}
