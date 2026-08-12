# Requirements

## Overview

Dashboard Observation Row restyles the Market Data Region body into the dashboard-mockup **middle observation row**: a **price/area chart panel** (left) framed with brand `ChartFrame` and chart CSS variables, plus a **Market Stats 24H** card (right) built from brand `Card` / `Text` primitives showing available 24H statistics (high, low, volume, and related fields when present in existing Market Data payloads). **Timeframe** selection for the chart uses brand `SegmentedControl` / `TimeframeControl`. Plotting geometry inside the frame remains consumer-owned in this app; chart **chrome** is brand-owned. Market Data stays a **supporting** Reading Region — observation, not the primary interpretive message and not Evidence. Surface uses `@maguer/market-data-brand@^0.2.0` tokens and UI components (established by Feature `dashboard-app-chrome`). This Feature owns the Market Data Region **middle observation row restyle only** — not app chrome (Feature `dashboard-app-chrome`), not the Reading hero band (Feature `dashboard-hero-band`), and not Analysis Assessment cards (Feature `dashboard-analysis-cards`).

## Goals

- Present the Market Data Region body as a dashboard middle observation row: chart panel + Market Stats 24H card (not a gray-box metric dump).
- Frame the price/area chart with brand `ChartFrame` and chart CSS variables (`--chart-*`); do not introduce a second frontend chart design system.
- Show available 24H stats (e.g. high, low, volume) from existing Market Data payloads in a Market Stats 24H card using brand `Card` / `Text`.
- Control chart timeframe with brand `SegmentedControl` / `TimeframeControl`.
- Keep Market Data a supporting Region per `knowledge/ux/reading-contract.md` — not the primary interpretive Region and not labeled or styled as Evidence.
- Style exclusively with `@maguer/market-data-brand` tokens and UI components.
- Preserve existing Market Data loading and error usability on the Reading surface.
- Resolve all user-facing labels from locale catalogs / brand wording.
- Use canonical terminology: **Symbol**, **Price**, **Candles**, **Market Data** (observation), **Analysis**, **Evidence**.

## Functional Requirements

```text
REQ-001

WHEN the Market Data Region of a successful Symbol Reading is shown and Market Data for the selected Symbol is available, THE SYSTEM SHALL present a middle observation row layout with a chart panel on the left and a Market Stats 24H panel on the right (not a gray-box metric dump of standalone Price / Order book / Candles tables as the primary Market Data body).
```

```text
REQ-002

WHILE the middle observation row chart panel is visible and candle or price series data for the selected Symbol can be derived from existing Market Data payloads, THE SYSTEM SHALL present a price/area chart inside brand `ChartFrame` using brand chart CSS variables (`--chart-*` or equivalent published chart tokens), and SHALL NOT introduce an ad-hoc frontend chart chrome library or a second frontend chart design system for that frame.
```

```text
REQ-003

WHILE the chart panel is visible, THE SYSTEM SHALL implement series plotting geometry (area/path/points) as consumer-owned rendering inside the brand `ChartFrame`, and SHALL keep chart chrome (frame, chart tokens, timeframe control chrome) brand-owned per REQ-002.
```

```text
REQ-004

WHILE the middle observation row is visible and a Market Stats 24H card is shown, THE SYSTEM SHALL present available 24H statistics (including high, low, and volume when present in existing Market Data payloads or deterministically derivable from candle OHLC series) inside a brand `Card` using brand `Text` and/or `Label` for field labels and values; IF a stat is not available, THEN THE SYSTEM SHALL omit that stat without failing the Reading.
```

```text
REQ-005

WHILE the chart panel (or its timeframe control) is visible, THE SYSTEM SHALL present timeframe selection using brand `SegmentedControl` and/or `TimeframeControl`, and SHALL NOT implement ad-hoc frontend timeframe pill chrome for the same role.
```

```text
REQ-006

WHEN the user selects a timeframe via the observation-row timeframe control and a corresponding candle series exists in existing Market Data for the selected Symbol, THE SYSTEM SHALL update the area chart series to reflect that timeframe’s available candle data.
```

```text
REQ-007

WHILE the Market Data Region body is visible on a successful Reading, THE SYSTEM SHALL keep Market Data as a supporting Reading Region and SHALL NOT mark Market Data as the primary interpretive Region of the Symbol Reading.
```

```text
REQ-008

WHILE the Market Data Region body is visible on a successful Reading, THE SYSTEM SHALL NOT place Market Data as the first Region in the primary interpretive band; Context and Analysis SHALL remain ahead of Market Data in Reading hierarchy and document / layout order for the primary interpretive message.
```

```text
REQ-009

WHILE the Market Data Region body is visible, THE SYSTEM SHALL keep Market Data visually and semantically distinct from the Evidence Region and SHALL NOT label Market Data observation content (chart, stats card) as Evidence or present Drivers → Features → Contributions as Market Data kinds.
```

```text
REQ-010

THE SYSTEM SHALL NOT present Assessment outcomes, Recommendation stance, Narrative prose, Classification signal lists, Evidence explainability tables, or Diagnostics trust elevation chrome as content owned by the Market Data observation row.
```

