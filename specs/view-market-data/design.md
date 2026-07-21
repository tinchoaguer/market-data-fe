# Design

## Overview

This feature adds a Market Data screen where the user selects a supported symbol and the app fetches raw market data from `GET /markets/{symbol}/market-data`. The screen renders price, order book (bids and asks), and candle series grouped by timeframe. Loading, empty, and error states use shared brand chrome where possible and feature-specific copy otherwise.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Market data route / screen | Hosts symbol selection and market data presentation; owns view-state transitions (idle → loading → success \| error). |
| Symbol selector | Presents the configured set of supported trading symbols; emits the selected symbol. |
| Market data API client | Issues `GET /markets/{symbol}/market-data` and maps the HTTP response into the view model. |
| Price section | Displays the current price from the view model. |
| Order book section | Displays bids and asks from the view model. |
| Candles section | Displays all candle series grouped by timeframe. |
| Status chrome | Renders empty, loading, and error UI using brand wording and feature copy. |
| Locale layer | Feature strings in `src/locales/en.json` via `src/i18n/messages.ts`; shared keys from `@market-data/brand/wording`. |

**Supported symbols source:** The set of selectable symbols is defined as static application configuration in this app (a typed constant or equivalent). No symbol-list API is documented in project knowledge; inventing a backend list endpoint is out of scope. Changing the supported set is a configuration change, not a UI flow change.

**UI kit:** Prefer existing `@market-data/brand` components and tokens for layout, controls, and chrome. Do not introduce a parallel visual system.

## Data Flow

1. User opens the market data view with no symbol selected → empty state (REQ-009).
2. User selects a symbol from the supported list (REQ-001).
3. Screen enters loading state and the API client calls `GET /markets/{symbol}/market-data` (REQ-002, REQ-006).
4. On HTTP success, the client maps the payload to the view model; the screen shows price, order book, and candles (REQ-003, REQ-004, REQ-005).
5. On HTTP failure or unusable payload, the screen shows the error state with retry (REQ-007, REQ-008).
6. Selecting a different symbol repeats steps 3–5 for the new symbol. In-flight requests for a prior symbol must not overwrite the view for the currently selected symbol (latest selection wins).

```text
[Symbol selector] --selected symbol--> [Screen state]
                                            |
                                            v
                                   [API client GET]
                                            |
                     +----------------------+----------------------+
                     |                      |                      |
                  success                failure              (aborted/stale)
                     |                      |                      |
                     v                      v                      v
              [View model]           [Error state]           (ignored)
              Price / Book /
              Candles by TF
```

## Interfaces

### External API

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/markets/{symbol}/market-data` | Fetch raw market data for the path `symbol`. |

**Path parameter**

| Name | Type | Rules |
|------|------|-------|
| `symbol` | string | Must be one of the configured supported symbols; URI-encoded in the request path. |

**Success response (HTTP 2xx)**

The client depends on a JSON body that supplies at least:

| Field | Type | Meaning |
|-------|------|---------|
| `price` | number | Current price for the symbol. |
| `orderBook` | object | Order book container. |
| `orderBook.bids` | array of `{ price: number, quantity: number }` | Buy side levels, displayed under Bids. |
| `orderBook.asks` | array of `{ price: number, quantity: number }` | Sell side levels, displayed under Asks. |
| `candles` | object | Map of timeframe key → candle array. |
| `candles[timeframe][]` | `{ open: number, high: number, low: number, close: number, timestamp: string }` | OHLC candle for that timeframe. |

Timeframe keys are opaque strings returned by the backend (for example `"1m"`, `"1h"`). The UI groups and labels series by those keys without renaming domain concepts.

If the backend uses equivalent nested shapes with the same semantics, the client may adapt field names in one mapping layer; the view model below remains the screen contract.

**Error responses**

Any non-2xx response, network failure, or body that cannot be mapped to the view model is treated as failure (REQ-007).

### Application configuration

| Name | Type | Purpose |
|------|------|---------|
| `SUPPORTED_SYMBOLS` | `readonly string[]` (non-empty) | Symbols offered in the selector (REQ-001). |

### Public UI surface

- A dedicated market data view reachable in the app (implementation may wire it as the primary screen or a route; no alternate product features are required by this spec).
- Primary CTA / entry labeling may reuse brand `cta.viewMarket` where a navigation control is shown.

## Data Model

### View model

```text
MarketDataViewModel
  symbol: string
  price: number
  orderBook:
    bids: OrderBookLevel[]
    asks: OrderBookLevel[]
  candlesByTimeframe: CandleSeries[]

OrderBookLevel
  price: number
  quantity: number

CandleSeries
  timeframe: string
  candles: Candle[]

Candle
  open: number
  high: number
  low: number
  close: number
  timestamp: string   # ISO-8601 or backend-provided timestamp string, displayed as returned/formatted consistently
