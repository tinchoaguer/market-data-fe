# Design

## Overview

Populate the Content module with v1 narrative catalogs and `en`/`ui` templates for the closed MessageRef inventories from completed BE Features `analysis-message-refs` and `classification-message-refs`, and implement in-process `resolve({ locale, channel, messages }) → ResolvedMessage[]` with param interpolation and per-message safe fallback. Contracts from `content-message-contract` are reused unchanged. Mappers, screens, legacy `analysisLabels.*`, classification HTTP error codes, and remote content-service are out of scope.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| `src/content/` | Bounded Content module (REQ-010, NFR-001). |
| `src/content/types.ts` (existing) | Unchanged `MessageRef` / `ResolvedMessage` / severity / channel types from `content-message-contract`. |
| `src/content/registry.ts` (existing) | `CodeRegistryEntry` / `CodeRegistry` types; v1 replaces empty skeleton usage with a populated registry export. |
| `src/content/catalogs/` (new) | Declares the closed v1 `CodeRegistry` entries (codes + paramsSchema + optional defaultSeverity) for analysis + classification narrative codes (REQ-001–REQ-003). |
| `src/content/templates/en/ui/` (new) | `en`/`ui` template map keyed by message code (REQ-004). |
| `src/content/resolve.ts` (new) | In-process `resolve` + interpolation / fallback (REQ-005–REQ-010, NFR-006). |
| `src/content/index.ts` | Public barrel: re-export registry, `resolve`, and prior contract types (REQ-013). |
| Feature mappers / screens / `src/i18n/` label helpers | Unchanged (REQ-011, NFR-003). |
| `@market-data/brand` | Unchanged; Content must not import brand wording (REQ-012). |

```text
src/content/
├── index.ts                 # public barrel (+ resolve, v1 registry)
├── types.ts                 # existing contracts
├── registry.ts              # existing entry/registry types
├── catalogs/
│   ├── analysis.ts          # analysis narrative CodeRegistry entries
│   ├── classification.ts    # classification signal-reason entries
│   └── index.ts             # merged v1CodeRegistry
├── templates/
│   └── en/
│       └── ui.ts            # Record<code, template string> (or .json)
├── resolve.ts               # resolve() + interpolate helpers
└── *.test.ts                # colocated oracles
```

File names may vary slightly if the Implementer consolidates modules, but public exports and the closed code/param inventories below are mandatory.

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Catalogs/templates under `src/content/` | Matches product Content architecture; extractable later | NFR-001, REQ-010 |
| Closed inventories copied from Done BE Features | Do not invent codes; FE catalogs mirror wire SoT | REQ-001, REQ-002 |
| In-process `resolve` only | v1 acceptance; no content-service | REQ-010 |
| No mapper/screen wiring | Backlog split: catalogs → boundary → copy wiring | REQ-011, NFR-003 |
| Exclude classification HTTP error codes | Not signal MessageRefs; later Feature if needed | NFR-003 |
| Exclude legacy `analysisLabels.*` | Belong to `content-resolve-boundary` | REQ-011, NFR-003 |

### Brand UI primitives

This Feature does **not** introduce or change interactive UI. No brand UI primitives are required.

**Exception (documented):** Catalogs/templates/resolve are TypeScript module concerns only; native HTML / Tailwind rules do not apply because no UI is added (NFR-004).

### Out of scope (explicit)

- Remote content-service / HTTP resolve
- Wiring analysis/classification mappers or screens to `resolve`
- Migrating or deleting `analysisLabels.*` / feature-local DTO→label maps
- Registering analysis regime labels (`TREND_UP`, …) or regime reason codes (`adx_strong`, …) as Content codes (not MessageRefs on the BE narrative fields in scope)
- Classification HTTP error machine codes (`classification.invalid_symbol_format`, `classification.undeclared_reason`, `classification.invalid_message_params`)
- Additional locales beyond `en`, additional channels beyond `ui`
- ICU plurals, rich text, nested messages, A/B variants
- Brand chrome wording ownership

## Data Flow

