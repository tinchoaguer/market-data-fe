# Requirements

## Overview

Reading Market Data Body fills the Reading’s Market Data Region with raw observation content — current Price, Order book (Bids and Asks), and Candles grouped by timeframe — per the adopted Reading UX contract (`knowledge/ux/reading-contract.md`). Market Data remains a supporting Region: it never becomes the primary interpretive message of the Symbol Reading, is never marked primary, and is never the first Region in the primary interpretive band. Observation stays visually distinct from Evidence (explainability). Composition uses brand tokens and UI kit primitives already available to the frontend at gray-box / structural fidelity. This Feature depends on the Market Data Region host from Feature `reading-layout-shell`, reuses existing Market Data mapping from Feature `view-market-data`, and respects Evidence ownership from Feature `reading-evidence-composition`. Hi-fi visual polish is out of scope.

## Goals

- Fill the Market Data Region with Price, Order book (Bids and Asks), and Candles grouped by timeframe for the selected Symbol.
- Keep Market Data as supporting observation — not the primary interpretive Region and not first in the primary interpretive band.
- Keep Market Data visually distinct from Evidence (observation ≠ explainability); do not label Market Data content as Evidence.
- Place timeframe under Candles (Market Data), not under Identity / Context.
- Style Market Data body chrome with `@market-data/brand` tokens/components (no ad-hoc design system).
- Reuse existing Market Data payload mapping; no new backend API or OpenAPI change required.
- Use canonical terminology: **Symbol**, **Price**, **Order book**, **Bids**, **Asks**, **Candles**, **Market Data**.

## Functional Requirements

```text
REQ-001

WHEN the Market Data Region of a successful Symbol Reading is shown and Market Data for the selected Symbol is available, THE SYSTEM SHALL display the current Price for that Symbol inside the Market Data Region body.
```

```text
REQ-002

WHEN the Market Data Region of a successful Symbol Reading is shown and Market Data for the selected Symbol is available, THE SYSTEM SHALL display the Order book Bids and the Order book Asks inside the Market Data Region body.
```

```text
REQ-003

WHEN the Market Data Region of a successful Symbol Reading is shown and Market Data for the selected Symbol is available, THE SYSTEM SHALL display Candles grouped by timeframe inside the Market Data Region body.
```

```text
REQ-004

WHILE the Market Data Region body is visible on a successful Reading, THE SYSTEM SHALL keep Market Data as a supporting Reading Region and SHALL NOT mark Market Data as the primary interpretive Region of the Symbol Reading.
```

```text
REQ-005

WHILE the Market Data Region body is visible on a successful Reading, THE SYSTEM SHALL NOT place Market Data as the first Region in the primary interpretive band; Context and Analysis SHALL remain ahead of Market Data in Reading hierarchy and document / layout order for the primary interpretive message.
```

```text
REQ-006

WHILE the Market Data Region body is visible, THE SYSTEM SHALL keep Market Data visually distinct from the Evidence Region so observation content is not presented as claim-attached explainability (Drivers → Features → Contributions).
```

```text
REQ-007

THE SYSTEM SHALL NOT label Market Data Region content (Price, Order book, Candles) as Evidence; raw Market Data SHALL remain observation unless cited elsewhere as Evidence Features supporting a claim (owned by Feature reading-evidence-composition).
```

```text
REQ-008

THE SYSTEM SHALL place timeframe grouping under Candles inside the Market Data Region and SHALL NOT present timeframe as Identity content in the Context Region.
```

```text
REQ-009

WHEN rendering Market Data Region body chrome and observation structure (Price, Order book, Candles), THE SYSTEM SHALL use `@market-data/brand` tokens and UI kit primitives for structure, spacing, and typography, and SHALL NOT introduce an ad-hoc parallel design system for that chrome.
```

```text
REQ-010

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode user-facing English in components.
```