```

### Screen state

| State | Condition | UI |
|-------|-----------|-----|
| `idle` | No symbol selected | Empty state prompting symbol selection |
| `loading` | Symbol selected; request in flight | Loading chrome |
| `success` | Symbol selected; view model available | Price, order book, candles |
| `error` | Symbol selected; last request failed | Error chrome + retry |

Transitions:

- `idle` → `loading` on symbol select
- `loading` → `success` on mapped success
- `loading` → `error` on failure
- `success` → `loading` on symbol change or explicit refresh (if provided); retry uses the error→loading path
- `error` → `loading` on retry or symbol change
- any → `idle` only if selection is cleared (optional; not required if the selector always has a value after first pick)

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|----------------------|----------|
| Network / HTTP error | Non-2xx or transport failure | Error state with shared error copy | `Try again` retries the same symbol (REQ-008) |
| Invalid / incomplete payload | Missing required fields or wrong types after parse | Treated as failure; error state | Retry |
| Empty bids, asks, or a timeframe series | Valid response with empty arrays | Still success; show section with no levels/candles (do not treat as error) |
| Stale response | Response symbol or request id ≠ current selection | Ignore payload; keep current selection’s state | None |
| Unsupported symbol in config misuse | N/A for normal UI (selector only offers supported symbols) | — | — |

Validation rules:

- Do not call the API without a selected symbol (REQ-009).
- Do not display partial success sections mixed with a global error for the same request; prefer a single screen state.

## Testing Strategy

| Type | Scope | Expectations |
|------|-------|--------------|
| Unit | API mapping from JSON → view model | Valid payloads map correctly; invalid payloads fail closed |
| Unit / component | Screen state machine | Idle, loading, success, error transitions; retry triggers a new request |
| Component | Symbol selector | Only configured symbols are selectable; selection triggers fetch |
| Component | Success rendering | Price, bids, asks, and each timeframe candle group are visible from a fixture view model |
| Component | Copy | Loading / error / retry / domain labels resolve from wording or feature messages (no hardcoded English assertions against raw string literals in components preferred; assert via keys or rendered catalog values) |
| Contract-style (optional) | Fixture aligned to Interfaces success shape | Documents FE expectation for backend payload |

Coverage: every REQ-* and NFR-* above must have at least one automated test or an explicit verified assertion in component tests. Prefer testing observable UI and mapper behavior over implementation internals.

## Copy / Wording

Follow `knowledge/writing/` (aligned with `@market-data/brand`).

### Design-system keys reused

| Key | Source |
|-----|--------|
| `product.name` | `@market-data/brand/wording` |
| `common.loading` | `@market-data/brand/wording` |
| `common.error` | `@market-data/brand/wording` |
| `common.retry` | `@market-data/brand/wording` |
| `cta.viewMarket` | `@market-data/brand/wording` |
| `labels.symbol` | `@market-data/brand/wording` |
| `labels.price` | `@market-data/brand/wording` |
| `labels.orderBook` | `@market-data/brand/wording` |
| `labels.bids` | `@market-data/brand/wording` |
| `labels.asks` | `@market-data/brand/wording` |
| `labels.candles` | `@market-data/brand/wording` |

### Feature keys to add or change

| Key | English | File |
|-----|---------|------|
| `viewMarketData.title` | Market data | `src/locales/en.json` |
| `viewMarketData.empty` | Select a symbol to view market data. | `src/locales/en.json` |
| `viewMarketData.timeframe` | Timeframe | `src/locales/en.json` |

Terminology constraints: see `knowledge/writing/terminology.md`. Prefer brand `wording` for shared chrome and domain labels; keep screen-specific copy in this app’s catalogs. Do not use “Ticker”, “Orderbook”, or “Candlesticks” as primary labels.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Symbol selector bound to `SUPPORTED_SYMBOLS` configuration |
| REQ-002 | Market data API client calls `GET /markets/{symbol}/market-data` on selection |
| REQ-003 | Price section renders `MarketDataViewModel.price` |
| REQ-004 | Order book section renders `orderBook.bids` and `orderBook.asks` |
| REQ-005 | Candles section renders `candlesByTimeframe` grouped by `timeframe` |
| REQ-006 | Screen `loading` state uses `common.loading` |
| REQ-007 | Screen `error` state uses `common.error` |
| REQ-008 | Retry action uses `common.retry` and re-invokes the API client for the current symbol |
| REQ-009 | `idle` state with `viewMarketData.empty`; no API call without selection |
| REQ-010 | Brand wording + `src/locales/en.json` / message helpers; no hardcoded UI English |
| NFR-001 | React 19 + TypeScript + Vite per architecture |
| NFR-002 | Consume `@market-data/brand` tokens, UI kit, and wording |
| NFR-003 | Canonical terms Symbol, Price, Order book, Bids, Asks, Candles |
| NFR-004 | Writing guidelines for tone, capitalization, ellipsis |
| NFR-005 | Feature keys in app locale catalog; shared keys from brand |