```text
Caller (later Features; tests in this Feature)
        │
        │  MessageRef[]  +  locale + channel
        ▼
resolve({ locale, channel, messages })
        │
        ├─► for each MessageRef (preserve order):
        │     1. look up code in v1CodeRegistry
        │     2. look up template for locale × channel (fallback locale → en)
        │     3. interpolate params into template (or fallback text)
        │     4. emit ResolvedMessage { code, locale, text, meta? }
        ▼
ResolvedMessage[]  (same length as messages; never aborts batch)
```

No HTTP, no feature screen involvement in this Feature.

## Interfaces

### Public Content module exports (additions)

All of the following MUST be importable from `src/content/index.ts` in addition to existing `content-message-contract` exports:

| Export | Kind | Purpose |
|--------|------|---------|
| `v1CodeRegistry` | const `CodeRegistry` | Frozen merged registry of REQ-001 + REQ-002 codes |
| `resolve` | function | In-process batch resolve |

Optional helpers MAY be exported if useful (`interpolateTemplate`, `DEFAULT_LOCALE`) but are not required by acceptance.

### `resolve` contract

```text
resolve(input: {
  locale: string
  channel: MessageChannel   // v1: 'ui'
  messages: readonly MessageRef[]
}): ResolvedMessage[]
```

**Rules:**

1. Output length equals `messages.length`; order is preserved.
2. Default locale constant: `'en'`.
3. When `channel` is not `'ui'`, treat as unknown channel for template lookup → per-message fallback (REQ-008), do not throw.
4. When `locale !== 'en'` and no template for that locale exists, use `'en'` if available (REQ-009).
5. Do not mutate `messages` or nested params objects (NFR-006).
6. No network I/O.

### External systems

None.

### Consumers (this Feature)

Unit/completeness tests under `src/content/` are the required consumers. Production mappers/screens must not be changed (REQ-011).

## Data Model

### Closed v1 inventory — analysis narrative (from `analysis-message-refs`)

| Code | Params schema (name / kind / required) | Default severity |
|------|----------------------------------------|------------------|
| `catalog.wait` | `gate` string required; plus any hard-gate params that were forwarded (`regime` string optional; `risk_score` number optional; `edge` number optional) | `warning` |
| `catalog.strategy_allowed` | `strategy` string required; `regime` string required; `risk_score` number required; `edge` number required | `info` |
| `catalog.no_strategy_allowed` | `regime` string required; `risk_score` number required; `edge` number required | `warning` |
| `catalog.hard_gate.extreme_regime` | `regime` string required | `error` |
| `catalog.hard_gate.risk_too_high` | `risk_score` number required | `error` |
| `catalog.hard_gate.negative_edge` | `edge` number required | `error` |
| `catalog.hard_gate.no_capacity` | _(none)_ | `error` |

**Param wire conventions (informational for templates/tests; not new codes):**

- `strategy` values are machine tokens such as `TREND_FOLLOWING`, `RANGE_BOUNDING`, `PING_PONG`, `OTHER` (BE `StrategyType`).
- `regime` values on analysis narrative params are SCREAMING_SNAKE tokens such as `TREND_UP`, `CHAOTIC`, `NEWS_SPIKE` (BE `MarketRegime`).
- `gate` tokens on `catalog.wait`: `extreme_regime`, `risk_too_high`, `negative_edge`, `no_capacity`.

**Registry note for `catalog.wait`:** Declare paramsSchema as:

- `{ name: 'gate', kind: 'string', required: true }`
- `{ name: 'regime', kind: 'string', required: false }`
- `{ name: 'risk_score', kind: 'number', required: false }`
- `{ name: 'edge', kind: 'number', required: false }`

so forwarded hard-gate params remain schema-valid without inventing new codes.

### Closed v1 inventory — classification signal reasons (from `classification-message-refs`)

All classification signal MessageRefs use `params: {}` on the wire today. Each entry has `paramsSchema: []`.

| Group | Codes | Default severity |
|-------|-------|------------------|
| regime | `trend_up`, `trend_down`, `range`, `chaotic`, `news_spike` | `info` |
| risk | `low_risk`, `moderate_risk`, `elevated_risk`, `high_risk` | `info` |
| economic | `strong_edge`, `moderate_edge`, `neutral_edge`, `negative_edge` | `info` |
| exposure | `ample_capacity`, `limited_capacity`, `constrained_capacity` | `info` |

