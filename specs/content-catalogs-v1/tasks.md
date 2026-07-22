# Tasks

## Implementation Tasks

Tasks are ordered to minimize dependencies. Each task is independently verifiable and scoped to `market-data-fe` (`PROJECT_ROOT`).

- [x] **T-001** Add Content catalog modules under `src/content/catalogs/` that define `CodeRegistryEntry` objects for the 7 analysis narrative codes (`catalog.wait`, `catalog.strategy_allowed`, `catalog.no_strategy_allowed`, `catalog.hard_gate.extreme_regime`, `catalog.hard_gate.risk_too_high`, `catalog.hard_gate.negative_edge`, `catalog.hard_gate.no_capacity`) with paramsSchema and defaultSeverity per design.md. *(REQ-001, REQ-003)*

- [x] **T-002** Add Content catalog entries for the 16 classification signal-reason codes (regime/risk/economic/exposure closed sets) with empty `paramsSchema` and defaultSeverity `info` per design.md. *(REQ-002, REQ-003)*

- [x] **T-003** Merge analysis + classification entries into a frozen `v1CodeRegistry` (`CodeRegistry`) whose keys equal entry codes and whose member set is exactly the designed 23 codes (no extras). *(REQ-001, REQ-002, REQ-013)*

- [x] **T-004** Add `en`/`ui` template map under `src/content/templates/` with the exact designed English strings and `{param}` placeholders from design.md Copy / Wording for all 23 codes. *(REQ-004)*

- [x] **T-005** Implement in-process `resolve({ locale, channel, messages })` in the Content module: ordered `ResolvedMessage[]`, `{param}` interpolation, v1 number formatting, default-locale `en` fallback, per-message unknown/missing-template fallback without aborting the batch, optional `meta.fallback`. *(REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, NFR-006)*

- [x] **T-006** Export `v1CodeRegistry` and `resolve` from `src/content/index.ts` alongside existing contract exports; ensure Content sources do not import `@market-data/brand` or `@market-data/brand/wording`. *(REQ-012, REQ-013, NFR-001, NFR-005)*

- [x] **T-007** Confirm no production feature mapper or screen is changed to call `resolve`, and that legacy `analysisLabels.*` / classification HTTP error codes / non-MessageRef regime maps are not migrated in this Feature. *(REQ-011, NFR-002, NFR-003, NFR-004)*

- [x] **T-008** Add/extend colocated Content tests with strong oracles: closed-set registry completeness (23 codes + paramsSchema), template↔registry bi-inclusion, `resolve` interpolation for analysis+classification fixtures, unknown-code batch fallback, and non-`en` locale fallback to `en`. *(REQ-001–REQ-009; testing-policy)*

## Task order

1. T-001 → T-002 → T-003 (registries)
2. T-004 (templates)
3. T-005 → T-006 (resolve + barrel)
4. T-007 (scope check)
5. T-008 (tests; may start earlier against T-003/T-004 stubs)

## Traceability summary

| Requirement | Tasks |
|-------------|-------|
| REQ-001 | T-001, T-003, T-008 |
| REQ-002 | T-002, T-003, T-008 |
| REQ-003 | T-001, T-002, T-008 |
| REQ-004 | T-004, T-008 |
| REQ-005 | T-005, T-006, T-008 |
| REQ-006 | T-005, T-008 |
| REQ-007 | T-005, T-008 |
| REQ-008 | T-005, T-008 |
| REQ-009 | T-005, T-008 |
| REQ-010 | T-005 |
| REQ-011 | T-007 |
| REQ-012 | T-006 |
| REQ-013 | T-003, T-006 |
| NFR-001 | T-006 |
| NFR-002 | T-007 |
| NFR-003 | T-007 |
| NFR-004 | T-007 |
| NFR-005 | T-006, T-008 |
| NFR-006 | T-005 |

Tasks intentionally omit screen, mapper, fetch, E2E, and copy.source suites — those are out of scope for this Feature.
