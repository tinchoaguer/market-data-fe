# Tasks

## Implementation Tasks

- [x] Add feature locale keys `readingContext.displayName`, `readingContext.pair`, `readingContext.base`, `readingContext.quote`, and `readingContext.venue` to `src/locales/en.json`, plus display-name catalog entries `readingContext.symbols.<symbolKey>.displayName` for supported pair Symbols used by the Reading selector; ensure keys are readable via `src/i18n/messages.ts` (REQ-009, REQ-011, NFR-003, NFR-004, NFR-005)

- [x] Implement Identity composer under `src/features/reading-context-identity/` that maps a selected Symbol to `SymbolIdentityViewModel` (catalog `displayName` when present; deterministic pairForm / base / quote derivation; optional venue when provided) without calling a new backend Identity endpoint (REQ-002, REQ-003, REQ-004, REQ-005, REQ-010, REQ-011)

- [x] Build Context Identity UI that renders available Identity fields with brand `Stack` / `Inline` / `Cluster` / `Label` / `Text` (and `Badge` / `Card` only if needed for compact strip chrome), using catalog-linked labels and Symbol terminology (REQ-001, REQ-003, REQ-004, REQ-005, REQ-008, REQ-009, NFR-002, NFR-006, NFR-007)

- [x] Enforce Identity-only Context content: do not render price, scores, signals, recommendations, Assessment outcomes, Classification signals, Evidence metrics, Market Data observations, or candle timeframe controls inside Context (REQ-006, REQ-013)

- [x] Mount the Identity body as the Context Region content in the Reading layout shell host; keep Context a small non-primary frame so Analysis remains the primary interpretive Region; do not redefine other Reading Regions (REQ-007, REQ-012, NFR-008, NFR-009)

- [x] Ensure idle Reading (no Symbol selected) does not claim a successful Identity body in Context; leave empty/prompt ownership to the Reading host (REQ-014)

- [x] Add unit tests for the Identity composer covering pair-form fixtures (`BTC/USDT`, `BTC-USDT`), catalog hit → displayName, catalog miss with pair still produced, and venue omit-when-absent (REQ-002, REQ-004, REQ-005, REQ-010, REQ-011)

- [x] Extend or add Context / Reading layout component tests asserting Identity beyond bare ticker, absence of price/scores/signals/recommendation/timeframe in Context, catalog-linked field labels, and Analysis still primary / Context not primary (REQ-001, REQ-002, REQ-006, REQ-007, REQ-009, REQ-013)

Tasks are ordered to minimize implementation dependencies.
