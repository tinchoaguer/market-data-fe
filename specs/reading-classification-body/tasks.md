# Tasks

## Implementation Tasks

- [x] Reuse or add Classification body locale keys for signal field labels and optional empty-group / body chrome (`viewMarketClassification.source|score|reason` reuse preferred, or `readingClassification.*` equivalents) in `src/locales/en.json`, readable via `src/i18n/messages.ts` (REQ-009, NFR-003, NFR-004, NFR-005)

- [x] Create the Classification body composition module under `src/features/reading-classification-body/` that defines four dimension signal groups (Regime, Risk, Economic, Exposure) and per-signal source / score / reason packaging, using brand `Stack` / `SectionHeading` / `Text` / `Label` / `Table` (and `Badge` / `Card` only as needed for compact gray-box scanning) (REQ-001, REQ-002, REQ-003, REQ-008, REQ-015, NFR-001, NFR-002, NFR-006, NFR-007)

- [x] Wire Classification body to the existing Classification view model (Reading host / reused mapper from `view-market-classification` + Content-resolved reasons) without new HTTP endpoints or OpenAPI fields; empty groups remain visible (REQ-004, REQ-013, REQ-014, NFR-009)

- [x] Mount the Classification body as the Classification Region body in the Reading layout shell host without redefining Reading-wide Regions; keep Classification compact, adjacent, and subordinate to Analysis (not equal prominence) (REQ-005, REQ-010, REQ-012)

- [x] Enforce ownership and anti-patterns: do not nest Classification under Assessments; do not introduce Overall / Primary / Secondary Classification taxonomy; do not replace packaging with count-only summary; do not own Analysis / Evidence / Market Data / Diagnostics content inside Classification body (REQ-006, REQ-007, REQ-011, REQ-015)

- [x] Ensure all Classification-body user-facing strings resolve from feature locale keys, brand wording, or Classification view-model reason strings (no hardcoded designed English; no inline MessageRef→English maps; use Symbol terminology, not Asset) (REQ-009, NFR-002, NFR-003, NFR-005)

- [x] Add composition/component tests under `src/features/reading-classification-body/` asserting four dimension groups (including empty), one success fixture with source/score/reason visible (catalog-linked labels + fixture reason), and not-count-only packaging (REQ-001–REQ-004, REQ-013, REQ-015, AC-001, AC-002, AC-006, AC-007)

- [x] Extend Reading shell / Analysis composition tests as needed so Classification remains a Reading sibling (not nested under Assessments), stays non-primary / subordinate adjacent to Analysis, and has no Overall / Primary-Secondary Classification units (REQ-005, REQ-006, REQ-007, REQ-010, AC-003, AC-004, AC-008)

Tasks are ordered to minimize implementation dependencies.
