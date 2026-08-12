# Design

## Overview

This Feature **restyles** the Market Data Region body (hosted by Feature `reading-layout-shell`, previously filled gray-box by Feature `reading-market-data-body`) into the dashboard-mockup **middle observation row**:

| Panel | Content | Brand primitives |
|-------|---------|------------------|
| **Left — chart panel** | Price/area chart from existing candle series for selected timeframe | `ChartFrame`, chart CSS variables (`--chart-*`), `SegmentedControl` / `TimeframeControl`; consumer-owned area plot inside frame |
| **Right — Market Stats 24H** | Available 24H high, low, volume, and related stats from existing payloads | `Card`, `Text`, `Label` |

Market Data remains a **supporting** Region per `knowledge/ux/reading-contract.md` — secondary exploration beside Evidence, never the primary interpretive message, never labeled Evidence. The compact hero observation strip stays owned by Feature `dashboard-hero-band`; this Feature owns the **full-width middle row** inside the Market Data Region only.

App chrome, Reading hero band, and Analysis Assessment cards are unchanged (Features `dashboard-app-chrome`, `dashboard-hero-band`, `dashboard-analysis-cards`).

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Market Data Region host | Existing Reading shell slot from `reading-layout-shell`; this Feature replaces gray-box Market Data body with dashboard observation row (REQ-001, REQ-013). |
| Observation row composer | Lays out chart panel (left) and Market Stats 24H card (right) as one middle observation row (REQ-001). |
| Observation row mapper | Builds `ObservationRowViewModel` from existing `MarketDataViewModel`: area-chart series points, available timeframes, 24H high/low/volume (derive-or-omit), selected timeframe (REQ-004, REQ-006, REQ-014, REQ-016). |
| Chart panel UI | Renders `ChartFrame` + brand chart tokens; consumer-owned area series; timeframe via `SegmentedControl` / `TimeframeControl` (REQ-002, REQ-003, REQ-005, REQ-006). |
| Market Stats 24H card | Renders brand `Card` with labeled stat rows for available 24H fields (REQ-004). |
| Supporting prominence guard | Market Data not primary; not first in primary interpretive band; not Evidence (REQ-007, REQ-008, REQ-009). |
| Ownership boundary guard | No Analysis / Classification / Evidence / Diagnostics content in observation row (REQ-010). |
| Locale / wording layer | Labels via `src/locales/en.json` + brand wording (REQ-012). |
| Host state | Idle / loading / error remain Reading / Market Data host-owned (REQ-015). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Replace gray-box body with observation row | Feature acceptance: not a gray-box metric dump | REQ-001, AC-001 |
| Chart left, stats card right | Dashboard mockup middle row | REQ-001 |
| `ChartFrame` + `--chart-*`; no FE chart DS | Acceptance + conventions + hero-band precedent | REQ-002, AC-002, NFR-006 |
| Consumer-owned area plot only | NFR-011; chrome stays brand | REQ-003, NFR-011 |
| Stats derive-or-omit from existing VM | No new API; payloads may omit volume | REQ-004, REQ-014, REQ-016 |
| Brand TF controls under Market Data | Reading rule 6: timeframe belongs under Candles / Market Data | REQ-005, REQ-006, REQ-018 |
| Supporting Region; not Evidence | reading-contract P5; evidence-contract boundary | REQ-007, REQ-008, REQ-009, AC-005 |
| Reuse Market Data VM / fetch | view-market-data; no OpenAPI change | REQ-014 |
| Hero band unchanged | Sibling Feature ownership | REQ-017, NFR-010 |
| Host owns idle/loading/error | Acceptance AC-007 | REQ-015 |
| Brand surface only | conventions + dashboard package | REQ-011, AC-006, NFR-002, NFR-009 |

### Brand UI primitives

| Need | Use from `@maguer/market-data-brand/ui` |
|------|----------------------------------------|
| Observation row layout | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Chart chrome | `ChartFrame` and/or published chart CSS variables (`--chart-*` or equivalent) |
| Timeframe pills | `SegmentedControl` and/or `TimeframeControl` |
| Market Stats 24H shell | `Card`, `CardHeader`, `CardTitle`, and related Card parts when exported |
| Stat labels / values | `Text`, `Label`, `SectionHeading` (card title only) |
| Loading (host path) | `Skeleton` (existing host; do not duplicate success claim) |
| Error chrome (host path) | `Alert`, `AlertTitle`, `AlertDescription`, `Button` (existing host path) |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings (NFR-009).

