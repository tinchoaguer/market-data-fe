# Design

## Overview

This feature extends locale-backed label resolution already delivered by Human-Readable Labels. Classification mappers humanize signal `reason` enums. Analysis mappers humanize preferred strategy / catalog strategy tokens, exposure factor keys, and risk/economic component names used in summaries. All new catalogs live in `src/locales/en.json` and are resolved through the existing `resolveLabel(catalogPrefix, code)` helper (or thin wrappers). Screens continue to bind view-model strings only. No backend or OpenAPI changes are introduced.

Existing `AnalysisRegimeLabel` / `AnalysisRegimeReasonCode` catalogs and helpers remain unchanged.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Shared OpenAPI (`shared/openapi.json`) | Source of truth for `RegimeReasonCode`, `RiskReasonCode`, `EconomicReasonCode`, `ExposureReasonCode`, and `ExposureComponentsResponse` property names (REQ-013, REQ-015, NFR-002). |
| App locale catalog `src/locales/en.json` | Stores display English for every new closed-set member under stable nested keys (REQ-009, REQ-013–REQ-016, NFR-003). |
| Existing `resolveLabel` / message helpers | Reused pattern: `(catalog prefix, code) → display text` with raw-code fallback (REQ-010, REQ-017). |
| Thin wrappers (new) | Optional domain wrappers (for example `getClassificationRegimeReasonLabel`, `getStrategyLabel`, `getExposureFactorLabel`, `getRiskComponentLabel`, `getEconomicComponentLabel`) that call `resolveLabel` with fixed prefixes (REQ-017). |
| `mapMarketClassificationPayload` (or equivalent classification mapper) | Maps each signal `reason` via classification reason helpers into view-model reason strings (REQ-001–REQ-004, REQ-011). |
| `mapMarketAnalysis` (or equivalent analysis mapper) | Humanizes preferred strategy / catalog strategy tokens, exposure factor names, and risk/economic component names when writing recommendation, exposure factors, and component summaries (REQ-005–REQ-008, REQ-011). |
| Analysis & Classification screens | Unchanged state machines; continue binding only to view-model strings (REQ-011, REQ-012). |

```text
DTO (raw codes / keys)
    │
    ├─► mapMarketClassificationPayload
    │     signal.reason → resolveLabel(classificationLabels.*, code)
    │
    └─► mapMarketAnalysis
          preferred_strategy / strategy tokens → resolveLabel(analysisLabels.strategy, code)
          exposure.components keys → resolveLabel(analysisLabels.exposureFactor, key)
          risk/economic component names → resolveLabel(analysisLabels.riskComponent|economicComponent, name)
    │
    ▼
View models (human-readable strings)
    │
    ▼
Screens (no DTO code maps)
```

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Humanize in mappers, not in components | Preserves view-model boundary | REQ-001–REQ-008, REQ-011 |
| Locale catalog + `resolveLabel`, not inline English | Matches conventions and prior feature | REQ-009, REQ-017, NFR-003, NFR-004 |
| Raw-code fallback for unknown values | Avoids failing whole payloads when catalog lags | REQ-010, NFR-005 |
| Thin wrappers over existing helper | Extends pattern without a second architecture | REQ-017 |
| FE-only | Acceptance and backlog forbid BE/OpenAPI changes | NFR-001 |
| Leave regime analysis catalogs alone | Already completed; out of scope to rework | NFR-006, REQ-017 |

### Brand UI primitives

This feature does **not** change interactive UI chrome. Analysis and Classification screens continue to use the brand primitives already specified by `view-market-analysis` and `view-market-classification`. No new native HTML controls and no Tailwind/`className` utilities are introduced.

**Exception (documented):** No additional brand primitive is required solely for label lookup; label resolution remains a data/mapping concern.

### Out of scope (explicit)

