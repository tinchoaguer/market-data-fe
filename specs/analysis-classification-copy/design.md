# Design

## Overview

Complete analysis and classification copy wiring on top of `content-resolve-boundary`. Keep Content resolution at the mapping/boundary layer via the existing `resolveUiMessages` (or equivalent) adapter. Finish deferred analysis VM exposure for `catalog.hard_gate_reason` as a dedicated resolved string field, keep `catalog.catalog_reason` → recommendation rationale and classification signal reasons as Content-resolved strings, and ensure Analysis / Classification screens bind those VM strings only. Do not invent Content codes, do not reintroduce `analysisLabels.*` as SoT for Content v1 narrative, and leave transitional non-v1 assessment token humanization unchanged.

Depends on completed Features `content-message-contract`, `content-catalogs-v1`, and `content-resolve-boundary`. Wire shapes for analysis `catalog_reason` / `hard_gate_reason` and classification signal `reason` MessageRefs follow completed BE Features `analysis-message-refs` and `classification-message-refs`.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Boundary adapter (`resolveUiMessages` or equivalent) | Unchanged from `content-resolve-boundary`: Content `resolve` with `en` + `ui` (REQ-001, REQ-002, NFR-001). |
| Analysis mapper (`mapMarketAnalysis` or equivalent under `src/api/`) | Resolve `catalog.catalog_reason` → VM `recommendation.rationale`; resolve `catalog.hard_gate_reason` when non-null → VM `recommendation.hardGateReason` (or sibling field); null → null (REQ-001–REQ-003, REQ-009). |
| Classification mapper | Already resolves v1 signal reasons onto VM `reason` strings; confirm/keep that contract; no screen-side maps (REQ-004, REQ-008). |
| Analysis screen | Bind `recommendation.rationale`; when `hardGateReason` non-null, render hard-gate narrative with chrome label; no Content/catalog imports (REQ-005–REQ-007, REQ-015). |
| Classification screen | Bind signal `reason` strings only (REQ-004, REQ-015). |
| Transitional `analysisLabels.*` (non-v1) | Remains for regime/strategy/factor/component tokens not in Content v1 (REQ-012, REQ-011). |
| `@market-data/brand` | Section chrome / loading / error wording only; not Content narrative (REQ-013). |

```text
DTO MessageRefs (catalog_reason, hard_gate_reason?, classification reason)
        │
        ▼
Mappers + boundary adapter → Content.resolve (en/ui)
        │
        ▼
View models (resolved strings only for in-scope narrative)
        │
        ▼
Screens bind VM strings (no MessageRef→English maps)
```

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Resolve at mapper/boundary, not screens | Epic + prior Features: resolve once at boundary | REQ-015, NFR-001 |
| Dedicated VM field for hard gate | Deferred from boundary; rationale and hard-gate are distinct wire fields | REQ-002, REQ-003, REQ-006, REQ-007 |
| Screens bind strings only | Prevent component-owned Content maps | REQ-004, REQ-005, REQ-015 |
| No new Content codes | Closed set from `content-catalogs-v1` | REQ-010, NFR-003 |
| Keep transitional non-v1 labels | Assessment summaries/levels are not Content v1 MessageRefs on the wire | REQ-012 |
| Minimal chrome key for hard-gate label | Field label is UI chrome, not narrative SoT | NFR-006 |

### Brand UI primitives

This Feature does **not** introduce new interactive controls. Continue using brand primitives from `view-market-analysis` / `view-market-classification`:

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Recommendation / hard-gate narrative text | `Text`, `Label` (or `SectionHeading` only if grouping requires it) |
| Recommendation section container | Existing `Card` / section structure already used for Recommendation |
| Classification reason cells | Existing `Table` / `TableCell` binding |

Native HTML stand-ins and Tailwind/`className` utilities remain forbidden.

**Exception (documented):** No new brand primitive is required solely for hard-gate narrative display (NFR-005).

### Out of scope (explicit)

- Registering new Content codes (regime SCREAMING_SNAKE labels, AnalysisRegimeReasonCode, StrategyType, exposure factors, risk/economic component names, classification HTTP error machine codes)
- Migrating transitional `analysisLabels.*` non-v1 token catalogs into Content
- Reintroducing `analysisLabels.*` / duplicate English tables as SoT for Content v1 catalog codes
- Brand chrome ownership by Content
- Remote content-service / non-`en` locales / non-`ui` channels / ICU plurals
- Changing idle/loading/error/retry semantics
- Backend / OpenAPI edits in this PROJECT_ROOT
- Redesigning Analysis assessment summary/level layout beyond binding existing/deferred Content narrative fields

### Continuity from `content-resolve-boundary`