**Package naming:** Use `@maguer/market-data-brand` at `^0.2.0` (or newer compatible already on the app from Feature `dashboard-app-chrome`). Older knowledge docs may still say `@market-data/brand`; imports for this Feature follow the published `@maguer/market-data-brand` entry points (`/ui`, `/wording`).

**Explicit exception (NFR-011):** Area **series plotting** (SVG/canvas path/area inside the frame) may be implemented in this app. Chart **chrome** (frame, chart tokens, timeframe pills) must use brand primitives/tokens. Do not add a third-party chart **chrome** library (axes/frame/tooltip chrome). A minimal plotting helper for geometry only inside `ChartFrame` is allowed if it does not introduce parallel design tokens.

**Supporting-space guidance:** Observation row uses medium allocated space consistent with supporting Regions. Do not scale the chart row to Analysis-competing prominence. Do not style the row like claim-attached Evidence depth.

### Scope boundary

**In scope**

- Restyle Market Data Region body to dashboard middle observation row (chart panel + Market Stats 24H card)
- Map existing Market Data VM to area-chart series + 24H stats (derive-or-omit)
- Brand `ChartFrame` / chart tokens + `SegmentedControl` / `TimeframeControl`
- Brand `Card` / `Text` for Market Stats 24H
- Supporting Region / Evidence-separation guards
- Locale keys for observation-row labels
- Component / unit tests for mapper + observation-row composition oracles
- Preserve host idle/loading/error

**Out of scope**

- App chrome — Feature `dashboard-app-chrome`
- Reading hero band (compact sparkline / top observation strip) — Feature `dashboard-hero-band`
- Analysis Assessment card restyle — Feature `dashboard-analysis-cards`
- Classification Factor/Score/Reason table — Feature `dashboard-classification-surface`
- Evidence Drivers → Features → Contributions — Feature `reading-evidence-composition`
- Diagnostics elevation — Feature `reading-diagnostics`
- Order book tabular presentation (gray-box Bids/Asks tables from `reading-market-data-body`) — not part of dashboard middle observation row acceptance; superseded by this restyle for dashboard fidelity
- Standalone tabular Candles tables as primary Market Data body — superseded by area chart + timeframe control for dashboard fidelity
- New backend APIs, DTO fields, or OpenAPI changes
- Sibling-repo brand visual-definition paths or Epic coordination artifacts
- Hi-fi Figma pixel polish as a delivery gate
- Inventing FE token sets, Tailwind design system, or ad-hoc chart chrome libraries

## Data Flow

1. User opens a successful Symbol Reading; Market Data Region is present from the Reading shell (REQ-013, REQ-015).
2. Existing Market Data mapping supplies `MarketDataViewModel` for the selected Symbol via `GET /markets/{symbol}/market-data` (REQ-014).
3. Observation row mapper derives `ObservationRowViewModel`: area-chart points from selected timeframe candles; available timeframes; 24H high/low (from payload or OHLC derivation); volume when present; omits unavailable stats (REQ-004, REQ-016).
4. Observation row composer renders chart panel (left) and Market Stats 24H card (right) (REQ-001).
5. Chart panel renders area series inside brand `ChartFrame`; timeframe control updates series when user selects a timeframe with data (REQ-002, REQ-005, REQ-006).
6. Market Data stays in the supporting band; Evidence remains a separate explainability Region; Analysis remains primary (REQ-007, REQ-008, REQ-009).
7. Hero band, app chrome, and Analysis cards remain unchanged (REQ-017).
8. Host idle / loading / error states continue to own fetch chrome; no parallel success claim without host success (REQ-015).

