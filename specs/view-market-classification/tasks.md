# Tasks

## Implementation Tasks

- [x] Add feature locale keys `viewMarketClassification.title`, `viewMarketClassification.empty`, `viewMarketClassification.source`, `viewMarketClassification.score`, and `viewMarketClassification.reason` to `src/locales/en.json` and ensure they are readable via `src/i18n/messages.ts` (REQ-012, NFR-004, NFR-005)

- [x] Reuse (or define if missing) the typed `SUPPORTED_SYMBOLS` configuration (non-empty string list) used by the symbol selector (REQ-001)

- [x] Define TypeScript types for the API success payload and the `MarketClassificationViewModel` / `ClassificationSignal` view model from design.md (REQ-003, REQ-004, REQ-005, REQ-006, REQ-007)

- [x] Implement the classification API client that calls `GET /markets/{symbol}/classification` and maps a valid response to `MarketClassificationViewModel`, failing closed on invalid payloads or incomplete signals (REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-009)

- [x] Implement the market classification screen shell with states `idle`, `loading`, `success`, and `error`, including empty copy before selection and no fetch until a symbol is selected; use brand `Page` / `Stack` / `Text` for structure (REQ-008, REQ-009, REQ-011, NFR-006)

- [x] Implement the symbol selector bound to `SUPPORTED_SYMBOLS` with brand `Select` (and related parts), using `labels.symbol` for the control label, and trigger a fetch on selection (REQ-001, REQ-002, REQ-012, NFR-006)

- [x] Render the success view sections with brand section primitives (`SectionHeading`, `Card`, `Table` as applicable): regime (`labels.regime`), risk (`labels.risk`), economic (`labels.economic`), and exposure (`labels.exposure`) signal tables showing source, score, and reason for each signal (REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-012, NFR-003, NFR-006)

- [x] Wire loading chrome to brand `Skeleton` and `common.loading`, and error chrome to brand `Alert` / `common.error` with a brand `Button` using `common.retry` that re-requests the selected symbol; ignore stale responses when the selection has changed (REQ-008, REQ-009, REQ-010, REQ-012, NFR-006)

- [x] Mount the classification screen as the Classification destination content in the shared application layout, replacing any Classification stub/placeholder (reuse layout nav labeling already owned by App Layout; `cta.viewClassification` only where a CTA is shown) (REQ-013, NFR-001, NFR-002)

- [x] Write unit tests for response → view model mapping (valid payloads, empty signal arrays, and invalid / incomplete payloads) (REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-009)

- [x] Write component tests for idle/loading/success/error states, symbol selection fetch, retry, and visible regime / risk / economic / exposure signals with source, score, and reason from fixtures (REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, REQ-011)

- [x] Verify Classification destination renders this view (not stub-only) and that user-facing strings resolve from brand wording or feature locale keys (no hardcoded English in components) (REQ-012, REQ-013, NFR-002, NFR-005, NFR-006)

Tasks are ordered to minimize implementation dependencies.
