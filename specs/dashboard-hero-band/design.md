# Design

## Overview

This Feature replaces the top Reading **gray-box Context stub** with a dashboard-mockup **hero band**: Context-owned Symbol Identity (logo / pair / full name as available) laid out **adjacent** to a compact **observation strip** (price, change, sparkline, timeframe pills, supporting 24H high/low/vol / last update when available). Visual unity is the hero; **Region ownership stays split** per `knowledge/ux/reading-contract.md`:

| Content | Ownership |
|---------|-----------|
| Logo, display name, pair / base–quote | **Context** (Identity only) |
| Price, change, sparkline, TF pills, 24H stats, last update | **Observation** (Market Data–sourced; not Context-owned) |
| Assessment outcomes, Recommendation | **Analysis** (unchanged; not re-homed into Context) |

App chrome remains owned by Feature `dashboard-app-chrome` (`@maguer/market-data-brand@^0.2.0`). Full Order book / Candles body remains in the Market Data Region (`reading-market-data-body`); Feature `dashboard-observation-row` owns the later middle observation-row restyle. This Feature owns **only** the top hero band composition.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Reading workspace / Context host | Existing Context Region slot from `reading-layout-shell` / `reading-context-identity`; hero band composes Identity into the top band without replacing the Reading Region map (REQ-015). |
| Hero band composer | Lays out Identity adjacent to observation strip as one visual hero (REQ-001). |
| Context Identity body | Reuses / extends Identity from `reading-context-identity` (display name, pair, base/quote, venue when present) plus optional Symbol logo when available (REQ-002, REQ-003). |
| Hero observation mapper | Builds `HeroObservationViewModel` from existing `MarketDataViewModel` (price, candles-by-timeframe); derives change, 24H high/low, volume (if present), last update, sparkline points; omits unavailable fields (REQ-004–REQ-007, REQ-016). |
| Observation strip UI | Renders price, change (semantic tones), supporting stats, sparkline in `ChartFrame`, timeframe via `SegmentedControl` / `TimeframeControl` (REQ-004–REQ-010, REQ-011). |
| Ownership guards | Context excludes scores/signals/recommendations; observation not assigned to Context Identity; Analysis/Recommendation not re-homed (REQ-003, REQ-011, REQ-012). |
| Locale / wording layer | Labels via `src/locales/en.json` + brand wording (REQ-014). |
| App chrome (unchanged) | Slim header / ThemeToggle / StatusFooter owned by `dashboard-app-chrome` (REQ-018). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| One visual hero; split ownership | Feature acceptance + reading-contract Context = Identity only | REQ-001, REQ-011, NFR-007, AC-001, AC-002 |
| Logo optional | Available when asset/catalog exists; omit safely | REQ-002 |
| Observation adjacent, not Context-owned | Avoids violating Context Identity-only rule while matching mockup adjacency | REQ-003, REQ-011, REQ-012 |
| Derive from existing Market Data VM | No new BE/OpenAPI; acceptance “available from existing payloads” | REQ-016, AC-009 |
| Omit unavailable fields | Payloads may lack volume / explicit change / last-update | REQ-005, REQ-007 |
| Brand semantic tones for change | No ad-hoc hex; conventions + acceptance | REQ-006, AC-004 |
| `ChartFrame` + chart tokens; brand TF controls | Dashboard kit in brand ^0.2.0; no FE chart chrome library | REQ-008, REQ-009, AC-005, NFR-006 |
| Sparkline TF is observation chrome | Reading critical rule 6: timeframe not Identity; hero TF does not make Context own timeframe | REQ-009, REQ-011, NFR-007 |
| Keep Market Data Region body | Hero is compact summary; Order book / full Candles stay supporting Region | REQ-019, NFR-010 |
| No Analysis in Context | Contract + Feature acceptance | REQ-012, AC-006 |
| Brand surface only | conventions + dashboard-app-chrome package | REQ-013, AC-007, NFR-002, NFR-009 |

### Brand UI primitives