- Backend route, DTO, or OpenAPI changes
- Replacing or redesigning `AnalysisRegimeLabel` / `AnalysisRegimeReasonCode` catalogs and their helpers
- Humanizing free-text `catalog_reason` / `hard_gate_reason` prose (leave BE-returned strings as-is even if they embed tokens)
- Humanizing classification `signal.source` values
- Changing idle/loading/error chrome or retry semantics
- Inventing labels beyond the closed sets listed in Data Model

## Data Flow

### Classification

1. User selects a symbol; existing classification client fetches `GET /markets/{symbol}/classification` (unchanged) (REQ-012).
2. On HTTP success, parse/validate payload as today (structural failures still fail closed).
3. For each signal in `regime`, `risk`, `economic`, and `exposure`: resolve `reason` via the matching classification reason catalog → write human-readable reason on the view-model signal (REQ-001–REQ-004).
4. Screen renders success view model; raw reason enums are not mapped in UI components (REQ-011).
5. Catalog miss for a reason → fallback to raw code; mapping continues; success state retained when the rest of the payload is valid (REQ-010, NFR-005).

### Analysis

1. Existing analysis client fetches `GET /markets/{symbol}/analysis` (unchanged) (REQ-012).
2. On success, existing regime label/reason humanization remains as already implemented (NFR-006).
3. Resolve `catalog.preferred_strategy` (and any StrategyType token written to recommendation `name` and/or `catalogId`) via `analysisLabels.strategy` (REQ-005).
4. When building exposure factors from `exposure.components` (`vol_budget_pct`, `liquidity_cap_value`), resolve factor display names via `analysisLabels.exposureFactor` (REQ-006).
5. When formatting risk and economic component summaries (`name=weight` joins via the existing summary formatter), resolve each component name via `analysisLabels.riskComponent` / `analysisLabels.economicComponent` before join (REQ-007, REQ-008).
6. Do not rewrite `catalog.catalog_reason` or `catalog.hard_gate_reason` through strategy/component catalogs (NFR-006).
7. Catalog miss → raw code/key fallback; continue mapping (REQ-010, NFR-005).

```text
[fetch classification / analysis]
        │
        v
[validate DTO shape] --fail--> [error state] (unchanged)
        │ ok
        v
[mapper + resolveLabel wrappers]
        │
        v
[view model with humanized strings]
        │
        v
[screen success UI]
```

## Interfaces

### External API

Unchanged.

| Endpoint | Relevant fields humanized |
|----------|---------------------------|
| `GET /markets/{symbol}/classification` | `regime[].reason`, `risk[].reason`, `economic[].reason`, `exposure[].reason` |
| `GET /markets/{symbol}/analysis` | `catalog.preferred_strategy` (as recommendation name/catalogId); `exposure.components` keys; `risk.components[][0]` and `economic.components[][0]` names in summaries |

### Internal helpers (public within the FE app)

| Helper | Behavior |
|--------|----------|
| Existing `resolveLabel(catalogPrefix, code)` | Catalog hit → locale string; miss → raw `code` (mandatory reuse) |
| Thin classification wrappers | Prefixes under `classificationLabels.*` for the four reason-code enums |
| Thin analysis wrappers | Prefixes `analysisLabels.strategy`, `analysisLabels.exposureFactor`, `analysisLabels.riskComponent`, `analysisLabels.economicComponent` |

Helpers MUST read locale JSON via `getMessage` / `resolveLabel` and MUST NOT contain inline English maps of the closed-set members (REQ-009, REQ-017).

### View-model contract

Preserve shapes from `view-market-classification` and `view-market-analysis`. After mapping:

| Surface | Content after this feature |
|---------|----------------------------|
| Classification signal `reason` | Human-readable reason text (or raw-code fallback) |
| Analysis recommendation `name` / `catalogId` (wherever preferred_strategy is mapped today) | Human-readable strategy text (or fallback) |
| Analysis exposure `factors[].name` | Human-readable factor names (or fallback) |
| Analysis risk / economic summary fields | Humanized component names in `name=weight` (or equivalent) summary text |

