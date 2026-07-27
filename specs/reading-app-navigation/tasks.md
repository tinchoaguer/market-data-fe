# Tasks

## Implementation Tasks

- [x] Record and implement the IA decision in routing/layout: default home and primary Symbol-inspection destination are Symbol Reading (`reading`); remove Market Data, Analysis, and Classification as equal peer primary nav destinations (REQ-001, REQ-002, REQ-003)

- [x] Add feature locale key `appLayout.navReading` (“Reading”) to `src/locales/en.json` and wire the primary nav label through `src/i18n/messages.ts`; stop rendering `appLayout.navMarketData` / `appLayout.navAnalysis` / `appLayout.navClassification` as primary nav peers; keep brand `product.name` as chrome identity only (REQ-012, REQ-013, NFR-003, NFR-004, NFR-005)

- [x] Update shared application layout under `src/features/app-layout/` to use brand `AppShell` / `AppHeader` / `AppHeaderBar` / `AppBrand` / `AppNav` / `AppMain` (and `Button` or kit nav pattern) so primary nav exposes Reading only, with visual active indication when Reading is shown; keep chrome structure stable across outlet changes (REQ-002, REQ-005, REQ-011, REQ-012, NFR-002, NFR-006)

- [x] Configure routing so legacy Market Data / Analysis / Classification destination paths (or destination ids) redirect into Symbol Reading; outlet always hosts the Reading workspace for those entries rather than peer screens (REQ-004)

- [x] Ensure the Reading workspace host remains mounted as the Reading destination content so Region hierarchy from `reading-layout-shell` stays intact (Analysis primary; Market Data not primary / not Market-Data-first) and Symbol selection, idle, loading, and error+retry flows remain usable (REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, NFR-008)

- [x] Ensure all new/changed user-facing nav and chrome strings resolve from brand wording or feature locale keys (no hardcoded English in components; use “Reading” and “Symbol”, not peer trio labels or “Asset”) (REQ-013, NFR-002, NFR-003, NFR-005)

- [x] Extend `src/features/app-layout/*.test.tsx` for: Reading as default/primary destination; absence of peer Market Data / Analysis / Classification primary nav controls; Reading active indication; legacy path/id redirect into Reading; catalog-linked Reading nav label and brand name in chrome (REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-012, REQ-013)

- [x] Extend or smoke-assert Reading host / `reading-layout-shell` tests so hierarchy (Analysis primary; Market Data not primary; Context+Analysis before Market Data) and idle/loading/error+retry remain green with the new default route mount (REQ-006, REQ-007, REQ-008, REQ-009, REQ-010)

Tasks are ordered to minimize implementation dependencies.
