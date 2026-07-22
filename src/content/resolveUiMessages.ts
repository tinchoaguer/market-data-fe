import { DEFAULT_LOCALE, resolve } from './resolve'
import type { MessageRef, ResolvedMessage } from './types'

/**
 * App-boundary adapter: Content resolve with fixed `en` locale and `ui` channel.
 * Shared entry point for analysis/classification mappers.
 */
export function resolveUiMessages(
  messages: readonly MessageRef[],
): ResolvedMessage[] {
  return resolve({
    locale: DEFAULT_LOCALE,
    channel: 'ui',
    messages,
  })
}
