# Requirements

## Overview

Content Catalogs v1 populates the Content module (established by `content-message-contract`) with the closed set of analysis and classification narrative MessageRef codes emitted by completed backend Features `analysis-message-refs` and `classification-message-refs`, provides `en`/`ui` templates for those codes, and implements an in-process `resolve` API that turns `MessageRef[]` into `ResolvedMessage[]` with param interpolation and safe per-message fallback. This Feature does not wire feature mappers or screens, does not migrate legacy `analysisLabels.*` maps, and does not introduce a remote content-service.

## Goals

- Register v1 Content catalog entries for every analysis catalog narrative MessageRef code and every classification signal-reason MessageRef code from the closed BE inventories.
- Ship `en` locale templates for the `ui` channel for every registered code.
- Expose in-process `resolve({ locale, channel, messages })` from the Content module public surface.
- Interpolate typed params into templates so callers do not own display copy.
- Fall back safely for unknown codes or missing templates without failing the entire batch.
- Keep resolve in-process in FE; leave mapper/screen wiring and legacy label retirement to later Features.

## Functional Requirements

```text
REQ-001

WHEN Content catalogs are loaded for v1,
THE SYSTEM SHALL register a `CodeRegistryEntry` for every analysis narrative MessageRef code in the closed set:

- `catalog.wait`
- `catalog.strategy_allowed`
- `catalog.no_strategy_allowed`
- `catalog.hard_gate.extreme_regime`
- `catalog.hard_gate.risk_too_high`
- `catalog.hard_gate.negative_edge`
- `catalog.hard_gate.no_capacity`

derived from completed BE Feature `analysis-message-refs` (no invented codes).
```

```text
REQ-002

WHEN Content catalogs are loaded for v1,
THE SYSTEM SHALL register a `CodeRegistryEntry` for every classification signal-reason MessageRef code in the closed sets:

- regime: `trend_up`, `trend_down`, `range`, `chaotic`, `news_spike`
- risk: `low_risk`, `moderate_risk`, `elevated_risk`, `high_risk`
- economic: `strong_edge`, `moderate_edge`, `neutral_edge`, `negative_edge`
- exposure: `ample_capacity`, `limited_capacity`, `constrained_capacity`

derived from completed BE Features `classification-message-refs` / `classification-reason-codes` (no invented codes, no renamed wire values).
```

```text
REQ-003

THE SYSTEM SHALL define params-schema metadata on each registered `CodeRegistryEntry` that matches the typed params the backend may emit for that code (parameter names and kinds), including empty `paramsSchema` when the BE inventory emits only empty params.
```

```text
REQ-004

THE SYSTEM SHALL provide an `en` locale template for the `ui` channel for every code registered under REQ-001 and REQ-002, such that a successful resolve of a known code with valid params yields non-empty display `text` derived from that template (not caller-owned copy).
```

```text
REQ-005

THE Content module SHALL export an in-process function `resolve` with input shape `{ locale, channel, messages }` where `messages` is a sequence of `MessageRef`, and output shape `ResolvedMessage[]` (one result per input message, same order).
```

```text
REQ-006

WHEN `resolve` is invoked with `locale` equal to `en` and `channel` equal to `ui` for a `MessageRef` whose `code` is registered and whose template exists,
THE SYSTEM SHALL return a `ResolvedMessage` whose `code` echoes the input code, `locale` is the locale used for the template, and `text` is the interpolated template result.
```

```text
REQ-007

WHEN a template references named placeholders corresponding to MessageRef params,
THE SYSTEM SHALL interpolate param values into the display text inside Content (including basic number formatting as needed for v1 numeric params) so callers do not assemble display English from params.
```

```text
REQ-008

WHEN `resolve` encounters a `MessageRef` whose `code` is not registered, or whose `en`/`ui` template is missing,
THE SYSTEM SHALL still return a `ResolvedMessage` for that input (same array position) with safe fallback `text` (the raw `code` string at minimum) and SHALL NOT throw in a way that aborts resolution of the remaining messages in the batch.
```

