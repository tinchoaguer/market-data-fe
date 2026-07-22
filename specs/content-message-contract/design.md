# Design

## Overview

This Feature adds a Content module skeleton under `src/content/` and the stable TypeScript contracts that later Content Features will build on: `MessageRef`, `ResolvedMessage`, severity/channel unions, a `CodeRegistryEntry` shape, and an empty typed registry container. No resolve API, no narrative catalogs, no mapper/screen wiring, and no brand chrome ownership are introduced here.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| `src/content/` | Bounded Content module root; later extraction candidate (REQ-001, NFR-001). |
| `src/content/types.ts` (or equivalent) | Defines `MessageSeverity`, `MessageChannel`, `MessageRef`, `ResolvedMessage`, and related param types (REQ-002, REQ-003, REQ-005). |
| `src/content/registry.ts` (or equivalent) | Defines `CodeRegistryEntry`, params-schema metadata, and the empty registry container type/value (REQ-004, REQ-008). |
| `src/content/index.ts` | Public barrel: re-exports only Content contracts and skeleton; no feature/UI/brand wording imports (REQ-001, REQ-007). |
| Existing `src/i18n/`, `src/locales/`, feature mappers, screens | Unchanged by this Feature (REQ-006, NFR-003). |
| `@market-data/brand` | Remains the owner of product chrome / shared DS wording; Content must not depend on it (REQ-007, NFR-004). |

```text
src/content/
├── index.ts          # public barrel
├── types.ts          # MessageRef, ResolvedMessage, severity, channel
├── registry.ts       # CodeRegistryEntry + empty registry container
└── *.test.ts         # contract/shape oracles (colocated)
```

File names may vary slightly if the Implementer consolidates types into fewer modules, but the public barrel path `src/content/index.ts` and the exported type names below are mandatory.

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| New `src/content/` tree | Clear package boundary; not mixed into `src/i18n/` (legacy label helpers) or feature folders | REQ-001, NFR-001 |
| Types-first, no resolve | Matches backlog split: contract → catalogs/resolve → boundary → wiring | REQ-006, NFR-003 |
| Closed severity/channel unions | Prevents per-feature string drift before catalogs land | REQ-005 |
| Empty registry container | Lets `content-catalogs-v1` register entries without redesigning the entry shape | REQ-004, REQ-008 |
| No brand imports | Brand chrome stays in `@market-data/brand`; Content owns semantic narrative codes later | REQ-007 |

### Brand UI primitives

This Feature does **not** introduce or change interactive UI. No brand UI primitives are required.

**Exception (documented):** Contract/skeleton work is a TypeScript module concern only; native HTML / Tailwind rules do not apply because no UI is added.

### Out of scope (explicit)

- Implementing `resolve({ locale, channel, messages })` or any resolve API
- Registering analysis/classification narrative codes or `en`/`ui` templates
- Param interpolation / formatters
- Migrating or deleting `analysisLabels.*` / feature-local DTO→label maps
- Changing analysis or classification mappers or screens
- Owning or mirroring `@market-data/brand` chrome wording
- Backend / OpenAPI changes

## Data Flow

This Feature introduces **no runtime user data flow**. Contracts exist for later Features.

Conceptual future flow (not implemented here; documented for boundary clarity):

```text
[Mapper / boundary] builds MessageRef[]
        │
        ▼
[Content resolve]  ← later Feature (content-catalogs-v1)
        │
        ▼
ResolvedMessage[] → view model → screen
```

For this Feature, the only “flow” is compile-time / module import:

```text
Consumer Feature (future)
        │
        ▼
import { MessageRef, ResolvedMessage, CodeRegistryEntry, ... } from '../content'
        │
        ▼
Types used to author catalogs / resolve (later)
```

Existing product flows (market data / analysis / classification fetch → map → screen) are unchanged (REQ-006).

## Interfaces

### Public Content module exports (mandatory)

All of the following MUST be importable from `src/content/index.ts` (direct deep imports of internal files MAY exist, but the barrel MUST re-export these names):

