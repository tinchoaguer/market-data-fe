# Design

## Overview

This feature introduces a shared application layout that wraps every product destination. The layout chrome presents the Market Data brand (name and logo) and primary navigation for Market Data, Analysis, and Classification. Product views render in a content outlet inside that chrome. Analysis and Classification may show placeholder or stub content until their dedicated features are implemented; navigation to those destinations is in scope for this feature.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| App shell / routing | Mounts the shared layout and maps destinations (Market Data, Analysis, Classification) to views; keeps chrome outside per-screen ownership. |
| Shared application layout | Renders persistent header/nav chrome and a content outlet for the active product view (REQ-001, REQ-006). |
| Brand chrome | Displays Market Data product identity using brand logo and `product.name` as a primary chrome signal (REQ-002). |
| Primary navigation | Three destination controls: Market Data, Analysis, Classification; indicates the active destination (REQ-003, REQ-004, REQ-005). |
| Market Data view | Existing market-data product screen; rendered inside the layout outlet. |
| Analysis destination | Navigable Analysis view; full analysis product behavior is out of scope — placeholder/stub allowed (REQ-007). |
| Classification destination | Navigable Classification view; full classification product behavior is out of scope — placeholder/stub allowed (REQ-007). |
| Locale layer | Feature strings in `src/locales/en.json` via `src/i18n/messages.ts`; shared identity from `@market-data/brand/wording` (REQ-008). |

**Scope boundary:** This feature owns layout chrome, navigation between the three destinations, active-state indication, and stubs for not-yet-built Analysis/Classification destinations. It does not define Analysis or Classification product data, APIs, or domain UI beyond what is required to occupy the outlet after navigation.

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Navigation actions | `Button` for primary nav controls that act as selectable actions |

**Explicit exception (page shell):** Header landmarks, layout regions, and the content outlet are structural composition, not matching DS primitives. Semantic HTML (for example `header`, `nav`, `main`) styled with brand tokens is allowed for that shell, per `knowledge/conventions.md` (token-only styling for layout/structure that is not a DS primitive).

**Brand assets (non-ui kit):** Product logo and shared wording come from `@market-data/brand` (logo export and `@market-data/brand/wording`). Do not fork logo assets or rewrite `product.name` locally.

Native HTML stand-ins for Button (or any other kit role that applies) are forbidden.

## Data Flow

1. User opens the app → shared layout mounts with brand chrome and primary navigation; one product destination is active (default: Market Data unless routing already targets another destination) (REQ-001, REQ-002, REQ-003).
2. Layout renders the active destination’s view in the content outlet.
3. User activates a navigation control → routing/state selects that destination; outlet content updates; chrome structure remains unchanged; active indication updates (REQ-004, REQ-005, REQ-006).
4. If Analysis or Classification content is not yet the full product feature, the outlet still shows a navigable stub/placeholder for that destination (REQ-007).

```text
[Brand chrome + Primary nav] ----active destination----> [Layout outlet]
        |                                                      |
        | user selects Market Data / Analysis / Classification |
        +--------------------- updates ------------------------+
                              |
                              v
              [Market Data view | Analysis stub/view | Classification stub/view]
```

## Interfaces

### Destinations

| Destination id | Nav label (canonical) | Content |
|----------------|----------------------|---------|
| `market-data` | Market Data | Existing Market Data product view |
| `analysis` | Analysis | Analysis product view when available; otherwise placeholder/stub |
| `classification` | Classification | Classification product view when available; otherwise placeholder/stub |

Destination identity is an application routing concern (path segments, route table, or equivalent). Exact URL paths are an implementation choice; the three destinations and their labels are fixed by this design.

### Public UI surface

- Shared layout wrapping all product destinations.
- Primary navigation with exactly three destinations: Market Data, Analysis, Classification.
- Brand signal: Market Data name from brand wording; brand logo from `@market-data/brand`.
- Content outlet that hosts the active destination view.

### External systems

None. This feature does not call backend APIs. Analysis/Classification stubs must not invent API contracts for those Pending features.

## Data Model

### Layout / navigation state

```text
AppLayoutState
  activeDestination: "market-data" | "analysis" | "classification"
```

| State field | Meaning |
|-------------|---------|
| `activeDestination` | Which product destination is shown in the outlet and marked active in navigation |

Transitions:

- Initial load → `activeDestination` set from the current route (or default `market-data` if unspecified).
- User activates a nav control → `activeDestination` becomes that destination; outlet content swaps; chrome structure unchanged.
- Deep link / direct navigation to a destination route → same as activating that destination.

No additional domain entities are introduced by this feature.

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|----------------------|----------|
| Unknown / unmatched destination path | Router falls through or destination id is invalid | Show a safe fallback inside the layout (for example Market Data, or a minimal not-found message in the outlet) without removing chrome | User uses primary nav to pick a known destination |
| Missing brand wording / logo at build time | Import or asset resolution failure | Treat as implementation defect; do not hardcode English product name as a permanent substitute | Fix brand dependency wiring |
| Stub destination with no product feature yet | Expected until Analysis/Classification features ship | Show calm placeholder copy in the outlet; navigation remains available | None required beyond later feature implementation |

Validation rules:

- Navigation must always expose all three destinations (REQ-003, REQ-007).
- Exactly one destination is active at a time for active indication (REQ-005).
- Layout chrome must remain mounted across destination changes (REQ-006).

## Testing Strategy

| Type | Scope | Expectations |
|------|-------|--------------|
| Component | Shared layout | Brand name (from wording) and logo region are present in chrome |
| Component | Navigation | Three destinations are available; activating each updates the outlet content |
| Component | Active state | Active destination is visually distinguishable from inactive ones |
| Component | Chrome consistency | Header/nav structure remains present and unchanged when switching destinations |
| Component | Stubs | Analysis and Classification destinations render placeholder/stub content when full features are absent |
| Component | Copy | Nav and stub strings resolve from brand wording or feature locale keys (no hardcoded English in components) |
| Integration (light) | App entry | Product views (at least Market Data) render inside the shared layout |

Coverage: every REQ-* and NFR-* must have at least one automated test or an explicit verified assertion in component tests. Prefer observable UI behavior over implementation internals.

## Copy / Wording

Follow `knowledge/writing/` (mirrored from `@market-data/brand`).

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `product.name` | `@market-data/brand/wording` | Primary brand label in layout chrome |
| `product.nameShort` | `@market-data/brand/wording` | Optional compact brand label if space-constrained chrome is needed |

### Feature keys to add or change

| Key | English | File |
|-----|---------|------|
| `appLayout.navMarketData` | Market Data | `src/locales/en.json` |
| `appLayout.navAnalysis` | Analysis | `src/locales/en.json` |
| `appLayout.navClassification` | Classification | `src/locales/en.json` |
| `appLayout.analysisPlaceholder` | Analysis is not available yet. | `src/locales/en.json` |
| `appLayout.classificationPlaceholder` | Classification is not available yet. | `src/locales/en.json` |

Do not use brand CTA strings (`cta.viewMarket`, `cta.viewAnalysis`, `cta.viewClassification`) as primary nav labels; those are “View …” actions, not the canonical nav terms from terminology.

Terminology constraints: see `knowledge/writing/terminology.md`. Prefer brand `wording` for product identity; keep layout-specific nav and placeholder copy in this app’s catalogs. Do not use “Insights”, “Analytics”, “Tags”, or “Categories” as primary nav labels. Do not use “Market Information” or “MarketData” as the display brand name.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Shared application layout with content outlet wraps all product destinations |
| REQ-002 | Brand chrome uses `@market-data/brand` logo and `product.name` |
| REQ-003 | Primary navigation exposes Market Data, Analysis, and Classification |
| REQ-004 | Destination activation updates routing/state and outlet content |
| REQ-005 | `activeDestination` drives visual active indication on the matching nav control |
| REQ-006 | Header/nav live in the shared layout outside per-screen trees; destination changes only swap outlet content |
| REQ-007 | Analysis and Classification destinations render placeholder/stub views until those features ship |
| REQ-008 | Brand wording + `src/locales/en.json` / message helpers; no hardcoded UI English |
| NFR-001 | React 19 + TypeScript + Vite per architecture |
| NFR-002 | Consume `@market-data/brand` tokens, logo, UI kit, and wording |
| NFR-003 | Canonical labels Market Data, Analysis, Classification |
| NFR-004 | Writing guidelines for tone and capitalization |
| NFR-005 | Feature keys in app locale catalog; product identity from brand |
| NFR-006 | Brand `Button` for nav actions; documented shell exception for landmarks/outlet |
