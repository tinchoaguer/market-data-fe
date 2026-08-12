# Design

## Overview

This Feature upgrades shared application chrome to dashboard-mockup surface fidelity by consuming published `@maguer/market-data-brand@^0.2.0` (or newer compatible) and composing brand AppShell primitives with slim header density, brand mark + product name, Reading-primary navigation, brand `ThemeToggle`, optional non-competing breadcrumb, and quiet `StatusFooter` / `LiveStatus`. Information architecture established by Feature `reading-app-navigation` is preserved: Symbol Reading remains the sole primary product surface for Symbol inspection. Reading Region bodies are not redesigned here.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Package dependency | Declare and resolve `@maguer/market-data-brand@^0.2.0` (or newer compatible) so dashboard kit exports are importable (REQ-001). |
| Shared application layout | Owns slim header, nav, theme toggle, optional breadcrumb, status footer, and content outlet; chrome structure stable across Reading content (REQ-002, REQ-013). |
| Slim header chrome | Brand `AppHeader` / `AppHeaderBar` with `density="slim"`; brand mark + product name via `AppBrand` / logo + wording (REQ-002, REQ-003). |
| Primary navigation | Continues Reading-only primary Symbol-inspection destination; does not resurrect peer trio (REQ-004). |
| Theme control | Brand `ThemeToggle` only; persists preference in this app and applies brand theme tokens to the document/app root (REQ-005, REQ-015). |
| Optional breadcrumb | If rendered, Reading-scoped trail only; no peer destination revival (REQ-006). |
| Status footer | Brand `StatusFooter` and/or `LiveStatus` for date, source, and Live/status quiet chrome (REQ-007). |
| Reading surface host | Existing Reading workspace remains outlet content; selection / loading / error contracts unchanged (REQ-009–REQ-012). |
| Locale layer | Chrome strings via brand wording + `src/locales/en.json` (REQ-014). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Bump to `@maguer/market-data-brand@^0.2.0` | Dashboard kit (`ThemeToggle`, `StatusFooter` / `LiveStatus`, slim density) ships in that published range | REQ-001, AC-001 |
| Slim `AppHeaderBar` density | Matches dashboard-mockup header chrome | REQ-002, AC-002 |
| Keep Reading-primary IA | Prior Feature decision; epic forbids resurrecting peer destinations | REQ-004, AC-003 |
| Brand `ThemeToggle` only | Conventions mandate brand primitives; no ad-hoc theme control | REQ-005, NFR-006 |
| Persist theme in FE | Toggle must remain effective across reloads without inventing a second theme system | REQ-015, AC-010 |
| Optional breadcrumb, Reading-scoped | Mockup may show trail chrome; must not revive equal peer IA | REQ-006, AC-005 |
| Quiet footer via brand status primitives | Date/source/Live are chrome, not Diagnostics hero | REQ-007, AC-006 |
| No Region body redesign | Sibling Features own hero/analysis/observation/classification surface | NFR-008 |

### Brand UI primitives

| Need | Use from `@maguer/market-data-brand` UI kit |
|------|---------------------------------------------|
| App chrome / shell | `AppShell`, `AppHeader`, `AppHeaderBar` (`density="slim"`), `AppBrand`, `AppNav`, `AppMain` |
| Theme switching | `ThemeToggle` |
| Status footer / Live | `StatusFooter`, `LiveStatus` |
| Nav destination control | Existing kit nav/`Button` pattern used with `AppNav` |
| Optional breadcrumb | Brand breadcrumb primitive if exported; otherwise compose with brand `Inline` / `Text` / `Button` only — document any missing primitive as an exception that does **not** invent a parallel FE kit |
| Symbol selection / loading / error | Existing Reading patterns: `Select`, `Skeleton`, `Alert`, `Button` |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings (NFR-009).

**Brand assets (non-ui kit):** Product logo/mark and `product.name` from the brand package wording/logo exports.

**Explicit exception:** None for shell, theme toggle, or status footer when the matching brand exports exist. If an optional breadcrumb primitive is absent from the published kit, FE may compose breadcrumb chrome from existing brand layout/typography primitives only; do not add a custom FE design-system component family.

### Package naming note

