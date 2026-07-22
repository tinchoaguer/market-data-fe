# Tasks

## Implementation Tasks

Tasks are ordered to minimize dependencies. Each task is independently verifiable and scoped to `market-data-fe` (`PROJECT_ROOT`).

- [x] **T-001** Add a thin boundary adapter (e.g. `resolveUiMessages`) that delegates to Content `resolve` with `locale: 'en'` and `channel: 'ui'`, does not mutate inputs, and does not import `@market-data/brand`. Export it from a stable path usable by both API mappers. *(REQ-006, REQ-011, NFR-001)*

- [x] **T-002** Update the classification mapper so signal reasons that are `MessageRef` values, or raw codes in the Content v1 classification set, are resolved via the boundary adapter; write `ResolvedMessage.text` onto the existing view-model reason field. Preserve structural fail-closed and per-code fallback without aborting the whole map. *(REQ-001, REQ-003, REQ-007, NFR-004)*

- [x] **T-003** Update the analysis mapper so Content v1 analysis catalog narrative `MessageRef` fields are resolved via the boundary adapter; write `text` onto the existing view-model narrative field(s) already consumed for catalog/recommendation narrative. Preserve structural fail-closed and per-code fallback. *(REQ-001, REQ-003, REQ-008, NFR-004)*

- [x] **T-004** Stop using `classificationLabels.*` (and any duplicate narrative locale keys for Content v1 analysis codes) as SoT: remove resolution call sites, delete retired locale keys when safe, and remove or narrow helpers that only served those overlapping catalogs. Leave transitional non-v1 `analysisLabels.*` token catalogs on `resolveLabel` per design.md. *(REQ-002, REQ-009, REQ-010, NFR-006)*

- [x] **T-005** Confirm Analysis and Classification screens still bind view-model strings only (no component-owned code→English maps), and that idle/loading/success/error/retry flows remain intact without screen redesign. Defer fuller copy wiring to `analysis-classification-copy`. *(REQ-004, REQ-005, REQ-012, NFR-003, NFR-005)*

- [x] **T-006** Extend existing tests with strong oracles: boundary adapter → Content text for a known v1 fixture; classification mapper humanization via Content + unknown fallback; analysis mapper narrative resolve via Content + unknown fallback; update/remove obsolete `classificationLabels` completeness expectations; keep structural fail-closed cases. Prefer extending `map*.test.ts` / Content tests — no new `copy.source.test.ts`, E2E, or MSW. *(REQ-001–REQ-003, REQ-007–REQ-009; testing-policy)*

## Task order

1. T-001 (adapter)
2. T-002 → T-003 (mappers; either order OK after T-001)
3. T-004 (retire overlapping SoT; after mappers no longer depend on it)
4. T-005 (screen/flow scope check)
5. T-006 (tests; may start in parallel with T-002/T-003)

## Traceability summary

| Requirement | Tasks |
|-------------|-------|
| REQ-001 | T-002, T-003, T-006 |
| REQ-002 | T-004, T-006 |
| REQ-003 | T-002, T-003, T-006 |
| REQ-004 | T-005 |
| REQ-005 | T-005 |
| REQ-006 | T-001 |
| REQ-007 | T-002, T-006 |
| REQ-008 | T-003, T-006 |
| REQ-009 | T-004, T-006 |
| REQ-010 | T-004 |
| REQ-011 | T-001 |
| REQ-012 | T-005 |
| NFR-001 | T-001 |
| NFR-002 | T-002, T-003 (consume existing shapes only) |
| NFR-003 | T-005 |
| NFR-004 | T-002, T-003, T-006 |
| NFR-005 | T-005 |
| NFR-006 | T-004 |

Tasks intentionally omit inventing Content codes, migrating non-v1 token catalogs into Content, remote content-service work, and full analysis/classification copy redesign (`analysis-classification-copy`).
