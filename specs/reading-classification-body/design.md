# Design

## Overview

This Feature composes the **internals of the Classification Region** (hosted by Feature `reading-layout-shell`) per `knowledge/ux/reading-contract.md`: compact, subordinate signal packaging for Regime / Risk / Economic / Exposure — each displayed signal showing **source**, **score**, and **reason** (human-readable narrative when available from existing Content-resolved Classification mapping). Classification remains a **sibling** of Analysis (associated / adjacent), never nested under Assessments, and never reduced to a count-only summary. Fidelity is gray-box / structural; hi-fi polish is out of scope.

Analysis remains the interpretive hero (`knowledge/ux/analysis-contract.md`). Classification answers “How is this Symbol tagged?” with discrete packaging of the same four axes — not a fifth engine and not a substitute for Analysis.

### Post-ship presentation alignment

Wireframe SoT (Reading shell hosts Classification compact adjacent to Analysis): https://www.figma.com/design/opTJ1E7ZHIgpLPQTw1YtKP/Reading-Layout-Wireframe?node-id=0-1

Gray-box fidelity only. Payload orientation (UI model, not a new API map): reuse existing `MarketClassificationViewModel` (or Reading-hosted equivalent) from Features `view-market-classification` and `analysis-classification-copy` — arrays per dimension; each signal already carries `source`, `score`, and Content-resolved `reason` string.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Classification Region host | Provided by `reading-layout-shell`; this Feature fills the Classification Region body only (REQ-010). |
| Classification body composition | Single compact packaging workspace inside Classification; owns four dimension signal groups and per-signal rows (REQ-001, REQ-002, REQ-015). |
| Dimension signal groups | Regime, Risk, Economic, Exposure — each labeled; empty groups still exposed (REQ-002, REQ-013). |
| Signal row packaging | For each displayed signal: source, score, reason (REQ-003, REQ-004). |
| Prominence / placement guard | Keep Classification compact, subordinate, adjacent to Analysis; not equal prominence (REQ-005). |
| Ownership boundary guard | Classification not nested under Assessments; no Analysis/Evidence/Market Data/Diagnostics ownership inside Classification body (REQ-006, REQ-011). |
| Locale / Content binding | Dimension labels from brand wording; column / empty-group chrome from feature locale; reason from VM string only (REQ-009). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Fill Classification Region body only | Shell owns Region map; Reading contract owns Classification packaging | REQ-010 |
| Four dimension groups, empty allowed | Contract: same four axes; Feature acceptance | REQ-001, REQ-002, REQ-013 |
| Per-signal source / score / reason | Feature acceptance; anti count-only | REQ-003, REQ-004, REQ-015 |
| Compact adjacent subordinate | Reading hierarchy P3; Associated layout kind | REQ-005 |
| Sibling of Analysis, not nested | Analysis contract ownership; anti nested Classification | REQ-006 |
| No Primary/Secondary / Overall rollup | Reading critical rules | REQ-007 |
| Reuse existing Classification VM | Done Features already map GET classification + Content reasons | REQ-014, NFR-009 |
| Brand UI kit for chrome | Conventions + Feature acceptance | REQ-008, NFR-002, NFR-006 |
| Gray-box compact packaging | Epic fidelity | NFR-007 |

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Classification spacing / compact bands | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Group / field titles | `SectionHeading`, `Label`, `Text` |
| Compact group containers (gray-box scanning) | `Card`, `CardHeader`, `CardTitle` when a bordered unit aids scanning — **not** as an equal-weight hero wall competing with Analysis |
| Signal lists (source / score / reason) | `Table`, `TableHeader`, `TableRow`, `TableCell` (and related Table parts) — prefer compact density appropriate to subordinate Region |
| Discrete score / group markers (optional) | `Badge` when a short token is shown |
| Loading (only if Classification body surfaces local loading independently of host) | `Skeleton` |
| Error chrome (only if Classification body surfaces local failure independently of host) | `Alert`, `AlertTitle`, `AlertDescription` |
| Retry | `Button` |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings.

**Explicit exception:** Semantic landmarks for dimension groups (e.g. `section` / list with accessible names) are structural composition. They may be used with brand spacing/typography primitives and tokens; do not invent a parallel CSS design system.

