# Design

## Overview

This feature adds a Market Classification screen where the user selects a supported symbol and the app fetches classification signals from `GET /markets/{symbol}/classification`. The screen renders regime, risk, economic, and exposure signal groups; each signal shows source, score, and reason. Loading, empty, and error states use shared brand chrome where possible and feature-specific copy otherwise. The screen mounts as the Classification destination content inside the existing shared application layout.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Classification route / screen | Hosts symbol selection and classification presentation; owns view-state transitions (idle → loading → success \| error). Mounted as the Classification layout destination (REQ-013). |
| Symbol selector | Presents the configured set of supported trading symbols; emits the selected symbol. |
| Classification API client | Issues `GET /markets/{symbol}/classification` and maps the HTTP response into the view model. |
| Regime signals section | Displays regime classification signals from the view model. |
| Risk signals section | Displays risk classification signals from the view model. |
| Economic signals section | Displays economic classification signals from the view model. |
| Exposure signals section | Displays exposure classification signals from the view model. |
| Signal row / table | For each signal, renders source, score, and reason (REQ-007). |
| Status chrome | Renders empty, loading, and error UI using brand wording and feature copy. |
| Locale layer | Feature strings in `src/locales/en.json` via `src/i18n/messages.ts`; shared keys from `@market-data/brand/wording`. |

**Supported symbols source:** The set of selectable symbols is defined as static application configuration in this app (reuse the existing typed `SUPPORTED_SYMBOLS` constant, or an equivalent shared non-empty list). No symbol-list API is documented in project knowledge; inventing a backend list endpoint is out of scope. Changing the supported set is a configuration change, not a UI flow change.

**Layout integration:** App Layout already provides Classification navigation. This feature replaces Classification placeholder/stub content with the full classification screen. It does not redefine layout chrome or navigation.

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Symbol selection | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` (and related Select parts as required) |
| Page structure | `Page`, `PageHeader`, `PageTitle` (and related Page parts as required) |
| Section spacing / clusters | `Stack`, `Inline`, `Cluster` as needed |
| Typography | `Text`, `Label`, `SectionHeading` |
| Signal group containers | `Card`, `CardHeader`, `CardTitle` (and related Card parts) when a bordered section container aids scanning of multiple signal groups |
| Signal lists | `Table`, `TableHeader`, `TableRow`, `TableCell` (and related Table parts) for source / score / reason columns |
| Discrete markers (optional) | `Badge` when a short token is shown beside a score or group |
| Loading placeholder | `Skeleton` |
| Error chrome | `Alert`, `AlertTitle`, `AlertDescription` |
| Retry action | `Button` |

Native HTML stand-ins for those roles are forbidden. Do not introduce Tailwind / utility `className` strings.

**UI kit:** Prefer existing `@market-data/brand` components and tokens for layout, controls, and chrome. Do not introduce a parallel visual system.

## Data Flow

1. User opens the Classification destination with no symbol selected → empty state (REQ-011, REQ-013).
2. User selects a symbol from the supported list (REQ-001).
3. Screen enters loading state and the API client calls `GET /markets/{symbol}/classification` (REQ-002, REQ-008).
4. On HTTP success, the client maps the payload to the view model; the screen shows regime, risk, economic, and exposure signal sections, each signal with source, score, and reason (REQ-003, REQ-004, REQ-005, REQ-006, REQ-007).
5. On HTTP failure or unusable payload, the screen shows the error state with retry (REQ-009, REQ-010).
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
              Regime / Risk /
              Economic / Exposure
              signals (source,
              score, reason)
```

## Interfaces

### External API

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/markets/{symbol}/classification` | Fetch market classification signals for the path `symbol`. |

**Path parameter**

| Name | Type | Rules |
|------|------|-------|
| `symbol` | string | Must be one of the configured supported symbols; URI-encoded in the request path. |

**Success response (HTTP 2xx)**

The client depends on a JSON body that supplies at least:

| Field | Type | Meaning |
|-------|------|---------|
| `regime` | array of `ClassificationSignal` | Regime classification signals; may be empty. |
| `risk` | array of `ClassificationSignal` | Risk classification signals; may be empty. |
| `economic` | array of `ClassificationSignal` | Economic classification signals; may be empty. |
| `exposure` | array of `ClassificationSignal` | Exposure classification signals; may be empty. |

**`ClassificationSignal` object**

| Field | Type | Meaning |
|-------|------|---------|
| `source` | string | Origin or identifier of the signal. |
| `score` | number | Numeric score for the signal (displayed as mapped). |
| `reason` | string | Human-readable justification for the signal. |

If the backend uses equivalent nested shapes with the same semantics (for example wrapping each group in an object that contains a `signals` array), the client may adapt field names in one mapping layer; the view model below remains the screen contract.

**Error responses**

Any non-2xx response, network failure, or body that cannot be mapped to the view model is treated as failure (REQ-009).

### Application configuration

| Name | Type | Purpose |
|------|------|---------|
| `SUPPORTED_SYMBOLS` | `readonly string[]` (non-empty) | Symbols offered in the selector (REQ-001). Reuse the existing app configuration when present. |

### Public UI surface

- Classification product view reachable via the shared layout’s Classification destination (REQ-013).
- Primary CTA / entry labeling may reuse brand `cta.viewClassification` where a navigation control is shown; layout nav labels remain owned by App Layout.

## Data Model

### View model

```text
MarketClassificationViewModel
  symbol: string
  regime: ClassificationSignal[]
  risk: ClassificationSignal[]
  economic: ClassificationSignal[]
  exposure: ClassificationSignal[]