| Export | Kind | Purpose |
|--------|------|---------|
| `MessageSeverity` | type (literal union) | Closed severity vocabulary |
| `MessageChannel` | type (literal union) | Closed channel vocabulary |
| `MessageParams` | type | Params map on a `MessageRef` |
| `MessageRef` | type | Unresolved message reference |
| `ResolvedMessage` | type | Resolved display message |
| `ResolvedMessageMeta` | type | Optional meta bag on `ResolvedMessage` |
| `CodeParamKind` | type (literal union) | Param value kinds in registry schema |
| `CodeParamSchema` | type | Per-code params schema metadata |
| `CodeRegistryEntry` | type | One catalog registration unit |
| `CodeRegistry` | type | Map/record of code → entry |
| `emptyCodeRegistry` | const | Empty typed registry container skeleton |

No `resolve` function is exported in this Feature.

### External systems

None. No HTTP, no brand wording package usage for Content contracts.

### Consumers (this Feature)

No production consumer is required. Unit tests under `src/content/` are the only required consumers for verification.

## Data Model

### Closed unions

#### `MessageSeverity`

```text
'info' | 'warning' | 'error'
```

Rationale: sufficient for narrative/UI messaging; extend only in a later Feature if product needs more levels (do not invent open strings).

#### `MessageChannel`

```text
'ui'
```

Rationale: `content-catalogs-v1` acceptance targets the `ui` channel; defining only `'ui'` now locks the vocabulary without pretending other channels exist. Additional channels require a later Feature that extends this union.

#### `CodeParamKind`

```text
'string' | 'number' | 'boolean'
```

Describes expected param value kinds for registry metadata (validation/interpolation belongs to later Features).

### `MessageParams`

```text
Record<string, string | number | boolean>
```

Keys are parameter names referenced by templates in later catalogs. Values are restricted to the three kinds above so registry schema and runtime params stay aligned.

### `MessageRef`

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `code` | yes | `string` | Semantic message code id (stable identity) |
| `params` | no | `MessageParams` | Interpolation values |
| `severity` | no | `MessageSeverity` | Overrides or supplies severity for this ref |
| `channel` | no | `MessageChannel` | Target channel; later resolve may default to `'ui'` |

### `ResolvedMessageMeta`

```text
Record<string, unknown>
```

Opaque optional bag. This Feature does not prescribe keys; later Features may populate (e.g. severity used, fallback applied) without changing `ResolvedMessage`’s required fields.

### `ResolvedMessage`

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `code` | yes | `string` | Echo of resolved code |
| `locale` | yes | `string` | Locale used for resolution (e.g. `'en'`) |
| `text` | yes | `string` | Final display text |
| `meta` | no | `ResolvedMessageMeta` | Optional metadata |

### `CodeParamSchema`

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `name` | yes | `string` | Parameter name |
| `kind` | yes | `CodeParamKind` | Expected value kind |
| `required` | yes | `boolean` | Whether resolve/catalog expects the param |

A code’s params schema is `CodeParamSchema[]` (ordered list is fine; order is not semantically significant unless a later Feature says otherwise).

### `CodeRegistryEntry`

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `code` | yes | `string` | Semantic code id (same space as `MessageRef.code`) |
| `paramsSchema` | yes | `CodeParamSchema[]` | Expected params; empty array when none |
| `defaultSeverity` | no | `MessageSeverity` | Default severity metadata for the code |

### `CodeRegistry`

```text
Readonly<Record<string, CodeRegistryEntry>>
```

Key MUST equal `entry.code` for every entry when catalogs are populated later. This Feature ships:

```text
emptyCodeRegistry: CodeRegistry = Object.freeze({})
```

(or equivalent immutable empty object typed as `CodeRegistry`).

### State transitions

None. No runtime state machine.

## Error Handling

| Situation | Behavior in this Feature |
|-----------|--------------------------|
| Invalid usage of types at compile time | TypeScript compilation fails (desired) |
| Empty registry | Valid; no resolution attempted |
| Missing catalogs / unknown codes | Not applicable — resolve not implemented |
| Brand wording missing | Not applicable — Content does not load brand wording |

