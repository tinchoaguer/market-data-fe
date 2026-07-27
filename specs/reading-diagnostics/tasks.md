# Tasks

## Implementation Tasks

- [x] Add feature locale keys `readingDiagnostics.statusHealthy`, `readingDiagnostics.statusQualifying`, `readingDiagnostics.statusBlocking`, `readingDiagnostics.kindInsufficient`, `readingDiagnostics.kindPartial`, `readingDiagnostics.kindStale`, `readingDiagnostics.kindEquivalent`, `readingDiagnostics.signalPlaceholder`, `readingDiagnostics.showDetails`, and `readingDiagnostics.hideDetails` to `src/locales/en.json` and ensure they are readable via `src/i18n/messages.ts` (REQ-011, NFR-003, NFR-004, NFR-005)

- [x] Create the Diagnostics composition module under `src/features/reading-diagnostics/` that defines quiet / elevated trust status chrome and a Diagnostics signal list, using brand `Stack` / `SectionHeading` / `Text` / `Label` / `Alert` / `Button` (and `Badge` / `Card` only as needed for gray-box scanning) (REQ-001, REQ-002, REQ-003, REQ-008, REQ-010, NFR-001, NFR-002, NFR-006)

- [x] Implement a trust signal mapper that derives Diagnostics signals (`insufficient` / `partial` / `stale` / `equivalent`) and severity (`healthy` \| `qualifying` \| `blocking`) from existing Analysis / Reading view-model fields without new HTTP endpoints or OpenAPI fields (REQ-004, NFR-009)

- [x] Wire presentation rules: quiet / minimal when healthy; elevate near the Reading when qualifying or blocking; expand elevated chrome when blocking (not collapsed-only); keep Diagnostics cross-cutting and never Extra-large primary (REQ-002, REQ-003, REQ-009, REQ-010, REQ-014, NFR-007)

- [x] Enforce ownership and anti-patterns: Diagnostics qualify only (no Assessment / Recommendation conclusions); do not bury blocking Diagnostics solely as a Market-Data-late epilogue or solely inside Evidence tables; do not show diagnostic plumbing codes as primary Analysis body text (REQ-006, REQ-007, REQ-013, REQ-015)

- [x] Ensure Analysis Assessments composition has no Confidence / data-quality Assessment peer dimension (REQ-005)

- [x] Mount the Diagnostics composition as the Diagnostics Region body in the Reading layout shell host without redefining Reading-wide Regions (Context, Analysis, Classification, Evidence, Market Data) (REQ-012)

- [x] Ensure all Diagnostics-composition user-facing strings resolve from feature locale keys, reused shell Region labels, brand wording, or existing humanized reason catalogs (no hardcoded English in components; use Symbol terminology, not Asset; never Confidence as an Assessment label) (REQ-011, NFR-002, NFR-003, NFR-005)

- [x] Add mapper unit tests and composition/component tests under `src/features/reading-diagnostics/` asserting quiet healthy state, elevated qualifying/blocking state, mapped trust signal kinds with catalog-linked labels, expanded blocking chrome, and ownership boundaries (REQ-001–REQ-004, REQ-007, REQ-009, REQ-010, REQ-011, REQ-013, REQ-014)

- [x] Extend Reading shell / Analysis / Evidence composition tests as needed so Diagnostics remain distinct, Analysis stays primary hero, no Confidence Assessment peer exists, and blocking trust is not Evidence-only (REQ-005, REQ-006, REQ-012, REQ-015)

Tasks are ordered to minimize implementation dependencies.