ClassificationSignal
  source: string
  score: number
  reason: string
```

### Screen state

| State | Condition | UI |
|-------|-----------|-----|
| `idle` | No symbol selected | Empty state prompting symbol selection |
| `loading` | Symbol selected; request in flight | Loading chrome (`Skeleton` / loading copy) |
| `success` | Symbol selected; view model available | Regime, risk, economic, exposure signal sections |
| `error` | Symbol selected; last request failed | Error chrome (`Alert`) + retry (`Button`) |

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
| Network / HTTP error | Non-2xx or transport failure | Error state with shared error copy | `Try again` retries the same symbol (REQ-010) |
| Invalid / incomplete payload | Missing required fields, wrong types, or a signal missing `source` / `score` / `reason` after parse | Treated as failure; error state | Retry |
| Empty signal arrays | Valid response with empty `regime`, `risk`, `economic`, and/or `exposure` arrays | Still success; show the corresponding section with no signal rows (do not treat as error) | None |
| Stale response | Response symbol or request id ≠ current selection | Ignore payload; keep current selection’s state | None |
| Unsupported symbol in config misuse | N/A for normal UI (selector only offers supported symbols) | — | — |

Validation rules:

- Do not call the API without a selected symbol (REQ-011).
- Do not display partial success sections mixed with a global error for the same request; prefer a single screen state.
- Every displayed signal must include source, score, and reason (REQ-007); omit incomplete signals by failing the map rather than rendering partial rows.

## Testing Strategy

| Type | Scope | Expectations |
|------|-------|--------------|
| Unit | API mapping from JSON → view model | Valid payloads map correctly; invalid payloads fail closed |
| Unit / component | Screen state machine | Idle, loading, success, error transitions; retry triggers a new request |
| Component | Symbol selector | Only configured symbols are selectable; selection triggers fetch; brand `Select` used |
| Component | Success rendering | Regime, risk, economic, and exposure sections visible; each signal row shows source, score, and reason from a fixture view model |
| Component | Empty signal groups | Empty arrays still render section chrome without treating as error |
| Component | Copy | Loading / error / retry / domain labels resolve from wording or feature messages (no hardcoded English assertions against raw string literals in components preferred; assert via keys or rendered catalog values) |
| Component | Layout destination | Classification destination renders this screen (not stub-only content) |
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
| `cta.viewClassification` | `@market-data/brand/wording` |
| `labels.symbol` | `@market-data/brand/wording` |
| `labels.regime` | `@market-data/brand/wording` |
| `labels.risk` | `@market-data/brand/wording` |
| `labels.economic` | `@market-data/brand/wording` |
| `labels.exposure` | `@market-data/brand/wording` |

### Feature keys to add or change

| Key | English | File |
|-----|---------|------|
| `viewMarketClassification.title` | Classification | `src/locales/en.json` |
| `viewMarketClassification.empty` | Select a symbol to view classification. | `src/locales/en.json` |
| `viewMarketClassification.source` | Source | `src/locales/en.json` |
| `viewMarketClassification.score` | Score | `src/locales/en.json` |
| `viewMarketClassification.reason` | Reason | `src/locales/en.json` |

Terminology constraints: see `knowledge/writing/terminology.md`. Prefer brand `wording` for shared chrome and domain labels; keep screen-specific copy in this app’s catalogs. Use **Regime**, **Risk**, **Economic**, **Exposure**, and **Classification** as primary labels (not Tags, Categories, State, Danger, or Macro). Do not use “Ticker” as the symbol control label.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Symbol selector bound to `SUPPORTED_SYMBOLS` via brand `Select` |
| REQ-002 | Classification API client calls `GET /markets/{symbol}/classification` on selection |
| REQ-003 | Regime section renders `MarketClassificationViewModel.regime` with `labels.regime` |
| REQ-004 | Risk section renders `MarketClassificationViewModel.risk` with `labels.risk` |
| REQ-005 | Economic section renders `MarketClassificationViewModel.economic` with `labels.economic` |
| REQ-006 | Exposure section renders `MarketClassificationViewModel.exposure` with `labels.exposure` |
| REQ-007 | Each signal row renders `source`, `score`, and `reason` via brand `Table` columns |
| REQ-008 | Screen `loading` state uses `Skeleton` and `common.loading` |
| REQ-009 | Screen `error` state uses brand `Alert` and `common.error` |
| REQ-010 | Retry `Button` uses `common.retry` and re-invokes the API client for the current symbol |
| REQ-011 | `idle` state with `viewMarketClassification.empty`; no API call without selection |
| REQ-012 | Brand wording + `src/locales/en.json` / message helpers; no hardcoded UI English |
| REQ-013 | Screen mounted as Classification layout destination content |
| NFR-001 | React 19 + TypeScript + Vite per architecture |
| NFR-002 | Consume `@market-data/brand` tokens, UI kit, and wording |
| NFR-003 | Canonical terms Symbol, Regime, Risk, Economic, Exposure, Classification |
| NFR-004 | Writing guidelines for tone, capitalization, ellipsis |
| NFR-005 | Feature keys in app locale catalog; shared keys from brand |
| NFR-006 | Named brand primitives for Select, Skeleton, Alert, Button, Page, Stack, Text, SectionHeading, Badge, Card, Table |
