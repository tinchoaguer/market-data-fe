# Design

## Overview

Route analysis and classification narrative message resolution through the Content module `resolve` API at the app mapping/boundary layer, and retire overlapping feature-local label catalogs (`classificationLabels.*` and narrative `analysisLabels.*` entries that duplicate Content v1 codes) as SoT. A thin boundary adapter fixes `channel: 'ui'` and default locale `'en'`. Mappers write resolved `text` onto existing view-model narrative fields. Screens and state machines stay intact. Full copy wiring redesign is deferred to `analysis-classification-copy`. No new Content codes are invented.

Depends on completed Features `content-message-contract` and `content-catalogs-v1`. Replaces, does not dual-maintain, the narrative SoT introduced by `human-readable-labels` / `extend-human-readable-labels` for codes in the Content v1 closed set.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| `src/content` (`resolve`, `v1CodeRegistry`, types) | Existing SoT for v1 narrative codes + templates; unchanged catalogs (REQ-002, REQ-010, NFR-006). |
| Boundary adapter (new, under `src/content/` or thin `src/i18n`/`src/api` helper that only delegates) | Calls `resolve({ locale: 'en', channel: 'ui', messages })`; single entry for mappers (REQ-001, REQ-006, NFR-001). |
| Analysis mapper (`mapMarketAnalysis` or equivalent under `src/api/`) | For Content v1 analysis narrative MessageRefs on the DTO, call boundary adapter; write `text` to existing VM narrative fields (REQ-001, REQ-008). |
| Classification mapper (`mapMarketClassificationPayload` or equivalent) | For signal reasons that are MessageRefs or raw v1 classification codes, call boundary adapter; write `text` to VM reason fields (REQ-001, REQ-007). |
| Legacy `resolveLabel` / `analysisLabels.*` / `classificationLabels.*` | Retire from SoT for every overlapping Content v1 code (REQ-002, REQ-009). Non-v1 token catalogs may remain temporarily for deferred tokens (REQ-010). |
| Analysis / Classification screens | Unchanged state machines; bind existing VM string fields only (REQ-004, REQ-005, REQ-012). |
| `@market-data/brand` | Unchanged chrome wording owner; Content/boundary must not import brand wording (REQ-011). |

```text
DTO (MessageRef and/or raw v1 narrative codes)
        │
        ▼
Analysis / Classification mapper
        │
        ├─► boundary adapter → Content.resolve({ locale: 'en', channel: 'ui', messages })
        │         │
        │         ▼
        │   ResolvedMessage[].text
        │
        ▼
View model (existing narrative string fields)
        │
        ▼
Screens (no code→English maps)
```

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Resolve at mapper/boundary, not in screens | Preserves VM boundary; matches epic “resolve once at boundary” | REQ-001, REQ-004 |
| Thin adapter over Content `resolve` | One locale/channel policy; extractable later | REQ-006, NFR-001 |
| Retire overlapping locale SoT | Epic: replace, do not patch dual SoT | REQ-002, REQ-009, NFR-006 |
| Do not invent Content codes | Scope: only `content-catalogs-v1` inventory | REQ-010, NFR-003 |
| Defer full copy wiring | Backlog split → `analysis-classification-copy` | REQ-012, NFR-003 |
| Keep non-v1 token maps transitional | Cannot move `TREND_UP` / strategy / factors into Content without new codes | REQ-010 |

### Brand UI primitives

This Feature does **not** change interactive UI chrome. Analysis and Classification screens continue to use brand primitives already specified by `view-market-analysis` and `view-market-classification`.

**Exception (documented):** Boundary resolve is a mapping concern; no new brand primitive is required (NFR-005).

### Out of scope (explicit)

- Feature `analysis-classification-copy`: redesigning which VM fields expose summaries/rationale/levels, or changing screen presentation beyond existing field binding
- Registering new Content codes (regime SCREAMING_SNAKE labels, AnalysisRegimeReasonCode, StrategyType, exposure factors, risk/economic component names, classification HTTP error machine codes)
- Migrating non-v1 token humanization into Content
- Remote content-service / non-`en` locales / non-`ui` channels
- Brand chrome ownership
- Changing idle/loading/error/retry semantics
- Backend / OpenAPI edits in this PROJECT_ROOT