```text
[Reading workspace]
  ├── Hero band — dashboard-hero-band (unchanged)
  ├── Analysis + Classification — dashboard-analysis-cards / reading-* (unchanged)
  ├── Supporting band
  │     ├── Evidence Region (unchanged)
  │     └── Market Data Region (this Feature)
  │           └── Middle observation row
  │                 ├── Chart panel (left)
  │                 │     SegmentedControl/TimeframeControl
  │                 │     ChartFrame[ area series — consumer plot ]
  │                 └── Market Stats 24H card (right)
  │                       high | low | volume? | …
  └── Diagnostics (unchanged)

Data (reuse; no new API):
  GET /markets/{symbol}/market-data → MarketDataViewModel → ObservationRowViewModel
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Observation row | On successful Market Data: two-panel row — chart (left), Market Stats 24H card (right) |
| Chart panel | Brand `ChartFrame` with area/price series when candle data exists for selected TF; empty frame acceptable when series absent |
| Timeframe control | Brand `SegmentedControl` / `TimeframeControl`; updates chart series when selection has data |
| Market Stats 24H card | Brand `Card` with labeled rows for each available stat; omit rows when stat unavailable |
| Supporting placement | Market Data Region remains supporting; not primary; not first in primary interpretive band |
| Evidence separation | Observation row does not use Evidence kind labels or claim-attached explainability chrome |
| Forbidden in observation row | Assessment scores, Recommendation, Classification signals, Evidence Drivers/Features/Contributions, Diagnostics elevation |

### Observation row view-model contract (FE)

| Field | Required when | Notes |
|-------|---------------|-------|
| `areaChartPoints` | When selected TF candles exist | Ordered series for area chart (typically closes or midpoints) |
| `availableTimeframes` | When candle groups exist | Opaque TF keys from existing `candlesByTimeframe` |
| `selectedTimeframe` | When TF list non-empty | User selection or deterministic default |
| `high24h` | When derivable | Max high over 24H window or designated series |
| `low24h` | When derivable | Min low over same window |
| `volume24h` | Only if present on payload/VM | Omit if absent — do not invent |
| `lastUpdatedAt` | When usable timestamp exists | Optional stat row; omit if absent |
| `price` | When present on VM | Optional reference in stats card only if design shows current price there; hero owns primary price display — prefer stats card for 24H fields only |

### Derivation rules (deterministic; no new API)

| Observation-row field | Source guidance |
|-----------------------|-----------------|
| Area chart points | Closes (or midpoints) of candles for `selectedTimeframe` from `candlesByTimeframe` |
| Timeframe list | Keys of existing `candlesByTimeframe` / equivalent |
| 24H high / low | Prefer explicit 24H fields if mapped; otherwise derive from OHLC highs/lows of candle series chosen for 24H summary (document chosen series in mapper). If candles empty, omit. |
| Volume | Only if existing payload/VM exposes volume; otherwise omit. |
| Last update | Latest candle `timestamp` or existing as-of field if mapped; otherwise omit. |

Timeframe selection for the observation row is **independent** of the hero sparkline timeframe unless an existing shared state already exists; do not require cross-sync in this Feature.

Exact numeric formatting (decimals, compact volume) is an implementation choice; labels remain catalog-linked.

### External systems

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/markets/{symbol}/market-data` | Existing Market Data fetch (owned by Feature `view-market-data`) |

No new HTTP endpoints.

### Application configuration

| Name | Purpose |
|------|---------|
| Existing `SUPPORTED_SYMBOLS` (or equivalent) | Selected Symbol source |
| Existing Market Data mapper / VM | Source for chart series and stats |

## Data Model

### Observation row structure

```text
ObservationRowComposition
  chartPanel: ChartPanelSection
  statsPanel: MarketStats24hSection

ChartPanelSection
  id: "observation-chart"
  availableTimeframes: string[]
  selectedTimeframe: string | null
  areaChartPoints: number[]   // may be empty (REQ-016)

MarketStats24hSection
  id: "market-stats-24h"
  high24h: number | null
  low24h: number | null
  volume24h: number | null
  lastUpdatedAt: string | null
  // additional stat rows only when mapped from existing VM — do not invent fields
```

### Payload → observation row binding