No runtime validators are **required** for this Feature. Optional type guards (e.g. `isMessageSeverity`) MAY be added if useful for tests, but MUST NOT become a resolve API.

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This Feature is contract/skeleton only: no mapper, fetch, screen, or locale-catalog completeness suites. Prefer one colocated Content module test file with strong structural oracles.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Public barrel exports contract symbols | Content module | Import from `src/content` (barrel) succeeds; exported const `emptyCodeRegistry` is an empty object | `src/content/*.test.ts` |
| `MessageRef` shape accepts required + optional fields | Content module | Construct fixture objects assignable to `MessageRef` (minimal `{ code }` and full `{ code, params, severity, channel }`) and assert field values exactly | `src/content/*.test.ts` |
| `ResolvedMessage` shape requires `code`/`locale`/`text` | Content module | Construct fixture with required fields (+ optional `meta`); assert exact `text`/`locale`/`code` | `src/content/*.test.ts` |
| Registry entry includes code + paramsSchema + optional defaultSeverity | Content module | Build a sample `CodeRegistryEntry` (not registered in production catalogs) and assert `code`, `paramsSchema` contents, and `defaultSeverity` | `src/content/*.test.ts` |
| Severity/channel unions are closed | Content module | Assert allowed literals used in fixtures are the designed set (`info`/`warning`/`error`, `ui`); do not require a separate file per union | `src/content/*.test.ts` |
| Empty registry skeleton | Content module | `emptyCodeRegistry` has no keys / `Object.keys(...).length === 0` | `src/content/*.test.ts` |
| No brand wording ownership | Content module / Reviewer check | Content sources under `src/content/` do not import `@market-data/brand` or `@market-data/brand/wording` (Reviewer AC check; optional single source-import guard only if cheap — not a per-AC copy.source suite) | Reviewer + optional assert in same test file |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| Bounded `src/content/` + barrel | Yes — barrel import test |
| `MessageRef` fields | Yes — fixture shape asserts |
| `ResolvedMessage` fields | Yes — fixture shape asserts |
| Code-registry entry shape | Yes — sample entry asserts |
| Closed severity/channel | Yes — fixture uses designed literals (type system enforces closed set) |
| Mappers/screens unchanged | Manual / Reviewer — no production imports of Content from feature mappers/screens required; do not add screen/mapper tests |
| Brand chrome out of scope | Reviewer (+ optional no-import guard) |
| Empty registry skeleton | Yes — `emptyCodeRegistry` empty |

Do **not** add: screen tests, mapper tests, locale completeness suites, E2E, MSW, coverage thresholds, or a new `copy.source.test.ts`.

## Copy / Wording

This Feature adds **no** user-facing UI copy.

### Design-system keys reused

None.

### Feature keys to add or change

None. Do not add Content narrative strings to `src/locales/en.json` in this Feature. Catalog templates belong to `content-catalogs-v1`.

Terminology: semantic **code**, **MessageRef**, **ResolvedMessage**, and **registry** are engineering contract terms, not UI labels.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | `src/content/` module + `index.ts` public barrel |
| REQ-002 | `MessageRef` type with `code` / optional `params` / `severity` / `channel` |
| REQ-003 | `ResolvedMessage` type with `code` / `locale` / `text` / optional `meta` |
| REQ-004 | `CodeRegistryEntry` with `code`, `paramsSchema`, optional `defaultSeverity` |
| REQ-005 | Closed `MessageSeverity`, `MessageChannel`, `CodeParamKind` unions |
| REQ-006 | No mapper/screen wiring; out-of-scope list; empty consumer set |
| REQ-007 | Barrel and module forbid brand wording imports; Copy section empty |
| REQ-008 | `CodeRegistry` type + `emptyCodeRegistry` constant |
| NFR-001 | Isolated `src/content/` tree |
| NFR-002 | No API/OpenAPI/HTTP changes |
| NFR-003 | No resolve/catalogs/migration |
| NFR-004 | No UI / no brand primitives |
| NFR-005 | TypeScript types + Vitest structural tests |
