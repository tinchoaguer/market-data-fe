# Requirements

## Overview

Content Message Contract establishes a bounded Content module in `market-data-fe` and the stable TypeScript contracts for message references, resolved messages, and code-registry entries. Later Content Features (`content-catalogs-v1`, `content-resolve-boundary`, `analysis-classification-copy`) can add catalogs and resolve without redesigning these shapes. This Feature does not resolve messages, does not register narrative catalogs, and does not change feature mappers or screens.

## Goals

- Create a clear Content module directory/package boundary suitable for later extraction from the app.
- Define `MessageRef` with at least `code`, optional `params`, optional `severity`, and optional `channel`.
- Define `ResolvedMessage` with at least `code`, `locale`, and `text` (optional `meta` allowed).
- Define a code-registry entry shape (semantic code id plus params-schema and severity metadata as designed).
- Export the contracts from the Content module public surface so subsequent Features can depend on them.
- Leave brand chrome wording via `@market-data/brand` outside this module.
- Do not wire mappers or screens to resolve messages in this Feature.

## Functional Requirements

```text
REQ-001

THE SYSTEM SHALL provide a bounded Content module under `src/content/` whose public entry is `src/content/index.ts`, such that Content types and registry contracts are importable from that entry without importing feature screens, API mappers, or `@market-data/brand` wording.
```

```text
REQ-002

THE SYSTEM SHALL export a TypeScript type `MessageRef` from the Content module public entry with:

- required `code: string` (semantic message code id)
- optional `params` (structured interpolation values, keyed by parameter name)
- optional `severity` (message severity classification)
- optional `channel` (delivery channel for resolution, e.g. UI narrative)
```

```text
REQ-003

THE SYSTEM SHALL export a TypeScript type `ResolvedMessage` from the Content module public entry with:

- required `code: string`
- required `locale: string`
- required `text: string`
- optional `meta` (opaque structured metadata bag allowed for later Features)
```

```text
REQ-004

THE SYSTEM SHALL export a code-registry entry type from the Content module public entry that describes a catalog registration unit with at least:

- semantic code id (same identity space as `MessageRef.code`)
- params schema metadata describing expected parameter names (and value kinds as designed)
- optional default severity metadata for the code
```

```text
REQ-005

THE SYSTEM SHALL define closed TypeScript unions (or equivalent literal unions) for `severity` and `channel` values used by `MessageRef` and the registry, so callers and later catalogs share one vocabulary without inventing ad-hoc strings per feature.
```

```text
REQ-006

WHEN this Feature is complete,
THE SYSTEM SHALL NOT require existing feature mappers or screens to import, construct, or resolve Content messages; existing analysis/classification label helpers and screen behavior MAY remain unchanged.
```

```text
REQ-007

THE Content module SHALL NOT import, re-export, or own brand chrome / design-system wording from `@market-data/brand` (including `@market-data/brand/wording`); brand product identity and shared chrome copy remain outside Content.
```

```text
REQ-008

THE SYSTEM SHALL expose a typed empty (or placeholder) registry container shape from the Content module suitable for later Features to register catalog entries without changing the registry entry contract defined in REQ-004.
```

## Non-Functional Requirements

```text
NFR-001

Maintainability: The Content module layout SHALL keep Content contracts and skeleton isolated under `src/content/` so a later extraction (package or workspace move) does not require rewriting MessageRef / ResolvedMessage / registry shapes.
```

```text
NFR-002

Compatibility: This Feature SHALL NOT change backend API contracts, OpenAPI documents, or HTTP clients.
```

```text
NFR-003

Scope: In-process message resolve APIs, locale template catalogs, param interpolation, and migration of `analysisLabels.*` (or equivalent) are OUT OF SCOPE; those belong to later Features (`content-catalogs-v1`, `content-resolve-boundary`).
```

```text
NFR-004

Compatibility: No new user-facing UI copy is introduced by this Feature; no interactive UI chrome or brand primitives are required.
```

```text
NFR-005

Type safety: Content contracts SHALL be expressible as TypeScript types (and, where designed, runtime type-guard or schema helpers) that compile under the project’s existing TypeScript / Vitest toolchain.
```

## Acceptance Criteria

- [ ] A bounded Content module exists at `src/content/` with a public barrel `src/content/index.ts` suitable as a later extraction boundary.
- [ ] `MessageRef` is exported and typed with required `code` and optional `params`, `severity`, and `channel`.
- [ ] `ResolvedMessage` is exported and typed with required `code`, `locale`, and `text` (optional `meta` allowed).
- [ ] A code-registry entry shape is exported with semantic code id plus params-schema and severity metadata as specified in design.md.
- [ ] Closed unions for severity and channel are defined and shared by `MessageRef` / registry types.
- [ ] Feature mappers and screens are not required to resolve messages; this Feature only establishes the contract and module skeleton.
- [ ] The Content module does not own or re-export `@market-data/brand` chrome wording.
- [ ] A typed registry container skeleton exists for later catalog registration without redesigning the entry contract.