| Existing Market Data VM source | Observation row presentation |
|--------------------------------|------------------------------|
| `candlesByTimeframe[tf]` | Area chart points for selected `tf` |
| Keys of `candlesByTimeframe` | Timeframe control options |
| OHLC highs/lows (derived or explicit) | Market Stats 24H high / low |
| Volume field when mapped | Market Stats 24H volume row |
| Latest candle timestamp / as-of | Optional last-update row |

### Attention / placement structure (observable)

| Priority | Content | Notes |
|----------|---------|-------|
| Reading P0–P1 | Context + Analysis (incl. hero band) | Primary interpretive band; Market Data must not lead (REQ-008) |
| Reading P4 | Evidence | Explainability; distinct from Market Data (REQ-009) |
| Reading P5 | Market Data observation row | Supporting; medium space (REQ-007) |
| Row internals | Chart panel (left, ~majority width) \| Stats card (right) | Dashboard middle row |

Forbidden: Market Data marked primary; Market Data first in primary interpretive band; Market Data labeled Evidence; timeframe under Context Identity; Assessment/Recommendation values in observation row.

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| Reading host idle or loading | Host status | Observation row success body not claimed until Market Data success | Host selection / wait |
| Market Data fetch failure | Host / prior Feature error state | Host error + retry; do not invent parallel Market-Data-only success row | Retry via host |
| Empty candles for selected TF | Valid mapped payload with empty series | Chart frame + TF control when timeframes exist; empty plot; stats derive-or-omit | User selects another TF |
| 24H stats unavailable | Mapper omit | Stat rows absent; card shell may remain with available rows only | None |
| Volume absent on payload | No volume on VM | Volume row omitted (REQ-004) | None |
| Stale Market Data response | Host stale-ignore | Row follows current Symbol only | None |
| Unknown timeframe after race | TF not in `availableTimeframes` | Fall back to first available TF or omit plot | User reselects |

Validation rules:

- Chart frame and TF pills must import brand primitives (REQ-002, REQ-005).
- Market Stats card must use brand `Card` / `Text` (REQ-004, REQ-011).
- Observation row must not contain Recommendation / Assessment / Evidence kind labels (REQ-009, REQ-010).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This Feature is **observation-row mapper + Market Data Region composition UI**. Prefer unit tests for series/stats derivation and focused component tests for row layout / brand chrome / supporting-Region oracles. Reuse existing Market Data mapper / fetch tests from Feature `view-market-data`; do **not** duplicate full JSON→VM suites unless mapping modules change. Extend existing Reading / Market Data screen tests lightly. No E2E, MSW, coverage %, mutation, or new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Area chart points from selected TF | Unit (observation row mapper) | Known candle fixture → expected `areaChartPoints`; TF switch updates series | `src/features/dashboard-observation-row/*.test.ts` (or colocated mapper) |
| 24H high/low derive or omit | Unit | Fixture with OHLC → expected high/low; empty candles → nulls | same |
| Volume / last update omit-when-absent | Unit | Absent fields → null; present → row value set | same |
| Row shows chart panel + stats card | Component | Success fixture: chart frame region + stats card both present under Market Data Region | `src/features/dashboard-observation-row/*Screen.test.tsx` or extend Reading Market Data body tests |
| Not gray-box metric dump as primary body | Component | Absence of standalone gray-box Order book / tabular Candles as primary Market Data body; observation row structure present | same |
| ChartFrame + chart tokens | Component / Reviewer | Chart panel uses brand frame; no ad-hoc chart chrome library imports | component + Reviewer |
| Timeframe control present | Component | Brand `SegmentedControl` / `TimeframeControl` role/name when timeframes exist | same |
| Market Stats 24H rows | Component | Catalog-linked high/low labels + values from fixture when present | same |
| Supporting / not Evidence | Component | Market Data Region not marked primary/Evidence; no Drivers/Features/Contributions in row | same or Reading shell tests |
| Host loading/error not replaced | Component | Idle/loading/error defer to host; no false success row | extend existing Reading / Market Data state-machine tests |
| Labels catalog-linked | Component | Field labels via `getMessage` / brand `wording` | same |
| Brand primitives / no Tailwind | Reviewer | Imports from `@maguer/market-data-brand`; no utility `className` chrome | Reviewer |
| No new Market Data API | Reviewer | Reuses existing market-data fetch/map | Reviewer |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 chart panel + Market Stats 24H row (not gray-box dump) | Yes — component layout |
| AC-002 ChartFrame + `--chart-*`; consumer plot | Yes — component + Reviewer imports |
| AC-003 stats from payload in brand Card/Text | Yes — mapper + component |
| AC-004 SegmentedControl / TimeframeControl | Yes — component |
| AC-005 supporting; not Evidence | Yes — Region role / absence oracles |
| AC-006 brand tokens/components only | Reviewer (required) + light UI smoke |
| AC-007 host loading/error usable | Yes — extend host state-machine oracles |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`. Prefer extending existing Reading / Market Data test modules when oracles fit there.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared domain labels; observation-row-specific labels live in the app locale catalog.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.price` | `@maguer/market-data-brand` wording | Only if price appears in stats card |
| `labels.candles` | brand wording | Chart accessible name / section when needed |
| `common.loading` / `common.error` / `common.retry` | brand wording | Host path only |

