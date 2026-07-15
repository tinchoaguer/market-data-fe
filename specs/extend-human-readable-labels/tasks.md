# Tasks

## Implementation Tasks

- [x] Add `classificationLabels.regimeReason.*`, `classificationLabels.riskReason.*`, `classificationLabels.economicReason.*`, and `classificationLabels.exposureReason.*` locale keys for every OpenAPI member of those reason-code enums to `src/locales/en.json` with the English values from design.md Copy / Wording (REQ-001, REQ-002, REQ-003, REQ-004, REQ-013, NFR-003, NFR-004)

- [x] Add `analysisLabels.strategy.*` locale keys for every StrategyType token (`TREND_FOLLOWING`, `RANGE_BOUNDING`, `PING_PONG`, `NEWS_TRADING`, `OTHER`) to `src/locales/en.json` with the English values from design.md Copy / Wording (REQ-005, REQ-014, NFR-003, NFR-004)

- [x] Add `analysisLabels.exposureFactor.*` locale keys for `vol_budget_pct` and `liquidity_cap_value` to `src/locales/en.json` with the English values from design.md Copy / Wording (REQ-006, REQ-015, NFR-003, NFR-004)

- [x] Add `analysisLabels.riskComponent.*` and `analysisLabels.economicComponent.*` locale keys for the closed risk and economic component name sets to `src/locales/en.json` with the English values from design.md Copy / Wording (REQ-007, REQ-008, REQ-016, NFR-003, NFR-004)

- [x] Add thin label wrappers (or equivalent) that call existing `resolveLabel` with the new catalog prefixes for classification reasons, strategy tokens, exposure factors, and risk/economic components; do not introduce a second label-resolution pattern and do not rework existing analysis regime helpers (REQ-009, REQ-017, NFR-003)

- [x] Update the classification mapper (`mapMarketClassificationPayload` or equivalent) so each regime, risk, economic, and exposure signal `reason` is written to the view model as humanized text via the classification reason wrappers, without hardcoding display English in the mapper (REQ-001, REQ-002, REQ-003, REQ-004, REQ-009, REQ-011)

- [x] Update the analysis mapper (`mapMarketAnalysis` or equivalent) so preferred strategy / catalog strategy tokens mapped to recommendation name and/or catalogId are humanized via the strategy wrapper, without hardcoding display English (REQ-005, REQ-009, REQ-011)

- [x] Update the analysis mapper so exposure factor display names derived from `exposure.components` keys are humanized via the exposure-factor wrapper (REQ-006, REQ-009, REQ-011)

- [x] Update the analysis risk/economic components summary path (`formatComponentsSummary` or equivalent) so component names are humanized via the risk/economic component wrappers before summary composition, without rewriting free-text `catalog_reason` / `hard_gate_reason` (REQ-007, REQ-008, REQ-009, REQ-011, NFR-006)

- [x] Confirm unknown/uncatalogued in-scope codes fall back to the raw code and do not fail the entire payload mapping when the rest of the DTO is valid, for both classification and analysis mappers (REQ-010, NFR-005)

- [x] Verify Analysis and Classification screens still consume view-model strings only (no component-level DTO code maps) and that idle/loading/success/error/retry flows remain intact aside from humanized success copy (REQ-011, REQ-012, NFR-001, NFR-006)

- [x] Write unit tests for the new wrappers / catalogs covering every in-scope closed-set member plus unknown-code raw fallback (REQ-010, REQ-013, REQ-014, REQ-015, REQ-016, REQ-017, NFR-002, NFR-005)

- [x] Write or extend unit tests for the classification mapper asserting humanized reasons from fixtures and continued mapping on unknown reasons without regressing structural fail-closed behavior (REQ-001, REQ-002, REQ-003, REQ-004, REQ-009, REQ-010, REQ-012, NFR-005)

- [x] Write or extend unit tests for the analysis mapper / summary formatter asserting humanized strategy, exposure factor names, and risk/economic component summaries, unknown-code fallback, and unchanged structural fail-closed behavior (REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, REQ-012, NFR-005)

- [x] Write or extend component/integration coverage so successful classification and analysis fixtures render human-readable in-scope labels (not raw tokens such as `trend_up` or `TREND_FOLLOWING` as the sole presentation for known codes), while loading and error/retry paths still behave as today (REQ-001–REQ-008, REQ-011, REQ-012)

Tasks are ordered to minimize implementation dependencies.