| Need | Use from `@maguer/market-data-brand` UI kit |
|------|---------------------------------------------|
| Hero / Identity / strip layout | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Typography / labels / values | `Text`, `Label`, `SectionHeading` (Region title remains shell-owned where already present) |
| Change / compact markers | `Badge` and/or `Text` with brand semantic positive/negative tone props |
| Sparkline chrome | `ChartFrame` and/or published chart CSS variables (`--chart-*` or equivalent) |
| Timeframe pills | `SegmentedControl` and/or `TimeframeControl` |
| Optional Identity / strip container | `Card` / related only if needed for scanning — must not become an Analysis-competing hero card wall or re-home Recommendation |
| Logo / mark | Brand logo export and/or Symbol logo asset when available; omit when unavailable |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings (NFR-009).

**Explicit exception (NFR-011):** Sparkline **series plotting** (path/points inside the frame) may be implemented in this app (SVG/canvas). Chart **chrome** (frame, chart tokens, timeframe pills, semantic change tones) must use brand primitives/tokens. Do not add a third-party chart chrome library for frame/axes chrome.

**Package naming:** Use `@maguer/market-data-brand` at `^0.2.0` (or newer compatible already on the app from Feature `dashboard-app-chrome`). Older knowledge docs may still say `@market-data/brand`; imports for this Feature follow the published `@maguer/market-data-brand` entry points.

### Scope boundary

**In scope**

- Top Reading hero band: Identity adjacent to observation strip
- Context Identity presentation in the hero (logo when available; display name / pair from existing Identity)
- Hero observation mapping from existing Market Data VM (price, derived change, 24H high/low, vol if present, last update, sparkline points)
- Brand `ChartFrame` / chart tokens + `SegmentedControl` / `TimeframeControl`
- Semantic positive/negative change emphasis via brand tones
- Locale keys for hero observation labels
- Component / unit tests for mapper + hero composition oracles
- Preserve Reading Region map; preserve host idle/loading/error

**Out of scope**

- App chrome (header, ThemeToggle, StatusFooter) — Feature `dashboard-app-chrome`
- Analysis Assessment card restyle — Feature `dashboard-analysis-cards`
- Full Market Data middle observation row (large area chart + Market Stats card) — Feature `dashboard-observation-row`
- Classification Factor/Score/Reason table restyle — Feature `dashboard-classification-surface`
- New backend APIs, DTO fields, or OpenAPI changes
- Re-homing Analysis / Recommendation / Classification / Evidence / Diagnostics into Context
- Replacing Market Data Region Order book / Candles body with the hero strip alone
- Sibling-repo brand visual-definition paths or Epic coordination artifacts
- Hi-fi Figma pixel polish as a delivery gate
- Inventing FE token sets, Tailwind design system, or ad-hoc chart chrome libraries

## Data Flow

1. User has a successful Symbol Reading with selected Symbol (host from prior Features) (REQ-017).
2. Identity composer (existing `reading-context-identity` path) supplies display name / pair / base–quote / venue; hero attaches logo when available (REQ-002).
3. Existing Market Data mapping supplies `MarketDataViewModel` for the Symbol (REQ-016).
4. Hero observation mapper derives `HeroObservationViewModel`: price; change when derivable; 24H high/low from candle OHLC when available; volume only if present on payload/VM; last update from latest usable timestamp; sparkline points from selected timeframe candle closes (REQ-004–REQ-008, REQ-010).
5. Hero band renders Identity | observation strip as one visual composition; Context-owned portion remains Identity-only (REQ-001, REQ-003, REQ-011).
6. User changes timeframe → sparkline series updates from that timeframe’s candles when present (REQ-009, REQ-010).
7. Analysis / Classification / Evidence / Market Data Region / Diagnostics remain in place; Recommendation stays in Analysis (REQ-012, REQ-015, REQ-019).

