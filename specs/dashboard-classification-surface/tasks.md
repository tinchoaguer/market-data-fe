# Tasks

## Implementation Tasks

Ordered to minimize dependencies. Each task contributes to one or more requirements. Prefer restyling the existing Classification body under `src/features/reading-classification-body/` (and extending its tests) before adding a parallel feature tree.

- [x] **T-001** Confirm `@maguer/market-data-brand@^0.2.0` (or newer compatible already present from Feature `dashboard-app-chrome`) exports `Table` (and related Table parts), `Card`, `Text` / `Label`, `SectionHeading`, and layout helpers needed for the tabular surface; note whether a Gauge (or equivalent compact score viz) primitive is exported for optional per-row use (REQ-008, NFR-002, NFR-006, NFR-011)

- [x] **T-002** Reuse or add Classification tabular locale keys in `src/locales/en.json` for Factor / Score / Reason column headers and optional empty-group / body chrome (`viewMarketClassification.*` reuse preferred, or `readingClassification.factor|score|reason` equivalents); readable via `src/i18n/messages.ts`. Add `readingClassification.factor` only when Factor header copy differs from existing Source key (REQ-010, REQ-019, NFR-004, NFR-005)

- [x] **T-003** Restyle the Classification Region body to dashboard Factor / Score / Reason tabular packaging using brand `Table` as the primary signal row structure; preserve four dimension groups (Regime, Risk, Economic, Exposure) via grouped tables or sectioned single table per design (REQ-001, REQ-002, REQ-008, REQ-017)

- [x] **T-004** Bind table rows from the existing Classification view model without new HTTP endpoints: Factor column from signal `source`, Score from `score`, Reason from Content-resolved display string; omit individual cells when unmapped without failing the Reading (REQ-003, REQ-004, REQ-012, REQ-015, NFR-009)

- [x] **T-005** Keep empty dimension groups visible with labeled group chrome and empty table body or `readingClassification.emptyGroup` copy; do not treat empty groups as fetch failure (REQ-014)

- [x] **T-006** If a brand Gauge (or equivalent) primitive is exported, optionally render compact per-signal or per-group score visualization supplementary to the Score cell; if not exported, omit visualization entirely (REQ-009, NFR-011)

- [x] **T-007** Enforce anti-patterns: no Overall Assessment / Overall Score / Synthesis unit, label, or Symbol-wide rollup visualization; no count-only summary as sole body when signals exist; no Classification nested under Assessments; no Analysis / Recommendation / Evidence / Market Data / Diagnostics content in Classification body (REQ-006, REQ-007, REQ-009, REQ-016)

- [x] **T-008** Preserve Classification placement: compact, adjacent, visually subordinate to Analysis — not equal prominence with Assessment cards; do not remount or restyle app chrome, hero band, Analysis Assessment cards, or Market Data observation row (REQ-005, REQ-011, REQ-018, NFR-010)

- [x] **T-009** Preserve host idle / loading / error: no success Classification table without host Classification success; loading remains usable; error still exposes retry for the failed Classification request (REQ-013, REQ-020, REQ-021, REQ-022)

- [x] **T-010** Resolve all restyled user-facing strings from brand wording / `getMessage`; bind reason cells to view-model strings only; no hardcoded designed English; use Symbol / Classification terminology (not Asset, Overall Score, Synthesis, Tags) (REQ-010, NFR-003, NFR-004, NFR-005)

- [x] **T-011** Extend existing Classification body component tests with strong oracles: Factor/Score/Reason table headers (catalog-linked); four dimension groups including empty; success fixture with source/score/reason visible; partial-cell fixture; not count-only; absence of Overall/Synthesis labels; optional viz scope (if used) not Symbol-wide rollup (REQ-001–REQ-004, REQ-007, REQ-009, REQ-014, REQ-015; AC-001, AC-002, AC-003, AC-006, AC-007, AC-008)

- [x] **T-012** Extend Reading shell / Analysis composition tests as needed so Classification remains a Reading sibling (not nested under Assessments), stays non-primary / subordinate adjacent to Analysis (REQ-005, REQ-006, REQ-017; AC-004, AC-005)

- [x] **T-013** Extend existing Reading / Classification host tests so idle / loading / error/retry oracles still pass after the tabular restyle (REQ-020, REQ-021, REQ-022; AC-009)

## Traceability

| Task | Requirements |
|------|----------------|
| T-001 | REQ-008, NFR-002, NFR-006, NFR-011 |
| T-002 | REQ-010, REQ-019, NFR-004, NFR-005 |
| T-003 | REQ-001, REQ-002, REQ-008, REQ-017 |
| T-004 | REQ-003, REQ-004, REQ-012, REQ-015, NFR-009 |
| T-005 | REQ-014 |
| T-006 | REQ-009, NFR-011 |
| T-007 | REQ-006, REQ-007, REQ-009, REQ-016 |
| T-008 | REQ-005, REQ-011, REQ-018, NFR-010 |
| T-009 | REQ-013, REQ-020, REQ-021, REQ-022 |
| T-010 | REQ-010, NFR-003, NFR-004, NFR-005 |
| T-011 | REQ-001–REQ-004, REQ-007, REQ-009, REQ-014, REQ-015 |
| T-012 | REQ-005, REQ-006, REQ-017 |
| T-013 | REQ-020, REQ-021, REQ-022 |

| Acceptance criterion | Primary tasks |
|----------------------|---------------|
| AC-001 | T-003, T-011 |
| AC-002 | T-004, T-011 |
| AC-003 | T-006, T-007, T-011 |
| AC-004 | T-008, T-012 |
| AC-005 | T-007, T-012 |
| AC-006 | T-001, T-003 |
| AC-007 | T-002, T-010, T-011 |
| AC-008 | T-003, T-005, T-011 |
| AC-009 | T-009, T-013 |
| AC-010 | T-008 |

Tasks are ordered to minimize implementation dependencies.
