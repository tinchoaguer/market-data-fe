# Design

## Overview

This Feature restyles the **Classification Region body** already composed by Feature `reading-classification-body` into the dashboard-mockup **Factor / Score / Reason** tabular surface. The primary scanning unit is a compact brand `Table` (with `TableHeader`, `TableRow`, `TableCell`, and related parts) whose columns are **Factor** (mapped from existing signal `source` when no separate factor field exists), **Score**, and **Reason**. Signals remain organized across the four Classification dimensions (Regime, Risk, Economic, Exposure); each dimension group may render as its own compact table under a dimension label, or as grouped sections within one Classification body table — both satisfy “equivalent compact tabular packaging.”

Optional compact score visualization (for example a small gauge) may appear **only** beside an individual signal row or dimension group header when a suitable brand primitive exists; it must **not** become an Overall Score / Synthesis hero. Classification stays a **sibling** Reading Region — compact, adjacent, subordinate to Analysis — never nested under Assessments. Surface uses `@maguer/market-data-brand@^0.2.0` (established by Feature `dashboard-app-chrome`).

Contract authority: `knowledge/ux/reading-contract.md` (Reading Regions, Classification subordination, no Overall rollup) and `knowledge/ux/analysis-contract.md` (Classification not nested under Analysis). Behavioral rules from Feature `reading-classification-body` (per-signal source/score/reason, four groups, Content-resolved reasons) are unchanged; this Feature owns **dashboard tabular presentation** only.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Classification Region host | Existing Reading shell Classification Region from `reading-layout-shell`; unchanged Region map (REQ-011). |
| Classification body restyle | Replaces gray-box list/card scanning with Factor/Score/Reason tabular packaging (REQ-001, REQ-008, REQ-017). |
| Dimension signal groups | Regime, Risk, Economic, Exposure — labeled; empty groups still exposed (REQ-002, REQ-014). |
| Signal table rows | Each displayed signal: Factor/source, Score, Reason cells; omit unavailable cells (REQ-003, REQ-015). |
| Optional score viz | Per-signal or per-group compact visualization only; never Overall rollup (REQ-009, REQ-007, NFR-011). |
| Prominence / placement guard | Compact, subordinate, adjacent to Analysis (REQ-005, REQ-017). |
| Ownership boundary guard | Not nested under Assessments; no Analysis/Evidence/Market Data/Diagnostics content (REQ-006, REQ-016). |
| Locale / Content binding | Column headers and group labels from brand wording / feature locale; reason from VM string (REQ-010, REQ-019). |
| Host state | Idle / loading / error remain Reading / Classification host-owned (REQ-013, REQ-020, REQ-021, REQ-022). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Restyle existing body; no new data contract | Feature owns presentation only; VM from prior Features | REQ-012, NFR-010 |
| Brand `Table` as primary structure | Dashboard mockup + conventions (mandatory Table primitive) | REQ-001, REQ-008, NFR-006 |
| Factor column ← existing `source` | Feature acceptance “factor (or source)”; no new API field | REQ-003, REQ-019, REQ-012 |
| Four dimension groups preserved | Reading contract: same four axes | REQ-002, REQ-014 |
| Grouped tables or sectioned single table | “Equivalent compact tabular packaging” | REQ-001 |
| Optional gauge per row/group only | Mockup may show compact viz; anti Overall rollup | REQ-009, REQ-007, NFR-011 |
| Compact subordinate density | Reading P3; smaller than Analysis cards | REQ-005, REQ-017 |
| Sibling of Analysis | analysis-contract + reading-contract | REQ-006 |
| Reuse Classification VM + Content reasons | Done Features already map GET classification | REQ-012, REQ-004 |
| Brand kit only; no Tailwind | conventions + dashboard package | REQ-008, NFR-002, NFR-006, NFR-009 |
| Do not touch hero / chrome / Analysis / Market Data | Sibling Feature ownership | REQ-011, REQ-018, NFR-010 |

