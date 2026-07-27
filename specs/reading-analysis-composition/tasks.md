# Tasks



## Implementation Tasks



- [x] Add feature locale keys `readingAnalysis.assessmentsLabel`, `readingAnalysis.unitPlaceholder`, `readingAnalysis.recommendationPlaceholder`, and `readingAnalysis.narrativePlaceholder` to `src/locales/en.json` and ensure they are readable via `src/i18n/messages.ts` (REQ-015, NFR-003, NFR-004, NFR-005)



- [x] Create the Assessments composition module under `src/features/reading-analysis-composition/` that defines one Assessments workspace with four peer Assessment units (Regime, Risk, Economic, Exposure) and a compact Recommendation unit, using brand `Stack` / `SectionHeading` / `Text` / `Label` / `Badge` (and `Card` only if needed for gray-box scanning) (REQ-001, REQ-002, REQ-004, REQ-011, REQ-016, NFR-001, NFR-002, NFR-006)



- [x] Implement attention order and anti-patterns inside Assessments: peer Assessments before Recommendation; Recommendation composed inside Assessments (not a Reading Region); Narrative only as claim-bound content (no Narrative Region); no Overall Assessment / Overall Score / Synthesis unit; Classification / Evidence / Market Data / Diagnostics not nested as Analysis-owned Regions (REQ-003, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, NFR-007)



- [x] Ensure Recommendation stance (mapped content or labeled placeholder) is present in the Analysis composition without requiring Analysis-only scrolling to discover the stance unit, and keep Recommendation compact relative to the peer collection (REQ-005, REQ-013, REQ-016)



- [x] Wire Assessment peer outcomes and Recommendation stance from existing Analysis view-model / mapping when available; render labeled gray-box placeholders for peers or Recommendation when detail is not yet composed; optional claim-bound Narrative placeholders remain associated with a claim unit (REQ-012, REQ-013, REQ-014)



- [x] Mount the Assessments composition as the Analysis Region body in the Reading layout shell host without redefining Reading-wide Regions (Context, Classification, Evidence, Market Data, Diagnostics) (REQ-017)



- [x] Ensure all Analysis-composition user-facing strings resolve from brand wording (`labels.regime`, `labels.risk`, `labels.economic`, `labels.exposure`, `labels.recommendation`) or feature locale keys (no hardcoded English in components; use Symbol terminology, not Asset) (REQ-015, NFR-002, NFR-003, NFR-005)



- [x] Add composition/component tests under `src/features/reading-analysis-composition/` asserting one Assessments workspace, four peer labels, Recommendation inside Assessments after peers, absence of Narrative/Overall/Synthesis Regions, Classification not nested under Assessments, and catalog-linked labels (REQ-001–REQ-011, REQ-015, REQ-016)



- [x] Extend Reading shell / Analysis host tests as needed so the Analysis Region body mounts the Assessments composition on a successful Reading and Evidence remains outside Analysis ownership in document order (REQ-009, REQ-010, REQ-017)



Tasks are ordered to minimize implementation dependencies.