```text
[Reading workspace]
  └── Top hero band (this Feature)
        ├── Context Identity (Context-owned)
        │     logo? | displayName | pair / base–quote | venue?
        └── Observation strip (NOT Context-owned)
              price | change (± tones) | 24H high/low/vol? | last update?
              ChartFrame[sparkline] | SegmentedControl/TimeframeControl
  ├── Analysis (+ Recommendation) — unchanged ownership
  ├── Classification — unchanged
  ├── Evidence | Market Data Region (full body) — unchanged ownership
  └── Diagnostics — unchanged

Data (reuse; no new API):
  Selected Symbol → Identity VM (prior Feature)
  GET /markets/{symbol}/market-data → MarketDataViewModel → HeroObservationViewModel
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Hero band | On successful Reading: one top composition with Identity adjacent to observation |
| Context Identity (hero) | Logo (optional), display name and/or pair form; no scores/signals/recommendations |
| Observation strip | Price required when Market Data success; change and supporting fields when available |
| Change emphasis | Brand positive/negative semantic tone on `Text` and/or `Badge` |
| Sparkline | Series inside brand `ChartFrame` / chart tokens when candle series available |
| Timeframe | Brand `SegmentedControl` / `TimeframeControl`; updates sparkline when series exists |
| Forbidden in Context-owned Identity | Price, change, sparkline, TF pills, 24H stats, scores, signals, Recommendation, Assessments |

### Hero observation view-model contract (FE)

| Field | Required when | Notes |
|-------|---------------|-------|
| `price` | Market Data success with price | From existing VM `price` |
| `changeAbsolute` / `changePercent` | When derivable | Prefer percent when both possible; omit both if not derivable |
| `changeDirection` | When change present | `positive` \| `negative` \| `neutral` (zero / flat) |
| `high24h` | When derivable | e.g. max high over candles representing ~24H window or designated series |
| `low24h` | When derivable | e.g. min low over same window |
| `volume24h` | Only if present on payload/VM | Omit if absent — do not invent |
| `lastUpdatedAt` | When a usable timestamp exists | e.g. latest candle timestamp or payload as-of if mapped |
| `sparklinePoints` | When selected TF candles exist | Ordered numeric series (typically closes) |
| `availableTimeframes` | When candle groups exist | Opaque TF keys from existing candles-by-timeframe |
| `selectedTimeframe` | When TF list non-empty | User selection or deterministic default (first available / prior selection) |

### Derivation rules (deterministic; no new API)

| Observation field | Source guidance |
|-------------------|-----------------|
| Price | `MarketDataViewModel.price` |
| Change | Prefer explicit change fields if already mapped; otherwise derive from candle series for selected or default TF (e.g. first vs last close, or close vs prior close). If neither exists, omit. |
| 24H high / low | Prefer explicit 24H fields if mapped; otherwise derive from OHLC highs/lows of the candle series chosen for the 24H summary (document chosen series in mapper). If candles empty, omit. |
| Volume | Only if existing payload/VM exposes volume; otherwise omit. |
| Last update | Latest candle `timestamp` or existing as-of field if mapped; otherwise omit. |
| Sparkline | Closes (or midpoints) of candles for `selectedTimeframe`. |
| Timeframe list | Keys of existing `candlesByTimeframe` / equivalent. |

Exact numeric formatting (decimals, percent signs) is an implementation choice; labels remain catalog-linked.

### External systems

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/markets/{symbol}/market-data` | Existing Market Data fetch (owned by Feature `view-market-data`) |

No new HTTP endpoints. Identity continues to use FE catalog / derivation from Feature `reading-context-identity`.

### Application configuration

| Name | Purpose |
|------|---------|
| Existing `SUPPORTED_SYMBOLS` (or equivalent) | Selected Symbol source |
| Existing Identity display-name / logo catalog (if present) | Optional display name and Symbol logo resolution |

## Data Model

### Hero band structure

```text
HeroBandComposition
  identity: SymbolIdentityViewModel   // Context-owned (from reading-context-identity + optional logo)
  observation: HeroObservationViewModel | null  // null when Market Data not successfully available

SymbolIdentityViewModel  // existing + optional logo
  symbol: string
  displayName: string | null
  pairForm: string | null
  base: string | null
  quote: string | null
  venue: string | null
  logoSrc: string | null   // omit UI when null

HeroObservationViewModel
  price: number
  changeAbsolute: number | null
  changePercent: number | null
  changeDirection: "positive" | "negative" | "neutral" | null
  high24h: number | null
  low24h: number | null
  volume24h: number | null
  lastUpdatedAt: string | null
  availableTimeframes: string[]
  selectedTimeframe: string | null
  sparklinePoints: number[]
```

