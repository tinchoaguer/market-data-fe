# Tasks

## Implementation Tasks

Ordered to minimize dependencies. Each task contributes to one or more requirements. Prefer extending the existing Assessments composition under `src/features/reading-analysis-composition/` (and existing Reading / Analysis host tests) before adding a parallel feature tree.

- [x] **T-001** Confirm `@maguer/market-data-brand@^0.2.0` (or newer compatible already present from Feature `dashboard-app-chrome`) exports `Card` (and related Card parts), `Badge`, `Text` / `Label`, and layout helpers needed for Assessment cards; if no Icon primitive exists, apply the NFR-011 decorative-mark exception and do not add a third-party icon library (REQ-003, NFR-002, NFR-006, NFR-011)

- [x] **T-002** Add `readingAnalysis.score` to `src/locales/en.json` **only if** a visible/accessible Score field label is rendered; otherwise skip the key. Reuse brand `labels.regime` / `labels.risk` / `labels.economic` / `labels.exposure` / `labels.recommendation` and existing `readingAnalysis.*` keys (REQ-015, NFR-004, NFR-005)

- [x] **T-003** Restyle the four Assessment peers (Regime, Risk, Economic, Exposure) as vertical brand `Card` units with stacked slots icon → label → badge → score → summary, bound from the existing Analysis view-model; omit badge, score, and/or summary when unmapped without removing the peer or failing the Reading (REQ-001, REQ-002, REQ-003, REQ-004, REQ-017)

- [x] **T-004** Implement dimension identity icons (brand Icon or NFR-011 decorative mark) as presentational marks; keep the dimension text label as the accessible card name (REQ-001, REQ-015, NFR-011)

- [x] **T-005** Lay out the peer collection in Regime → Risk → Economic → Exposure order: readable single row or 2×2 at `md` and above; stack in that order below `md`; keep all four peers visible and do not hide conflicts behind a rollup (REQ-005, REQ-019)

- [x] **T-006** Keep Recommendation composed inside Assessments after the peer collection as a compact band that does **not** use the Assessment-card skeleton and is **not** a fifth Assessment peer; stance (or labeled Recommendation unit) remains discoverable without Analysis-only scrolling (REQ-007, REQ-008)

- [x] **T-007** Enforce anti-patterns: no Overall Assessment / Overall Score / Synthesis unit or card; no Narrative Region; no Classification / Evidence / Market Data / Diagnostics nested as Analysis-owned Regions or extra Assessment cards; no Evidence tables or `components` / `factors` dumps as Assessment card primary body; no confidence Assessment card (REQ-006, REQ-009, REQ-010, REQ-011, REQ-020, REQ-021)

- [x] **T-008** Do not restyle or remount app chrome (`dashboard-app-chrome`), the Reading hero band (`dashboard-hero-band`), or the Market Data Region observation body; do not replace the Reading-wide Region map (REQ-016, REQ-018, NFR-010)

- [x] **T-009** Preserve host idle / loading / error: no success Assessment card body without Analysis success; loading remains usable; error still exposes retry for the failed Analysis request (REQ-012, REQ-013, REQ-014)

- [x] **T-010** Resolve all new or restyled user-facing strings from brand wording / `getMessage`; no hardcoded designed English in Assessment card components; use Symbol / Assessment terminology (not Asset, Overall Score, Synthesis, Advice) (REQ-015, NFR-003, NFR-004, NFR-005)

- [x] **T-011** Extend existing Analysis composition component tests with strong oracles: four labeled Assessment cards; full-slot fixture shows badge/score/summary; omit-slot fixture keeps the peer and hides missing slots; Recommendation after peers and not Assessment-card skeleton; absence of Overall/Synthesis/Narrative Region; Classification not nested under Assessments; catalog-linked labels (REQ-001–REQ-011, REQ-015, REQ-019, REQ-020; AC-001, AC-003, AC-004, AC-005, AC-007, AC-008)

- [x] **T-012** Extend existing Reading / Analysis host tests so idle / loading / error/retry oracles still pass after the card restyle (loading visible; error retry re-invokes loader; idle does not claim success cards) (REQ-012, REQ-013, REQ-014; AC-006)

## Traceability

| Task | Requirements |
|------|----------------|
| T-001 | REQ-003, NFR-002, NFR-006, NFR-011 |
| T-002 | REQ-015, NFR-004, NFR-005 |
| T-003 | REQ-001, REQ-002, REQ-003, REQ-004, REQ-017 |
| T-004 | REQ-001, REQ-015, NFR-011 |
| T-005 | REQ-005, REQ-019 |
| T-006 | REQ-007, REQ-008 |
| T-007 | REQ-006, REQ-009, REQ-010, REQ-011, REQ-020, REQ-021 |
| T-008 | REQ-016, REQ-018, NFR-010 |
| T-009 | REQ-012, REQ-013, REQ-014 |
| T-010 | REQ-015, NFR-003, NFR-004, NFR-005 |
| T-011 | REQ-001–REQ-011, REQ-015, REQ-019, REQ-020 |
| T-012 | REQ-012, REQ-013, REQ-014 |

| Acceptance criterion | Primary tasks |
|----------------------|---------------|
| AC-001 | T-003, T-004, T-005, T-011 |
| AC-002 | T-001, T-003 |
| AC-003 | T-007, T-011 |
| AC-004 | T-006, T-011 |
| AC-005 | T-007, T-011 |
| AC-006 | T-009, T-012 |
| AC-007 | T-002, T-010, T-011 |
| AC-008 | T-003, T-011 |
| AC-009 | T-008 |

Tasks are ordered to minimize implementation dependencies.