### Relationship to prior label Features

| Prior catalog (human-readable-labels / extend-human-readable-labels) | This Feature |
|----------------------------------------------------------------------|--------------|
| `classificationLabels.regimeReason\|riskReason\|economicReason\|exposureReason.*` (16 codes) | **Retire as SoT**; resolve via Content v1 (same code ids) |
| Analysis catalog / hard-gate **narrative** previously shown as free-text or local maps for Content v1 analysis codes | **Resolve via Content**; do not keep parallel English tables for those codes |
| `analysisLabels.regime.*` (`TREND_UP`, …) | **Not migrated** (not Content v1 MessageRef codes); may remain on `resolveLabel` until a later catalog Feature |
| `analysisLabels.regimeReason.*` | **Not migrated** (not Content v1) |
| `analysisLabels.strategy.*`, `exposureFactor.*`, `riskComponent.*`, `economicComponent.*` | **Not migrated** (not Content v1) |

## Data Flow

1. Existing analysis/classification clients fetch payloads (HTTP unchanged) (REQ-005, NFR-002).
2. Structural validation remains fail-closed (NFR-004).
3. **Classification:** For each signal reason that is a `MessageRef`, or a string code ∈ Content v1 classification set, build/normalize to `MessageRef` (`{ code, params? }`), batch or per-field resolve via boundary adapter, assign `ResolvedMessage.text` to the VM `reason` (REQ-007).
4. **Analysis:** For each in-scope narrative `MessageRef` field carrying a Content v1 analysis catalog code, resolve via boundary adapter; assign `text` to the existing VM narrative field(s) used today for catalog rationale / recommendation narrative / hard-gate narrative as already consumed by the Analysis screen (REQ-008). Exact DTO property names follow completed BE MessageRef Features / current FE DTO types — do not invent codes or new narrative semantics.
5. Content fallback (`text === code` or designed fallback) applies per message; mapping continues (REQ-003).
6. Screens render success VM strings; no component-level maps (REQ-004).
7. Overlapping `classificationLabels.*` (and any duplicate narrative locale keys for v1 analysis codes) are removed from resolution paths and deleted from locale SoT (or left unused only if a transitional compile constraint forces delayed deletion — prefer delete) (REQ-009).

```text
[fetch analysis | classification]
        │
        v
[validate DTO] --fail--> [error state] (unchanged)
        │ ok
        v
[normalize narrative refs] → MessageRef[]
        │
        v
[boundary adapter → Content.resolve]
        │
        v
[map remaining fields; non-v1 tokens may still use resolveLabel]
        │
        v
[view model] → [screen success]
```

## Interfaces

### Boundary adapter (mandatory behavior)

Suggested export name (Implementer may choose equivalent):

```text
resolveUiMessages(messages: readonly MessageRef[]): ResolvedMessage[]
```

**Rules:**

1. Delegates to Content `resolve({ locale: DEFAULT_LOCALE, channel: 'ui', messages })` where `DEFAULT_LOCALE = 'en'`.
2. Does not mutate `messages`.
3. Does not import `@market-data/brand`.
4. Prefer exporting from a stable app path used by both mappers (either re-export near Content public surface or a dedicated thin module under `src/` that only wraps Content).

### Content module (existing)

| Export | Use |
|--------|-----|
| `resolve` | Called by boundary adapter |
| `MessageRef` / `ResolvedMessage` | Typing |
| `v1CodeRegistry` | Optional guard/tests for closed-set membership; not required at runtime for every call |

### Mapper inputs (conceptual)

| Surface | Narrative input | Output on VM |
|---------|-----------------|--------------|
| Classification signals | `reason: MessageRef` **or** reason string ∈ v1 classification codes | Humanized/resolved `reason` string field already bound by Classification screen |
| Analysis catalog narrative | MessageRef fields for Content v1 analysis codes | Existing recommendation/catalog narrative string field(s) already bound by Analysis screen |