**Compactness guidance:** Prefer denser table/list packaging and smaller allocated space than Analysis Assessments peers. Do not mirror Analysis peer card wall scale inside Classification.

### Out of scope (explicit)

- Hi-fi Figma / pixel polish as a delivery gate
- Reading-wide Region shell layout (Context, Analysis adjacency geometry owned by shell) — owned by `reading-layout-shell` (this Feature must not undo shell hierarchy)
- Nesting Classification under Analysis Assessments
- Analysis Assessment outcomes / Recommendation / Narrative ownership — owned by `reading-analysis-composition`
- Evidence Drivers → Features → Contributions — owned by `reading-evidence-composition`
- Diagnostics quiet/elevated trust chrome — owned by `reading-diagnostics`
- Market Data Region body fidelity — Feature `reading-market-data-body`
- New backend APIs, DTO fields, or OpenAPI changes
- Re-resolving Content MessageRefs in components (resolution stays at mapper / boundary from prior Features)
- Sibling-repo brand `visual-definitions` paths (use adopted `knowledge/ux/reading-contract.md` only)
- Standalone legacy Classification destination redesign beyond what Reading host already routes

## Data Flow

1. User opens a successful Symbol Reading; Classification Region is present from the Reading shell (REQ-010, REQ-012).
2. Classification Region body mounts Classification packaging composition (REQ-001).
3. Existing Classification mapping (Reading host or reused client) supplies `MarketClassificationViewModel` (or equivalent) for the selected Symbol (REQ-014, NFR-009).
4. Body renders four dimension groups; each non-empty group lists signals with source, score, reason; empty groups remain labeled without rows (REQ-002, REQ-003, REQ-013).
5. Reason cells bind VM `reason` strings (Content-resolved narrative when prior Features provided them) (REQ-004, REQ-009).
6. Classification stays compact adjacent to Analysis; Assessments workspace does not gain a Classification child Region (REQ-005, REQ-006).
7. Host idle / loading / error states continue to own selection and fetch chrome; this Feature does not invent a parallel success claim without host success (REQ-012).

```text
[Reading workspace — reading-layout-shell]
    ├── Analysis Region (reading-analysis-composition)
    │     └── Assessments peers + Recommendation
    │           (no nested Classification Region)
    └── Classification Region (this Feature)  [compact | adjacent | subordinate]
          └── Classification body composition
                ├── Regime group   → signals[source, score, reason] | empty
                ├── Risk group     → signals[...] | empty
                ├── Economic group → signals[...] | empty
                └── Exposure group → signals[...] | empty

Data source (reuse; no new API):
  GET /markets/{symbol}/classification
    → existing mapper + Content boundary
    → MarketClassificationViewModel
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Classification body composition | Exactly one packaging composition inside Classification Region; stable accessible name / label for Classification body |
| Dimension signal groups | Four groups with stable ids and accessible names: Regime, Risk, Economic, Exposure |
| Signal rows | Each displayed signal exposes source, score, and reason |
| Empty groups | Group chrome present with no signal rows; not treated as error |
| Prominence | Classification not marked primary; remains associated / subordinate relative to Analysis |
| Absence of nested Classification under Assessments | Assessments tree has no Classification child Region |

### Unit identity (stable)

| Unit id | Label (canonical) | Role | Prominence |
|---------|-------------------|------|------------|
| `classification` | Classification (Region host; existing shell) | Associated Reading Region | Small / subordinate |
| `classification-body` | Classification body | Composition root | Inside Classification Region |
| `classification-regime` | Regime | Dimension signal group | Compact within Classification |
| `classification-risk` | Risk | Dimension signal group | Compact within Classification |
| `classification-economic` | Economic | Dimension signal group | Compact within Classification |
| `classification-exposure` | Exposure | Dimension signal group | Compact within Classification |
| `classification-signal` | Signal row | Source / score / reason packaging | Listed under group |

Unit ids are implementation identifiers for tests and composition; user-facing labels come from brand wording / locale (REQ-009). There is **no** `overall-classification`, `primary-classification`, or `secondary-classification` unit id.

### External systems

No new HTTP endpoints. Reuse existing `GET /markets/{symbol}/classification` mapping owned by prior Features. Mapping and Content resolution rules remain in those Feature specs; this Feature owns Classification Region body packaging and placement relative to Analysis.

### Application configuration

None beyond existing Symbol selection / Classification loading owned by the Reading host and prior Classification Features.

## Data Model

### Classification body structure

```text
ClassificationBody
  groups:
    regime: ClassificationSignalGroup
    risk: ClassificationSignalGroup
    economic: ClassificationSignalGroup
    exposure: ClassificationSignalGroup

