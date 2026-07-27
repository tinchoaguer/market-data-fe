# Tasks

## Implementation Tasks

- [x] Add feature locale keys `readingEvidence.drivers`, `readingEvidence.features`, `readingEvidence.contributions`, `readingEvidence.claimAttachment`, `readingEvidence.kindPlaceholder`, `readingEvidence.emptyForClaim`, `readingEvidence.showFeatures`, `readingEvidence.showContributions`, and `readingEvidence.hideDepth` to `src/locales/en.json` and ensure they are readable via `src/i18n/messages.ts` (REQ-012, NFR-003, NFR-004, NFR-005)

- [x] Create the Evidence composition module under `src/features/reading-evidence-composition/` that defines claim-attached Evidence depth with Drivers → Features → Contributions structure, using brand `Stack` / `SectionHeading` / `Text` / `Label` / `Button` (and `Table` / `Card` / `Badge` only as needed for gray-box scanning or row lists) (REQ-001, REQ-002, REQ-003, REQ-009, REQ-011, NFR-001, NFR-002, NFR-006)

- [x] Implement progressive disclosure and anti-patterns inside Evidence: Drivers highest prominence; Features and Contributions on demand; no Metrics / Observations kind labels; Market Data not labeled as Evidence; Evidence remains supporting (not primary interpretive workspace) (REQ-003, REQ-006, REQ-007, REQ-011, NFR-007)

- [x] Bind existing Analysis-mapped assessment component rows and exposure factor rows into Evidence Drivers and/or Contributions under the matching claim attachment; render labeled gray-box placeholders when kind depth is missing; empty explainability still shows structured Evidence (not a free-floating metrics wall) (REQ-002, REQ-004, REQ-010, REQ-015, NFR-009)

- [x] Update Assessment peer composition so components / factors are not the primary body owned inside Assessment peers; peers keep outcome (+ Narrative) and may expose an Evidence path/reference only (REQ-004, REQ-008, REQ-014)

- [x] Mount the Evidence composition as the Evidence Region body in the Reading layout shell host without redefining Reading-wide Regions (Context, Analysis, Classification, Market Data, Diagnostics) (REQ-013)

- [x] Ensure Analysis outcomes and Recommendation stance remain understandable without requiring Features/Contributions disclosure to be open (interpretation before Evidence) (REQ-005)

- [x] Ensure all Evidence-composition user-facing strings resolve from feature locale keys or brand wording for claim labels (no hardcoded English in components; use Symbol terminology, not Asset; never Metrics/Observations kind labels) (REQ-012, NFR-002, NFR-003, NFR-005)

- [x] Add composition/component tests under `src/features/reading-evidence-composition/` asserting Drivers → Features → Contributions under Evidence, claim attachment (or structured empty Evidence), progressive disclosure, absence of Metrics/Observations kinds, and catalog-linked labels (REQ-001–REQ-003, REQ-006, REQ-010, REQ-012, REQ-015)

- [x] Extend Reading shell / Analysis composition tests as needed so components/factors appear under Evidence (not Assessment primary body), Analysis interpretation precedes Evidence in document order, and Market Data remains a distinct non-Evidence Region (REQ-004, REQ-005, REQ-007, REQ-008, REQ-013, REQ-014)

Tasks are ordered to minimize implementation dependencies.
