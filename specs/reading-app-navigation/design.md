# Design

## Overview

This Feature rewires application information architecture so **Symbol Reading** is the sole primary product destination for inspecting a Symbol. It implements the epic Order 2 decision recorded in `requirements.md`: **Reading replaces** the three equal peer destinations (Market Data, Analysis, Classification). Shared layout chrome (brand identity + primary nav) continues to wrap product content; primary nav no longer lists those three peers. Legacy routes redirect into Reading. The Reading workspace shell (Feature `reading-layout-shell`) and Analysis composition remain the hosted content; this Feature does not redesign Region bodies.

## Product decision (recorded)

| Decision | Detail |
|----------|--------|
| Pattern | **Replace** peer destinations with Reading |
| Primary nav | One primary destination: Symbol Reading (`reading`) |
| Legacy peers | Removed from primary `AppNav` |
| Legacy routes | Redirect to Reading (no competing equal homes) |
| Region model | Unchanged — Market Data / Analysis / Classification are Regions inside Reading per `knowledge/ux/reading-contract.md` |
| Product brand | `product.name` (“Market Data”) stays as header identity only |

Rationale: the adopted Reading contract defines one Symbol workstation. Peer destinations that duplicate Analysis / Classification / Market Data as equal product homes recreate dual IA. Demoting peers while leaving them in primary nav still reads as competing IA. Region composition already merges those concerns.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| App shell / routing | Mounts shared layout; default route → Symbol Reading; maps legacy `market-data` / `analysis` / `classification` paths to redirects into Reading (REQ-001, REQ-003, REQ-004). |
| Shared application layout | Persistent brand chrome + primary nav + content outlet; chrome structure stable across surfaces (REQ-011, REQ-012). |
| Primary navigation | Exposes **Reading** as the sole primary Symbol-inspection destination; does **not** expose Market Data / Analysis / Classification as peer nav items (REQ-002). |
| Active indication | Marks Reading (or other remaining primary surface, if any) as active in nav chrome (REQ-005). |
| Reading surface host | Existing Reading workspace from `reading-layout-shell` (+ Analysis composition) rendered in the outlet; Region hierarchy preserved (REQ-006). |
| Symbol / status chrome | Existing Symbol selection, idle / loading / error / retry on the Reading surface (REQ-007–REQ-010). |
| Locale layer | Nav and redirect-safe copy via `src/locales/en.json` + brand `wording` (REQ-013). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Replace peers (not demote-in-nav) | Resolves dual IA; matches Reading-as-workstation contract | REQ-001, REQ-002, AC-002 |
| Redirect legacy paths | Preserves bookmarks / deep links without keeping peer homes | REQ-004, AC-003 |
| Keep Reading Region hierarchy | Explicit Feature acceptance; owned structure from prior Features | REQ-006, AC-004 |
| Brand name ≠ Market Data destination | Avoids reintroducing peer labeled “Market Data” | REQ-012, AC-008 |
| No Region body redesign | Sibling Features own Evidence / Diagnostics / bodies | NFR-008 |

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| App chrome / shell | `AppShell`, `AppHeader`, `AppHeaderBar`, `AppBrand`, `AppNav`, `AppMain` |
| Nav destination control | `Button` (or kit nav item pattern already used with `AppNav`) |
| Page / Reading host (unchanged) | Existing Reading host primitives (`Page`, `Stack`, …) — do not reimplement |
| Symbol selection / loading / error | Existing Reading patterns: `Select`, `Skeleton`, `Alert`, `Button` |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings.

**Explicit exception:** None for shell chrome when brand `AppShell` / `AppNav` exports exist. Prefer migrating any remaining semantic-only shell from Feature `app-layout` onto brand AppShell primitives as part of this Feature if the layout module is touched for nav IA.

**Brand assets (non-ui kit):** Product logo and `product.name` from `@market-data/brand` / `@market-data/brand/wording`.

### Scope boundary

**In scope**

- Primary nav IA: Reading only for Symbol inspection
- Default route / home → Reading
- Remove peer Market Data / Analysis / Classification nav items
- Redirect legacy peer routes → Reading
- Active state for Reading in chrome
- Locale keys for Reading nav label; retire or stop using peer nav keys as primary destinations
- Layout/component tests for nav IA + redirects + active state + Reading hierarchy smoke
- Preserve Symbol selection / loading / error usability on Reading

**Out of scope**

- Analysis Assessment internals, Evidence Drivers→Features→Contributions, Diagnostics elevation, Context Identity enrichment, Classification/Market Data Region body fidelity (sibling Features)
- New backend APIs or DTO changes
- Hi-fi Figma polish
- Sibling-repo brand `visual-definitions` paths
- Adding a secondary “legacy screens” nav cluster