### Brand UI primitives

| Need | Use from `@maguer/market-data-brand/ui` |
|------|-----------------------------------------|
| Factor / Score / Reason table | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` (and related Table parts when exported) |
| Classification Region / group chrome | `Card`, `CardHeader`, `CardTitle` when a bordered unit aids subordinate scanning — **not** at Assessment-card scale |
| Column / group labels | `Text`, `Label`, `SectionHeading` |
| Compact layout | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Discrete score tokens (optional) | `Badge` for short score level tokens when mapped |
| Optional compact score viz | Brand Gauge / meter primitive **only if exported**; otherwise omit (NFR-011) |
| Loading (host / Classification body) | `Skeleton` (existing host path) |
| Error chrome (host / Classification body) | `Alert`, `AlertTitle`, `AlertDescription`, `Button` (existing host path) |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings (NFR-009).

**Package naming:** Use `@maguer/market-data-brand` at `^0.2.0` (or newer compatible already on the app from Feature `dashboard-app-chrome`). Older knowledge docs may still say `@market-data/brand`; imports for this Feature follow the published `@maguer/market-data-brand` entry points (`/ui`, `/wording`).

**Explicit exception (NFR-011):** If the brand package exports a Gauge (or equivalent compact score visualization) suitable for per-signal packaging, it may appear adjacent to the Score cell or dimension group header. If it does not export one, **omit** the visualization; do **not** add `recharts`, D3 gauge libraries, or another chart package for Classification. Numeric score in the table satisfies REQ-003.

**Explicit exception:** Semantic landmarks (`section`, table captions) for dimension groups may wrap brand Tables for accessibility. They are not a parallel design system.

**Compactness guidance:** Table density shall remain **denser and smaller in allocated space** than Analysis Assessment cards. Do not mirror the four vertical Assessment card wall scale inside Classification.

### Scope boundary

**In scope**

- Restyle Classification Region body to Factor/Score/Reason tabular packaging
- Bind existing mapped signals to table rows; omit unavailable cells
- Preserve four dimension groups (Regime, Risk, Economic, Exposure); empty groups allowed
- Optional per-signal or per-group compact score viz when brand primitive exists
- Preserve subordination, adjacency, and sibling ownership vs Analysis
- Preserve no-Overall / no-Synthesis / not-nested anti-patterns
- Preserve host idle / loading / error usability
- Locale keys for column headers if not already present
- Tests for table structure, ownership anti-patterns, catalog-linked labels, host state preservation

**Out of scope**

- App chrome — Feature `dashboard-app-chrome`
- Reading hero band — Feature `dashboard-hero-band`
- Analysis Assessment cards — Feature `dashboard-analysis-cards`
- Market Data middle observation row — Feature `dashboard-observation-row`
- Evidence Drivers → Features → Contributions depth — Feature `reading-evidence-composition`
- Diagnostics elevation — Feature `reading-diagnostics`
- Redesigning Reading shell Region geometry (Analysis:Classification ~3:2 band) — Feature `reading-layout-shell`
- New backend APIs, DTO fields, or OpenAPI changes
- Overall Score / Synthesis rollup or fifth analytical engine in Classification
- Sibling-repo brand visual-definition paths or Epic coordination artifacts
- Hi-fi Figma pixel polish as a delivery gate
- Inventing FE token sets, Tailwind design system, or third-party gauge/chart libraries

## Data Flow

1. User opens a successful Symbol Reading; Classification Region is present from the Reading shell (REQ-011, REQ-013).
2. Existing Classification mapping supplies `MarketClassificationViewModel` (or Reading-hosted equivalent) for the selected Symbol (REQ-012).
3. Classification body restyle renders four dimension groups; each group presents signals as Factor/Score/Reason table rows using brand `Table` (REQ-001, REQ-002, REQ-003).
4. Reason cells bind VM `reason` strings (Content-resolved when prior Features provided them) (REQ-004, REQ-010).
5. Unavailable factor/source, score, or reason cells are omitted without failing the Reading; empty dimension groups remain labeled (REQ-014, REQ-015).
6. Optional compact score visualization, if used, binds to a single signal row or dimension group only — never a Symbol-wide rollup (REQ-009, REQ-007).
7. Classification stays compact adjacent to Analysis; Assessments workspace does not gain a Classification child Region (REQ-005, REQ-006, REQ-017).
8. Idle / loading / error remain host-owned; table is not claimed as success without Classification success (REQ-020, REQ-021, REQ-022).
9. Hero band, Analysis cards, Market Data row, app chrome remain outside this restyle (REQ-018).

```text
[Reading workspace]
  ├── Hero band — dashboard-hero-band (unchanged)
  ├── Analysis Region — dashboard-analysis-cards (unchanged)
  │     └── Assessments workspace (no nested Classification)
  ├── Classification Region (this Feature restyle)
  │     └── Classification tabular body
  │           ├── Regime group   → Table[Factor | Score | Reason?] (+ optional row gauge)
  │           ├── Risk group     → Table[...] | empty group chrome
  │           ├── Economic group → Table[...] | empty
  │           └── Exposure group → Table[...] | empty
  ├── Market Data row — dashboard-observation-row (unchanged)
  ├── Evidence | Diagnostics — unchanged ownership
  └── App chrome — dashboard-app-chrome (unchanged)

