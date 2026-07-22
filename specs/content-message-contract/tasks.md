# Tasks

## Implementation Tasks

Tasks are ordered to minimize dependencies. Each task is independently verifiable and scoped to `market-data-fe` (`PROJECT_ROOT`).

- [x] Create Content module directory `src/content/` and public barrel `src/content/index.ts` (initially may re-export placeholders until types land) (REQ-001, NFR-001)

- [x] Define closed unions `MessageSeverity` (`'info' | 'warning' | 'error'`), `MessageChannel` (`'ui'`), and `CodeParamKind` (`'string' | 'number' | 'boolean'`) in the Content module (REQ-005)

- [x] Define `MessageParams`, `MessageRef` (required `code`; optional `params`, `severity`, `channel`), `ResolvedMessageMeta`, and `ResolvedMessage` (required `code`, `locale`, `text`; optional `meta`) (REQ-002, REQ-003, NFR-005)

- [x] Define `CodeParamSchema`, `CodeRegistryEntry` (`code`, `paramsSchema`, optional `defaultSeverity`), `CodeRegistry`, and export `emptyCodeRegistry` as an immutable empty registry container (REQ-004, REQ-008)

- [x] Re-export all mandatory public symbols from `src/content/index.ts` per design.md Interfaces; ensure Content sources do not import `@market-data/brand` or `@market-data/brand/wording` (REQ-001, REQ-007)

- [x] Confirm no production feature mapper or screen is changed to import/resolve Content messages (leave existing i18n/label paths untouched) (REQ-006, NFR-002, NFR-003, NFR-004)

- [x] Add colocated `src/content/*.test.ts` with strong structural oracles: barrel exports, `MessageRef` / `ResolvedMessage` fixtures, sample `CodeRegistryEntry`, closed severity/channel literals, and empty `emptyCodeRegistry` (REQ-002, REQ-003, REQ-004, REQ-005, REQ-008; testing-policy)

Tasks intentionally omit screen, mapper, fetch, locale-catalog completeness, and copy.source suites — those are out of scope for this contract Feature.