ClassificationSignalGroup
  id: "classification-regime" | "classification-risk" | "classification-economic" | "classification-exposure"
  identityLabel: brand wording (Regime | Risk | Economic | Exposure)
  signals: ClassificationSignal[]   # may be empty

ClassificationSignal
  source: string
  score: number                     # displayed as already mapped
  reason: string                    # Content-resolved / mapped display narrative when available
```

### Content binding

| Source | Consumed as |
|--------|-------------|
| Existing Classification view-model `regime` / `risk` / `economic` / `exposure` arrays | ClassificationSignalGroup.signals |
| Existing per-signal `source`, `score`, `reason` | ClassificationSignal fields (reason already a display string from Content boundary when MessageRef was provided) |
| Empty arrays | Group still rendered; no rows |

Forbidden packaging: count-only sole body (“N signals”); Overall Classification score; Primary/Secondary Classification taxonomy; Classification nested under Assessments.

### Attention / layout structure (observable)

| Priority (Reading) | Content | Notes |
|--------------------|---------|-------|
| P1 | Analysis | Hero interpretation (unchanged) |
| P3 | Classification | Compact adjacent packaging |
| — | Evidence / Market Data / Diagnostics | Not owned by this Feature |

Relative allocated space: Classification **small**; Analysis **extra large**. Classification must not read as equal prominence.

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| Reading host idle or loading | Host status | Classification body packaging not claimed as success until host provides Classification content | Host selection / wait |
| Classification fetch failure | Host / prior Feature error state | Host error + retry; do not invent a parallel Classification-only error Region that replaces Reading error chrome | Retry via host |
| Empty signal arrays | Valid mapped VM with empty groups | Success packaging; empty groups still labeled (REQ-013) | None |
| Partial groups (some empty, some populated) | Valid mapped VM | Show populated rows; keep empty groups visible | None |
| Stale Classification response | Host stale-ignore | Body follows current Symbol only | None |
| Missing reason narrative | Mapper already supplied fallback string or fail-closed per prior Features | Bind VM string only; do not invent English in components | Prior Feature contracts |
| Attempt to nest under Assessments | Design / review gate | Not allowed | Spec + Reviewer reject |

Validation rules:

- Exactly four dimension groups when Classification body success packaging is shown (REQ-001, REQ-002).
- Every displayed signal includes source, score, and reason (REQ-003).
- Classification not rendered as a child of Assessments (REQ-006).
- No Overall / Primary / Secondary Classification ownership nodes (REQ-007).
- Body is not solely a count summary when signals exist (REQ-015).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a **composition / screen** Feature inside Classification: prefer component tests with strong packaging oracles. Reuse existing Classification mapper fixtures; do **not** re-scaffold mapper/fetch suites unless this Feature changes those modules. Extend Reading shell / Analysis composition tests only for nesting / prominence boundaries. No E2E, MSW, coverage %, or new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Four dimension groups present | Layout / component | Accessible names / labels for Regime, Risk, Economic, Exposure groups under Classification Region | `src/features/reading-classification-body/*.test.tsx` (new) and/or extend Reading Classification body host tests |
| Empty groups allowed | Layout / component | Fixture with empty arrays still shows four group labels; not error state | same |
| Signal shows source, score, reason | Layout / component | One success fixture with ≥1 signal asserts catalog-linked / fixture source, score, and reason text visible | same |
| Not count-only summary | Layout / component | Success with signals asserts source/score/reason fields present; sole “N signals” count text is not the only Classification body content | same |
| Compact subordinate / adjacent | Layout / component | Classification not marked primary; remains in associated band with Analysis (shell adjacency preserved); Classification body present | same or shell + body suite |
| Not nested under Assessments | Layout / component | Assessments tree has no Classification child Region; Classification Region remains Reading sibling | composition + shell / analysis tests |
| No Overall / Primary-Secondary taxonomy | Layout / component | No unit labeled Overall Classification / Primary Classification / Secondary Classification | same |
| Brand primitives / no ad-hoc DS | Reviewer + light UI | Imports from `@market-data/brand/ui`; no Tailwind utility `className` for Classification chrome | Reviewer; optional render smoke |
| Copy from catalogs / Content-resolved VM | Component / Reviewer | Dimension and column labels via brand `wording` / `getMessage`; reason asserts fixture VM string (resolved narrative), not hardcoded component English | assert catalog-linked labels + fixture reason |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 four groups (empty allowed) | Yes — composition tests |
| AC-002 source / score / reason per signal | Yes — composition success fixture |
| AC-003 compact subordinate / adjacent | Yes — prominence + shell adjacency / not primary |
| AC-004 not nested under Assessments | Yes — ownership boundary asserts |
| AC-005 brand tokens/components | Reviewer (required) + optional render smoke |
| AC-006 locale / Content-resolved copy | Yes — catalog-linked labels + fixture reason string |
| AC-007 not count-only | Yes — packaging fields present when signals exist |
| AC-008 contract anti-patterns | Yes — absence of Overall / Primary-Secondary + sibling placement |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`. Do **not** duplicate full Classification mapper fail-closed suites already owned by prior Features unless mapping changes.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared domain labels; Classification-body chrome that is feature-specific lives in the app locale catalog. Signal **reason** narrative is **not** authored here — it comes from the Classification view-model string (Content-resolved when MessageRefs were provided by prior Features).

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.regime` | `@market-data/brand/wording` | Regime signal group label |
| `labels.risk` | `@market-data/brand/wording` | Risk signal group label |
| `labels.economic` | `@market-data/brand/wording` | Economic signal group label |
| `labels.exposure` | `@market-data/brand/wording` | Exposure signal group label |
| `common.loading` / `common.error` / `common.retry` | `@market-data/brand/wording` | Only if Classification body surfaces local loading/error chrome independent of host |

### Feature keys to add or change

Prefer reusing existing `viewMarketClassification.source` / `.score` / `.reason` keys when those already exist in `src/locales/en.json` for the same column semantics. Add Reading-scoped keys only when Classification-body chrome needs distinct copy from the legacy Classification screen.

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `viewMarketClassification.source` (reuse) or `readingClassification.source` | Source | `src/locales/en.json` | Signal source column / field label |
| `viewMarketClassification.score` (reuse) or `readingClassification.score` | Score | `src/locales/en.json` | Signal score column / field label |
| `viewMarketClassification.reason` (reuse) or `readingClassification.reason` | Reason | `src/locales/en.json` | Signal reason column / field label |
| `readingClassification.emptyGroup` | No signals for this dimension. | `src/locales/en.json` | Empty dimension group body (factual empty state; optional if group chrome alone is sufficient) |
| `readingClassification.bodyLabel` | Classification signals | `src/locales/en.json` | Optional accessible name for Classification body composition when distinct from Region chrome |

Do not use “Tags”, “Categories”, “Overall”, “Primary Classification”, or “Secondary Classification” as labels. Do not use “Asset”. Do not hardcode reason narrative English in components.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | ClassificationBody with four dimension groups |
| REQ-002 | Groups always exposed; empty arrays allowed |
| REQ-003 | ClassificationSignal row: source, score, reason |
| REQ-004 | Bind VM reason narrative; anti count-only substitute |
| REQ-005 | Compact subordinate associated placement vs Analysis |
| REQ-006 | Ownership boundary: not nested under Assessments |
| REQ-007 | Forbidden Overall / Primary-Secondary nodes |
| REQ-008 / NFR-002 / NFR-006 | Brand UI primitives table; compact density guidance |
| REQ-009 / NFR-005 | Brand wording + feature locale; VM reason binding |
| REQ-010 | Fills Classification Region body only |
| REQ-011 | Ownership: no Analysis/Evidence/Market Data/Diagnostics content owned here |
| REQ-012 | Defer to Reading host idle/loading/error |
| REQ-013 | Empty groups still labeled; not error |
| REQ-014 / NFR-009 | Reuse existing Classification fetch/mapping + Content reasons |
| REQ-015 | Per-signal packaging required when signals exist |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines in Copy / Wording |
| NFR-007 | Gray-box fidelity explicit |
| NFR-008 | Adopted reading-contract (+ analysis nesting boundary); PROJECT_ROOT scope |
