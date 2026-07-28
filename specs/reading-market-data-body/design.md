# Design

## Overview

This Feature composes the **internals of the Market Data Region** (hosted by Feature `reading-layout-shell`) per `knowledge/ux/reading-contract.md`: raw observation of **Price**, **Order book** (Bids and Asks), and **Candles** grouped by timeframe for the selected Symbol. Market Data remains a **supporting** Region — secondary exploration, never the primary interpretive message, never marked primary, never first in the primary interpretive band. Observation stays visually distinct from Evidence (`knowledge/ux/evidence-contract.md`: Market Data is not Evidence until cited as a Feature). Fidelity is gray-box / structural; hi-fi polish is out of scope.

Analysis remains the interpretive hero. Market Data answers “What is the market showing?” and must not replace Assessment outcomes or Recommendation.

### Post-ship presentation alignment

Wireframe SoT (Reading shell hosts Market Data as supporting Region beside Evidence): https://www.figma.com/design/opTJ1E7ZHIgpLPQTw1YtKP/Reading-Layout-Wireframe?node-id=0-1

Gray-box fidelity only. Payload orientation (UI model, not a new API map): reuse existing `MarketDataViewModel` (or Reading-hosted equivalent) from Feature `view-market-data` — `price`, `orderBook.bids` / `orderBook.asks`, `candlesByTimeframe[]`.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Market Data Region host | Provided by `reading-layout-shell`; this Feature fills the Market Data Region body only (REQ-011). |
| Market Data body composition | Single observation workspace inside Market Data; owns Price, Order book, and Candles-by-timeframe structure (REQ-001–REQ-003, REQ-016). |
| Price section | Displays current price from existing Market Data view model (REQ-001). |
| Order book section | Displays Bids and Asks levels (REQ-002). |
| Candles section | Displays all candle series grouped by timeframe; timeframe belongs here, not Context (REQ-003, REQ-008). |
| Supporting prominence guard | Market Data not primary; not first in primary interpretive band; not Market-Data-first Reading (REQ-004, REQ-005, REQ-016). |
| Evidence separation guard | Market Data visually and semantically distinct from Evidence; not labeled Evidence (REQ-006, REQ-007). |
| Ownership boundary guard | No Analysis / Classification / Evidence / Diagnostics content owned by Market Data body (REQ-012). |
| Locale layer | Domain labels from brand wording; feature chrome (empty series / timeframe grouping) from app locale when needed (REQ-010). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Fill Market Data Region body only | Shell owns Region map; Reading contract owns observation content | REQ-011 |
| Price + Order book + Candles by TF | Feature acceptance + reading-contract Market Data Region | REQ-001, REQ-002, REQ-003 |
| Supporting / medium; not primary | Reading hierarchy P5; anti Market-Data-first | REQ-004, REQ-005, REQ-016 |
| Distinct from Evidence | Observation ≠ explainability; evidence-contract boundary | REQ-006, REQ-007 |
| Timeframe under Candles | Reading critical rule 6 | REQ-008 |
| Reuse existing Market Data VM | Done Feature `view-market-data`; no new BE/OpenAPI | REQ-014, NFR-009 |
| Brand UI kit for chrome | Conventions + Feature acceptance | REQ-009, NFR-002, NFR-006 |
| Gray-box observation body | Epic fidelity | NFR-007 |
| Host owns idle/loading/error | Avoid parallel success claim | REQ-013 |

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Market Data spacing / sections | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Section / field titles | `SectionHeading`, `Label`, `Text` |
| Observation containers (gray-box scanning) | `Card`, `CardHeader`, `CardTitle` when a bordered unit aids scanning — **not** as a primary equal-weight wall that outranks Analysis or mimics Evidence explainability chrome as claim attachment |
| Order book / candle row lists | `Table`, `TableHeader`, `TableRow`, `TableCell` (and related Table parts) when tabular depth is shown |
| Timeframe / side markers (optional) | `Badge` when a short timeframe or Bids/Asks token is shown |
| Loading (only if Market Data body surfaces local loading independently of host) | `Skeleton` |
| Error chrome (only if Market Data body surfaces local failure independently of host) | `Alert`, `AlertTitle`, `AlertDescription` |
| Retry | `Button` |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings.

**Explicit exception:** Semantic landmarks for Price / Order book / Candles sections (e.g. `section` with accessible names) are structural composition. They may be used with brand spacing/typography primitives and tokens; do not invent a parallel CSS design system.

**Supporting-space guidance:** Prefer medium allocated space consistent with supporting Regions. Do not mirror Analysis peer wall scale. Do not style Market Data to look like claim-attached Evidence depth (Drivers → Features → Contributions).

### Out of scope (explicit)