Data (reuse; no new API):
  GET /markets/{symbol}/classification → existing VM → table rows
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Classification tabular body | Exactly one dashboard-style tabular composition inside Classification Region; stable accessible name for Classification body |
| Table columns | Factor (or Source), Score, Reason — headers from locale / brand wording (REQ-019) |
| Dimension signal groups | Four groups with stable ids: Regime, Risk, Economic, Exposure |
| Signal rows | Each displayed signal exposes factor/source, score, and reason in table cells when available |
| Empty groups | Group label + empty table body or factual empty-group copy; not error state |
| Optional score viz | Per-signal or per-group only; decorative/supplementary to Score cell; never labeled Overall Score / Synthesis |
| Prominence | Classification not marked primary; remains associated / subordinate relative to Analysis |
| Forbidden | Overall Assessment / Overall Score / Synthesis unit; Classification nested under Assessments; count-only sole body; Assessment/Recommendation/Evidence/Market Data content in Classification body |

### Unit identity (stable)

| Unit id | Label (canonical) | Role | Presentation |
|---------|-------------------|------|--------------|
| `classification` | Classification | Associated Reading Region (shell host) | Subordinate Region |
| `classification-body` | Classification body | Composition root | Tabular body |
| `classification-table` | Factor / Score / Reason table | Primary scanning unit | Brand `Table` |
| `classification-regime` | Regime | Dimension signal group | Group header + table section |
| `classification-risk` | Risk | Dimension signal group | Group header + table section |
| `classification-economic` | Economic | Dimension signal group | Group header + table section |
| `classification-exposure` | Exposure | Dimension signal group | Group header + table section |
| `classification-signal` | Signal row | Factor / score / reason packaging | `TableRow` under group |

Unit ids are implementation identifiers for tests and composition; user-facing labels come from brand wording / locale (REQ-010). There is **no** `overall-score`, `overall-classification`, `synthesis`, `primary-classification`, or `secondary-classification` unit id.

### Table row contract (FE)

Each row binds existing Classification view-model signal fields. This Feature does **not** invent a new HTTP DTO.

| Cell | Required? | Source guidance |
|------|-----------|-----------------|
| Factor | When mapped | Existing signal `source` (displayed under Factor column header per REQ-019) |
| Score | When mapped | Existing numeric/level `score` on the signal |
| Reason | When mapped | Existing Content-resolved / mapped `reason` display string |
| Optional viz | When brand primitive exists | Binds to same signal’s `score`; not aggregated across dimensions |

