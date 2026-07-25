# Design

## Overview

This Feature introduces a **Symbol Reading workspace shell** that structures the product’s Symbol Reading around six labeled Regions defined by `knowledge/ux/reading-contract.md`: Context, Analysis, Classification, Evidence, Market Data, and Diagnostics. Fidelity is gray-box / structural: labeled Region chrome and spatial hierarchy are required; hi-fi polish and Analysis Region internal Assessment composition are deferred (Feature `reading-analysis-composition`).

The shell reuses existing Symbol selection and Reading-related loading/error behavior so those flows remain usable. Region bodies may host existing product content where it already maps cleanly (e.g. Analysis / Classification / Market Data surfaces) or labeled gray-box placeholders when content composition is out of scope.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Reading surface / route host | Mounts the Reading workspace inside the existing shared application layout; preserves Symbol selection entry and Reading-related status chrome (REQ-011–REQ-014). |
| Reading workspace shell | Composes the six Regions with primary vs supporting bands and relative prominence (REQ-001–REQ-008, REQ-016, REQ-017). |
| Context Region | Identity frame for the selected Symbol (display name / Symbol identity). Gray-box acceptable; must not compete with Analysis for message prominence (REQ-002, REQ-003). |
| Analysis Region | Primary interpretive Region. Hosts existing Analysis content and/or a gray-box slot; largest prominence (REQ-004). Internal Assessment peer composition is **out of scope**. |
| Classification Region | Compact, adjacent packaging Region; hosts existing Classification content and/or gray-box; never equal prominence to Analysis (REQ-005). |
| Evidence Region | Supporting Region; labeled gray-box placeholder acceptable when claim-attached Evidence UI is not yet composed (REQ-006, REQ-010). |
| Market Data Region | Supporting observation Region; hosts existing Market Data content and/or gray-box; never primary interpretation (REQ-006, REQ-016). |
| Diagnostics Region | Cross-cutting trust Region; minimal/quiet on healthy Reading; distinct from Analysis hero message (REQ-007, REQ-010). |
| Locale layer | Feature Region labels in `src/locales/en.json` via `src/i18n/messages.ts`; shared domain labels from `@market-data/brand/wording` (REQ-015). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Six named Regions in one Reading workspace | Adopted Reading contract Layer → Region map | REQ-001, REQ-002 |
| Primary band = Context + Analysis | Initial viewport rule: identity + conclusion without scrolling for primary message | REQ-003, AC-002 |
| Analysis most prominent; Classification compact adjacent | Visual priority and Associated layout kind | REQ-004, REQ-005 |
| Evidence + Market Data supporting after interpretation | Flow and anti Market-Data-first / equal-weight wall | REQ-006, REQ-008, REQ-016 |
| Diagnostics cross-cutting, not hero when healthy | Diagnostics role in contract | REQ-007 |
| Gray-box placeholders allowed | Epic + contract fidelity (structural, not hi-fi) | REQ-010, NFR-007 |
| Defer Analysis internals | Owned by `reading-analysis-composition` / `analysis-contract.md` | REQ-017 scope |
| Preserve selection / loading / error | Explicit Feature acceptance | REQ-011–REQ-014 |

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Page / Reading surface structure | `Page`, `PageHeader`, `PageTitle` (and related Page parts as needed) |
| Region spacing / bands | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Region titles / labels | `SectionHeading`, `Label`, `Text` |
| Optional Region container chrome | `Card`, `CardHeader`, `CardTitle` when a bordered Region aids gray-box scanning — **not** as an equal-weight card wall |
| Symbol selection | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` (reuse existing selection pattern) |
| Loading | `Skeleton` |
| Error chrome | `Alert`, `AlertTitle`, `AlertDescription` |
| Retry | `Button` |
| Compact Classification markers (if shown) | `Badge` when a short token is displayed |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings.

**Explicit exception:** Semantic landmarks for Region bands (e.g. `section` with accessible names) are structural composition. They may be used with brand spacing/typography primitives and tokens; do not invent a parallel CSS design system.

**App shell:** Existing `AppShell` / nav chrome from Feature `app-layout` remains; this Feature does not replace primary product navigation beyond mounting the Reading workspace as the Symbol Reading surface.

### Out of scope (explicit)

- Hi-fi Figma / pixel polish as a delivery gate
- Analysis Region internal composition (peer Assessments, Recommendation/Narrative binding rules) — Feature `reading-analysis-composition`
- New backend APIs, DTO fields, or OpenAPI changes
- Full Evidence depth expansion (Drivers → Features → Contributions) beyond a labeled Region shell
- Content catalog / i18n epic work beyond Region chrome labels needed here
- Replacing shared app-layout destination chrome (Market Data / Analysis / Classification nav) except as needed to host the Reading surface
- Sibling-repo brand `visual-definitions` paths (use adopted `knowledge/ux/reading-contract.md` only)

## Data Flow

1. User opens the Symbol Reading surface inside the shared app layout (REQ-001).
2. If no Symbol is selected → empty / prompt state; no successful Reading body required (REQ-014).
3. User selects a supported Symbol → Reading-related fetch/loading chrome runs as today for the surfaces composed into the Reading (REQ-011, REQ-012).
4. On success → Reading workspace shows Regions; Context + Analysis occupy the primary band; Classification adjacent/compact; Evidence, Market Data, Diagnostics in supporting / cross-cutting positions (REQ-003–REQ-008).
5. On failure → error state + retry remains available (REQ-013).
6. Region bodies render existing mapped content or gray-box placeholders (REQ-010).

```text
[App layout]
    │
    v