Older Features and `knowledge/architecture.md` may still refer to `@market-data/brand`. For this Feature, the npm dependency and imports SHALL use `@maguer/market-data-brand` at `^0.2.0` (or newer compatible). Entry points follow the published package (`/ui`, wording, tokens/CSS). Do not maintain a second parallel brand package dependency for the same roles.

### Scope boundary

**In scope**

- Dependency on `@maguer/market-data-brand@^0.2.0` (or newer compatible)
- Slim header via `AppHeader` / `AppHeaderBar` `density="slim"`
- Brand mark + product name as primary chrome identity
- Preserve Reading-primary nav IA (no peer trio)
- Wire brand `ThemeToggle` + theme preference persistence in this app
- Optional breadcrumb that does not revive peer destinations
- Quiet footer with date/source/Live via `StatusFooter` / `LiveStatus`
- Brand tokens/CSS + brand UI only for chrome styling
- Locale keys for new chrome labels
- Layout tests for chrome composition, IA preservation, theme toggle, footer, copy sourcing
- Preserve Symbol selection / loading / error on Reading

**Out of scope**

- Reading Region body visual fidelity (hero band, Analysis cards, observation row, Classification table) — sibling Features
- New backend APIs or DTO changes
- Resurrecting Market Data / Analysis / Classification as equal peer destinations
- Inventing FE-local token sets, Tailwind design system, or ad-hoc theme controls
- Sibling-repo brand visual-definition paths or Epic coordination artifacts
- Changing Diagnostics Region semantics (footer Live/status is quiet chrome, not Diagnostics elevation)

## Data Flow

1. App boots → resolves `@maguer/market-data-brand@^0.2.0` (or newer compatible); brand tokens/CSS apply; theme preference (if stored) is applied before interactive chrome (REQ-001, REQ-015).
2. Shared layout mounts slim `AppHeaderBar`, brand mark + product name, Reading-primary nav, `ThemeToggle`, optional breadcrumb, `StatusFooter` / `LiveStatus`, and outlet (REQ-002, REQ-003, REQ-004, REQ-005, REQ-007, REQ-013).
3. Outlet hosts Symbol Reading; selection / loading / error paths unchanged (REQ-009–REQ-012).
4. User activates `ThemeToggle` → brand theme updates application surface; preference persisted for subsequent loads (REQ-015).
5. Footer reflects date, source, and Live/status from app-provided values mapped into brand status primitives (REQ-007).

```text
[AppHeaderBar density=slim]
  AppBrand (mark + product.name) | AppNav (Reading) | ThemeToggle
[optional breadcrumb — Reading-scoped only]
[AppMain outlet → Symbol Reading workspace]
[StatusFooter / LiveStatus — date | source | Live]
```

## Interfaces

### Dependency

| Package | Constraint | Purpose |
|---------|------------|---------|
| `@maguer/market-data-brand` | `^0.2.0` (or newer compatible within the Feature acceptance) | Tokens/CSS, wording, logo, AppShell family, `ThemeToggle`, `StatusFooter`, `LiveStatus` |

### Destinations (unchanged IA)

| Destination id | Primary nav? | Behavior |
|----------------|--------------|----------|
| `reading` | **Yes** (sole primary for Symbol inspection) | Symbol Reading workspace |
| `market-data` / `analysis` / `classification` | No | Remain non-peer (redirect into Reading per prior Feature); must not reappear as equal primary nav or breadcrumb peers |

### Public UI surface

- Slim shared layout chrome wrapping Reading.
- Brand mark + Market Data product name in header.
- Reading primary nav with active indication.
- Brand `ThemeToggle` with persisted preference.
- Optional Reading-scoped breadcrumb (or omitted).
- Quiet footer showing date, source, and Live/status via brand status primitives.
- Reading outlet with existing selection / loading / error behavior.

### Theme preference

| Concern | Contract |
|---------|----------|
| Control | Brand `ThemeToggle` only |
| Persistence | Application-local storage (implementation choice: e.g. `localStorage` key owned by layout) |
| Application | Brand-documented theme attribute/class/CSS variable mechanism on the document or app root |
| Default | Brand/package default when no stored preference exists |

### Status footer inputs