If only some cells exist, render the row with available cells and omit empty columns’ values (REQ-015). Do not fail mapping or hide the dimension group.

Exact score formatting remains the existing Classification mapping convention; this Feature does not change mapper fail-closed rules unless a thin presentation adapter is needed for table binding.

### Tabular layout options (implementer choice)

Both satisfy REQ-001:

| Option | Structure | When to prefer |
|--------|-----------|----------------|
| **A — Grouped tables** | Four compact `Table` instances under dimension `SectionHeading` labels | Preserves dimension scanning; aligns with prior `reading-classification-body` mental model |
| **B — Sectioned single table** | One `Table` with dimension group header rows or tbody sections | Matches a single mockup table with visual group breaks |

Implementer picks one; Reviewer validates four groups remain observable and tabular packaging is compact.

### External systems

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/markets/{symbol}/classification` | Existing Classification fetch (owned by Feature `view-market-classification`) |

No new HTTP endpoints. Mapping and Content resolution rules remain those of prior Classification / Content Features.

### Application configuration

None beyond existing Symbol selection / Classification loading owned by the Reading host.

## Data Model

### Classification tabular structure

```text
ClassificationTabularBody
  presentation: "dashboard-factor-score-reason-table"
  groups:
    regime: ClassificationTableGroup
    risk: ClassificationTableGroup
    economic: ClassificationTableGroup
    exposure: ClassificationTableGroup

ClassificationTableGroup
  id: "classification-regime" | "classification-risk" | "classification-economic" | "classification-exposure"
  identityLabel: brand wording (Regime | Risk | Economic | Exposure)
  signals: ClassificationTableRow[]   # may be empty
  optionalGroupScoreViz: null | PerGroupScoreViz   # never Overall rollup

ClassificationTableRow
  factor: mappedSourceString | null      # column header "Factor"; from signal.source
  score: mappedScore | null
  reason: mappedReasonNarrative | null  # Content-resolved display string
  optionalRowScoreViz: null | PerRowScoreViz
  shell: brand TableRow