## Data Flow

1. User opens the app → shared layout mounts; default active destination is Symbol Reading; outlet shows Reading surface (REQ-001, REQ-003, REQ-012).
2. Primary nav shows Reading as the sole primary Symbol-inspection control; active indication marks Reading (REQ-002, REQ-005).
3. User works on Reading → Symbol select / loading / success Regions / error+retry unchanged in contract (REQ-006–REQ-010).
4. User hits legacy `/market-data`, `/analysis`, or `/classification` (or equivalent destination ids) → router redirects to Reading; outlet shows Reading; active indication is Reading (REQ-004, REQ-005).
5. Chrome header/nav structure remains mounted across redirects and Reading interaction (REQ-011).

```text
[AppBrand: product.name] + [AppNav: Reading (sole primary)]
                │
                ▼
         [AppMain outlet]
                │
                ├── default / reading  →  [Symbol Reading workspace]
                │                              Regions: Context, Analysis (primary),
                │                              Classification, Evidence, Market Data,
                │                              Diagnostics
                │
                └── legacy market-data | analysis | classification
                         └─ redirect ─→  [Symbol Reading workspace]
```

## Interfaces

### Destinations (after this Feature)

| Destination id | Primary nav? | Nav label (canonical) | Content |
|----------------|--------------|------------------------|---------|
| `reading` | **Yes** (sole primary for Symbol inspection) | Reading | Symbol Reading workspace (`reading-layout-shell` host) |
| `market-data` | No | — | Redirect → `reading` |
| `analysis` | No | — | Redirect → `reading` |
| `classification` | No | — | Redirect → `reading` |

Exact URL path strings remain an implementation choice; destination ids and behavior above are fixed. Do not reintroduce the three peers as primary nav items under different English synonyms (“Insights”, “Analytics”, “Tags”, “Categories”).

### Public UI surface

- Shared layout with brand identity + primary nav containing Reading as the primary Symbol-inspection destination.
- Active visual indication on the Reading nav control when Reading is shown.
- Content outlet hosting the Reading workspace (or redirecting legacy paths into it).
- Reading workspace Region hierarchy unchanged (observable: Analysis primary; Market Data not primary / not first in primary interpretive band).

### External systems

None new. Reading continues to use existing market / analysis / classification fetch paths owned by prior Features. This Feature does not change HTTP contracts.

## Data Model

### Layout / navigation state

```text
AppLayoutState
  activeDestination: "reading"
  # legacy destination ids are not primary-nav selectable states;
  # resolving them sets activeDestination to "reading" via redirect
```

| State field | Meaning |
|-------------|---------|
| `activeDestination` | Primary surface shown in the outlet and marked active in nav; after this Feature the Symbol-inspection value is `reading` |

Transitions:

- Initial load (unspecified or home) → `reading`.
- User activates Reading nav → `reading`.
- Navigation to legacy destination id/path → redirect → `reading`.
- Deep link to Reading → `reading`.

### Reading hierarchy (preserved, not redefined)

Observable constraints from `knowledge/ux/reading-contract.md` / Feature `reading-layout-shell` that this Feature must not break:

| Constraint | Observable |
|------------|------------|
| Analysis primary | Analysis Region remains the primary interpretive Region |
| No Market-Data-first | Market Data is not the primary interpretive Region and not sole content of the primary band |
| Regions present | Context, Analysis, Classification, Evidence, Market Data, Diagnostics remain distinct on successful Reading |

No new domain entities.

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| Legacy peer path | Router matches retired destination | Redirect to Reading; Reading idle/loading/success/error as usual | User continues on Reading |
| Unknown path | Router fall-through | Safe fallback inside layout (prefer Reading) without removing chrome | User activates Reading nav |
| Reading fetch failure | Existing Reading error path | Error + retry on Reading (unchanged contract) | Retry current Symbol |
| No Symbol selected | Selection empty | Idle / prompt on Reading (unchanged) | Select Symbol |
| Missing brand wording / AppShell import | Build / import failure | Implementation defect; do not hardcode English nav permanently | Fix brand dependency |

Validation rules:

- Primary nav must not list Market Data / Analysis / Classification as peer destinations (REQ-002).
- Exactly one primary Symbol-inspection destination is active for indication when on Reading (REQ-005).
- Redirect targets must be Reading, not a stub peer page (REQ-004).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a **layout / navigation** Feature: prefer layout component tests with strong IA oracles. Extend existing `src/features/app-layout/*.test.tsx` (and Reading host tests only where selection/loading/error must stay green). Do not add mapper/fetch suites, E2E, MSW, coverage %, or a new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Reading is primary / default destination | Layout | Initial / home render shows Reading workspace (Region labels or Reading host marker); Reading nav control present | `src/features/app-layout/*.test.tsx` (extend) |
| No peer Market Data / Analysis / Classification nav | Layout | Primary nav does **not** expose those three destination controls as peers (query by accessible name from locale keys) | same |
| Active indication | Layout | Reading nav control marked active when Reading is shown | same |
| Legacy path redirect | Layout / routing | Navigating legacy destination ids/paths results in Reading surface + Reading active | same (router harness already used by layout tests) |
| Reading hierarchy intact | Layout / Reading smoke | On Reading success (or shell mount), Analysis primary; Market Data not primary; Context+Analysis before Market Data in order | extend `reading-layout-shell` or host test lightly — one smoke, not full Region suite redo |
| Symbol selection / loading / error usable | Screen | Idle prompt; loading; error + retry re-invokes loader still pass | extend existing Reading host tests if broken by route mount; else assert host still mounted from layout |
| Catalog-linked nav copy | Layout | Reading nav label from `getMessage` / locale key; brand `product.name` in chrome | layout test |
| Brand AppShell primitives | Reviewer + light UI | Imports from `@market-data/brand/ui`; no native stand-ins for AppShell/AppNav/Button roles | Reviewer |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 Reading primary | Yes — layout default / Reading present |
| AC-002 no peer trio in primary nav | Yes — layout absences |
| AC-003 legacy redirect | Yes — routing/layout |
| AC-004 Region hierarchy intact | Yes — light Reading smoke |
| AC-005 active indication | Yes — layout |
| AC-006 selection / loading / error | Yes — existing/extended host tests |
| AC-007 catalog copy | Yes — rendered nav/brand from catalogs |
| AC-008 brand ≠ peer destination | Yes — brand present + peer Market Data nav absent |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for product identity; Feature nav label for Reading lives in the app locale catalog.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `product.name` | `@market-data/brand/wording` | Primary brand label in layout chrome (identity only) |
| `product.nameShort` | `@market-data/brand/wording` | Optional compact brand label |
| `common.loading` / `common.error` / `common.retry` | `@market-data/brand/wording` | Unchanged Reading status chrome |

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `appLayout.navReading` | Reading | `src/locales/en.json` | Primary nav label for Symbol Reading |

### Feature keys to stop using as primary destinations

| Key | Prior use | After this Feature |
|-----|-----------|--------------------|
| `appLayout.navMarketData` | Peer nav “Market Data” | Not rendered as primary nav; may remain unused or be deleted if unused elsewhere |
| `appLayout.navAnalysis` | Peer nav “Analysis” | Not rendered as primary nav; Analysis remains a **Region** label via `readingLayout.regionAnalysis` |
| `appLayout.navClassification` | Peer nav “Classification” | Not rendered as primary nav; Classification remains a **Region** label via `readingLayout.regionClassification` |
| `appLayout.analysisPlaceholder` / `appLayout.classificationPlaceholder` | Peer stub outlets | Obsolete for primary IA; remove from UI paths (catalog cleanup optional if unused) |

Do not use brand CTA strings (`cta.viewMarket`, `cta.viewAnalysis`, `cta.viewClassification`) as primary nav labels. Do not label the primary destination “Market Data”, “Analysis”, or “Classification”. Do not use “Asset”, “Insights”, “Analytics”, “Tags”, or “Categories” as the Reading nav label. Sentence case for the nav control label (“Reading”).

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Default / primary destination is Symbol Reading |
| REQ-002 | Primary nav exposes only Reading for Symbol inspection; peer trio removed |
| REQ-003 | Reading nav activation shows Reading workspace in outlet |
| REQ-004 | Legacy destination paths redirect to Reading |
| REQ-005 | `activeDestination: "reading"` drives active nav indication |
| REQ-006 | Reading shell hierarchy preserved; no Market-Data-first |
| REQ-007 | Existing Symbol selector remains on Reading host |
| REQ-008 | Existing loading chrome on Reading |
| REQ-009 | Existing error + retry on Reading |
| REQ-010 | Existing idle / prompt on Reading |
| REQ-011 | Shared AppShell chrome outside outlet; stable across redirects |
| REQ-012 | Brand `product.name` + logo as identity; not a peer destination |
| REQ-013 / NFR-005 | `appLayout.navReading` + brand wording; no hardcoded English |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-002 / NFR-006 | Brand AppShell / AppNav / Button; no forks / native stand-ins |
| NFR-003 / NFR-004 | Terminology + writing guidelines in Copy / Wording |
| NFR-007 | Adopted `reading-contract.md` only; PROJECT_ROOT scope |
| NFR-008 | Explicit out-of-scope sibling Feature boundaries |