[Reading surface]
    │  Symbol selector (existing)
    │  idle | loading | error | success
    v
[Reading workspace shell]
    ├── Primary band
    │     ├── Context Region (identity)
    │     └── Analysis Region (primary / largest)
    ├── Associated
    │     └── Classification Region (compact, adjacent)
    ├── Supporting
    │     ├── Evidence Region
    │     └── Market Data Region
    └── Cross-cutting
          └── Diagnostics Region
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Symbol Reading workspace | Exposes Regions with stable accessible names / labels for Context, Analysis, Classification, Evidence, Market Data, Diagnostics |
| Primary band | Contains Context and Analysis; first Reading content band (document order / layout order) |
| Supporting band | Contains Evidence and Market Data after the primary interpretive content |
| Symbol selection | Same supported-Symbol set and selection control pattern already used by product Reading/analysis surfaces |
| Status chrome | Empty, loading (`Skeleton` / loading copy), error (`Alert` + retry `Button`) |

### Region identity (stable)

| Region id | Label (canonical) | Layout kind | Prominence |
|-----------|-------------------|-------------|------------|
| `context` | Context | Persistent (primary band) | Small frame |
| `analysis` | Analysis | Persistent (primary band) | Extra large / primary |
| `classification` | Classification | Associated (adjacent to Analysis) | Small / subordinate |
| `evidence` | Evidence | Supporting | Large only when expanded; default supporting |
| `market-data` | Market Data | Supporting | Medium; never primary |
| `diagnostics` | Diagnostics | Cross-cutting | Minimal when healthy |

Region ids are implementation identifiers for tests and composition; user-facing labels come from locale / wording (REQ-015).

### External systems

No new HTTP endpoints. Reuse existing market / analysis / classification fetch paths already owned by prior Features when composing Region bodies. Mapping rules for those payloads remain in their Feature specs; this Feature only hosts Regions.

### Application configuration

| Name | Purpose |
|------|---------|
| Existing `SUPPORTED_SYMBOLS` (or equivalent) | Symbols offered by the selector (REQ-011, REQ-014). Do not invent a new symbol-list API. |

## Data Model

### Reading workspace structure

```text
ReadingWorkspace
  selectedSymbol: string | null
  status: "idle" | "loading" | "success" | "error"
  regions:
    context: RegionSlot
    analysis: RegionSlot
    classification: RegionSlot
    evidence: RegionSlot
    marketData: RegionSlot
    diagnostics: RegionSlot

RegionSlot
  id: "context" | "analysis" | "classification" | "evidence" | "market-data" | "diagnostics"
  prominence: "primary" | "associated" | "supporting" | "cross-cutting"
  body: existingFeatureContent | GrayBoxPlaceholder
```