```text
REQ-011

THE SYSTEM SHALL host this composition inside the Market Data Region provided by the Reading layout shell and SHALL NOT redefine or replace the Reading-wide Region map (Context, Analysis, Classification, Evidence, Diagnostics) owned by Feature reading-layout-shell.
```

```text
REQ-012

THE SYSTEM SHALL NOT present Assessment outcomes, Recommendation stance, Narrative prose, Classification signal lists, Evidence Drivers / Features / Contributions tables, or Diagnostics trust elevation chrome as content owned by the Market Data Region body.
```

```text
REQ-013

WHEN Market Data content for the selected Symbol is not yet available beyond Region chrome (loading, error, or idle Reading host states), THE SYSTEM SHALL defer to the Reading host’s existing selection / loading / error behavior and SHALL NOT invent a parallel Market-Data-only success body that claims a successful Reading Market Data body without host success.
```

```text
REQ-014

WHEN Market Data is available from existing Market Data mapping for the selected Symbol, THE SYSTEM SHALL surface that mapped content (Price, Order book Bids and Asks, Candles by timeframe) inside the Market Data Region body without requiring a new backend API, DTO field, or OpenAPI change.
```

```text
REQ-015

WHEN a successful Market Data payload yields empty Bids, empty Asks, or an empty candle series for a timeframe, THE SYSTEM SHALL still expose the corresponding Price / Order book / Candles structure and SHALL NOT treat empty book levels or empty candle arrays alone as a Market Data fetch failure.
```

```text
REQ-016

WHILE the Market Data Region body is visible on a successful Reading, THE SYSTEM SHALL present Market Data as secondary exploration (supporting / medium relative space) and SHALL NOT present Market Data as an equal-weight Region wall that dominates Analysis or as a Market-Data-first Reading.
```

## Non-Functional Requirements

```text
NFR-001

THE SYSTEM SHALL implement this Feature with React 19, TypeScript, and Vite, consistent with knowledge/architecture.md.
```

```text
NFR-002

THE SYSTEM SHALL consume shared UI primitives, tokens, and shared wording from `@market-data/brand` where applicable, and SHALL NOT fork brand tokens or rewrite shared design-system copy locally.
```

```text
NFR-003

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/reading-contract.md: Symbol (not Asset), Price, Order book, Bids, Asks, Candles, Market Data; and SHALL NOT use Ticker, Orderbook, or Candlesticks as primary labels.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in `src/locales/en.json` and read them via the application message helpers; shared domain labels (Price, Order book, Bids, Asks, Candles) SHALL prefer `@market-data/brand/wording` when applicable.
```

```text
NFR-006

WHEN a matching export exists in `@market-data/brand/ui`, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

Composition fidelity for this Feature SHALL be gray-box / structural per knowledge/ux/reading-contract.md; hi-fi Figma polish SHALL NOT be a completion gate.
```

```text
NFR-008

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Market Data Region composition SHALL follow knowledge/ux/reading-contract.md (and Evidence boundary notes in knowledge/ux/evidence-contract.md) only — no dependency on sibling-repo brand visual-definition paths.
```

```text
NFR-009

THE SYSTEM SHALL NOT require new backend APIs, DTO fields, or OpenAPI changes to complete this Feature; reuse existing Market Data payload mapping from Feature view-market-data (GET /markets/{symbol}/market-data).
```

## Acceptance Criteria

- [ ] AC-001: Market Data Region displays current Price for the selected Symbol.
- [ ] AC-002: Market Data Region displays Order book Bids and Asks.
- [ ] AC-003: Market Data Region displays Candles grouped by timeframe.
- [ ] AC-004: Market Data remains a supporting Region — not marked primary and not the first Region in the primary interpretive band.
- [ ] AC-005: Market Data is visually distinct from Evidence (observation ≠ explainability).
- [ ] AC-006: Region body uses brand tokens/components already available to the FE.
- [ ] AC-007: User-facing strings come from locale catalogs / brand wording, not hardcoded English in components.
