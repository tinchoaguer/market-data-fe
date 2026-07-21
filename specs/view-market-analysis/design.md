# Design

## Overview

This feature adds a Market Analysis screen where the user selects a supported symbol and the app fetches deterministic analysis from `GET /markets/{symbol}/analysis`. The screen renders regime, risk, and economic assessments, the exposure profile, and the catalog recommendation. Loading, empty, and error states use shared brand chrome where possible and feature-specific copy otherwise. The screen mounts as the Analysis destination content inside the existing shared application layout.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Analysis route / screen | Hosts symbol selection and analysis presentation; owns view-state transitions (idle → loading → success \| error). Mounted as the Analysis layout destination (REQ-013). |
| Symbol selector | Presents the configured set of supported trading symbols; emits the selected symbol. |
| Analysis API client | Issues `GET /markets/{symbol}/analysis` and maps the HTTP response into the view model. |
| Regime section | Displays the regime assessment from the view model. |
| Risk section | Displays the risk assessment from the view model. |
| Economic section | Displays the economic assessment from the view model. |
| Exposure section | Displays the exposure profile from the view model. |
| Recommendation section | Displays the catalog recommendation from the view model. |
| Status chrome | Renders empty, loading, and error UI using brand wording and feature copy. |
| Locale layer | Feature strings in `src/locales/en.json` via `src/i18n/messages.ts`; shared keys from `@market-data/brand/wording`. |

**Supported symbols source:** The set of selectable symbols is defined as static application configuration in this app (reuse the existing typed `SUPPORTED_SYMBOLS` constant, or an equivalent shared non-empty list). No symbol-list API is documented in project knowledge; inventing a backend list endpoint is out of scope. Changing the supported set is a configuration change, not a UI flow change.

**Layout integration:** App Layout already provides Analysis navigation. This feature replaces Analysis placeholder/stub content with the full analysis screen. It does not redefine layout chrome or navigation.

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Symbol selection | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` (and related Select parts as required) |
| Page structure | `Page`, `PageHeader`, `PageTitle` (and related Page parts as required) |
| Section spacing / clusters | `Stack`, `Inline`, `Cluster` as needed |
| Typography | `Text`, `Label`, `SectionHeading` |
| Assessment / profile containers | `Card`, `CardHeader`, `CardTitle` (and related Card parts) when a bordered section container aids scanning of multiple assessments |
| Discrete assessment or recommendation markers | `Badge` when a short level/status token is shown |
| Loading placeholder | `Skeleton` |
| Error chrome | `Alert`, `AlertTitle`, `AlertDescription` |
| Retry action | `Button` |

Native HTML stand-ins for those roles are forbidden. Do not introduce Tailwind / utility `className` strings.

**UI kit:** Prefer existing `@market-data/brand` components and tokens for layout, controls, and chrome. Do not introduce a parallel visual system.

## Data Flow

1. User opens the Analysis destination with no symbol selected → empty state (REQ-011, REQ-013).
2. User selects a symbol from the supported list (REQ-001).
3. Screen enters loading state and the API client calls `GET /markets/{symbol}/analysis` (REQ-002, REQ-008).
4. On HTTP success, the client maps the payload to the view model; the screen shows regime, risk, economic, exposure, and recommendation sections (REQ-003, REQ-004, REQ-005, REQ-006, REQ-007).
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
              Economic / Exposure /
              Recommendation
```

## Interfaces

### External API

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/markets/{symbol}/analysis` | Fetch deterministic market analysis for the path `symbol`. |

**Path parameter**

| Name | Type | Rules |
|------|------|-------|
| `symbol` | string | Must be one of the configured supported symbols; URI-encoded in the request path. |

**Success response (HTTP 2xx)**

The client depends on a JSON body that supplies at least:

| Field | Type | Meaning |
|-------|------|---------|
| `regime` | object | Regime assessment container. |
| `regime.summary` | string | Human-readable regime assessment summary. |
| `regime.level` | string | Opaque regime level/token returned by the backend (displayed as returned). |
| `risk` | object | Risk assessment container. |
| `risk.summary` | string | Human-readable risk assessment summary. |
| `risk.level` | string | Opaque risk level/token returned by the backend. |
| `economic` | object | Economic assessment container. |
| `economic.summary` | string | Human-readable economic assessment summary. |
| `economic.level` | string | Opaque economic level/token returned by the backend. |
| `exposure` | object | Exposure profile container. |
| `exposure.summary` | string | Human-readable exposure profile summary. |
| `exposure.factors` | array of `{ name: string, weight: number }` | Named exposure factors with relative weights; may be empty. |
| `recommendation` | object | Catalog recommendation container. |
| `recommendation.catalogId` | string | Identifier of the recommended catalog entry. |
| `recommendation.name` | string | Display name of the recommended catalog entry. |
| `recommendation.rationale` | string | Why this catalog entry is recommended. |

If the backend uses equivalent nested shapes with the same semantics, the client may adapt field names in one mapping layer; the view model below remains the screen contract.

**Error responses**

Any non-2xx response, network failure, or body that cannot be mapped to the view model is treated as failure (REQ-009).

### Application configuration

| Name | Type | Purpose |
|------|------|---------|
| `SUPPORTED_SYMBOLS` | `readonly string[]` (non-empty) | Symbols offered in the selector (REQ-001). Reuse the existing app configuration when present. |

### Public UI surface

- Analysis product view reachable via the shared layout’s Analysis destination (REQ-013).
- Primary CTA / entry labeling may reuse brand `cta.viewAnalysis` where a navigation control is shown.

## Data Model

### View model

```text
MarketAnalysisViewModel
  symbol: string
  regime: Assessment
  risk: Assessment
  economic: Assessment
  exposure: ExposureProfile
  recommendation: CatalogRecommendation