```text
REQ-011

WHEN styling the middle observation row (chart panel, Market Stats 24H card, timeframe control), THE SYSTEM SHALL use `@maguer/market-data-brand` tokens/CSS variables and brand UI components only, and SHALL NOT introduce a second frontend token set, a parallel component library, or a Tailwind-based design system for that surface.
```

```text
REQ-012

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode designed English in components.
```

```text
REQ-013

THE SYSTEM SHALL compose the middle observation row inside the existing Market Data Region host from prior Reading Features and SHALL NOT redefine or replace the Reading-wide Region map (Context, Analysis, Classification, Evidence, Diagnostics) owned by Feature `reading-layout-shell`.
```

```text
REQ-014

THE SYSTEM SHALL derive observation-row chart series and Market Stats 24H values from existing Market Data payloads / view models already consumed by the Reading (Feature `view-market-data` / `reading-market-data-body`), and SHALL NOT require a new backend API, DTO field, or OpenAPI change for this Feature.
```

```text
REQ-015

WHEN Market Data content for the selected Symbol is not yet available beyond Region chrome (idle Reading, loading, or error host states), THE SYSTEM SHALL defer to the Reading host’s existing selection / loading / error behavior and SHALL NOT invent a parallel Market-Data-only success body that claims a successful observation row without host success.
```

```text
REQ-016

WHEN a successful Market Data payload yields empty candle series for the selected timeframe or omits volume / explicit 24H fields, THE SYSTEM SHALL still expose the observation row structure (chart frame and stats card shell when applicable) and SHALL omit unavailable series or stat fields without treating empty candle arrays alone as a Market Data fetch failure.
```

```text
REQ-017

THE SYSTEM SHALL NOT change shared application chrome (slim header, ThemeToggle, StatusFooter / LiveStatus, Reading-primary nav) owned by Feature `dashboard-app-chrome`, the Reading hero band owned by Feature `dashboard-hero-band`, or Analysis Assessment card restyle owned by Feature `dashboard-analysis-cards` beyond what is required to host the Market Data observation row inside the existing Reading layout.
```

```text
REQ-018

THE SYSTEM SHALL place timeframe selection for the observation-row area chart under the Market Data Region (Candles observation), and SHALL NOT present that timeframe control as Identity content in the Context Region.
```

## Non-Functional Requirements

```text
NFR-001

THE SYSTEM SHALL implement this Feature with React 19, TypeScript, and Vite, consistent with knowledge/architecture.md.
```

```text
NFR-002

THE SYSTEM SHALL consume shared UI primitives, tokens/CSS variables, and shared wording from `@maguer/market-data-brand` at `^0.2.0` (or newer compatible already established by Feature `dashboard-app-chrome`), and SHALL NOT fork brand tokens or rewrite shared design-system copy locally.
```

```text
NFR-003

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/reading-contract.md: Symbol (not Asset); Price; Candles; Market Data / observation for chart and stats; Analysis and Evidence remain outside Market Data ownership.
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

WHEN a matching export exists in `@maguer/market-data-brand` UI kit entrypoints, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role (including `ChartFrame`, `Card`, `Text`, `SegmentedControl` / `TimeframeControl`, layout helpers, and related) and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

Region ownership and anti-patterns for this Feature SHALL follow knowledge/ux/reading-contract.md: Market Data is supporting observation (P5); Analysis remains the primary interpretive Region; Market Data never becomes the interpretive message; observation row does not replace Analysis prominence.
```

```text
NFR-008

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Market Data observation-row composition SHALL follow knowledge/ux/reading-contract.md only — no dependency on sibling-repo brand visual-definition paths; no Epic coordination deliverables in this specification.
```

```text
NFR-009

Do NOT put Tailwind / utility `className` strings in this application for observation-row styling; brand tokens/CSS variables and brand primitives SHALL provide the visual surface.
```

```text
NFR-010

This Feature SHALL NOT redesign the Reading hero band, app chrome, Analysis Assessment cards, Classification tabular packaging, Evidence composition, or Diagnostics elevation (those remain owned by sibling Features).
```

```text
NFR-011

Plotting geometry inside `ChartFrame` (SVG/canvas area series for the price chart) MAY be consumer-owned in this app; chart **chrome** (frame, chart tokens, timeframe pills) SHALL remain brand-owned per REQ-002 and REQ-005.
```

## Acceptance Criteria

- [ ] AC-001: Market Data Region layout presents a chart panel and a Market Stats 24H panel as a middle observation row (not a gray-box metric dump).
- [ ] AC-002: Price/area chart chrome uses brand `ChartFrame` and chart CSS variables (`--chart-*`) — no second FE chart design system; plotting stays consumer-owned inside the frame.
- [ ] AC-003: Market Stats 24H card shows available 24H stats (e.g. high/low/volume) from existing payloads using brand `Card` / `Text` primitives.
- [ ] AC-004: Timeframe controls use brand `SegmentedControl` / `TimeframeControl`.
- [ ] AC-005: Market Data remains a supporting Region — not the primary interpretive Region and not marked as Evidence.
- [ ] AC-006: Surface uses `@maguer/market-data-brand` tokens and UI components only.
- [ ] AC-007: Existing Market Data loading and error flows remain usable.