```text
REQ-009

WHEN `resolve` is invoked with a locale other than `en` and no template exists for that locale,
THE SYSTEM SHALL fall back to the default locale `en` for that message when an `en`/`ui` template exists; if the default-locale template is also missing, THE SYSTEM SHALL apply the unknown/missing fallback of REQ-008 for that message only.
```

```text
REQ-010

THE SYSTEM SHALL keep `resolve` entirely in-process within the FE Content module for v1; THE SYSTEM SHALL NOT require a remote content-service, network call, or out-of-process catalog fetch to resolve registered codes.
```

```text
REQ-011

WHEN this Feature is complete,
THE SYSTEM SHALL NOT require existing feature mappers or screens to call `resolve` or to retire `analysisLabels.*` (or equivalent) catalogs; those migrations belong to later Features (`content-resolve-boundary`, `analysis-classification-copy`).
```

```text
REQ-012

THE Content module SHALL continue to avoid importing, re-exporting, or owning brand chrome / design-system wording from `@market-data/brand` (including `@market-data/brand/wording`); brand product identity and shared chrome remain outside Content.
```

```text
REQ-013

THE SYSTEM SHALL export the populated v1 code registry (or a stable accessor) and `resolve` from the Content module public entry `src/content/index.ts` so later Features can depend on them without redesigning the `content-message-contract` shapes.
```

## Non-Functional Requirements

```text
NFR-001

Maintainability: Catalogs, templates, and resolve SHALL remain under `src/content/` so a later extraction (package or content-service) does not require redesigning `MessageRef` / `ResolvedMessage` / registry / resolve contracts.
```

```text
NFR-002

Compatibility: This Feature SHALL NOT change backend API contracts, OpenAPI documents, or HTTP clients.
```

```text
NFR-003

Scope: Classification HTTP error machine codes (`classification.invalid_symbol_format`, `classification.undeclared_reason`, `classification.invalid_message_params`), analysis regime labels / regime reason codes that are not MessageRefs, strategy id lists, and legacy FE `analysisLabels.*` / reason-code display maps are OUT OF SCOPE unless already listed in REQ-001 or REQ-002.
```

```text
NFR-004

Compatibility: No interactive UI chrome or brand UI primitives are required; this Feature adds Content catalogs/templates/resolve only.
```

```text
NFR-005

Type safety: Catalogs, templates, and `resolve` SHALL compile under the project’s existing TypeScript / Vitest toolchain and reuse `MessageRef`, `ResolvedMessage`, `CodeRegistryEntry`, `MessageChannel`, and related types from `content-message-contract`.
```

```text
NFR-006

Reliability: `resolve` SHALL be deterministic for a given `{ locale, channel, messages }` input and SHALL NOT mutate the input `messages` array.
```

## Acceptance Criteria

- [ ] **AC-001 (REQ-001, REQ-002, REQ-003):** The v1 Content registry contains exactly the analysis narrative codes and classification signal-reason codes listed in REQ-001/REQ-002, each with params-schema metadata aligned to the BE inventories (including empty schemas where BE emits `{}`).
- [ ] **AC-002 (REQ-004):** Every registered code has a non-empty `en`/`ui` template; completeness tests assert registry codes ⊆ template keys and template keys ⊆ registry codes for the v1 closed set.
- [ ] **AC-003 (REQ-005, REQ-006, REQ-007, REQ-013):** `resolve({ locale: 'en', channel: 'ui', messages })` is exported from `src/content` and returns `ResolvedMessage[]` with interpolated `text` for valid registered refs (including at least one analysis code with params and one classification code with empty params).
- [ ] **AC-004 (REQ-008, REQ-009):** Unknown codes and missing templates fall back per message without throwing across the batch; non-`en` locale falls back to `en` when available.
- [ ] **AC-005 (REQ-010, REQ-011, NFR-002, NFR-003):** Resolve is in-process; mappers/screens are not required to migrate; out-of-scope codes/maps are not silently expanded into this Feature.
- [ ] **AC-006 (REQ-012, NFR-001, NFR-004, NFR-005, NFR-006):** Content stays brand-wording-free; contracts reuse `content-message-contract` types; layout remains under `src/content/`; no UI chrome required.
