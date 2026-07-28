import { getAnalysisRegimeLabel, getStrategyLabel } from '../i18n/labels'
import { DEFAULT_LOCALE, resolve } from './resolve'
import type { MessageParams, MessageRef, ResolvedMessage } from './types'

/**
 * Humanize known Analysis catalog tokens in MessageRef params before template
 * interpolation so UI copy uses locale wordings (not raw API codes).
 */
function humanizeUiParams(
  params: MessageParams | undefined,
): MessageParams | undefined {
  if (params === undefined) {
    return undefined
  }

  const next: MessageParams = { ...params }
  if (typeof next.strategy === 'string') {
    next.strategy = getStrategyLabel(next.strategy)
  }
  if (typeof next.regime === 'string') {
    next.regime = getAnalysisRegimeLabel(next.regime)
  }
  return next
}

/**
 * App-boundary adapter: Content resolve with fixed `en` locale and `ui` channel.
 * Shared entry point for analysis/classification mappers.
 */
export function resolveUiMessages(
  messages: readonly MessageRef[],
): ResolvedMessage[] {
  const prepared = messages.map((message) => ({
    code: message.code,
    params: humanizeUiParams(message.params),
  }))

  return resolve({
    locale: DEFAULT_LOCALE,
    channel: 'ui',
    messages: prepared,
  })
}