### Screen state (Reading surface)

| State | Condition | UI |
|-------|-----------|-----|
| `idle` | No Symbol selected | Prompt to select a Symbol; Region shell may be absent or inert |
| `loading` | Symbol selected; Reading-related request in flight | Loading chrome |
| `success` | Symbol selected; Reading content available | Full Region workspace with hierarchy |
| `error` | Symbol selected; last request failed | Error chrome + retry |

Transitions mirror existing product screen state machines: `idle` → `loading` on select; `loading` → `success` \| `error`; `error` → `loading` on retry; selection change restarts loading. Stale responses for a prior Symbol must not overwrite the current selection’s state.

### Layout structure (observable)

| Band | Contains | Notes |
|------|----------|-------|
| Primary | Context, Analysis | Must appear before supporting Regions in reading order; Analysis marked primary |
| Associated | Classification | Adjacent to Analysis; not primary |
| Supporting | Evidence, Market Data | After primary interpretive content |
| Cross-cutting | Diagnostics | Present; not the primary band hero when healthy |

No separate Narrative Region and no Overall Score Region nodes exist in this model (REQ-017).

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| No Symbol selected | Selection empty | Empty / prompt state (REQ-014) | User selects a Symbol |
| Network / HTTP failure for Reading-related fetch | Non-2xx or transport failure | Error state with shared error copy | Retry (`common.retry`) for current Symbol (REQ-013) |
| Unusable payload from composed surfaces | Existing mapper fail-closed | Error state (unchanged contract from prior Features) | Retry |
| Stale response | Response ≠ current selection | Ignore; keep current selection state | None |
| Missing Region body composition | Expected for Evidence / Diagnostics / deferred Analysis internals | Labeled gray-box placeholder still exposes the Region (REQ-010) | Later Features fill bodies |
| Missing brand primitive / wording at build time | Import failure | Implementation defect; do not hardcode English substitutes permanently | Fix brand dependency |

Validation rules:

- Exactly six distinct Regions when the successful Reading workspace is shown (REQ-001, REQ-002).
- Analysis is the only Region with `prominence: primary` (REQ-004, REQ-016).
- Market Data must not be placed as the sole content of the primary band (REQ-008, REQ-016).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a **layout / screen** Feature: prefer Reading workspace component tests with strong structural oracles. Do not add mapper/fetch suites unless this Feature changes those modules. No E2E, MSW, coverage %, or new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Six Regions present on success Reading | Layout / screen | Accessible names or Region labels for Context, Analysis, Classification, Evidence, Market Data, Diagnostics all present | `src/features/reading-layout-shell/*.test.tsx` (new) |
| Primary band order | Layout / screen | Context and Analysis appear before Evidence and Market Data in document / reading order | same |
| Analysis prominence | Layout / screen | Analysis Region exposes primary prominence marker / role; Classification does not | same |
| Classification subordinate / adjacent | Layout / screen | Classification labeled Region present; not marked primary; structurally associated with Analysis (same primary cluster or immediate adjacency) | same |
| Anti equal-weight / Market-Data-first | Layout / screen | Market Data not marked primary; not the first Region in the primary band | same |
| No Narrative / Overall Score Region | Layout / screen | No Region labeled as Narrative or Overall Score / Overall State | same |
| Gray-box allowed | Layout / screen | Regions still labeled when body is placeholder | same |
| Idle: no success Reading without Symbol | Screen | Prompt / empty; success Region workspace not claimed without selection | same or extend host screen tests |
| Loading / error / retry usable | Screen | Loading visible while in flight; error + retry re-invokes loader; existing state-machine cases remain green | extend host Reading/analysis screen tests if shell mounts there; else shell tests with injected status |
| Brand primitives / no ad-hoc DS | Reviewer + light UI | Imports from `@market-data/brand/ui`; no Tailwind utility `className` strings for Region chrome | Reviewer; optional smoke that Region headings render |
| Copy from catalogs | Screen / Reviewer | Region labels resolve via `getMessage` / brand `wording`; no hardcoded designed English in feature sources | assert catalog-linked labels in component test |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 six Regions | Yes — layout/screen |
| AC-002 Context + Analysis primary band / order | Yes — layout/screen document order + primary band |
| AC-003 prominence hierarchy | Yes — primary marker + Classification not primary + Market Data/Evidence not primary |
| AC-004 brand tokens/components | Reviewer (required) + optional render smoke |
| AC-005 contract anti-patterns | Yes — order/prominence + absence of Narrative/Overall Score Regions |
| AC-006 selection / loading / error | Yes — screen state machine oracles |
| AC-007 catalog copy | Yes — rendered Region labels from locale/wording keys |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared domain labels; Region chrome names that are Reading-shell-specific live in the app locale catalog.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.symbol` | `@market-data/brand/wording` | Symbol identity labeling in Context / selector chrome |
| `labels.regime` / `labels.risk` / `labels.economic` / `labels.exposure` | `@market-data/brand/wording` | Only if existing Analysis/Classification content inside Regions already uses them |
| `labels.recommendation` | `@market-data/brand/wording` | Only if Recommendation chrome appears inside hosted Analysis content |
| `common.loading` / `common.error` / `common.retry` | `@market-data/brand/wording` | Loading and error chrome |
| `labels.price` / `labels.orderBook` / `labels.candles` | `@market-data/brand/wording` | Only if hosted Market Data content uses them |

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `readingLayout.regionContext` | Context | `src/locales/en.json` | Context Region label |
| `readingLayout.regionAnalysis` | Analysis | `src/locales/en.json` | Analysis Region label |
| `readingLayout.regionClassification` | Classification | `src/locales/en.json` | Classification Region label |
| `readingLayout.regionEvidence` | Evidence | `src/locales/en.json` | Evidence Region label |
| `readingLayout.regionMarketData` | Market Data | `src/locales/en.json` | Market Data Region label |
| `readingLayout.regionDiagnostics` | Diagnostics | `src/locales/en.json` | Diagnostics Region label |
| `readingLayout.selectSymbolPrompt` | Select a Symbol to open a Reading. | `src/locales/en.json` | Empty / idle prompt (sentence case; Symbol capitalized as domain term) |
| `readingLayout.regionPlaceholder` | Content for this Region will appear here. | `src/locales/en.json` | Gray-box body copy when a Region has no composed content yet |

Do not use “Asset” in Region labels or prompts. Do not use “Insights”, “Analytics”, “Tags”, or “Categories” as Region names. Do not invent an “Overall” Region label.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Reading workspace shell exposes six Region slots |
| REQ-002 | Exactly one Context and one Analysis Region in the model |
| REQ-003 | Primary band contains Context + Analysis first |
| REQ-004 | Analysis `prominence: primary` / largest Region |
| REQ-005 | Classification `associated`, compact, adjacent |
| REQ-006 | Evidence + Market Data `supporting` |
| REQ-007 | Diagnostics `cross-cutting`, not primary-band hero when healthy |
| REQ-008 | Document/layout order Context → Analysis → Classification → Evidence → Market Data |
| REQ-009 / NFR-002 / NFR-006 | Brand UI primitives + tokens table; no ad-hoc DS |
| REQ-010 | `GrayBoxPlaceholder` allowed per Region body |
| REQ-011 | Reuse Symbol selector / `SUPPORTED_SYMBOLS` |
| REQ-012 | Loading state on Reading surface |
| REQ-013 | Error + retry on Reading surface |
| REQ-014 | Idle prompt when no Symbol selected |
| REQ-015 / NFR-005 | Feature locale keys + brand wording |
| REQ-016 | Market Data not primary; no equal-weight wall |
| REQ-017 | No Narrative Region; no Overall Score Region; Analysis internals deferred |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines in Copy / Wording |
| NFR-007 | Gray-box fidelity explicit |
| NFR-008 | Adopted `reading-contract.md` only; PROJECT_ROOT scope |
