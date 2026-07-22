import { v1CodeRegistry } from './catalogs'
import { enUiTemplates } from './templates/en/ui'
import type { MessageChannel, MessageParams, MessageRef, ResolvedMessage } from './types'

/** Default Content locale for v1. */
export const DEFAULT_LOCALE = 'en'

/** Fallback reasons recorded on `ResolvedMessage.meta.fallback`. */
export type ResolveFallbackReason =
  | 'unknown_code'
  | 'missing_template'
  | 'locale_fallback'

type ResolveInput = {
  locale: string
  channel: MessageChannel
  messages: readonly MessageRef[]
}

/**
 * Format a numeric param for template interpolation (v1 rules).
 * Integers: decimal digits without scientific notation.
 * Floats: up to 4 fractional digits, trailing zeros trimmed.
 */
export function formatParamNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return String(value)
  }

  if (Number.isInteger(value)) {
    return value.toLocaleString('en-US', {
      useGrouping: false,
      maximumFractionDigits: 0,
    })
  }

  const fixed = value.toFixed(4)
  return fixed.replace(/\.?0+$/, '')
}

function formatParamValue(value: string | number | boolean): string {
  if (typeof value === 'number') {
    return formatParamNumber(value)
  }
  return String(value)
}

/**
 * Replace `{paramName}` placeholders. Missing params → `''`.
 * Unresolved placeholders are left unchanged.
 */
export function interpolateTemplate(
  template: string,
  params: MessageParams | undefined,
): string {
  return template.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_match, name: string) => {
    if (!params || !(name in params)) {
      return ''
    }
    return formatParamValue(params[name]!)
  })
}

function lookupTemplate(
  locale: string,
  channel: MessageChannel,
  code: string,
): { template: string | undefined; usedLocale: string; localeFallback: boolean } {
  if (channel !== 'ui') {
    return { template: undefined, usedLocale: locale, localeFallback: false }
  }

  if (locale === DEFAULT_LOCALE) {
    return {
      template: enUiTemplates[code],
      usedLocale: DEFAULT_LOCALE,
      localeFallback: false,
    }
  }

  // v1: only `en` templates exist — fall back to default locale when available
  const enTemplate = enUiTemplates[code]
  if (enTemplate !== undefined) {
    return {
      template: enTemplate,
      usedLocale: DEFAULT_LOCALE,
      localeFallback: true,
    }
  }

  return { template: undefined, usedLocale: locale, localeFallback: false }
}

function resolveOne(
  locale: string,
  channel: MessageChannel,
  message: MessageRef,
): ResolvedMessage {
  const { code, params } = message
  const registered = Object.prototype.hasOwnProperty.call(v1CodeRegistry, code)

  if (!registered) {
    return {
      code,
      locale,
      text: code,
      meta: { fallback: 'unknown_code' satisfies ResolveFallbackReason },
    }
  }

  const { template, usedLocale, localeFallback } = lookupTemplate(
    locale,
    channel,
    code,
  )

  if (template === undefined || template === '') {
    return {
      code,
      locale: usedLocale,
      text: code,
      meta: { fallback: 'missing_template' satisfies ResolveFallbackReason },
    }
  }

  const text = interpolateTemplate(template, params)
  const resolved: ResolvedMessage = {
    code,
    locale: usedLocale,
    text,
  }

  if (localeFallback) {
    resolved.meta = {
      fallback: 'locale_fallback' satisfies ResolveFallbackReason,
    }
  }

  return resolved
}

/**
 * In-process batch resolve: MessageRef[] → ResolvedMessage[].
 * Preserves order and length; never aborts the batch for catalog/template gaps.
 * Does not mutate `messages` or nested params.
 */
export function resolve(input: ResolveInput): ResolvedMessage[] {
  const { locale, channel, messages } = input
  return messages.map((message) => resolveOne(locale, channel, message))
}