### Ownership invariants (observable)

| Invariant | Rule |
|-----------|------|
| Context-owned content | Identity fields only (`logoSrc`, names, pair, venue) |
| Observation not Context-owned | Price/change/sparkline/TF/stats live in observation strip node, not Identity node |
| No Analysis in Context | No Regime/Risk/Economic/Exposure/Recommendation values under Context Identity |
| Analysis primacy | Analysis remains primary interpretive Region; hero observation does not become the interpretive message |

### Screen state (host-owned)

| State | Hero band behavior |
|-------|--------------------|
| `idle` | No successful hero observation claim (REQ-017) |
| `loading` | Host loading chrome; no false success observation body |
| `success` | Hero Identity + observation when Market Data VM available; Identity still shown from selection even if some observation fields omit |
| `error` | Host error + retry; no parallel success hero claim |

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| No Symbol / idle | Selection empty | Host empty/prompt; no success hero observation (REQ-017) | User selects Symbol |
| Reading fetch loading / error | Host status | Host Skeleton / Alert + retry | Retry / wait |
| Market Data success but empty candles | Candles empty | Show price if present; omit sparkline / TF / derived 24H as needed | None |
| Change / 24H / vol / last update unavailable | Mapper omit | Field absent from strip; Reading continues | None |
| Logo missing | `logoSrc` null | Identity without logo | Optional catalog/asset later |
| Unknown timeframe after selection race | TF not in `availableTimeframes` | Fall back to first available TF or omit sparkline | User reselects |
| Stale Market Data response | Response ≠ current Symbol | Ignore; keep current selection state (host contract) | None |

Validation rules:

- Context Identity subtree must not contain Recommendation / Assessment score / Classification signal lists (REQ-003, REQ-012).
- Change styling must not use literal hex colors in feature sources for semantic emphasis (REQ-006).
- Sparkline frame and TF pills must import brand primitives (REQ-008, REQ-009).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This Feature is **hero mapper + Reading hero composition UI**. Prefer unit tests for observation derivation and focused component tests for adjacency / ownership / brand chrome oracles. Extend existing Reading / Context / Market Data tests lightly rather than scaffolding map+fetch+screen+copy.source. No new fetch suite unless path encoding changes (it should not). No E2E, MSW, coverage %, mutation, or new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Price maps into hero observation VM | Unit (hero observation mapper) | Exact `price` from Market Data fixture | `src/features/dashboard-hero-band/*.test.ts` (or colocated mapper) |
| Change derived or omitted | Unit | Known candle fixture → expected direction/value; empty candles → nulls; mapping succeeds | same |
| 24H high/low derived or omitted | Unit | Fixture with OHLC → expected high/low; empty → null | same |
| Volume / last update omit-when-absent | Unit | Absent fields → null; present timestamp → `lastUpdatedAt` set | same |
| Sparkline points from selected TF | Unit | Selected TF closes → `sparklinePoints`; TF switch updates series | same |
| Hero shows Identity adjacent to price | Component | Success fixture: Identity (name/pair) and price both visible in top band | `src/features/dashboard-hero-band/*Screen.test.tsx` or extend Reading shell / Context tests |
| Context excludes scores / Recommendation | Component | Absence of Recommendation / Assessment score labels inside Context Identity region | same |
| Change uses semantic tone (not hex) | Component / Reviewer | Rendered change uses brand tone/role; feature sources do not introduce ad-hoc change hex | component + Reviewer |
| ChartFrame + TF control present when series exists | Component | Sparkline framed; timeframe control role/name from brand control | same |
| Labels catalog-linked | Component | Field labels via `getMessage` / brand `wording` (not unbound English) | same |
| Idle/loading: no false success observation | Component / host | Extend existing Reading state-machine oracles; fetch not claimed success without host | extend existing Reading screen tests |
| Brand primitives / no Tailwind utilities | Reviewer | Imports from `@maguer/market-data-brand`; no utility `className` chrome | Reviewer |
| No new Market Data API module | Reviewer | Reuses existing market-data fetch/map | Reviewer |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 hero Identity + observation adjacency | Yes — component |
| AC-002 Context Identity-only (no scores/signals/recommendations) | Yes — component absence oracles |
| AC-003 price + available supporting fields | Yes — mapper + component (price required; supporting omit-safe) |
| AC-004 semantic change tones | Yes — component tone/role + Reviewer (no ad-hoc hex) |
| AC-005 ChartFrame / chart tokens + SegmentedControl/TimeframeControl | Yes — component presence + Reviewer imports |
| AC-006 no Analysis/Recommendation in Context | Yes — component absence |
| AC-007 brand tokens/components only | Reviewer (required) + light UI smoke |
| AC-008 catalog labels | Yes — catalog-linked label asserts |
| AC-009 no new backend API; derive from existing VM | Yes — mapper unit + Reviewer (reuse fetch/map) |
| AC-010 host owns idle/loading/error | Yes — extend host state-machine oracles |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`. Prefer extending existing Reading/Context test modules when oracles fit there.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared domain labels; hero-observation-specific labels live in the app locale catalog.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.symbol` | `@maguer/market-data-brand` wording | Symbol / Identity labeling when needed |
| `labels.price` | brand wording | Price field label in observation strip |
| `labels.candles` | brand wording | Only if referencing candle-derived chrome; do not label observation as Evidence |

