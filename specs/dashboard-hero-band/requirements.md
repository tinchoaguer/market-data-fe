# Requirements

## Overview

Dashboard Hero Band composes the top Reading band into a single dashboard-mockup **hero**: Symbol Identity (logo / pair / full name as available) adjacent to a compact **observation strip** (price, change with semantic positive/negative emphasis, sparkline, timeframe pills, supporting 24H high/low/vol and last-update fields when available from existing Market Data payloads). Identity remains Context-owned; Context does not own scores, signals, or recommendations. Observation content is not Context-owned and does not re-home Analysis interpretation or Recommendation into Context. Region ownership follows `knowledge/ux/reading-contract.md`. Surface uses `@maguer/market-data-brand@^0.2.0` tokens and UI components (established by Feature `dashboard-app-chrome`). This Feature owns the Reading **hero band composition**, not app chrome.

## Goals

- Present the top Reading band as one hero: Identity adjacent to price observation (not a gray-box Context stub alone).
- Keep Identity content Context-owned (display name / pair / logo as available); forbid scores, signals, and recommendations in Context.
- Show an observation strip with price, change, and supporting 24H high/low/vol / last-update fields when those values are available from existing Market Data payloads (derive when needed; omit when unavailable — no new backend API).
- Emphasize change with brand semantic positive/negative tokens or `Text` / `Badge` tones (no ad-hoc FE color hex).
- Frame the sparkline with brand `ChartFrame` and/or chart CSS variables; control sparkline timeframe with brand `SegmentedControl` / `TimeframeControl` (no ad-hoc FE chart chrome library).
- Preserve Reading Region ownership: do not re-home Analysis interpretation or Recommendation into Context; do not make Context own observation fields.
- Style exclusively with `@maguer/market-data-brand` tokens and UI components.
- Resolve all user-facing labels from locale catalogs / brand wording.
- Use canonical terminology: **Symbol** (never Asset), **Price**, **Context**, **Market Data** (observation), **Analysis**, **Recommendation**.

## Functional Requirements

```text
REQ-001

WHEN a successful Symbol Reading is shown with a selected Symbol, THE SYSTEM SHALL present a top Reading hero band that visually reads as one composition with Symbol Identity adjacent to a price observation strip (not a gray-box Context stub alone).
```

```text
REQ-002

WHILE the hero band is visible on a successful Reading, THE SYSTEM SHALL present Context-owned Identity content for the selected Symbol including display name and/or pair form as available from existing Identity composition, and SHALL present a Symbol logo when a logo asset is available for that Symbol; IF no logo is available, THEN THE SYSTEM SHALL omit the logo without failing the Reading.
```

```text
REQ-003

WHILE Identity is shown in the Context portion of the hero band, THE SYSTEM SHALL NOT present scores, signals, recommendations, Analysis Assessment outcomes, Classification packaging, Evidence depth, or Diagnostics trust elevation as Context-owned content.
```

```text
REQ-004

WHILE the hero band is visible on a successful Reading and Market Data for the selected Symbol is available, THE SYSTEM SHALL present an observation strip adjacent to Identity that shows the current Price for that Symbol.
```

```text
REQ-005

WHILE the observation strip is visible and a price change value can be derived or obtained from existing Market Data payloads for the selected Symbol, THE SYSTEM SHALL present that change in the observation strip; IF change cannot be derived from available payload fields, THEN THE SYSTEM SHALL omit change without failing the Reading.
```

```text
REQ-006

WHEN presenting a non-zero or signed price change in the observation strip, THE SYSTEM SHALL emphasize positive versus negative change using brand semantic positive/negative tokens and/or brand `Text` / `Badge` tone props, and SHALL NOT use ad-hoc frontend color hex values for that emphasis.
```

```text
REQ-007

WHILE the observation strip is visible and supporting 24H high, 24H low, volume, and/or last-update values are available from existing Market Data payloads (including deterministic derivation from candle series when those payloads supply OHLC candles), THE SYSTEM SHALL present each available field in the observation strip; IF a supporting field is not available, THEN THE SYSTEM SHALL omit that field without failing the Reading.
```

```text
REQ-008

WHILE the observation strip is visible and a sparkline series can be derived from existing Market Data candle data for the selected Symbol, THE SYSTEM SHALL present a sparkline framed with brand `ChartFrame` and/or brand chart CSS variables (`--chart-*` or equivalent published chart tokens), and SHALL NOT introduce an ad-hoc frontend chart chrome library for that frame.
```

```text
REQ-009

WHILE the observation strip sparkline (or its timeframe control) is visible, THE SYSTEM SHALL present timeframe selection using brand `SegmentedControl` and/or `TimeframeControl`, and SHALL NOT implement ad-hoc frontend timeframe pill chrome for the same role.
```

```text
REQ-010

WHEN the user selects a timeframe via the hero band timeframe control and a corresponding candle series exists in existing Market Data for the selected Symbol, THE SYSTEM SHALL update the hero sparkline series to reflect that timeframe’s available candle data.
```

```text
REQ-011

THE SYSTEM SHALL treat observation strip fields (price, change, sparkline, timeframe control, 24H high/low/vol, last update) as observation content adjacent to Context Identity, and SHALL NOT assign ownership of those observation fields to the Context Region Identity body.
```

```text
REQ-012

THE SYSTEM SHALL NOT re-home Analysis interpretation (Regime, Risk, Economic, Exposure assessments) or Recommendation into Context or into the Context-owned Identity portion of the hero band.
```

