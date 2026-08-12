# Requirements

## Overview

Dashboard App Chrome adapts the shared application layout (`AppLayout` / brand `AppShell` family) to dashboard-mockup surface fidelity. The frontend depends on published `@maguer/market-data-brand@^0.2.0` (or newer compatible) so dashboard surface-kit exports are available. Chrome presents a slim header (`AppHeader` / `AppHeaderBar` with `density="slim"`), brand mark and product name, Reading-primary navigation, brand `ThemeToggle`, optional breadcrumb that does not revive competing equal destinations, and quiet footer status via brand `StatusFooter` / `LiveStatus` (date, source, Live). Symbol Reading remains the primary product surface per `knowledge/ux/reading-contract.md`. Existing Symbol selection, loading, and error flows on Reading stay usable. Chrome styling uses brand tokens/CSS variables and UI components only.

## Goals

- Consume `@maguer/market-data-brand@^0.2.0` (or newer compatible) so dashboard kit primitives (`ThemeToggle`, `StatusFooter`, `LiveStatus`, slim header density) are available to the app.
- Present slim app chrome matching dashboard-mockup header density: brand mark + product name as primary chrome identity signals.
- Keep Symbol Reading as the sole primary product surface for Symbol inspection (no resurrecting Market Data / Analysis / Classification as equal peer destinations).
- Expose theme switching through brand `ThemeToggle` only (no ad-hoc FE theme control).
- Allow optional breadcrumb chrome that does not reintroduce competing equal destinations.
- Show quiet footer chrome for date, source, and Live/status via brand `StatusFooter` / `LiveStatus`.
- Style chrome exclusively with brand tokens/CSS variables and brand UI components (no second FE token set or Tailwind design system).
- Preserve Symbol selection, loading, and error usability on the Reading surface.
- Resolve all user-facing chrome labels from locale catalogs / brand wording (no hardcoded designed English in components).

## Functional Requirements

```text
REQ-001

WHEN this Feature is implemented, THE SYSTEM SHALL depend on `@maguer/market-data-brand@^0.2.0` (or a newer version compatible with that range) so that dashboard surface-kit exports required by this Feature are available to the application.
```

```text
REQ-002

WHILE the shared application layout is visible, THE SYSTEM SHALL present app header chrome using brand `AppHeader` / `AppHeaderBar` with density set to `slim`.
```

```text
REQ-003

WHILE the shared application layout is visible, THE SYSTEM SHALL present the brand mark and the Market Data product name as primary chrome identity signals in the slim header.
```

```text
REQ-004

WHILE the shared application layout is visible, THE SYSTEM SHALL keep Symbol Reading as the sole primary product navigation destination for Symbol inspection, and SHALL NOT present Market Data, Analysis, and Classification as equal peer primary destinations.
```

```text
REQ-005

WHILE the shared application layout is visible, THE SYSTEM SHALL present a theme toggle control implemented with brand `ThemeToggle`, and SHALL NOT introduce a separate ad-hoc frontend theme control for the same role.
```

```text
REQ-006

IF optional breadcrumb chrome is rendered in the application layout, THEN THE SYSTEM SHALL NOT use that breadcrumb to reintroduce Market Data, Analysis, or Classification as equal peer product destinations competing with Symbol Reading.
```

```text
REQ-007

WHILE the shared application layout is visible, THE SYSTEM SHALL present quiet footer (or equivalent quiet chrome) that shows date, source, and Live/status using brand `StatusFooter` and/or `LiveStatus`.
```

```text
REQ-008

WHEN styling application chrome for this Feature, THE SYSTEM SHALL use `@maguer/market-data-brand` tokens/CSS variables and brand UI components only, and SHALL NOT introduce a second frontend token set, a parallel component library, or a Tailwind-based design system for that chrome.
```

```text
REQ-009

WHILE the Symbol Reading surface is available after this Feature, THE SYSTEM SHALL keep Symbol selection usable so the user can choose a supported trading Symbol for the Reading.
```

```text
REQ-010

WHILE a Reading-related data request for the selected Symbol is in progress, THE SYSTEM SHALL present a loading state on the Reading surface.
```