| Field | Boundary Feature | This Feature |
|-------|------------------|--------------|
| Classification signal `reason` | Resolve → VM `reason` string | Confirm screens bind that string only |
| Analysis `catalog.catalog_reason` | Resolve → recommendation rationale | Confirm screen binds rationale; primary narrative is resolved text |
| Analysis `catalog.hard_gate_reason` | Deferred fuller VM/screen wiring | **Complete:** VM field + success UI when non-null |

## Data Flow

1. Existing clients fetch analysis/classification (HTTP unchanged) (NFR-002, REQ-014).
2. Structural validation remains fail-closed (NFR-004).
3. **Classification:** Signal reasons that are MessageRefs (or raw v1 codes) resolve via boundary adapter → VM `reason` strings (already established; keep) (REQ-004, REQ-008, REQ-009).
4. **Analysis catalog_reason:** MessageRef → boundary adapter → `recommendation.rationale` (REQ-001).
5. **Analysis hard_gate_reason:** MessageRef → boundary adapter → `recommendation.hardGateReason` (string); `null` → `null` (REQ-002, REQ-003).
6. Screens render success VM strings; hard-gate block only when `hardGateReason != null` (REQ-005–REQ-007).
7. Transitional non-v1 humanization for assessment summaries/levels continues via existing `resolveLabel` paths and is not Content SoT (REQ-012).

```text
[fetch analysis | classification]
        │
        v
[validate DTO] --fail--> [error state]
        │ ok
        v
[resolve Content v1 MessageRefs via boundary adapter]
  catalog_reason      → recommendation.rationale
  hard_gate_reason?   → recommendation.hardGateReason | null
  signal.reason       → signal.reason (string)
        │
        v
[map remaining non-v1 tokens via transitional labels]
        │
        v
[view model] → [screen binds strings]
```

## Interfaces

### Boundary adapter (existing)

```text
resolveUiMessages(messages: readonly MessageRef[]): ResolvedMessage[]
```

Unchanged. Channel `ui`, locale `en`. No brand imports.

### Analysis DTO narrative inputs (conceptual; from BE `analysis-message-refs`)

| Wire field | Type | VM output |
|------------|------|-----------|
| `catalog.catalog_reason` | `MessageRef` | `recommendation.rationale: string` (resolved `text`) |
| `catalog.hard_gate_reason` | `MessageRef \| null` | `recommendation.hardGateReason: string \| null` |

### Classification DTO narrative inputs (conceptual; from BE `classification-message-refs`)

| Wire field | Type | VM output |
|------------|------|-----------|
| `*.reason` on each signal | `MessageRef` (or transitional raw v1 code string) | `ClassificationSignal.reason: string` (resolved `text`) |

### Public UI surface

No new routes. Analysis Recommendation section gains optional hard-gate narrative presentation when the VM field is non-null.

### External systems

None new.

## Data Model

### Content v1 codes in scope (from `content-catalogs-v1`; do not extend)

**Analysis narrative (7):**

`catalog.wait`, `catalog.strategy_allowed`, `catalog.no_strategy_allowed`, `catalog.hard_gate.extreme_regime`, `catalog.hard_gate.risk_too_high`, `catalog.hard_gate.negative_edge`, `catalog.hard_gate.no_capacity`

**Classification signal reasons (16):** regime / risk / economic / exposure reason codes listed in `content-catalogs-v1` / `content-resolve-boundary`.

### Analysis view-model extension

Preserve `view-market-analysis` shape; extend recommendation:

```text
CatalogRecommendation
  catalogId: string
  name: string
  rationale: string                 # Content-resolved from catalog_reason
  hardGateReason: string | null     # Content-resolved from hard_gate_reason; null when wire null
```

Field naming may use an equivalent camelCase identifier; behavior above is mandatory.

### Classification view-model

Unchanged shape from `view-market-classification`:

```text
ClassificationSignal
  source: string
  score: number
  reason: string   # Content-resolved display text for v1 reasons
```

### “Summaries / rationale / levels covered by this epic”

| Surface | Covered by Content v1? | This Feature |
|---------|------------------------|--------------|
| Recommendation rationale | Yes (`catalog_reason`) | Bind resolved string |
| Hard-gate narrative | Yes (`hard_gate_reason`) | Expose + bind resolved string |
| Classification signal reasons | Yes | Bind resolved string |
| Assessment summary/level (regime/risk/economic/exposure) | No (not Content v1 MessageRefs) | Leave transitional humanization (REQ-012) |
| Strategy / factor / component tokens | No | Leave transitional `analysisLabels.*` |

### Screen state