UI components continue to bind to these strings only (REQ-011).

## Data Model

### Classification reason codes (OpenAPI SoT)

**`RegimeReasonCode`:** `trend_up`, `trend_down`, `range`, `chaotic`, `news_spike`

**`RiskReasonCode`:** `low_risk`, `moderate_risk`, `elevated_risk`, `high_risk`

**`EconomicReasonCode`:** `strong_edge`, `moderate_edge`, `neutral_edge`, `negative_edge`

**`ExposureReasonCode`:** `ample_capacity`, `limited_capacity`, `constrained_capacity`

### Strategy tokens (backend StrategyType closed set; `preferred_strategy` is a string on `CatalogResultResponse`)

`TREND_FOLLOWING`, `RANGE_BOUNDING`, `PING_PONG`, `NEWS_TRADING`, `OTHER`

### Exposure factor keys (`ExposureComponentsResponse` properties)

`vol_budget_pct`, `liquidity_cap_value`

### Risk / economic component names (summary formatter closed sets)

**Risk:** `volatility`, `atr_expansion`, `regime`, `liquidity_stress`

**Economic:** `microstructure`, `activity`, `range_economics`, `cost_drag`

### Locale key structure

| Catalog prefix | Key pattern | Example |
|----------------|-------------|---------|
| Classification regime reasons | `classificationLabels.regimeReason.<code>` | `classificationLabels.regimeReason.trend_up` |
| Classification risk reasons | `classificationLabels.riskReason.<code>` | `classificationLabels.riskReason.low_risk` |
| Classification economic reasons | `classificationLabels.economicReason.<code>` | `classificationLabels.economicReason.strong_edge` |
| Classification exposure reasons | `classificationLabels.exposureReason.<code>` | `classificationLabels.exposureReason.ample_capacity` |
| Strategy tokens | `analysisLabels.strategy.<TOKEN>` | `analysisLabels.strategy.TREND_FOLLOWING` |
| Exposure factors | `analysisLabels.exposureFactor.<key>` | `analysisLabels.exposureFactor.vol_budget_pct` |
| Risk components | `analysisLabels.riskComponent.<name>` | `analysisLabels.riskComponent.atr_expansion` |
| Economic components | `analysisLabels.economicComponent.<name>` | `analysisLabels.economicComponent.cost_drag` |

API member strings are used as leaf key segments so helpers resolve `prefix + code` deterministically without a second English map (REQ-009).

Existing prefixes remain untouched: `analysisLabels.regime.*`, `analysisLabels.regimeReason.*` (NFR-006).

### Fallback rule

| Condition | Behavior |
|-----------|----------|
| Catalog hit | Return locale English string |
| Missing key / empty catalog value | Return the raw API code / key string as the display fallback |

Mapping never throws solely for catalog miss (REQ-010, NFR-005).

### Screen state

No new states. Existing idle | loading | success | error transitions for Analysis and Classification remain authoritative (REQ-012).

## Error Handling

| Failure | Detection | Behavior |
|---------|-----------|----------|
| Structurally invalid / incomplete payload | Existing mapper validation | Fail closed → error state (unchanged) |
| Known DTO shape with unknown in-scope code | Catalog miss in label helper | Fallback to raw code; continue success mapping (REQ-010) |
| Empty signal arrays / empty component lists | Valid empties | Success; existing empty presentation rules; no error |
| Locale key typo for a known closed-set member | Helper miss | Same as unknown-code fallback; treat as defect to fix in tests/catalog, not as HTTP error |
| Free-text `catalog_reason` / `hard_gate_reason` | N/A | Pass through unchanged (NFR-006) |

Validation rules:

- Do not upgrade unknown-code fallback into a payload mapping failure.
- Do not catch structural validation errors and convert them into fake success via fallbacks.

## Testing Strategy

