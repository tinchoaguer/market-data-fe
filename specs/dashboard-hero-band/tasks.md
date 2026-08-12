# Tasks

## Implementation Tasks

Ordered to minimize dependencies. Each task contributes to one or more requirements. Prefer extending existing Reading / Context / Market Data modules and tests before adding new files.

- [x] **T-001** Confirm `@maguer/market-data-brand@^0.2.0` (or newer compatible already present from Feature `dashboard-app-chrome`) exports `ChartFrame`, chart CSS variables, `SegmentedControl` and/or `TimeframeControl`, and semantic `Text` / `Badge` tones needed by the hero; document any missing export as a design exception that still forbids ad-hoc FE chart chrome libraries (REQ-008, REQ-009, REQ-013, NFR-002, NFR-006)

- [x] **T-002** Add feature locale keys for hero observation labels (`readingHero.change`, `readingHero.high24h`, `readingHero.low24h`, `readingHero.volume24h`, `readingHero.lastUpdate`, `readingHero.timeframe`, `readingHero.sparkline`) in `src/locales/en.json`; reuse brand `labels.price` / `labels.symbol` and existing `readingContext.*` Identity labels (REQ-014, NFR-004, NFR-005)

- [x] **T-003** Implement `HeroObservationViewModel` mapper from existing `MarketDataViewModel`: map `price`; derive-or-omit change (direction + absolute/percent); derive-or-omit 24H high/low from candle OHLC; omit volume unless present; derive-or-omit last update; build sparkline points and available timeframes from candles-by-timeframe (REQ-004, REQ-005, REQ-007, REQ-010, REQ-016)

- [x] **T-004** Extend Identity presentation used in the hero with optional Symbol `logoSrc` when an asset/catalog entry exists; omit logo safely when absent without failing the Reading (REQ-002)

- [x] **T-005** Compose the top Reading hero band UI: Context-owned Identity (logo / display name / pair as available) adjacent to the observation strip so the band reads as one hero, not a gray-box Context stub alone (REQ-001, REQ-002, REQ-015)

- [x] **T-006** Render observation strip fields with brand layout/typography primitives: Price; Change with brand semantic positive/negative `Text` and/or `Badge` tones (no ad-hoc hex); supporting 24H high/low/vol / last update when present (REQ-004, REQ-005, REQ-006, REQ-007, REQ-013, NFR-009)

- [x] **T-007** Render sparkline inside brand `ChartFrame` (and/or chart CSS variables); implement consumer-owned series plotting only inside the frame; wire timeframe pills with brand `SegmentedControl` / `TimeframeControl` so selection updates sparkline points when the series exists (REQ-008, REQ-009, REQ-010, NFR-011)

- [x] **T-008** Enforce ownership boundaries in composition: observation fields are not mounted as Context Identity content; Context Identity excludes scores, signals, recommendations, and Analysis Assessment outcomes; do not re-home Recommendation into Context (REQ-003, REQ-011, REQ-012)

- [x] **T-009** Keep Market Data Region full Order book / Candles body intact; do not remove or replace that Region with the hero strip alone; do not modify app chrome owned by `dashboard-app-chrome` (REQ-018, REQ-019, NFR-010)

- [x] **T-010** Defer idle / loading / error to the Reading host; do not claim a successful hero observation body without host success (REQ-017)

- [x] **T-011** Add/extend unit tests for the hero observation mapper with strong oracles: price mapping; change derive-or-omit; 24H high/low derive-or-omit; volume/last-update omit-when-absent; sparkline points + timeframe switch (REQ-004, REQ-005, REQ-007, REQ-010, REQ-016; AC-003, AC-009)

- [x] **T-012** Add/extend Reading hero component tests with strong oracles: Identity adjacent to price on success; Context absence of Recommendation/scores/signals; ChartFrame + timeframe control when series exists; catalog-linked labels via `getMessage` / brand wording; host idle/loading does not claim success observation (REQ-001, REQ-003, REQ-008, REQ-009, REQ-012, REQ-014, REQ-017; AC-001, AC-002, AC-004, AC-005, AC-006, AC-008, AC-010)

## Traceability

| Task | Requirements |
|------|----------------|
| T-001 | REQ-008, REQ-009, REQ-013, NFR-002, NFR-006 |
| T-002 | REQ-014, NFR-004, NFR-005 |
| T-003 | REQ-004, REQ-005, REQ-007, REQ-010, REQ-016 |
| T-004 | REQ-002 |
| T-005 | REQ-001, REQ-002, REQ-015 |
| T-006 | REQ-004, REQ-005, REQ-006, REQ-007, REQ-013, NFR-009 |
| T-007 | REQ-008, REQ-009, REQ-010, NFR-011 |
| T-008 | REQ-003, REQ-011, REQ-012 |
| T-009 | REQ-018, REQ-019, NFR-010 |
| T-010 | REQ-017 |
| T-011 | REQ-004, REQ-005, REQ-007, REQ-010, REQ-016 |
| T-012 | REQ-001, REQ-003, REQ-008, REQ-009, REQ-012, REQ-014, REQ-017 |

| Acceptance criterion | Primary tasks |
|----------------------|---------------|
| AC-001 | T-005, T-012 |
| AC-002 | T-004, T-008, T-012 |
| AC-003 | T-003, T-006, T-011 |
| AC-004 | T-006, T-012 |
| AC-005 | T-001, T-007, T-012 |
| AC-006 | T-008, T-012 |
| AC-007 | T-001, T-006, T-007 |
| AC-008 | T-002, T-012 |
| AC-009 | T-003, T-011 |
| AC-010 | T-010, T-012 |