No new states. Existing idle | loading | success | error transitions remain authoritative (REQ-014).

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Valid payload + known v1 MessageRef | Resolved template `text` on VM; success |
| Valid payload + unknown narrative code | Content per-message fallback on that field; mapping continues (REQ-009) |
| `hard_gate_reason: null` | VM `hardGateReason: null`; UI omits hard-gate narrative (REQ-003, REQ-007) |
| Structurally invalid payload | Fail closed → error (NFR-004) |
| Non-v1 token missing from transitional locale map | Existing raw-code fallback via `resolveLabel` (unchanged) |

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. Prefer extending existing mapper and screen tests; no new `copy.source.test.ts`; no E2E/MSW/coverage %.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| `catalog_reason` → rationale equals Content text | API mapper | Fixture MessageRef e.g. `catalog.strategy_allowed` → `recommendation.rationale` equals boundary/Content-resolved text | extend `src/api/**/map*Analysis*.test.ts` |
| `hard_gate_reason` MessageRef → `hardGateReason` | API mapper | Fixture hard-gate MessageRef → VM field equals Content-resolved text; `null` → `null` | same mapper tests |
| Unknown narrative code fallback without fail-map | API mapper | Unknown code → fallback string on field; map succeeds | same |
| Classification reason remains Content-resolved | API mapper | Only if regression risk: reason equals Content text | extend classification mapper tests if touched |
| Analysis success binds rationale + hard gate | Screen | Fixture VM with rationale + non-null `hardGateReason` → both visible; null hard gate → hard-gate narrative omitted; assert catalog-linked / fixture strings not MessageRef JSON | extend Analysis `*Screen.test.tsx` (one focused success case) |
| Classification success binds reason strings | Screen | At most one success assert that reason text from fixture VM appears; no MessageRef mapping in component | extend Classification screen test only if binding path changes |
| State machine intact | Screen | Existing idle/loading/error/retry/stale cases remain green | existing screen tests |
| No component Content maps | Reviewer | Screens do not import Content catalogs or build code→English tables for narrative | Reviewer |
| No duplicate Content narrative in locales | Reviewer | No new `en.json` entries duplicating Content templates for v1 codes | Reviewer |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 rationale resolve + screen bind | Yes — mapper + Analysis screen success |
| AC-002 hard-gate VM + UI | Yes — mapper null/non-null + Analysis screen |
| AC-003 classification reasons | Yes — existing/extended mapper; screen only if needed |
| AC-004 flows + fallback | Yes — mapper fallback + existing screen state tests |
| AC-005 scope / brand / no new codes | Reviewer |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, or a new `copy.source.test.ts`.

## Copy / Wording

Follow `knowledge/writing/`. Narrative voice for Content v1 codes remains owned by `src/content/templates/` (`content-catalogs-v1`). This Feature does **not** duplicate those narrative strings in `src/locales/en.json`.

### Design-system keys reused

| Key | Source |
|-----|--------|
| `labels.recommendation` | `@market-data/brand/wording` |
| `labels.regime` / `labels.risk` / `labels.economic` / `labels.exposure` | `@market-data/brand/wording` |
| `common.loading` / `common.error` / `common.retry` | `@market-data/brand/wording` |

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `viewMarketAnalysis.hardGateReason` | Hard gate | `src/locales/en.json` | Chrome label for hard-gate narrative field (not narrative body) |
| Existing `viewMarketAnalysis.rationale` | Rationale | unchanged | Chrome label for rationale |

**Do not add:** Duplicate Content template English for `catalog.*` / classification reason codes.

Terminology: **Regime**, **Risk**, **Economic**, **Exposure**, **Recommendation**, **Analysis**, **Classification** per `knowledge/writing/terminology.md`. Hard-gate narrative is part of catalog recommendation presentation, not a new product domain noun requiring brand inventory.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Mapper: `catalog_reason` → `recommendation.rationale` via boundary adapter |
| REQ-002 | Mapper: `hard_gate_reason` MessageRef → `recommendation.hardGateReason` |
| REQ-003 | Null hard gate → null VM field |
| REQ-004 | Classification screen binds VM `reason` only |
| REQ-005 | Analysis screen binds VM `rationale` only for that narrative |
| REQ-006 | Analysis UI shows hard-gate string when non-null |
| REQ-007 | Analysis UI omits hard-gate when null |
| REQ-008 | Primary narrative is resolved VM string, not MessageRef/prose dump |
| REQ-009 | Per-message Content fallback; mapping continues |
| REQ-010 | Closed v1 inventory only |
| REQ-011 | No `analysisLabels.*` SoT for v1 catalog codes |
| REQ-012 | Transitional non-v1 assessment humanization unchanged |
| REQ-013 | Brand wording not used for Content narrative |
| REQ-014 | State machines preserved |
| REQ-015 | Resolution at boundary; screens do not import Content catalogs |
| NFR-001 | Reuse boundary adapter |
| NFR-002 | No BE/OpenAPI edits |
| NFR-003 | Explicit out-of-scope inventory |
| NFR-004 | Structural fail-closed preserved |
| NFR-005 | Existing brand primitives; optional hard-gate text display |
| NFR-006 | Chrome label only in app locales; narrative from Content templates |