**Total v1 registry size:** 7 analysis + 16 classification = **23 codes**. Completeness tests MUST assert exactly this closed set (no extras in the v1 registry constant used for AC-001).

### Template model

Templates are a `Readonly<Record<string, string>>` (or equivalent) keyed by message `code`.

**Placeholder syntax (mandatory for v1):** `{paramName}` — replaced by the string form of `params[paramName]`.

**Number formatting (v1):**

- Integer numbers: decimal digits without scientific notation.
- Floating numbers: render with up to 4 significant fractional digits trimmed of trailing zeros (e.g. `0.9`, `0.75`, `-0.01`), deterministic across runs.
- Missing param for a placeholder: substitute empty string `''` (do not throw).
- Unknown placeholders left in the template string MAY remain as `{name}` or be stripped; choose one behavior and apply consistently — **preferred:** leave unresolved `{name}` unchanged so tests can detect missing params without throwing.

### `ResolvedMessage.meta` (optional)

When fallback applies, populate:

```text
meta: { fallback: 'unknown_code' | 'missing_template' | 'locale_fallback' }
```

- `unknown_code` — code not in registry
- `missing_template` — registered (or not) but no template after locale fallback
- `locale_fallback` — requested locale missing; used `en` successfully

`meta` is optional on success paths with no fallback.

### State transitions

None beyond pure function evaluation of `resolve`.

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Known code + `en`/`ui` template + params | Interpolated `text`; no throw |
| Unknown code | `text = code`; `meta.fallback = 'unknown_code'`; continue batch |
| Known code, missing template after locale fallback | `text = code`; `meta.fallback = 'missing_template'`; continue batch |
| Non-`en` locale, `en` template exists | Resolve with `locale: 'en'` in output; `meta.fallback = 'locale_fallback'` allowed |
| Unsupported channel | Per-message fallback (treat as missing template); continue batch |
| Missing/extra params | Interpolate what is present; do not throw |
| Empty `messages` | Return `[]` |

`resolve` MUST NOT throw for catalog/template/param gaps. Programming errors (e.g. passing a non-array) MAY throw TypeScript/runtime type errors; tests focus on catalog behavior.

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a labels/catalog + resolver Feature: completeness, resolve happy path, and fallback oracles. No mapper, fetch, screen, or copy.source suites.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| v1 registry closed-set completeness vs REQ-001/REQ-002 | Content catalogs | Exact set equality: registry keys === designed 23 codes; each entry `code` equals key; paramsSchema matches design table | `src/content/catalogs/*.test.ts` (or `src/content/*.test.ts`) |
| Template completeness vs registry | Content templates | Every registry code has non-empty `en`/`ui` template string; every template key is in the registry | same / `templates` test module |
| `resolve` happy path — analysis with params | Content resolve | Exact interpolated `text` for a fixture `catalog.strategy_allowed` (and optionally one hard-gate) via catalog-linked expected string | `src/content/resolve.test.ts` |
| `resolve` happy path — classification empty params | Content resolve | Exact `text` for e.g. `trend_up` / `low_risk` | `src/content/resolve.test.ts` |
| Unknown code fallback (batch continues) | Content resolve | Batch of known + unknown → length preserved; unknown `text === code`; known still resolved | `src/content/resolve.test.ts` |
| Locale fallback to `en` | Content resolve | `locale: 'es'` (no templates) → uses `en` text; optional `meta.fallback` | `src/content/resolve.test.ts` |
| Barrel exports `resolve` + `v1CodeRegistry` | Content module | Import from `src/content` succeeds | existing or extended `src/content/*.test.ts` |
| No brand wording ownership | Reviewer (+ optional guard) | `src/content/` does not import `@market-data/brand` | Reviewer / optional assert |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 registry + paramsSchema | Yes — closed-set completeness |
| AC-002 en/ui templates | Yes — completeness bi-inclusion |
| AC-003 resolve + interpolation | Yes — exact text oracles |
| AC-004 fallback / locale | Yes — batch + fallback cases |
| AC-005 no mapper wiring / in-process / scope | Reviewer — no production mapper/screen changes; no remote client |
| AC-006 brand-free / types reuse | Reviewer + compile/tests |