Do **not** place `labels.recommendation`, regime/risk/economic/exposure Assessment labels, or Evidence kind labels inside Context Identity.

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `readingHero.change` | Change | `src/locales/en.json` | Label for price change |
| `readingHero.high24h` | 24H high | `src/locales/en.json` | Label for 24H high |
| `readingHero.low24h` | 24H low | `src/locales/en.json` | Label for 24H low |
| `readingHero.volume24h` | 24H volume | `src/locales/en.json` | Label for 24H volume (when shown) |
| `readingHero.lastUpdate` | Last update | `src/locales/en.json` | Label for last-update field |
| `readingHero.timeframe` | Timeframe | `src/locales/en.json` | Accessible name / label for hero TF control when needed |
| `readingHero.sparkline` | Price sparkline | `src/locales/en.json` | Accessible name for sparkline chart region |

Reuse existing `readingContext.*` Identity field labels from Feature `reading-context-identity` where still applicable. Do not hardcode designed English in components.

Do not use “Asset”, “Ticker” (as UI field label), “Advice”, or “Overall Score” in hero chrome. Prefer **Symbol**, **Price**, **Change**, **24H high**, **24H low**, **24H volume**, **Last update**.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Hero band composer; Identity adjacent to observation |
| REQ-002 | Identity + optional `logoSrc` |
| REQ-003 | Context Identity-only forbidden-content list |
| REQ-004 | Observation strip price from Market Data VM |
| REQ-005 | Change derive-or-omit |
| REQ-006 | Brand semantic `Text` / `Badge` tones; no ad-hoc hex |
| REQ-007 | Supporting 24H / vol / last-update derive-or-omit |
| REQ-008 | `ChartFrame` / chart tokens; consumer-owned plot only |
| REQ-009 | `SegmentedControl` / `TimeframeControl` |
| REQ-010 | TF selection updates sparkline points |
| REQ-011 | Split ownership table; observation not Context-owned |
| REQ-012 | No Analysis/Recommendation re-home |
| REQ-013 / NFR-002 / NFR-006 / NFR-009 | Brand primitives table; no Tailwind utilities |
| REQ-014 / NFR-005 | Copy / Wording keys |
| REQ-015 | Mount in existing Reading shell; Region map unchanged |
| REQ-016 | Reuse GET market-data + existing VM |
| REQ-017 | Host idle/loading/error ownership |
| REQ-018 | App chrome out of scope |
| REQ-019 | Market Data Region body retained |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines |
| NFR-007 | reading-contract ownership + TF-not-Identity |
| NFR-008 | PROJECT_ROOT scope; adopted UX contract only |
| NFR-010 | Sibling Feature boundaries |
| NFR-011 | Plotting vs chrome exception |
