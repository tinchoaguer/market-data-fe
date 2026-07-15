# Tasks

## Implementation Tasks

- [x] Add `analysisLabels.regime.*` locale keys for every OpenAPI `AnalysisRegimeLabel` member (`TREND_UP`, `TREND_DOWN`, `RANGE`, `CHAOTIC`, `NEWS_SPIKE`) to `src/locales/en.json` with the English values from design.md Copy / Wording (REQ-008, NFR-003, NFR-004)

- [x] Add `analysisLabels.regimeReason.*` locale keys for every OpenAPI `AnalysisRegimeReasonCode` member to `src/locales/en.json` with the English values from design.md Copy / Wording (REQ-009, NFR-003, NFR-004)

- [x] Implement a reusable label-resolution helper that resolves a locale catalog prefix + API code via `getMessage` (or equivalent), returning the catalog string on hit and the raw code string on miss (REQ-004, REQ-007, NFR-005)

- [x] Implement thin analysis wrappers (for example `getAnalysisRegimeLabel` and `getAnalysisRegimeReasonLabel`) that call the reusable helper against `analysisLabels.regime` and `analysisLabels.regimeReason` (REQ-001, REQ-002, REQ-007)

- [x] Update `mapMarketAnalysis` so `regime.regime` is written to the view model as humanized label text via the analysis label helper, without hardcoding display English in the mapper (REQ-001, REQ-003, REQ-005)

- [x] Update `mapMarketAnalysis` so each `regime.reasons` entry is humanized via the analysis reason helper and composed into the regime summary (or equivalent VM field) presented to the UI, without hardcoding display English in the mapper (REQ-002, REQ-003, REQ-005)

- [x] Confirm unknown/uncatalogued regime labels or reason codes fall back to the raw code and do not fail the entire payload mapping when the rest of the DTO is valid (REQ-004, NFR-005)

- [x] Verify the market analysis screen still consumes view-model strings only (no component-level DTO code maps) and that idle/loading/success/error/retry flows remain intact aside from humanized success copy (REQ-005, REQ-006, NFR-001)

- [x] Write unit tests for label helpers covering all OpenAPI `AnalysisRegimeLabel` and `AnalysisRegimeReasonCode` members plus unknown-code fallback (REQ-001, REQ-002, REQ-004, REQ-007, REQ-008, REQ-009, NFR-002, NFR-005)

- [x] Write unit tests for `mapMarketAnalysis` asserting humanized regime label and reason summary from fixtures, continued mapping on unknown codes, and no regression of structural fail-closed behavior for invalid payloads (REQ-001, REQ-002, REQ-003, REQ-004, REQ-006, NFR-005)

- [x] Write or extend component/integration coverage so a successful analysis fixture renders human-readable regime label and reason text (not raw tokens such as `TREND_UP` as the sole label), while loading and error/retry paths still behave as today (REQ-001, REQ-002, REQ-005, REQ-006)

Tasks are ordered to minimize implementation dependencies.