Normalization: if the wire still provides a bare classification reason **code string** that equals a v1 registry key, the mapper MAY construct `{ code: reasonString }` (empty params) before calling the adapter. This does not invent codes.

### External systems

None new. No brand wording package usage for narrative resolution.

## Data Model

### Content v1 codes in scope for boundary resolve (from `content-catalogs-v1`)

**Analysis narrative (7):**

`catalog.wait`, `catalog.strategy_allowed`, `catalog.no_strategy_allowed`, `catalog.hard_gate.extreme_regime`, `catalog.hard_gate.risk_too_high`, `catalog.hard_gate.negative_edge`, `catalog.hard_gate.no_capacity`

**Classification signal reasons (16):**

- regime: `trend_up`, `trend_down`, `range`, `chaotic`, `news_spike`
- risk: `low_risk`, `moderate_risk`, `elevated_risk`, `high_risk`
- economic: `strong_edge`, `moderate_edge`, `neutral_edge`, `negative_edge`
- exposure: `ample_capacity`, `limited_capacity`, `constrained_capacity`

### Locale retirement (overlapping SoT)

Remove from resolution (and delete keys when safe) at least:

| Prefix | Reason |
|--------|--------|
| `classificationLabels.regimeReason.*` | Replaced by Content templates for same codes |
| `classificationLabels.riskReason.*` | Same |
| `classificationLabels.economicReason.*` | Same |
| `classificationLabels.exposureReason.*` | Same |

Any helper whose only job was those prefixes MUST stop being used for classification reasons (delete or repoint to boundary adapter).

### Transitional non-v1 catalogs (explicitly not Content SoT)

May continue via existing `resolveLabel` until a later Feature expands Content:

- `analysisLabels.regime.*`
- `analysisLabels.regimeReason.*`
- `analysisLabels.strategy.*`
- `analysisLabels.exposureFactor.*`
- `analysisLabels.riskComponent.*`
- `analysisLabels.economicComponent.*`

These MUST NOT be consulted for Content v1 MessageRef narrative codes.

### View-model contract

Preserve existing Analysis and Classification view-model shapes consumed by screens. This Feature changes **how** narrative strings are produced (Content resolve), not the set of required screen sections (REQ-012).

### Screen state

No new states. Existing idle | loading | success | error transitions remain authoritative (REQ-005).

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Valid payload + known v1 MessageRef | Resolved template `text` on VM; success |
| Valid payload + unknown narrative code | Content per-message fallback; mapping continues; success (REQ-003) |
| Mixed known + unknown in one payload | Known resolved; unknown fallback; no batch abort |
| Structurally invalid payload | Fail closed → error (unchanged) (NFR-004) |
| Non-v1 token missing from transitional locale map | Existing raw-code fallback via `resolveLabel` (unchanged for those tokens) |
| Content module throw for programming misuse | Treat as mapping defect; do not swallow structural errors as success |

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This Feature changes mapper humanization boundaries and retires label SoT for overlapping codes. Prefer extending existing mapper and label/Content tests; do not scaffold full screen suites for every AC. No new `copy.source.test.ts`. No E2E/MSW/coverage %.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Boundary adapter calls Content resolve with `en` + `ui` | Boundary / Content unit | Exact `ResolvedMessage.text` for a known v1 fixture equals Content template interpolation (catalog-linked, not a free English literal) | `src/**` colocated adapter or content test; or mapper test that asserts via Content |
| Classification mapper uses Content for v1 reasons | API mapper | Fixture with `trend_up` / MessageRef → VM reason equals Content-resolved text; unknown reason → raw/fallback without failing map | `src/api/**/map*Classification*.test.ts` (extend) |
| Analysis mapper uses Content for v1 catalog narrative refs | API mapper | Fixture MessageRef for e.g. `catalog.strategy_allowed` → VM narrative field equals Content-resolved text; unknown code fallback without failing map | `src/api/**/map*Analysis*.test.ts` (extend) |
| Overlapping locale SoT retired | Labels / locale | Classification reason resolution path does not read `classificationLabels.*` for v1 codes; completeness tests for those prefixes removed or replaced; optional assert helpers unused | extend/remove prior `labels` / locale completeness tests |
| Structural fail-closed unchanged | API mapper | Invalid payload still throws / maps to mapping error | existing mapper fail-closed cases |
| Screen state machine intact | Screen (minimal) | Only if mapper injection path changes require it: idle/loading/error/retry still hold; at most one success assert that a Content-resolved reason/narrative string appears — do not re-list all labels | existing `*Screen.test.tsx` only if needed |
| No component-owned maps | Reviewer | Screens/components do not import Content catalogs or build code→English tables | Reviewer |
| Brand-free Content path | Reviewer | Boundary + Content do not import `@market-data/brand/wording` for narrative | Reviewer |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 boundary → Content resolve | Yes — adapter and/or mapper tests |
| AC-002 retire overlapping SoT | Yes — mapper no longer depends on classificationLabels for v1; locale key removal / helper tests updated |
| AC-003 unknown fallback + fail-closed | Yes — mapper unknown + structural cases |
| AC-004 screens / flows | Reviewer + extend screen test only if boundary changes break existing screen tests |
| AC-005 classification + analysis narrative resolve | Yes — mapper fixtures |
| AC-006 scope / brand / no new codes | Reviewer |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, or a new `copy.source.test.ts`.

