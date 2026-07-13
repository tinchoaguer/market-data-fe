import { Page, Text } from '@market-data/brand/ui'
import { getMessage } from '../../i18n/messages'

export function AnalysisPlaceholder() {
  return (
    <Page gap="sm">
      <Text tone="muted">{getMessage('appLayout.analysisPlaceholder')}</Text>
    </Page>
  )
}