Do **not** add: screen tests, mapper tests, E2E, MSW, coverage thresholds, or a new `copy.source.test.ts`.

## Copy / Wording

This Feature adds **Content narrative** templates (not brand chrome). Follow `knowledge/writing/writing-guidelines.md` and `terminology.md`: precise, calm, formal, data-first; sentence case; no exclamation marks; no emoji.

### Design-system keys reused

None. Do not put these narrative strings in `@market-data/brand` or re-export brand wording.

### Feature templates to add (`en` / `ui`)

Exact English strings below are the designed SoT for v1 (Implementer may only adjust for typography consistency if a writing-guideline conflict is found, and must keep placeholders identical).

#### Analysis

| Code | Template |
|------|----------|
| `catalog.wait` | `Catalog waiting — gated by {gate}.` |
| `catalog.strategy_allowed` | `Strategy {strategy} is allowed for regime {regime}.` |
| `catalog.no_strategy_allowed` | `No strategy is allowed for regime {regime}.` |
| `catalog.hard_gate.extreme_regime` | `Hard gate: extreme regime {regime}.` |
| `catalog.hard_gate.risk_too_high` | `Hard gate: risk score {risk_score} is too high.` |
| `catalog.hard_gate.negative_edge` | `Hard gate: economic edge {edge} is negative.` |
| `catalog.hard_gate.no_capacity` | `Hard gate: insufficient allocation capacity.` |

#### Classification — regime

| Code | Template |
|------|----------|
| `trend_up` | `Trend up` |
| `trend_down` | `Trend down` |
| `range` | `Range` |
| `chaotic` | `Chaotic` |
| `news_spike` | `News spike` |

#### Classification — risk

| Code | Template |
|------|----------|
| `low_risk` | `Low risk` |
| `moderate_risk` | `Moderate risk` |
| `elevated_risk` | `Elevated risk` |
| `high_risk` | `High risk` |

#### Classification — economic

| Code | Template |
|------|----------|
| `strong_edge` | `Strong edge` |
| `moderate_edge` | `Moderate edge` |
| `neutral_edge` | `Neutral edge` |
| `negative_edge` | `Negative edge` |

#### Classification — exposure

| Code | Template |
|------|----------|
| `ample_capacity` | `Ample capacity` |
| `limited_capacity` | `Limited capacity` |
| `constrained_capacity` | `Constrained capacity` |

Terminology: use **Regime**, **Risk**, **Economic**, **Exposure**, **Recommendation**/catalog language consistently with `knowledge/writing/terminology.md`. Strategy and regime **param tokens** remain machine tokens in display text for v1 (humanizing strategy/regime tokens inside templates is optional later; do not invent secondary label maps in this Feature).

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Analysis catalog entries in `catalogs/analysis.ts`; 7 codes from BE inventory |
| REQ-002 | Classification catalog entries in `catalogs/classification.ts`; 16 codes |
| REQ-003 | paramsSchema tables above (including empty arrays for classification) |
| REQ-004 | `templates/en/ui` map with designed English strings |
| REQ-005 | `resolve({ locale, channel, messages })` signature |
| REQ-006 | Happy-path resolve rules + `ResolvedMessage` fields |
| REQ-007 | `{param}` interpolation + number formatting |
| REQ-008 | Per-message fallback; no batch abort |
| REQ-009 | Default locale `en` fallback |
| REQ-010 | In-process only; no remote service |
| REQ-011 | Out-of-scope mapper/screen/`analysisLabels.*` |
| REQ-012 | No brand wording imports |
| REQ-013 | Barrel exports `v1CodeRegistry` + `resolve` |
| NFR-001 | Layout under `src/content/` |
| NFR-002 | No BE/OpenAPI/HTTP client changes |
| NFR-003 | Explicit out-of-scope inventory |
| NFR-004 | No UI / brand primitives |
| NFR-005 | Reuse contract types; Vitest tests |
| NFR-006 | Pure deterministic resolve; no input mutation |
