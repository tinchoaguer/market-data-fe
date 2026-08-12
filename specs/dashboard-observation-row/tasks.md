# Tasks

## Implementation Tasks

Ordered to minimize dependencies. Each task contributes to one or more requirements. Prefer extending existing Reading / Market Data modules and tests before adding new files.

- [x] **T-001** Confirm `@maguer/market-data-brand@^0.2.0` (or newer compatible already present from Feature `dashboard-app-chrome`) exports `ChartFrame`, chart CSS variables (`--chart-*` or equivalent), `SegmentedControl` and/or `TimeframeControl`, `Card`, and `Text` / `Label` needed by the observation row; document any missing export as a design exception that still forbids ad-hoc FE chart chrome libraries (REQ-002, REQ-005, REQ-011, NFR-002, NFR-006)

- [x] **T-002** Add or reuse feature locale keys for observation-row labels (`readingObservationRow.chartTitle`, `readingObservationRow.statsTitle`, stat row labels, timeframe accessible name, empty-chart message) in `src/locales/en.json`; prefer reusing `readingHero.*` keys where English is identical (REQ-012, NFR-004, NFR-005)

- [x] **T-003** Implement `ObservationRowViewModel` mapper from existing `MarketDataViewModel`: build `areaChartPoints` and `availableTimeframes` from `candlesByTimeframe`; derive-or-omit 24H high/low from OHLC or explicit fields; omit volume unless present; derive-or-omit last update; support timeframe selection updates (REQ-004, REQ-006, REQ-014, REQ-016)

- [x] **T-004** Replace gray-box Market Data Region body (Price / Order book / tabular Candles primary dump from `reading-market-data-body`) with the dashboard middle observation row composer: chart panel (left) + Market Stats 24H card (right) (REQ-001)

- [x] **T-005** Render chart panel with brand `ChartFrame` and chart CSS variables; implement consumer-owned area/price series plotting inside the frame only; wire timeframe pills with brand `SegmentedControl` / `TimeframeControl` so selection updates chart points when the series exists (REQ-002, REQ-003, REQ-005, REQ-006, NFR-011)

- [x] **T-006** Render Market Stats 24H card with brand `Card`, `Text`, and/or `Label`: show high, low, volume, and other available stat rows; omit rows when values are unavailable without failing the Reading (REQ-004, REQ-016)

- [x] **T-007** Enforce supporting Region and Evidence-separation guards: Market Data Region remains supporting (not primary, not first in primary interpretive band); observation row excludes Assessment, Recommendation, Classification, Evidence, and Diagnostics content; do not label observation content as Evidence (REQ-007, REQ-008, REQ-009, REQ-010)

- [x] **T-008** Keep timeframe control under Market Data Region (Candles observation), not Context Identity (REQ-018)

- [x] **T-009** Do not modify app chrome (`dashboard-app-chrome`), Reading hero band (`dashboard-hero-band`), or Analysis Assessment cards (`dashboard-analysis-cards`); observation-row timeframe state may remain independent of hero sparkline timeframe (REQ-017, NFR-010)

- [x] **T-010** Defer idle / loading / error to the Reading / Market Data host; do not claim a successful observation row body without host success (REQ-015, AC-007)

- [x] **T-011** Add/extend unit tests for the observation row mapper with strong oracles: area chart points + timeframe switch; 24H high/low derive-or-omit; volume/last-update omit-when-absent (REQ-004, REQ-006, REQ-014, REQ-016; AC-003)

- [x] **T-012** Add/extend Market Data observation-row component tests with strong oracles: chart panel + Market Stats 24H card present on success (not gray-box primary dump); ChartFrame + timeframe control when timeframes exist; catalog-linked stat labels; supporting Region / not Evidence absence checks; host idle/loading/error does not claim success row (REQ-001, REQ-002, REQ-005, REQ-007, REQ-009, REQ-012, REQ-015; AC-001, AC-004, AC-005, AC-007)

## Traceability

| Task | Requirements |
|------|----------------|
| T-001 | REQ-002, REQ-005, REQ-011, NFR-002, NFR-006 |
| T-002 | REQ-012, NFR-004, NFR-005 |
| T-003 | REQ-004, REQ-006, REQ-014, REQ-016 |
| T-004 | REQ-001 |
| T-005 | REQ-002, REQ-003, REQ-005, REQ-006, NFR-011 |
| T-006 | REQ-004, REQ-016 |
| T-007 | REQ-007, REQ-008, REQ-009, REQ-010 |
| T-008 | REQ-018 |
| T-009 | REQ-017, NFR-010 |
| T-010 | REQ-015 |
| T-011 | REQ-004, REQ-006, REQ-014, REQ-016 |
| T-012 | REQ-001, REQ-002, REQ-005, REQ-007, REQ-009, REQ-012, REQ-015 |

| Acceptance criterion | Primary tasks |
|----------------------|---------------|
| AC-001 | T-004, T-012 |
| AC-002 | T-001, T-005, T-012 |
| AC-003 | T-003, T-006, T-011, T-012 |
| AC-004 | T-001, T-005, T-012 |
| AC-005 | T-007, T-012 |
| AC-006 | T-001, T-005, T-006 |
| AC-007 | T-010, T-012 |