Do **not** use Evidence kind labels, Assessment dimension labels, or “Metrics/Observations” as Market Data section titles.

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `readingObservationRow.chartTitle` | Price chart | `src/locales/en.json` | Accessible name for chart panel / ChartFrame region |
| `readingObservationRow.statsTitle` | Market stats 24H | `src/locales/en.json` | Market Stats 24H card title |
| `readingObservationRow.high24h` | 24H high | `src/locales/en.json` | Stat row label (reuse `readingHero.high24h` if already present and semantically identical — prefer one key) |
| `readingObservationRow.low24h` | 24H low | `src/locales/en.json` | Stat row label (reuse `readingHero.low24h` when shared) |
| `readingObservationRow.volume24h` | 24H volume | `src/locales/en.json` | Stat row label (reuse `readingHero.volume24h` when shared) |
| `readingObservationRow.lastUpdate` | Last update | `src/locales/en.json` | Optional stat row (reuse `readingHero.lastUpdate` when shared) |
| `readingObservationRow.timeframe` | Timeframe | `src/locales/en.json` | Accessible name for observation-row TF control (reuse `readingHero.timeframe` when shared) |
| `readingObservationRow.emptyChart` | No chart data for this timeframe. | `src/locales/en.json` | Empty series message inside chart panel when structure shown but plot empty |

Prefer reusing existing `readingHero.*` keys for identical English when hero and observation row share the same label semantics — do not duplicate conflicting keys. Do not hardcode designed English in components.

Do not use “Asset”, “Ticker” (as UI field label), “Evidence”, “Metrics dashboard”, or “Overall Score” in observation-row chrome. Prefer **Symbol**, **Price chart**, **24H high**, **24H low**, **24H volume**, **Timeframe**.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Observation row composer; chart left + stats card right |
| REQ-002 | `ChartFrame` + chart CSS variables; no FE chart DS |
| REQ-003 | Consumer-owned area plot inside frame |
| REQ-004 | Market Stats 24H `Card` + derive-or-omit stats |
| REQ-005 | `SegmentedControl` / `TimeframeControl` |
| REQ-006 | TF selection updates area chart series |
| REQ-007 | Supporting prominence guard |
| REQ-008 | Placement after Context + Analysis |
| REQ-009 | Evidence separation guard |
| REQ-010 | Ownership boundary / forbidden content |
| REQ-011 / NFR-002 / NFR-006 / NFR-009 | Brand primitives table; no Tailwind |
| REQ-012 / NFR-005 | Copy / Wording keys |
| REQ-013 | Mount in existing Market Data Region host |
| REQ-014 | Reuse GET market-data + existing VM |
| REQ-015 | Host idle/loading/error ownership |
| REQ-016 | Empty series / omit stats without fetch failure |
| REQ-017 / NFR-010 | Sibling Feature boundaries |
| REQ-018 | TF under Market Data, not Context |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines |
| NFR-007 | reading-contract supporting Region rules |
| NFR-008 | PROJECT_ROOT scope |
| NFR-011 | Plotting vs chrome exception |
