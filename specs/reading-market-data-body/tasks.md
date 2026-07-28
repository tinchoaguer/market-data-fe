# Tasks



## Implementation Tasks



- [x] Add or reuse feature locale keys for Market Data body chrome (`readingMarketData.emptyBids`, `readingMarketData.emptyAsks`, `readingMarketData.emptyCandles`, and `readingMarketData.sectionPlaceholder` / timeframe label as specified — reuse `viewMarketData.timeframe` when already present) in `src/locales/en.json` and ensure they are readable via `src/i18n/messages.ts` (REQ-010, NFR-003, NFR-004, NFR-005)



- [x] Create the Market Data body composition module under `src/features/reading-market-data-body/` that defines Price, Order book (Bids and Asks), and Candles-by-timeframe structure, using brand `Stack` / `SectionHeading` / `Text` / `Label` (and `Table` / `Card` / `Badge` only as needed for gray-box scanning or row lists) (REQ-001, REQ-002, REQ-003, REQ-009, REQ-016, NFR-001, NFR-002, NFR-006)



- [x] Bind existing Market Data view-model fields (`price`, `orderBook.bids` / `orderBook.asks`, `candlesByTimeframe`) into the Market Data body sections; keep empty bids/asks/candle arrays as labeled structure without treating them as fetch failure (REQ-001, REQ-002, REQ-003, REQ-014, REQ-015, NFR-009)



- [x] Enforce supporting-observation rules inside Market Data: not marked primary; not first in the primary interpretive band; medium/supporting prominence; timeframe only under Candles (not Context Identity); no Evidence kind labels; Market Data content not labeled Evidence (REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-016, NFR-007)



- [x] Mount the Market Data composition as the Market Data Region body in the Reading layout shell host without redefining Reading-wide Regions (Context, Analysis, Classification, Evidence, Diagnostics) and without owning Analysis / Classification / Evidence / Diagnostics content (REQ-011, REQ-012)



- [x] Defer idle / loading / error presentation to the Reading host’s existing selection and fetch chrome; do not claim a successful Market Data body without host success (REQ-013)



- [x] Ensure all Market Data body user-facing strings resolve from brand wording (Price, Order book, Bids, Asks, Candles) or feature locale keys (no hardcoded English in components; use Symbol terminology, not Asset / Ticker / Orderbook / Candlesticks as primary labels) (REQ-010, NFR-002, NFR-003, NFR-005)



- [x] Add composition/component tests under `src/features/reading-market-data-body/` asserting Price, Bids, Asks, and Candles-by-timeframe under the Market Data Region from a success fixture, empty-structure behavior, catalog-linked labels, and absence of Evidence kinds in the Market Data body (REQ-001–REQ-003, REQ-006, REQ-007, REQ-010, REQ-015)



- [x] Extend Reading shell / host tests as needed so Market Data remains supporting (not primary; not first in the primary interpretive band), stays visually distinct from Evidence, and timeframe stays under Candles (REQ-004, REQ-005, REQ-008, REQ-011, REQ-016)



Tasks are ordered to minimize implementation dependencies.