- Hi-fi Figma / pixel polish as a delivery gate
- Reading-wide Region shell layout (Context, Analysis, Classification, Evidence, Diagnostics placement) — owned by `reading-layout-shell`
- Making Market Data the primary product destination or restoring Market-Data-first Reading IA — owned by `reading-app-navigation` / shell hierarchy
- Evidence Drivers → Features → Contributions — owned by `reading-evidence-composition`
- Citing Market Data as Evidence Features (claim attachment) — Evidence Feature only
- Analysis Assessment outcomes / Recommendation / Narrative — owned by `reading-analysis-composition`
- Classification signal packaging — owned by `reading-classification-body`
- Diagnostics quiet/elevated trust chrome — owned by `reading-diagnostics`
- Context Identity composition — owned by `reading-context-identity` (timeframe must not move into Context)
- New backend APIs, DTO fields, or OpenAPI changes
- Charting terminal / interactive chart library as a delivery gate (gray-box tabular or list presentation of candles by timeframe is sufficient)
- Sibling-repo brand `visual-definitions` paths (use adopted `knowledge/ux/reading-contract.md` only)
- Standalone legacy Market Data screen redesign beyond mounting observation content into the Reading Market Data Region

## Data Flow

1. User opens a successful Symbol Reading; Market Data Region is present from the Reading shell (REQ-011, REQ-013).
2. Market Data Region body mounts observation composition (Price, Order book, Candles) (REQ-001–REQ-003).
3. Existing Market Data mapping (Reading host or reused client from Feature `view-market-data`) supplies `MarketDataViewModel` (or equivalent) for the selected Symbol via `GET /markets/{symbol}/market-data` (REQ-014, NFR-009).
4. Body renders Price; Order book Bids and Asks; Candles grouped by timeframe keys from the view model (REQ-001–REQ-003, REQ-008).
5. Empty bids/asks/candle arrays remain structured sections, not fetch failures (REQ-015).
6. Market Data stays in the supporting band after primary interpretive content; Evidence Region remains a separate explainability Region (REQ-004–REQ-007, REQ-016).
7. Host idle / loading / error states continue to own selection and fetch chrome; this Feature does not invent a parallel success claim without host success (REQ-013).

```text
[Reading workspace — reading-layout-shell]
    ├── Primary interpretive band
    │     ├── Context Region
    │     └── Analysis Region (+ Classification associated)
    ├── Supporting band
    │     ├── Evidence Region (explainability — not this Feature)
    │     └── Market Data Region (this Feature)  [supporting | medium | observation]
    │           └── Market Data body composition
    │                 ├── Price
    │                 ├── Order book → Bids | Asks
    │                 └── Candles → series grouped by timeframe
    └── Diagnostics (cross-cutting — not this Feature)

Data source (reuse; no new API):
  GET /markets/{symbol}/market-data
    → existing mapper (view-market-data)
    → MarketDataViewModel
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Market Data composition | Exactly one composition inside Market Data Region; stable accessible name / label for Market Data body |
| Price | Labeled Price section showing current price value from VM |
| Order book | Labeled Order book with Bids and Asks (tables or gray-box lists) |
| Candles | Labeled Candles with each series grouped under its timeframe key |
| Supporting placement | Market Data Region remains supporting; not primary; not first in primary interpretive band |
| Evidence separation | Market Data body does not use Evidence kind labels (Drivers / Features / Contributions) and does not claim Evidence Region identity |

### Unit identity (stable)

| Unit id | Label (canonical) | Role | Prominence |
|---------|-------------------|------|------------|
| `market-data` | Market Data (Region host; existing shell) | Supporting Reading Region | Supporting (P5 Reading priority) |
| `market-data-composition` | Market Data body | Composition root | Inside Market Data Region |
| `price` | Price | Observation section | Within Market Data |
| `order-book` | Order book | Observation section | Within Market Data |
| `order-book-bids` | Bids | Order book side | Within Order book |
| `order-book-asks` | Asks | Order book side | Within Order book |
| `candles` | Candles | Observation section | Within Market Data |
| `candles-timeframe` | Timeframe group | Candles grouping key | Under Candles only |

Unit ids are implementation identifiers for tests and composition; user-facing labels come from locale / wording (REQ-010). There is **no** Evidence kind id under Market Data.

### External systems

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/markets/{symbol}/market-data` | Existing Market Data fetch (owned by Feature `view-market-data`) |

No new HTTP endpoints. Mapping rules for JSON → `MarketDataViewModel` remain in Feature `view-market-data`; this Feature owns Market Data Region body composition, supporting prominence, Evidence separation, and mounting into the Reading shell.

