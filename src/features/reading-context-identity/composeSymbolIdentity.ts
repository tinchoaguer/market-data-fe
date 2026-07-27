import { getMessage } from '../../i18n/messages'
import type {
  ComposeSymbolIdentityOptions,
  SymbolIdentityViewModel,
} from './types'

/**
 * Encode a Symbol for locale catalog lookup.
 * `/` and `-` pair separators become `_` (e.g. BTC/USDT → BTC_USDT).
 */
export function toSymbolCatalogKey(symbol: string): string {
  return symbol.trim().replace(/[/-]/g, '_')
}

function resolveDisplayName(symbol: string): string | null {
  const catalogKey = toSymbolCatalogKey(symbol)
  try {
    return getMessage(`readingContext.symbols.${catalogKey}.displayName`)
  } catch {
    return null
  }
}

function derivePairParts(symbol: string): {
  pairForm: string | null
  base: string | null
  quote: string | null
} {
  const trimmed = symbol.trim()
  const separator = trimmed.includes('/')
    ? '/'
    : trimmed.includes('-')
      ? '-'
      : null

  if (separator === null) {
    return { pairForm: null, base: null, quote: null }
  }

  const segments = trimmed.split(separator).filter((part) => part.length > 0)
  if (segments.length !== 2) {
    return { pairForm: null, base: null, quote: null }
  }

  const [base, quote] = segments
  return {
    pairForm: `${base}/${quote}`,
    base,
    quote,
  }
}

/**
 * Compose Symbol Identity from the selected Symbol + FE catalog / pair rules.
 * Does not call a backend Identity endpoint.
 */
export function composeSymbolIdentity(
  symbol: string,
  options: ComposeSymbolIdentityOptions = {},
): SymbolIdentityViewModel {
  const { pairForm, base, quote } = derivePairParts(symbol)
  const venue =
    options.venue != null && options.venue.trim().length > 0
      ? options.venue.trim()
      : null

  return {
    symbol,
    displayName: resolveDisplayName(symbol),
    pairForm,
    base,
    quote,
    venue,
  }
}