```text
REQ-013

WHEN styling the hero band (Identity and observation strip), THE SYSTEM SHALL use `@maguer/market-data-brand` tokens/CSS variables and brand UI components only, and SHALL NOT introduce a second frontend token set, a parallel component library, or a Tailwind-based design system for that surface.
```

```text
REQ-014

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode designed English in components.
```

```text
REQ-015

THE SYSTEM SHALL compose the hero band inside the existing Symbol Reading workspace (Context Region host and Reading shell from prior Features) and SHALL NOT redefine or replace the Reading-wide Region map (Analysis, Classification, Evidence, Market Data, Diagnostics) owned by Feature reading-layout-shell.
```

```text
REQ-016

THE SYSTEM SHALL derive hero observation values from existing Market Data payloads / view models already consumed by the Reading (Feature view-market-data / reading-market-data-body), and SHALL NOT require a new backend API, DTO field, or OpenAPI change for this Feature.
```

```text
REQ-017

WHILE no Symbol is selected (idle Reading), or while Reading host status is loading or error without a successful Market Data / Identity body, THE SYSTEM SHALL defer to the Reading host’s existing empty / loading / error behavior and SHALL NOT claim a successful hero band observation body without host success.
```

```text
REQ-018

THE SYSTEM SHALL NOT change shared application chrome (slim header, ThemeToggle, StatusFooter / LiveStatus, Reading-primary nav) owned by Feature dashboard-app-chrome beyond what is required to host the Reading hero band inside the existing outlet.
```

```text
REQ-019

THE SYSTEM SHALL keep full Order book and full Candles body presentation in the Market Data Region (owned by Feature reading-market-data-body and subsequent Market Data surface Features); the hero observation strip SHALL remain a compact top-band summary and SHALL NOT replace the Market Data Region as the sole observation surface.
```

## Non-Functional Requirements

```text
NFR-001

THE SYSTEM SHALL implement this Feature with React 19, TypeScript, and Vite, consistent with knowledge/architecture.md.
```

```text
NFR-002

THE SYSTEM SHALL consume shared UI primitives, tokens/CSS variables, logo assets, and shared wording from `@maguer/market-data-brand` at `^0.2.0` (or newer compatible already established by Feature dashboard-app-chrome), and SHALL NOT fork brand tokens or rewrite shared design-system copy locally.
```

```text
NFR-003

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/reading-contract.md: Symbol (not Asset); Price; Context for Identity; Market Data / observation for price and related market fields; Analysis and Recommendation remain outside Context ownership.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in `src/locales/en.json` and read them via the application message helpers; shared product identity and shared domain labels SHALL prefer `@maguer/market-data-brand` wording exports.
```

```text
NFR-006

WHEN a matching export exists in `@maguer/market-data-brand` UI kit entrypoints, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role (including `ChartFrame`, `SegmentedControl` / `TimeframeControl`, `Text`, `Badge`, layout helpers, and related) and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

Region ownership and anti-patterns for this Feature SHALL follow knowledge/ux/reading-contract.md: Context sole owned content is Identity; Analysis remains the primary interpretive Region; Market Data / observation never becomes the primary interpretive message; timeframe controls in the hero are observation chrome for the sparkline, not Identity content.
```

```text
NFR-008

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Hero composition SHALL follow knowledge/ux/reading-contract.md and prior Reading Features (no dependency on sibling-repo brand visual-definition paths; no Epic coordination deliverables in this specification).
```

```text
NFR-009

Do NOT put Tailwind / utility `className` strings in this application for hero band styling; brand tokens/CSS variables and brand primitives SHALL provide the visual surface.
```

```text
NFR-010

This Feature SHALL NOT redesign Analysis Assessment cards, Classification tabular packaging, Diagnostics elevation, or the full Market Data middle observation row beyond composing the top hero band (those remain owned by sibling Features).
```

```text
NFR-011

Plotting geometry inside `ChartFrame` (SVG/canvas path for the sparkline series) MAY be consumer-owned in this app; chart **chrome** (frame, chart tokens, timeframe pills) SHALL remain brand-owned per REQ-008 and REQ-009.
```

## Acceptance Criteria

- [ ] AC-001: The top Reading band visually reads as one hero: identity adjacent to price observation (not a gray-box Context stub alone).
- [ ] AC-002: Identity content remains Context-owned (display name / pair / logo as available); Context does not own scores, signals, or recommendations.
- [ ] AC-003: Observation strip shows price, change, and supporting 24H high/low/vol / last-update fields available from existing Market Data payloads (omit unavailable fields).
- [ ] AC-004: Change emphasis uses brand semantic positive/negative tokens or `Text` / `Badge` tones — no ad-hoc FE color hex.
- [ ] AC-005: Sparkline chrome uses brand `ChartFrame` and/or chart CSS variables; timeframe pills use `SegmentedControl` / `TimeframeControl` — no ad-hoc FE chart chrome library.
- [ ] AC-006: Hero composition does not re-home Analysis interpretation or Recommendation into Context.
- [ ] AC-007: Surface uses `@maguer/market-data-brand` tokens and UI components only.
- [ ] AC-008: User-facing labels come from locale catalogs / brand wording.
- [ ] AC-009: Hero observation values are derived from existing Market Data payloads / view models without a new backend API.
- [ ] AC-010: Idle / loading / error remain owned by the Reading host; no false success hero observation claim without host success.
