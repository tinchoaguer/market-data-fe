# Tasks

## Implementation Tasks

- [x] Add feature locale keys `viewMarketData.title`, `viewMarketData.empty`, and `viewMarketData.timeframe` to `src/locales/en.json` and ensure they are readable via `src/i18n/messages.ts` (REQ-010, NFR-004, NFR-005)

- [x] Define the typed `SUPPORTED_SYMBOLS` configuration (non-empty string list) used by the symbol selector (REQ-001)

- [x] Define TypeScript types for the API success payload and the `MarketDataViewModel` / `OrderBookLevel` / `CandleSeries` / `Candle` view model from design.md (REQ-003, REQ-004, REQ-005)

- [x] Implement the market data API client that calls `GET /markets/{symbol}/market-data` and maps a valid response to `MarketDataViewModel`, failing closed on invalid payloads (REQ-002, REQ-003, REQ-004, REQ-005, REQ-007)

- [x] Implement the market data screen shell with states `idle`, `loading`, `success`, and `error`, including empty copy before selection and no fetch until a symbol is selected (REQ-006, REQ-007, REQ-009)

- [x] Implement the symbol selector bound to `SUPPORTED_SYMBOLS`, using `labels.symbol` for the control label, and trigger a fetch on selection (REQ-001, REQ-002, REQ-010)

- [x] Render the success view: current price (`labels.price`), order book bids and asks (`labels.orderBook`, `labels.bids`, `labels.asks`), and all candle series grouped by timeframe (`labels.candles`, `viewMarketData.timeframe`) (REQ-003, REQ-004, REQ-005, REQ-010, NFR-003)

- [x] Wire loading chrome to `common.loading` and error chrome to `common.error` with a `common.retry` action that re-requests the selected symbol; ignore stale responses when the selection has changed (REQ-006, REQ-007, REQ-008, REQ-010)

- [x] Integrate the screen into the app entry/routing surface so users can open the market data view (reuse `cta.viewMarket` if a navigation control is shown) (REQ-001, NFR-001, NFR-002)

- [x] Write unit tests for response → view model mapping (valid and invalid payloads) (REQ-002, REQ-003, REQ-004, REQ-005, REQ-007)

- [x] Write component tests for idle/loading/success/error states, symbol selection fetch, retry, and visible price / order book / candles from fixtures (REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009)

- [x] Verify user-facing strings are resolved from brand wording or feature locale keys (no hardcoded English in components) (REQ-010, NFR-002, NFR-005)

Tasks are ordered to minimize implementation dependencies.
