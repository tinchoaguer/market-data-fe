/**
 * Identity view model for the Context Region.
 * Answers “What am I looking at?” without price, scores, or signals.
 */
export type SymbolIdentityViewModel = {
  /** Canonical selected Symbol identifier. */
  symbol: string
  /** Human-readable name when a catalog entry exists. */
  displayName: string | null
  /** Normalized pair presentation (e.g. BTC/USDT). */
  pairForm: string | null
  /** Base asset code when the pair splits cleanly. */
  base: string | null
  /** Quote asset code when the pair splits cleanly. */
  quote: string | null
  /** Venue when available; omit (null) when unknown. */
  venue: string | null
}

export type ComposeSymbolIdentityOptions = {
  /** Optional venue from an Identity source model; never invented. */
  venue?: string | null
}
