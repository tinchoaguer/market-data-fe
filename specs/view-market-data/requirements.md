# Requirements

## Overview

View Market Data lets users select a supported trading symbol and inspect the raw market data returned by the backend for that symbol: current price, order book (bids and asks), and all candle series grouped by timeframe. The UI presents loading and error states while retrieving data.

## Goals

- Enable users to inspect backend market data for a chosen symbol without leaving the product UI.
- Surface price, order book, and candle series in a clear, data-first layout.
- Communicate fetch progress and failures with recoverable error handling.
- Use canonical Market Data terminology and shared design-system wording.

## Functional Requirements

```text
REQ-001

WHEN the user opens the market data view, THE SYSTEM SHALL present a control that allows the user to select one symbol from the set of supported trading symbols.
```

```text
REQ-002

WHEN the user selects a supported trading symbol, THE SYSTEM SHALL retrieve market data for that symbol from GET /markets/{symbol}/market-data.
```

```text
REQ-003

WHEN market data for the selected symbol has been retrieved successfully, THE SYSTEM SHALL display the current price.
```

```text
REQ-004

WHEN market data for the selected symbol has been retrieved successfully, THE SYSTEM SHALL display the order book bids and the order book asks.
```

```text
REQ-005

WHEN market data for the selected symbol has been retrieved successfully, THE SYSTEM SHALL display all candle series grouped by timeframe.
```

```text
REQ-006

WHILE a market data request for the selected symbol is in progress, THE SYSTEM SHALL present a loading state to the user.
```

```text
REQ-007

IF the market data request for the selected symbol fails, THEN THE SYSTEM SHALL present an error state to the user.
```

```text
REQ-008

WHEN the market data view is showing an error state for a selected symbol, THE SYSTEM SHALL provide a recovery action that retries GET /markets/{symbol}/market-data for that symbol.
```

```text
REQ-009

WHEN no supported trading symbol is selected, THE SYSTEM SHALL not call GET /markets/{symbol}/market-data and SHALL present an empty state that prompts the user to select a symbol.
```

```text
REQ-010

THE SYSTEM SHALL present all user-facing labels and messages for this feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode user-facing English in components.
```

## Non-Functional Requirements

```text
NFR-001

THE SYSTEM SHALL implement this feature with React 19, TypeScript, and Vite, consistent with knowledge/architecture.md.
```

```text
NFR-002

THE SYSTEM SHALL consume shared UI primitives, tokens, and shared wording from @market-data/brand where applicable, and SHALL NOT fork brand tokens or rewrite shared design-system copy locally.
```

```text
NFR-003

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md for Symbol, Price, Order book, Bids, Asks, and Candles in requirements-facing and user-facing language.
```

```text
NFR-004

User-facing copy for this feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; ellipsis character for loading; sentence-case labels).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in src/locales/en.json and read them via the application message helpers; shared chrome and domain labels SHALL prefer @market-data/brand/wording.
```

## Acceptance Criteria

- [ ] The user can select a supported trading symbol.
- [ ] The UI retrieves data from GET /markets/{symbol}/market-data for the selected symbol.
- [ ] The current price is displayed after a successful response.
- [ ] The order book bids and asks are displayed after a successful response.
- [ ] All candle series grouped by timeframe are displayed after a successful response.
- [ ] A loading state is presented while the request is in progress.
- [ ] An error state is presented when the request fails, with a retry action available.
- [ ] No market-data request is made until a symbol is selected; an empty state prompts selection.
- [ ] User-facing strings come from locale catalogs / brand wording, not hardcoded English in components.