| Slot | Meaning | Source guidance |
|------|---------|-----------------|
| Date | Calendar / as-of date shown in quiet chrome | App-supplied formatted date string from locale-aware formatting; label from wording/locale |
| Source | Data source label for the quiet chrome | App-supplied or catalog-linked source label; not a peer destination |
| Live / status | Live indicator / quiet connection status | Brand `LiveStatus` (or `StatusFooter` live slot) with catalog-linked label |

Exact formatting helpers are an implementation choice; observable slots above are fixed.

### External systems

None new. Reading continues to use existing fetch paths. This Feature does not change HTTP contracts.

## Data Model

### Layout / chrome state

```text
AppChromeState
  activeDestination: "reading"
  themePreference: "light" | "dark" | <brand-supported theme id>
  # optional breadcrumb: Reading-scoped segments only, or absent
  statusFooter:
    dateLabel: string
    sourceLabel: string
    liveState: brand LiveStatus state
```

| State field | Meaning |
|-------------|---------|
| `activeDestination` | Primary surface in outlet / nav active mark; Symbol-inspection value remains `reading` |
| `themePreference` | Persisted theme selected via `ThemeToggle` |
| `statusFooter.*` | Values bound into brand status chrome |

Transitions:

- Initial load → restore `themePreference` if present; else brand default; `activeDestination` = `reading` for Symbol inspection.
- User toggles theme → update preference store + apply brand theme mechanism.
- Reading interaction → chrome structure unchanged; outlet state machine unchanged.

No new domain entities for market data Analysis/Classification payloads.

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| Missing / wrong brand package version | Install / import failure | Build or runtime import defect; do not ship ad-hoc FE replacements for kit roles | Fix dependency to `^0.2.0` (or newer compatible) |
| Theme persistence unavailable | Storage write/read fails | Theme still toggles for the session; fall back to brand default on next load if restore fails | Continue with session theme; do not invent a second control |
| Missing footer date/source values | Empty inputs | Quiet footer still mounts; omit empty slots or show calm catalog placeholders — do not hardcode designed English | Supply values when available |
| Reading fetch failure | Existing Reading error path | Error + retry on Reading (unchanged) | Retry current Symbol |
| No Symbol selected | Selection empty | Idle / prompt on Reading (unchanged) | Select Symbol |
| Breadcrumb would point at peer destinations | Design/implementation attempt | Do not render peer destination crumbs; omit breadcrumb or keep Reading-scoped only | Follow REQ-006 |

Validation rules:

- Primary nav must not list Market Data / Analysis / Classification as peers (REQ-004).
- Header must use slim density (REQ-002).
- Theme control must be brand `ThemeToggle` (REQ-005).
- Footer must use brand `StatusFooter` / `LiveStatus` (REQ-007).
- No Tailwind utility `className` chrome styling (NFR-009).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a **layout / chrome** Feature: prefer layout component tests with strong chrome and IA oracles. Extend existing `src/features/app-layout/*.test.tsx`. Extend Reading host tests only where selection/loading/error must stay green after chrome changes. Do not add mapper/fetch suites, E2E, MSW, coverage %, or a new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Brand dependency available for kit imports | Reviewer + install | `package.json` depends on `@maguer/market-data-brand@^0.2.0` (or newer compatible); layout imports kit exports | `package.json` + layout module (Reviewer); no weak `toBeTruthy` copy test |
| Slim header density | Layout | `AppHeaderBar` rendered with slim density (prop or accessible chrome marker documented by brand); brand mark + product name visible | `src/features/app-layout/*.test.tsx` (extend) |
| Reading-primary IA preserved | Layout | Reading nav present; peer Market Data / Analysis / Classification primary nav controls absent | same |
| ThemeToggle present | Layout | Brand `ThemeToggle` control present; activating it changes theme-related attribute/class on root (or documented brand hook) | same |
| Theme persistence | Layout / unit | After toggle, remount/reload harness restores preference | same or small helper unit test colocated with persistence module |
| Optional breadcrumb non-competing | Layout | If breadcrumb rendered, no peer destination controls as equal crumbs; Reading-scoped only or omitted | same |
| Status footer slots | Layout | Date, source, and Live/status visible via `StatusFooter` / `LiveStatus` with catalog-linked labels | same |
| No Tailwind / second token set | Reviewer | No new FE token module / Tailwind chrome; brand CSS/tokens used | Reviewer |
| Catalog-linked chrome copy | Layout | Brand `product.name` and footer/nav labels from wording/`getMessage` | layout test |
| Symbol selection / loading / error usable | Screen | Idle prompt; loading; error + retry still pass | extend existing Reading host tests if chrome mount breaks them |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 brand `^0.2.0` | Yes — dependency + import path (Reviewer + package assert as needed) |
| AC-002 slim header + brand mark/name | Yes — layout |
| AC-003 Reading-primary IA | Yes — layout absences + Reading present |
| AC-004 ThemeToggle | Yes — layout |
| AC-005 breadcrumb non-competing | Yes — layout (assert omission or Reading-scoped only) |
| AC-006 StatusFooter / LiveStatus | Yes — layout |
| AC-007 brand tokens only / no Tailwind DS | Reviewer (conventions); light UI if className regressions appear |
| AC-008 selection / loading / error | Yes — existing/extended host tests |
| AC-009 catalog copy | Yes — rendered chrome from catalogs |
| AC-010 theme persistence | Yes — layout/unit |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand wording for product identity and any shared chrome strings exported by `@maguer/market-data-brand`. Add feature locale keys only for FE-owned chrome labels not present in brand inventory.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `product.name` | Brand wording | Primary brand label in slim header |
| `product.nameShort` | Brand wording | Optional compact brand label if slim chrome requires it |
| `common.loading` / `common.error` / `common.retry` | Brand wording | Unchanged Reading status chrome |
| Shared Live / source / theme labels (if exported) | Brand wording | Prefer brand keys before inventing FE keys |

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `appLayout.navReading` | Reading | `src/locales/en.json` | Keep primary nav label (existing) |
| `appLayout.statusDate` | Date | `src/locales/en.json` | Footer date label **only if** brand wording lacks an equivalent |
| `appLayout.statusSource` | Source | `src/locales/en.json` | Footer source label **only if** brand wording lacks an equivalent |
| `appLayout.statusLive` | Live | `src/locales/en.json` | Live indicator label **only if** brand wording lacks an equivalent |
| `appLayout.themeToggle` | Theme | `src/locales/en.json` | Accessible name for theme control **only if** brand `ThemeToggle` does not supply wording |

Prefer brand-exported keys when present; do not duplicate brand inventory values under new FE keys.

### Terminology constraints

- Product brand in chrome: **Market Data** (`product.name`) — identity only, not a peer destination.
- Primary nav: **Reading** (sentence case).
- Do not use “Asset”, “Insights”, “Analytics”, “Tags”, or “Categories” as chrome destination labels.
- Do not hardcode designed English in components.
- Footer is quiet chrome; do not elevate Live/status into a hero Diagnostics message.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | `package.json` depends on `@maguer/market-data-brand@^0.2.0` (or newer compatible) |
| REQ-002 | `AppHeader` / `AppHeaderBar` with `density="slim"` |
| REQ-003 | `AppBrand` / logo + `product.name` as primary header identity |
| REQ-004 | Preserve Reading-only primary nav; no peer trio |
| REQ-005 | Brand `ThemeToggle` only |
| REQ-006 | Optional breadcrumb Reading-scoped or omitted |
| REQ-007 | Brand `StatusFooter` / `LiveStatus` for date/source/Live |
| REQ-008 / NFR-002 / NFR-009 | Brand tokens/CSS + UI only; no second token set / Tailwind DS |
| REQ-009–REQ-012 | Existing Reading host selection / loading / error / idle preserved |
| REQ-013 | Chrome outside outlet; stable across Reading interaction |
| REQ-014 / NFR-005 | Brand wording + `src/locales/en.json`; no hardcoded English |
| REQ-015 | Persist theme preference and apply via brand theme mechanism |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines in Copy / Wording |
| NFR-006 | Named brand primitives for shell, toggle, status |
| NFR-007 | PROJECT_ROOT + adopted `reading-contract.md` only |
| NFR-008 | Explicit out-of-scope Region body boundaries |
