# Tasks

## Implementation Tasks

- [x] Add feature locale keys `readingLayout.regionContext`, `readingLayout.regionAnalysis`, `readingLayout.regionClassification`, `readingLayout.regionEvidence`, `readingLayout.regionMarketData`, `readingLayout.regionDiagnostics`, `readingLayout.selectSymbolPrompt`, and `readingLayout.regionPlaceholder` to `src/locales/en.json` and ensure they are readable via `src/i18n/messages.ts` (REQ-015, NFR-003, NFR-004, NFR-005)

- [x] Create the Reading workspace shell under `src/features/reading-layout-shell/` that defines six Region slots (Context, Analysis, Classification, Evidence, Market Data, Diagnostics) with stable region ids and primary / associated / supporting / cross-cutting prominence, using brand `Page` / `Stack` / `SectionHeading` / `Text` / `Label` (and `Card` only if needed for gray-box scanning) (REQ-001, REQ-002, REQ-004, REQ-005, REQ-006, REQ-007, REQ-009, NFR-001, NFR-002, NFR-006)

- [x] Implement primary-band composition so Context and Analysis appear first (available without scrolling for the primary message), Classification is compact and adjacent to Analysis, and Evidence / Market Data follow as supporting Regions; ensure Market Data is never the primary interpretive Region and no Narrative or Overall Score Region exists (REQ-003, REQ-004, REQ-005, REQ-006, REQ-008, REQ-016, REQ-017, NFR-007)

- [x] Render labeled gray-box placeholders (feature locale copy) for Region bodies that are not yet composed; optionally host existing Analysis, Classification, and/or Market Data content inside their Regions without implementing Analysis Assessment peer composition (REQ-010, REQ-017)

- [x] Wire the Reading surface into the shared application layout host so Symbol selection remains usable (`Select` from `@market-data/brand/ui`, existing `SUPPORTED_SYMBOLS` or equivalent), and idle / loading / error / retry flows remain available with brand `Skeleton`, `Alert`, and `Button` plus shared wording (`common.loading`, `common.error`, `common.retry`) (REQ-011, REQ-012, REQ-013, REQ-014, NFR-006)

- [x] Ensure all Reading shell user-facing strings resolve from brand wording or feature locale keys (no hardcoded English in components; use Symbol terminology, not Asset) (REQ-015, NFR-002, NFR-003, NFR-005)

- [x] Add layout/screen tests under `src/features/reading-layout-shell/` asserting six Region labels, primary-band order (Context + Analysis before Evidence + Market Data), Analysis primary prominence, Classification not primary, Market Data not primary, absence of Narrative/Overall Score Regions, and catalog-linked Region labels (REQ-001–REQ-008, REQ-015, REQ-016, REQ-017)

- [x] Extend or add Reading host screen tests for idle prompt without Symbol, loading while in flight, and error + retry re-invoking the loader so selection/loading/error remain usable with the shell mounted (REQ-011, REQ-012, REQ-013, REQ-014)

Tasks are ordered to minimize implementation dependencies.
