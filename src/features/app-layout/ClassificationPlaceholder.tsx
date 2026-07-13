import { Page, Text } from '@market-data/brand/ui'
import { getMessage } from '../../i18n/messages'

export function ClassificationPlaceholder() {
  return (
    <Page gap="sm">
      <Text tone="muted">
        {getMessage('appLayout.classificationPlaceholder')}
      </Text>
    </Page>
  )
}
