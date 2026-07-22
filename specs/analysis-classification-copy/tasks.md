# Tasks

## Implementation Tasks

Tasks are ordered to minimize dependencies. Each task is independently verifiable and scoped to `market-data-fe` (`PROJECT_ROOT`).

- [x] **T-001** Extend the analysis view-model recommendation shape with `hardGateReason: string | null` (or equivalent), and update the analysis mapper so `catalog.hard_gate_reason` MessageRefs resolve via the existing boundary adapter onto that field; `null` wire value maps to `null`. Keep `catalog.catalog_reason` → `recommendation.rationale` Content-resolved. Preserve structural fail-closed and per-message Content fallback. *(REQ-001, REQ-002, REQ-003, REQ-009, NFR-001, NFR-004)*

- [x] **T-002** Confirm classification mapper continues to expose Content-resolved signal `reason` strings for Content v1 reasons (MessageRef or raw v1 code → boundary adapter → VM string) without reintroducing `classificationLabels.*` or `analysisLabels.*` as SoT for those codes. *(REQ-004, REQ-008, REQ-010, REQ-011)*

- [x] **T-003** Update the Analysis screen so success UI binds `recommendation.rationale` as the primary rationale narrative and, when `hardGateReason` is non-null, presents that resolved string with chrome label `viewMarketAnalysis.hardGateReason` (“Hard gate”) using existing brand `Text`/`Label` (and current Recommendation section structure). Omit hard-gate UI when null. Do not import Content catalogs or map MessageRef codes in the component. *(REQ-005, REQ-006, REQ-007, REQ-008, REQ-015, NFR-005, NFR-006)*

- [x] **T-004** Confirm the Classification screen binds view-model `reason` strings only (no MessageRef→English maps, no Content catalog imports). Leave idle/loading/error/retry unchanged. *(REQ-004, REQ-008, REQ-014, REQ-015)*

- [x] **T-005** Add feature locale key `viewMarketAnalysis.hardGateReason` = `Hard gate` in `src/locales/en.json` (chrome label only). Do not duplicate Content v1 narrative templates into app locales. Leave transitional non-v1 `analysisLabels.*` token catalogs intact for assessment summary/level humanization. *(REQ-011, REQ-012, REQ-013, NFR-006)*

- [x] **T-006** Extend existing tests with strong oracles: analysis mapper `catalog_reason` → rationale and `hard_gate_reason` → `hardGateReason` (plus null case) equal Content-resolved text / null; unknown-code fallback without failing the map; Analysis screen success shows rationale and non-null hard-gate text and omits hard-gate when null; keep classification/analysis state-machine tests green. Prefer extending `map*.test.ts` and existing `*Screen.test.tsx` — no new `copy.source.test.ts`, E2E, or MSW. *(REQ-001–REQ-003, REQ-006–REQ-009, REQ-014; testing-policy)*

## Task order

1. T-001 (analysis VM + mapper hard-gate wiring)
2. T-002 (classification mapper confirmation; parallel with T-001 OK)
3. T-005 (chrome locale key; before or with T-003)
4. T-003 → T-004 (screens)
5. T-006 (tests; may start in parallel with T-001 once fixtures exist)

## Traceability summary

| Requirement | Tasks |
|-------------|-------|
| REQ-001 | T-001, T-006 |
| REQ-002 | T-001, T-006 |
| REQ-003 | T-001, T-006 |
| REQ-004 | T-002, T-004 |
| REQ-005 | T-003 |
| REQ-006 | T-003, T-006 |
| REQ-007 | T-003, T-006 |
| REQ-008 | T-002, T-003, T-004 |
| REQ-009 | T-001, T-006 |
| REQ-010 | T-002 |
| REQ-011 | T-002, T-005 |
| REQ-012 | T-005 |
| REQ-013 | T-005 |
| REQ-014 | T-004, T-006 |
| REQ-015 | T-003, T-004 |
| NFR-001 | T-001 |
| NFR-002 | T-001, T-002 (consume existing shapes only) |
| NFR-003 | T-002, T-005 |
| NFR-004 | T-001, T-006 |
| NFR-005 | T-003 |
| NFR-006 | T-003, T-005 |

Tasks intentionally omit inventing Content codes, migrating non-v1 assessment token catalogs into Content, remote content-service work, and redesigning assessment summary/level presentation beyond Content-resolved catalog narrative binding.