Assessment
  summary: string
  level: string

ExposureProfile
  summary: string
  factors: ExposureFactor[]

ExposureFactor
  name: string
  weight: number

CatalogRecommendation
  catalogId: string
  name: string
  rationale: string
```

### Screen state

| State | Condition | UI |
|-------|-----------|-----|
| `idle` | No symbol selected | Empty state prompting symbol selection |
| `loading` | Symbol selected; request in flight | Loading chrome (`Skeleton` / loading copy) |
| `success` | Symbol selected; view model available | Regime, risk, economic, exposure, recommendation |
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
| Invalid / incomplete payload | Missing required fields or wrong types after parse | Treated as failure; error state | Retry |
| Empty `exposure.factors` | Valid response with empty factors array | Still success; show exposure summary with no factor rows (do not treat as error) |
| Stale response | Response symbol or request id ≠ current selection | Ignore payload; keep current selection’s state | None |
| Unsupported symbol in config misuse | N/A for normal UI (selector only offers supported symbols) | — | — |

Validation rules:

- Do not call the API without a selected symbol (REQ-011).
- Do not display partial success sections mixed with a global error for the same request; prefer a single screen state.

## Testing Strategy

| Type | Scope | Expectations |
|------|-------|--------------|
| Unit | API mapping from JSON → view model | Valid payloads map correctly; invalid payloads fail closed |
| Unit / component | Screen state machine | Idle, loading, success, error transitions; retry triggers a new request |
| Component | Symbol selector | Only configured symbols are selectable; selection triggers fetch; brand `Select` used |
| Component | Success rendering | Regime, risk, economic, exposure (summary + factors), and recommendation visible from a fixture view model |
| Component | Copy | Loading / error / retry / domain labels resolve from wording or feature messages (no hardcoded English assertions against raw string literals in components preferred; assert via keys or rendered catalog values) |
| Component | Layout destination | Analysis destination renders this screen (not stub-only content) |
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
| `cta.viewAnalysis` | `@market-data/brand/wording` |
| `labels.symbol` | `@market-data/brand/wording` |
| `labels.regime` | `@market-data/brand/wording` |
| `labels.risk` | `@market-data/brand/wording` |
| `labels.economic` | `@market-data/brand/wording` |
| `labels.exposure` | `@market-data/brand/wording` |
| `labels.recommendation` | `@market-data/brand/wording` |

### Feature keys to add or change

| Key | English | File |
|-----|---------|------|
| `viewMarketAnalysis.title` | Analysis | `src/locales/en.json` |
| `viewMarketAnalysis.empty` | Select a symbol to view analysis. | `src/locales/en.json` |
| `viewMarketAnalysis.summary` | Summary | `src/locales/en.json` |
| `viewMarketAnalysis.level` | Level | `src/locales/en.json` |
| `viewMarketAnalysis.factors` | Factors | `src/locales/en.json` |
| `viewMarketAnalysis.factorName` | Factor | `src/locales/en.json` |
| `viewMarketAnalysis.factorWeight` | Weight | `src/locales/en.json` |
| `viewMarketAnalysis.catalogId` | Catalog ID | `src/locales/en.json` |
| `viewMarketAnalysis.rationale` | Rationale | `src/locales/en.json` |

Terminology constraints: see `knowledge/writing/terminology.md`. Prefer brand `wording` for shared chrome and domain labels; keep screen-specific copy in this app’s catalogs. Use **Regime**, **Risk**, **Economic**, **Exposure**, and **Recommendation** as primary section labels (not State, Danger, Macro, Advice, or Insights). Do not use “Ticker” as the symbol control label.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Symbol selector bound to `SUPPORTED_SYMBOLS` via brand `Select` |
| REQ-002 | Analysis API client calls `GET /markets/{symbol}/analysis` on selection |
| REQ-003 | Regime section renders `MarketAnalysisViewModel.regime` with `labels.regime` |
| REQ-004 | Risk section renders `MarketAnalysisViewModel.risk` with `labels.risk` |
| REQ-005 | Economic section renders `MarketAnalysisViewModel.economic` with `labels.economic` |
| REQ-006 | Exposure section renders `MarketAnalysisViewModel.exposure` with `labels.exposure` |
| REQ-007 | Recommendation section renders `MarketAnalysisViewModel.recommendation` with `labels.recommendation` |
| REQ-008 | Screen `loading` state uses `Skeleton` and `common.loading` |
| REQ-009 | Screen `error` state uses brand `Alert` and `common.error` |
| REQ-010 | Retry `Button` uses `common.retry` and re-invokes the API client for the current symbol |
| REQ-011 | `idle` state with `viewMarketAnalysis.empty`; no API call without selection |
| REQ-012 | Brand wording + `src/locales/en.json` / message helpers; no hardcoded UI English |
| REQ-013 | Screen mounted as Analysis layout destination content |
| NFR-001 | React 19 + TypeScript + Vite per architecture |
| NFR-002 | Consume `@market-data/brand` tokens, UI kit, and wording |
| NFR-003 | Canonical terms Symbol, Regime, Risk, Economic, Exposure, Recommendation, Analysis |
| NFR-004 | Writing guidelines for tone, capitalization, ellipsis |
| NFR-005 | Feature keys in app locale catalog; shared keys from brand |
| NFR-006 | Named brand primitives for Select, Skeleton, Alert, Button, Page, Stack, Text, SectionHeading, Badge, Card |