**Success shape (reuse):** `price: number`; `orderBook.bids` / `orderBook.asks` as `{ price, quantity }[]`; `candles` / `candlesByTimeframe` as timeframe → OHLC candle arrays. Timeframe keys are opaque backend strings; UI groups by those keys without inventing Identity timeframe.

### Application configuration

| Name | Purpose |
|------|---------|
| Existing `SUPPORTED_SYMBOLS` (or equivalent) | Symbols offered by Reading host selection (REQ-013). Do not invent a new symbol-list API. |

## Data Model

### Market Data body structure

```text
MarketDataBodyComposition
  price: PriceSection
  orderBook: OrderBookSection
  candles: CandlesSection

PriceSection
  id: "price"
  value: number | null   // from MarketDataViewModel.price when success

OrderBookSection
  id: "order-book"
  bids: OrderBookLevel[]   // may be empty (REQ-015)
  asks: OrderBookLevel[]   // may be empty (REQ-015)

OrderBookLevel
  price: number
  quantity: number

CandlesSection
  id: "candles"
  series: CandleSeries[]   // grouped by timeframe; empty series allowed (REQ-015)

CandleSeries
  timeframe: string
  candles: Candle[]

Candle
  open: number
  high: number
  low: number
  close: number
  timestamp: string
```

### Payload → Market Data binding (UI model)

| Existing Market Data view-model source | Market Data presentation |
|----------------------------------------|--------------------------|
| `price` | Price section value |
| `orderBook.bids` | Order book Bids |
| `orderBook.asks` | Order book Asks |
| `candlesByTimeframe[]` (or mapped `candles` object) | Candles section groups by `timeframe` |

### Attention / placement structure (observable)

| Priority | Content | Notes |
|----------|---------|-------|
| Reading P0–P1 | Context + Analysis | Primary interpretive band; Market Data must not lead this band (REQ-005) |
| Reading P4 | Evidence | Explainability; visually distinct from Market Data (REQ-006) |
| Reading P5 | Market Data | Supporting observation; medium space (REQ-004, REQ-016) |
| Market Data internals | Price → Order book → Candles (or equivalent clear section order) | Timeframe only under Candles (REQ-008) |

Forbidden nodes: Market Data marked primary; Market Data first in primary interpretive band; Market Data labeled Evidence; timeframe under Context Identity; Drivers/Features/Contributions as Market Data kinds.

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| Reading host idle or loading | Host status | Market Data success body not claimed until Reading / Market Data success is available | Host selection / wait |
| Market Data fetch failure | Host / prior Feature error state | Host error + retry; do not invent a parallel Market-Data-only error Region that replaces Analysis | Retry via host |
| Empty bids / asks / candle series | Valid mapped payload with empty arrays | Success with labeled empty sections (REQ-015) | None |
| Partial candle map (some timeframes empty) | Valid mapped series list | Show groups that exist; empty groups may omit rows but keep Candles structure | None |
| Stale Market Data response | Host stale-ignore | Composition follows current Symbol only | None |
| Attempt to label Market Data as Evidence or as primary Region | Design / review gate | Not allowed in model or UI | Spec + Reviewer reject |

Validation rules:

- Exactly one Market Data composition when Market Data body is shown (REQ-011).
- Price, Order book (Bids + Asks), and Candles-by-timeframe structure present on success when VM is available (REQ-001–REQ-003).
- Market Data remains supporting and after primary interpretive content (REQ-004, REQ-005, REQ-016).
- Market Data must not use Evidence kind labels or Evidence Region identity (REQ-006, REQ-007).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a **layout / composition** Feature for the Market Data Region body (plus mounting reuse of existing Market Data VM). Prefer component tests with strong structural oracles. Reuse existing Market Data mapper / fetch tests from Feature `view-market-data`; do **not** duplicate mapper suites unless this Feature changes mapping modules. No E2E, MSW, coverage %, or new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Price visible in Market Data Region | Layout / component | Success fixture price rendered under Market Data Region (catalog-linked Price label) | `src/features/reading-market-data-body/*.test.tsx` (new) and/or extend Reading shell Market Data body tests |
| Order book Bids and Asks visible | Layout / component | Fixture bids and asks visible under Order book in Market Data Region | same |
| Candles grouped by timeframe | Layout / component | At least two timeframe groups from fixture (or one group + timeframe label) visible under Candles | same |
| Supporting / not primary / not first in primary band | Layout / component | Market Data Region not marked primary; document/layout order keeps Context + Analysis before Market Data; Market Data not first Region in primary interpretive band | same + extend Reading shell tests as needed |
| Distinct from Evidence | Layout / component | Market Data Region remains distinct; body does not present Drivers/Features/Contributions as Market Data kinds; Evidence Region still separately labeled | same or shell + composition suite |
| Empty book / candles still structured | Layout / component | Empty bids/asks/candles fixture still shows labeled Price/Order book/Candles structure without treating as error | same |
| Host loading/error not replaced | Layout / component | Idle: no false success body; loading/error defer to host chrome (no inventing parallel success) | same or host suite |
| Brand primitives / no ad-hoc DS | Reviewer + light UI | Imports from `@market-data/brand/ui`; no Tailwind utility `className` for Market Data chrome | Reviewer; optional render smoke |
| Copy from catalogs | Component / Reviewer | Price / Order book / Bids / Asks / Candles labels resolve via brand `wording` / `getMessage`; no hardcoded designed English in feature sources | assert catalog-linked labels |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 Price for selected Symbol | Yes — composition / shell success fixture |
| AC-002 Order book Bids and Asks | Yes — composition success fixture |
| AC-003 Candles grouped by timeframe | Yes — composition success fixture |
| AC-004 supporting; not primary; not first in primary band | Yes — region role / document-order asserts |
| AC-005 visually distinct from Evidence | Yes — Region separation + absence of Evidence kinds in Market Data body |
| AC-006 brand tokens/components | Reviewer (required) + optional render smoke |
| AC-007 catalog copy | Yes — rendered labels from wording/locale keys |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`. Do **not** re-test full JSON→VM mapping already covered by `view-market-data` unless mapping changes.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared domain labels; Market Data body chrome that is feature-specific lives in the app locale catalog.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.price` | `@market-data/brand/wording` | Price section label |
| `labels.orderBook` | `@market-data/brand/wording` | Order book section label |
| `labels.bids` | `@market-data/brand/wording` | Bids side label |
| `labels.asks` | `@market-data/brand/wording` | Asks side label |
| `labels.candles` | `@market-data/brand/wording` | Candles section label |
| `labels.symbol` | `@market-data/brand/wording` | Only if Symbol identity is referenced inside Market Data chrome (prefer Context for Identity) |
| `common.loading` / `common.error` / `common.retry` | `@market-data/brand/wording` | Only if Market Data body surfaces local loading/error chrome |

Reuse existing Reading shell Region label `readingLayout.regionMarketData` (or equivalent shell key) for the Market Data Region chrome (do not invent a second Region name).

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `readingMarketData.timeframe` | Timeframe | `src/locales/en.json` | Timeframe grouping label under Candles (reuse `viewMarketData.timeframe` if already present and shared — prefer one key; do not duplicate conflicting English) |
| `readingMarketData.emptyBids` | No Bids levels. | `src/locales/en.json` | Empty Bids structure |
| `readingMarketData.emptyAsks` | No Asks levels. | `src/locales/en.json` | Empty Asks structure |
| `readingMarketData.emptyCandles` | No Candles for this timeframe. | `src/locales/en.json` | Empty candle series under a timeframe |
| `readingMarketData.sectionPlaceholder` | Market observation for this section will appear here. | `src/locales/en.json` | Gray-box placeholder only if a section lacks mapped data while Region chrome is shown |

Prefer reusing `viewMarketData.timeframe` when that key already exists and matches this Feature’s Candles grouping label — then omit a duplicate `readingMarketData.timeframe`. Do not use “Ticker”, “Orderbook”, “Candlesticks”, “Asset”, “Metrics”, or “Observations” as Market Data section labels. Do not label Market Data content as Evidence.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Price section bound to `MarketDataViewModel.price` |
| REQ-002 | Order book section bound to bids/asks |
| REQ-003 | Candles section bound to `candlesByTimeframe` |
| REQ-004 | Supporting prominence guard; not primary Region |
| REQ-005 | Placement after Context + Analysis; not first in primary band |
| REQ-006 | Evidence separation guard / distinct Region |
| REQ-007 | Forbidden Evidence labeling of Market Data content |
| REQ-008 | Timeframe unit only under Candles |
| REQ-009 / NFR-002 / NFR-006 | Brand UI primitives table |
| REQ-010 / NFR-005 | Brand wording + feature locale keys |
| REQ-011 | Fills Market Data Region body only; shell Regions unchanged |
| REQ-012 | Ownership boundary / out of scope |
| REQ-013 | Host idle/loading/error owns fetch chrome |
| REQ-014 / NFR-009 | Reuse `GET /markets/{symbol}/market-data` mapping |
| REQ-015 | Empty arrays remain success structure |
| REQ-016 | Supporting / medium; anti equal-weight and Market-Data-first |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines in Copy / Wording |
| NFR-007 | Gray-box fidelity explicit |
| NFR-008 | Adopted reading/evidence contracts only; PROJECT_ROOT scope |