| Type | Scope | Expectations |
|------|-------|--------------|
| Unit | Label wrappers / `resolveLabel` | Every in-scope closed-set member resolves to Copy / Wording English; unknown code returns raw fallback |
| Unit | Locale catalog completeness | Keys exist for all members in Data Model (REQ-013–REQ-016) |
| Unit | Classification mapper | Fixture with known reason codes → VM reasons humanized; unknown reason falls back without failing mapping |
| Unit | Analysis mapper | Preferred strategy, exposure factor names, and risk/economic component summaries humanized; unknown tokens fall back; structural fail-closed unchanged |
| Unit | No inline English | Mapper sources do not hardcode display phrases for in-scope codes |
| Unit / component | Flows | Analysis and Classification idle, loading, error, retry unchanged; success shows humanized copy |
| Component | Boundary | Screens consume view-model / fixtures with display strings; no component-level DTO maps |

Coverage: every REQ-* and NFR-* must have at least one automated test or an explicit assertion in mapper/component tests. Prefer asserting against locale values (via `getMessage` / `resolveLabel` or rendered catalog text) rather than duplicating English only in tests without linking to the catalog.

## Copy / Wording

Follow `knowledge/writing/` (mirrored from `@market-data/brand`).

Tone: precise, calm, formal, data-first. Sentence case for labels. Technical abbreviations that are domain-meaningful (for example ATR) may remain. Prefer **Regime**, **Risk**, **Economic**, **Exposure**, **Analysis**, **Classification**, and **Recommendation** per terminology.

### Design-system keys reused

| Key | Source |
|-----|--------|
| `labels.regime` / `labels.risk` / `labels.economic` / `labels.exposure` / `labels.recommendation` | `@market-data/brand/wording` (section chrome; unchanged) |
| `common.loading` / `common.error` / `common.retry` | `@market-data/brand/wording` (unchanged flows) |

No new brand wording keys are required for these code catalogs (feature-owned strings).

### Feature keys to add

#### `classificationLabels.regimeReason.*` (`RegimeReasonCode`)

| Key | English | File |
|-----|---------|------|
| `classificationLabels.regimeReason.trend_up` | Trend up | `src/locales/en.json` |
| `classificationLabels.regimeReason.trend_down` | Trend down | `src/locales/en.json` |
| `classificationLabels.regimeReason.range` | Range | `src/locales/en.json` |
| `classificationLabels.regimeReason.chaotic` | Chaotic | `src/locales/en.json` |
| `classificationLabels.regimeReason.news_spike` | News spike | `src/locales/en.json` |

#### `classificationLabels.riskReason.*` (`RiskReasonCode`)

| Key | English | File |
|-----|---------|------|
| `classificationLabels.riskReason.low_risk` | Low risk | `src/locales/en.json` |
| `classificationLabels.riskReason.moderate_risk` | Moderate risk | `src/locales/en.json` |
| `classificationLabels.riskReason.elevated_risk` | Elevated risk | `src/locales/en.json` |
| `classificationLabels.riskReason.high_risk` | High risk | `src/locales/en.json` |

#### `classificationLabels.economicReason.*` (`EconomicReasonCode`)

| Key | English | File |
|-----|---------|------|
| `classificationLabels.economicReason.strong_edge` | Strong edge | `src/locales/en.json` |
| `classificationLabels.economicReason.moderate_edge` | Moderate edge | `src/locales/en.json` |
| `classificationLabels.economicReason.neutral_edge` | Neutral edge | `src/locales/en.json` |
| `classificationLabels.economicReason.negative_edge` | Negative edge | `src/locales/en.json` |

#### `classificationLabels.exposureReason.*` (`ExposureReasonCode`)

| Key | English | File |
|-----|---------|------|
| `classificationLabels.exposureReason.ample_capacity` | Ample capacity | `src/locales/en.json` |
| `classificationLabels.exposureReason.limited_capacity` | Limited capacity | `src/locales/en.json` |
| `classificationLabels.exposureReason.constrained_capacity` | Constrained capacity | `src/locales/en.json` |

#### `analysisLabels.strategy.*` (StrategyType tokens)