Forbidden nodes: OverallScore, OverallAssessment, Synthesis, PrimaryClassification, SecondaryClassification, countOnlySummary
```

### Content binding

| Source | Consumed as |
|--------|-------------|
| VM `regime` / `risk` / `economic` / `exposure` arrays | ClassificationTableGroup.signals |
| Per-signal `source`, `score`, `reason` | Table row cells (reason already display string from Content boundary) |
| Empty arrays | Group label + empty table / empty-group copy |

### Attention / layout structure (observable)

| Priority (Reading) | Content | Notes |
|--------------------|---------|-------|
| P1 | Analysis Assessment cards | Hero interpretation (unchanged) |
| P3 | Classification tabular body | Compact adjacent packaging |
| — | Evidence / Market Data / Diagnostics | Not owned by this Feature |

Relative allocated space: Classification **small**; Analysis **extra large**. Table typography and padding shall not match Assessment card prominence.

### Ownership invariants (observable)

| Invariant | Rule |
|-----------|------|
| Four groups | Regime, Risk, Economic, Exposure always represented when body succeeds |
| Tabular primary | Factor/Score/Reason table is the body scanning unit |
| No rollup | No unit labeled Overall Score, Overall Assessment, or Synthesis |
| Classification out of Assessments | Classification Region is not a child of Assessments |
| Sibling surfaces untouched | Hero, chrome, Analysis cards, Market Data row not restyled |

### Screen state (host-owned)

| State | Classification table behavior |
|-------|-------------------------------|
| `idle` | No successful table body claim (REQ-022) |
| `loading` | Host loading chrome; no false success table (REQ-020) |
| `success` | Tabular body with four groups; rows as data allows |
| `error` | Host error + retry; no parallel success table claim (REQ-021) |

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| No Symbol / idle | Selection empty | Host empty/prompt; no success table (REQ-022) | User selects Symbol |
| Classification fetch loading | Host status | Existing loading (Skeleton); do not claim success table (REQ-020) | Wait |
| Classification fetch failure | Host / prior Feature error | Existing error + retry (REQ-021) | Retry via host |
| Empty signal arrays | Valid mapped VM | Success packaging; empty groups still labeled (REQ-014) | None required |
| Partial cells on a signal | Some fields null | Row with available cells; omit missing cells (REQ-015) | None required |
| Stale Classification response | Host stale-ignore | Table follows current Symbol only | None |
| Missing reason narrative | Mapper supplied fallback per prior Features | Bind VM string only | Prior Feature contracts |
| No brand Gauge export | Kit lacks viz primitive | Omit optional viz; Score column only (NFR-011) | None |
| Attempt Overall / Synthesis / nested Classification | Design / review gate | Not allowed | Spec + Reviewer reject |

Validation rules:

- Tabular packaging uses brand `Table` for signal rows when signals exist (REQ-001, REQ-008).
- Every displayed signal row includes available factor/source, score, and reason cells (REQ-003).
- Classification not rendered as a child of Assessments (REQ-006).
- No Region/unit labeled Overall Score, Overall Assessment, or Synthesis (REQ-007, REQ-009).
- Body is not solely a count summary when signals exist (REQ-004).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a **UI composition restyle** of existing Classification body: prefer extending `src/features/reading-classification-body/` component tests. Do **not** re-scaffold mapper/fetch suites unless a thin table-row adapter is introduced (then unit-test cell omission only). Do **not** duplicate full Classification mapper fail-closed suites. No E2E, MSW, coverage %, mutation, or new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Factor/Score/Reason table present | Component | Success fixture: table (or role=table) with column headers from `getMessage` / brand wording; ≥1 signal row with fixture source, score, reason visible | Extend `src/features/reading-classification-body/*.test.tsx` (prefer existing module) |
| Four dimension groups | Component | Accessible names / labels for Regime, Risk, Economic, Exposure under Classification body; empty-group fixture still shows four groups | same |
| Omit unavailable cells | Component | Fixture with partial signal fields → row present; missing cell content absent; Reading does not error | same |
| Not count-only summary | Component | Success with signals asserts table cells for source/score/reason; sole “N signals” count is not the only body content | same |
| No Overall / Synthesis / rollup viz | Component | No unit labeled Overall Score, Overall Assessment, or Synthesis; optional viz (if present) count ≤ signal/group count, not one Symbol-wide hero | same |
| Compact subordinate / adjacent | Component | Classification not marked primary; remains associated with Analysis (shell adjacency preserved) | same or extend Reading shell tests |
| Not nested under Assessments | Component | Assessments tree has no Classification child; Classification Region remains Reading sibling | same or extend Analysis composition tests |
| Brand Table / Card / Text | Reviewer + light UI | Imports from `@maguer/market-data-brand/ui`; rendered table structure; no parallel table primitive | Reviewer; optional render smoke |
| Loading / error usable | Component / host | Extend existing Reading/Classification state-machine: loading visible; error + retry re-invokes loader; idle does not claim success table | extend existing Reading / Classification screen tests |
| Catalog-linked labels | Component | Column headers and group labels via brand `wording` / `getMessage`; reason asserts fixture VM string | same |
| No new Classification API | Reviewer | Reuses existing classification fetch/map | Reviewer |
| No Tailwind / no third-party gauge lib | Reviewer | No utility `className` chrome; no new gauge/chart package for Classification viz | Reviewer |
| Sibling surfaces untouched | Reviewer | No unrelated edits to hero, chrome, Analysis cards, Market Data row | Reviewer |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 Factor/Score/Reason table | Yes — composition tests (table headers + rows) |
| AC-002 factor/source, score, reason per row | Yes — success fixture with catalog-linked labels + fixture reason |
| AC-003 viz not Overall rollup | Yes — absence asserts + optional viz scope asserts |
| AC-004 compact subordinate / adjacent | Yes — prominence + shell adjacency |
| AC-005 not nested under Assessments | Yes — ownership boundary asserts |
| AC-006 brand Table/Card/Text | Reviewer (required) + light UI smoke |
| AC-007 locale / Content-resolved copy | Yes — catalog-linked headers + fixture reason string |
| AC-008 four groups; not count-only | Yes — four group labels + packaging fields when signals exist |
| AC-009 loading / error usable | Yes — extend host state-machine oracles |
| AC-010 sibling surfaces not redesigned | Reviewer (no unrelated surface edits) |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`. Prefer extending existing Classification body tests over a new `src/features/dashboard-classification-surface/` test island unless the restyle module must live there for isolation — default is extend `reading-classification-body`.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared domain labels. Reuse existing Classification column keys when semantics match. Signal **reason** narrative is **not** authored here — it comes from the Classification view-model string (Content-resolved when MessageRefs were provided by prior Features).

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.regime` | `@maguer/market-data-brand` wording | Regime group label |
| `labels.risk` | brand wording | Risk group label |
| `labels.economic` | brand wording | Economic group label |
| `labels.exposure` | brand wording | Exposure group label |
| `common.loading` / `common.error` / `common.retry` | brand wording | Existing host loading/error chrome only |

### Feature keys to add or change

Prefer reusing existing keys from Features `view-market-classification` and `reading-classification-body` when column semantics match.

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `viewMarketClassification.source` (reuse) or `readingClassification.factor` | Factor | `src/locales/en.json` | Factor column header (maps to signal `source`) |
| `viewMarketClassification.score` (reuse) or `readingClassification.score` | Score | `src/locales/en.json` | Score column header |
| `viewMarketClassification.reason` (reuse) or `readingClassification.reason` | Reason | `src/locales/en.json` | Reason column header |
| `readingClassification.emptyGroup` (reuse if present) | No signals for this dimension. | `src/locales/en.json` | Empty dimension group body |
| `readingClassification.bodyLabel` (reuse if present) | Classification signals | `src/locales/en.json` | Optional accessible name for tabular body |

If reusing `viewMarketClassification.source`, the **column header** may read **Factor** per dashboard mockup while the cell still binds `source` — add `readingClassification.factor` only when “Source” is not the desired header copy.

Do **not** add keys named Overall Score, Synthesis, Primary Classification, Secondary Classification, Tags, or Categories. Do not use “Asset”. Do not hardcode reason narrative English in components.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | ClassificationTabularBody with brand `Table` primary structure |
| REQ-002 | Four ClassificationTableGroup units preserved |
| REQ-003 / REQ-019 | Table row cells: factor←source, score, reason |
| REQ-004 | Bind VM reason; anti count-only |
| REQ-005 / REQ-017 | Compact subordinate tabular density vs Analysis cards |
| REQ-006 | Ownership boundary: not nested under Assessments |
| REQ-007 / REQ-009 | Forbidden Overall / Synthesis; optional viz per row/group only |
| REQ-008 / NFR-002 / NFR-006 / NFR-009 | Brand UI primitives table; no parallel table system |
| REQ-010 / NFR-005 | Copy / Wording keys; VM reason binding |
| REQ-011 / REQ-018 / NFR-010 | Restyle body only; sibling surfaces out of scope |
| REQ-012 | Reuse GET classification + existing VM |
| REQ-013 / REQ-020 / REQ-021 / REQ-022 | Host-owned idle / loading / error |
| REQ-014 | Empty groups still labeled |
| REQ-015 | Cell omit-when-absent |
| REQ-016 | No Analysis/Evidence/Market Data/Diagnostics ownership |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines |
| NFR-007 | reading-contract + analysis-contract nesting rules |
| NFR-008 | PROJECT_ROOT scope; adopted UX contracts only |
| NFR-011 | Gauge only if brand export; else omit |
| NFR-012 | No Figma pixel-polish gate |