```text
REQ-011

IF a Reading-related data request for the selected Symbol fails, THEN THE SYSTEM SHALL present an error state on the Reading surface with a recovery action that retries the failed request for that Symbol.
```

```text
REQ-012

WHEN no supported trading Symbol is selected, THE SYSTEM SHALL not treat the Reading as a successful Symbol Reading and SHALL present an empty / prompt state that asks the user to select a Symbol.
```

```text
REQ-013

WHILE the shared application layout is visible, THE SYSTEM SHALL keep layout chrome structure (slim header, Reading-primary nav, theme toggle, and status footer) consistent across Reading outlet content, and SHALL NOT restructure that chrome per destination.
```

```text
REQ-014

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode designed English in components.
```

```text
REQ-015

WHEN the user activates brand `ThemeToggle`, THE SYSTEM SHALL apply the selected theme to the application chrome and Reading surface using brand theme/token mechanisms, and SHALL persist the user’s theme preference across reloads within this application.
```

## Non-Functional Requirements

```text
NFR-001

THE SYSTEM SHALL implement this Feature with React 19, TypeScript, and Vite, consistent with knowledge/architecture.md.
```

```text
NFR-002

THE SYSTEM SHALL consume shared UI primitives, tokens/CSS variables, logo, and shared wording from `@maguer/market-data-brand` where applicable, and SHALL NOT fork brand tokens or rewrite shared design-system copy locally.
```

```text
NFR-003

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/reading-contract.md: Symbol (not Asset); Market Data as product brand identity; Reading as the primary surface label for Symbol inspection; Analysis, Classification, and Market Data as Region concepts inside Reading — not as equal peer primary nav destinations.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in `src/locales/en.json` and read them via the application message helpers; shared product identity and shared chrome SHALL prefer `@maguer/market-data-brand` wording exports.
```

```text
NFR-006

WHEN a matching export exists in `@maguer/market-data-brand` UI kit entrypoints, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role (including `AppShell` / `AppHeader` / `AppHeaderBar` / `AppBrand` / `AppNav` / `AppMain`, `ThemeToggle`, `StatusFooter`, `LiveStatus`, and related helpers) and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Chrome IA and Reading primacy SHALL follow knowledge/ux/reading-contract.md and prior Reading-primary navigation decisions (no dependency on sibling-repo brand visual-definition paths).
```

```text
NFR-008

This Feature SHALL NOT change Reading Region body composition (Context Identity enrichment, Analysis Assessments, Evidence depth, Market Data observation body, Classification packaging, or Diagnostics elevation) beyond what is required to host Reading inside the updated chrome (those remain owned by sibling Features).
```

```text
NFR-009

Do NOT put Tailwind / utility `className` strings in this application for chrome styling; brand tokens/CSS variables and brand primitives SHALL provide the visual surface.
```

## Acceptance Criteria

- [ ] AC-001: The app depends on `@maguer/market-data-brand@^0.2.0` (or newer compatible) so dashboard kit exports used by chrome are available.
- [ ] AC-002: App chrome presents a slim header via `AppHeader` / `AppHeaderBar` with `density="slim"`, including brand mark and product name as primary chrome signals.
- [ ] AC-003: Navigation presentation keeps Symbol Reading as the primary product surface (legacy Market Data / Analysis / Classification are not equal peer primary destinations).
- [ ] AC-004: Theme toggle is present and uses brand `ThemeToggle` (no ad-hoc FE theme control for the same role).
- [ ] AC-005: If breadcrumb chrome appears, it does not reintroduce competing equal destinations.
- [ ] AC-006: Footer (or equivalent quiet chrome) shows date/source and Live/status via brand `StatusFooter` / `LiveStatus`.
- [ ] AC-007: Chrome styling uses brand tokens/CSS variables and UI components only — no second FE token set or Tailwind design system.
- [ ] AC-008: Existing Symbol selection, loading, and error flows remain usable on the Reading surface.
- [ ] AC-009: User-facing chrome labels resolve from locale catalogs / brand wording — no hardcoded designed English in components.
- [ ] AC-010: Theme preference selected via `ThemeToggle` persists across application reloads.