## Copy / Wording

This Feature adds **no** new English narrative strings. Display text for Content v1 codes remains owned by `content-catalogs-v1` templates under `src/content/templates/`.

### Design-system keys reused

| Key | Source |
|-----|--------|
| `labels.regime` / `labels.risk` / `labels.economic` / `labels.exposure` / `labels.recommendation` | `@market-data/brand/wording` (section chrome; unchanged) |
| `common.loading` / `common.error` / `common.retry` | `@market-data/brand/wording` (unchanged flows) |

### Feature keys to add or change

| Action | Keys |
|--------|------|
| **Delete / stop using as SoT** | `classificationLabels.regimeReason.*`, `classificationLabels.riskReason.*`, `classificationLabels.economicReason.*`, `classificationLabels.exposureReason.*` |
| **Do not add** | Duplicate Content narrative strings in `src/locales/en.json` |
| **Leave transitional (non-v1)** | `analysisLabels.regime.*`, `analysisLabels.regimeReason.*`, `analysisLabels.strategy.*`, `analysisLabels.exposureFactor.*`, `analysisLabels.riskComponent.*`, `analysisLabels.economicComponent.*` |

Terminology: prefer **Regime**, **Risk**, **Economic**, **Exposure**, **Recommendation**, **Analysis**, **Classification** per `knowledge/writing/terminology.md`. Narrative voice remains that of Content templates (precise, calm, formal, data-first).

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Mappers call boundary adapter → Content `resolve`; write `text` to VM |
| REQ-002 | Content is SoT for v1 codes; legacy maps not consulted for those codes |
| REQ-003 | Per-message Content fallback; mapping continues |
| REQ-004 | Screens bind VM only; no component maps |
| REQ-005 | State machines unchanged aside from narrative source |
| REQ-006 | `resolveUiMessages` (or equivalent) adapter |
| REQ-007 | Classification reason → Content resolve → VM reason |
| REQ-008 | Analysis v1 MessageRefs → Content resolve → existing narrative VM fields |
| REQ-009 | Retire overlapping `classificationLabels.*` SoT |
| REQ-010 | Closed v1 inventory only; transitional non-v1 catalogs documented |
| REQ-011 | No brand wording imports on Content/boundary narrative path |
| REQ-012 | Out-of-scope list → `analysis-classification-copy` |
| NFR-001 | Single adapter for locale/channel |
| NFR-002 | No BE/OpenAPI edits in this Feature |
| NFR-003 | Explicit out-of-scope inventory |
| NFR-004 | Structural fail-closed preserved |
| NFR-005 | No new UI chrome / brand primitives |
| NFR-006 | No duplicate English tables for v1 codes |