| Key | English | File |
|-----|---------|------|
| `analysisLabels.strategy.TREND_FOLLOWING` | Trend following | `src/locales/en.json` |
| `analysisLabels.strategy.RANGE_BOUNDING` | Range bounding | `src/locales/en.json` |
| `analysisLabels.strategy.PING_PONG` | Ping pong | `src/locales/en.json` |
| `analysisLabels.strategy.NEWS_TRADING` | News trading | `src/locales/en.json` |
| `analysisLabels.strategy.OTHER` | Other | `src/locales/en.json` |

#### `analysisLabels.exposureFactor.*` (`ExposureComponentsResponse` keys)

| Key | English | File |
|-----|---------|------|
| `analysisLabels.exposureFactor.vol_budget_pct` | Vol budget % | `src/locales/en.json` |
| `analysisLabels.exposureFactor.liquidity_cap_value` | Liquidity cap value | `src/locales/en.json` |

#### `analysisLabels.riskComponent.*`

| Key | English | File |
|-----|---------|------|
| `analysisLabels.riskComponent.volatility` | Volatility | `src/locales/en.json` |
| `analysisLabels.riskComponent.atr_expansion` | ATR expansion | `src/locales/en.json` |
| `analysisLabels.riskComponent.regime` | Regime | `src/locales/en.json` |
| `analysisLabels.riskComponent.liquidity_stress` | Liquidity stress | `src/locales/en.json` |

#### `analysisLabels.economicComponent.*`

| Key | English | File |
|-----|---------|------|
| `analysisLabels.economicComponent.microstructure` | Microstructure | `src/locales/en.json` |
| `analysisLabels.economicComponent.activity` | Activity | `src/locales/en.json` |
| `analysisLabels.economicComponent.range_economics` | Range economics | `src/locales/en.json` |
| `analysisLabels.economicComponent.cost_drag` | Cost drag | `src/locales/en.json` |

Terminology constraints: see `knowledge/writing/terminology.md`. Prefer brand `wording` for shared chrome; keep code catalogs in this app’s `src/locales/en.json`.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Classification mapper resolves regime signal `reason` via `classificationLabels.regimeReason` |
| REQ-002 | Classification mapper resolves risk signal `reason` via `classificationLabels.riskReason` |
| REQ-003 | Classification mapper resolves economic signal `reason` via `classificationLabels.economicReason` |
| REQ-004 | Classification mapper resolves exposure signal `reason` via `classificationLabels.exposureReason` |
| REQ-005 | Analysis mapper resolves preferred strategy / catalog strategy tokens via `analysisLabels.strategy` into recommendation VM fields |
| REQ-006 | Analysis mapper resolves exposure component keys via `analysisLabels.exposureFactor` into factor names |
| REQ-007 | Analysis summary formatter resolves risk component names via `analysisLabels.riskComponent` |
| REQ-008 | Analysis summary formatter resolves economic component names via `analysisLabels.economicComponent` |
| REQ-009 | Locale keys + `resolveLabel` / thin wrappers; no inline English in mappers |
| REQ-010 | Catalog miss returns raw code; mapping continues |
| REQ-011 | Screens bind view models only |
| REQ-012 | Analysis and Classification flows unchanged aside from success copy |
| REQ-013 | Full classification reason-code locale tables |
| REQ-014 | Full strategy locale table |
| REQ-015 | Full exposure-factor locale table |
| REQ-016 | Full risk/economic component locale tables |
| REQ-017 | Reuse `resolveLabel`; leave existing analysis regime catalogs untouched |
| NFR-001 | FE-only mapping; no BE/OpenAPI edits |
| NFR-002 | Closed sets documented as Data Model SoT |
| NFR-003 | App locale + `resolveLabel` / `getMessage` |
| NFR-004 | Copy / Wording follows writing guidelines |
| NFR-005 | Unknown code does not force error state |
| NFR-006 | Explicit out-of-scope items listed |
