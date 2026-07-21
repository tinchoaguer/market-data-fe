# Design

## Overview

This feature humanizes market-analysis DTO codes in the frontend mapping layer. After `GET /markets/{symbol}/analysis` returns a valid payload, `mapMarketAnalysis` (or an equivalent mapper in `src/api/marketAnalysis`) resolves `AnalysisRegimeLabel` and `AnalysisRegimeReasonCode` values through locale-backed label helpers into human-readable strings on the existing market analysis view model. Screens keep rendering view-model fields only. No backend or OpenAPI changes are introduced.

Classification reason-code catalogs are out of scope; the label helper is intentionally reusable so a later feature can add catalogs without a second pattern.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| API OpenAPI (analysis regime enums) | Source of truth for `AnalysisRegimeLabel` and `AnalysisRegimeReasonCode` member sets (REQ-008, REQ-009, NFR-002). Closed sets are mirrored in-app for label coverage tests. |
| App locale catalog `src/locales/en.json` | Stores display English for each known analysis regime label and reason code under stable nested keys (REQ-003, REQ-008, REQ-009, NFR-003). |
| Message helper `src/i18n/messages.ts` (`getMessage`) | Existing access path for feature locale strings. |
| Label helpers (new, thin) | Reusable functions that resolve `(catalog prefix, code) → display text` with safe fallback; analysis catalogs are first consumers (REQ-004, REQ-007). |
| Analysis types / DTO types | Continue to type API codes as OpenAPI enum strings; no display English in types (NFR-001). |
| `mapMarketAnalysis` | Maps DTO → view model; calls label helpers for `regime` label and each reason code; builds humanized summary/level (or equivalent VM fields) (REQ-001, REQ-002, REQ-003, REQ-005). |
| Market analysis screen | Unchanged state machine; continues to bind only to view-model strings (REQ-005, REQ-006). |

```text
DTO (raw codes)
    │
    ▼
mapMarketAnalysis
    │
    ├─► label helper(AnalysisRegimeLabel catalog, regime)
    ├─► label helper(AnalysisRegimeReasonCode catalog, each reason)
    │
    ▼
MarketAnalysisViewModel (human-readable strings)
    │
    ▼
Analysis screen (no code maps)
```

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Humanize in mapper, not in components | Preserves view-model boundary; one place for code→text | REQ-001, REQ-002, REQ-005 |
| Locale catalog + helpers, not inline English | Matches conventions; keeps copy editable | REQ-003, NFR-003, NFR-004 |
| Safe fallback for unknown codes | Avoids failing whole analysis when catalog lags API | REQ-004, NFR-005 |
| Thin reusable helper | Shared infrastructure for future classification without doing classification now | REQ-007, NFR-006 |
| FE-only | Acceptance and backlog forbid BE API changes | NFR-001 |

### Brand UI primitives

This feature does **not** change interactive UI chrome. The Analysis screen continues to use the brand primitives already specified by `view-market-analysis` (`Select`, `Page`, `Stack`, `Text`, `SectionHeading`, `Card`, `Badge`, `Skeleton`, `Alert`, `Button`). No new native HTML controls and no Tailwind/`className` utilities are introduced.

**Exception (documented):** No additional brand primitive is required solely for label lookup; label resolution is a data/mapping concern, not a UI kit control.

### Out of scope (explicit)

- Backend route, DTO, or OpenAPI changes
- Classification locale catalogs and classification screen wiring (pattern only via REQ-007)
- Humanizing non-enum free-text fields already returned as prose by the API (if any)
- Humanizing classification-only enums (`RegimeReasonCode`, `RiskReasonCode`, `EconomicReasonCode`, `ExposureReasonCode`) in this feature
- Changing idle/loading/error chrome or retry semantics

## Data Flow

1. User selects a symbol; existing analysis client fetches `GET /markets/{symbol}/analysis` (unchanged) (REQ-006).
2. On HTTP success, parse/validate payload as today (structural/type failures still fail closed).
3. For `regime.regime` (`AnalysisRegimeLabel`): call label helper → human-readable string written to the view-model field the screen already uses for the regime level/label (REQ-001).
4. For each entry in `regime.reasons` (`AnalysisRegimeReasonCode[]`): call label helper → collect human-readable strings; join into the view-model regime summary (or dedicated summary field already consumed by the screen) using a stable separator (comma + space) (REQ-002).
5. Remaining fields (risk, economic, exposure, catalog) map as today without new label catalogs (NFR-006).
6. Screen renders success view model; raw DTO codes are not passed into UI mapping logic (REQ-005).
7. If a code has no catalog entry: helper returns the safe fallback for that code; mapping continues; screen stays on success when the rest of the payload is valid (REQ-004, NFR-005).

```text
[fetchMarketAnalysis]
        │
        v
[validate DTO shape] --fail--> [error state] (unchanged)
        │ ok
        v
[mapMarketAnalysis]
  regime.regime  --> getAnalysisRegimeLabel(code)
  regime.reasons --> getAnalysisRegimeReasonLabel(code) × N --> summary text
        │
        v
[MarketAnalysisViewModel]
        │
        v
[Analysis screen success UI]
```

## Interfaces

### External API

Unchanged. Contract remains `GET /markets/{symbol}/analysis` as documented in OpenAPI `MarketAnalysisResponse` / `RegimeAssessmentResponse`.

Relevant request fields consumed for humanization:

| DTO path | OpenAPI type | Mapping treatment |
|----------|--------------|-------------------|
| `regime.regime` | `AnalysisRegimeLabel` | Resolve via locale label helper → view-model display string |
| `regime.reasons[]` | `AnalysisRegimeReasonCode` | Resolve each via locale label helper → humanized summary text |

### Internal helpers (public within the FE app)

Suggested surface (names may vary; behavior is mandatory):

| Helper | Input | Output |
|--------|-------|--------|
| Generic label resolver | catalog prefix (or key builder) + `code: string` | Display string: catalog hit, else fallback |
| `getAnalysisRegimeLabel` | `AnalysisRegimeLabel` or string | Human-readable label |
| `getAnalysisRegimeReasonLabel` | `AnalysisRegimeReasonCode` or string | Human-readable reason text |

Helpers MUST read from `getMessage` / locale JSON and MUST NOT contain inline English maps of the OpenAPI members (REQ-003, REQ-007).

### View-model contract

Preserve the market analysis view-model shape already consumed by the Analysis screen (from `view-market-analysis`). At minimum, after mapping:

| View-model field (conceptual) | Content after this feature |
|-------------------------------|----------------------------|
| Regime level / label display | Human-readable `AnalysisRegimeLabel` text (or fallback) |
| Regime summary | Human-readable reason texts joined for known/fallback reasons |

UI components continue to bind to these strings only (REQ-005).

## Data Model

### OpenAPI closed sets in scope (SoT)

**`AnalysisRegimeLabel`:** `TREND_UP`, `TREND_DOWN`, `RANGE`, `CHAOTIC`, `NEWS_SPIKE`

**`AnalysisRegimeReasonCode`:**

- `insufficient_candles`
- `adx_low_band`
- `default`
- `abnormal_range_or_body`
- `relative_volume_spike`
- `relative_trades_spike`
- `volatility_expansion`
- `low_adx_high_atr`
- `frequent_direction_changes`
- `sma_whipsaw`
- `adx_strong`
- `plus_di_dominant`
- `minus_di_dominant`
- `hh_hl_structure`
- `lh_ll_structure`
- `above_sma_rising`
- `below_sma_falling`
- `taker_buy_flow`
- `taker_sell_flow`

### Locale key structure

Group under feature-oriented nested paths (camelCase leaves), default locale `en`:

| Catalog prefix | Key pattern | Example |
|----------------|-------------|---------|
| Regime labels | `analysisLabels.regime.<TOKEN>` | `analysisLabels.regime.TREND_UP` |
| Regime reasons | `analysisLabels.regimeReason.<code>` | `analysisLabels.regimeReason.adx_strong` |

Enum member strings are used as leaf key segments so helpers can resolve `prefix + code` deterministically without a second English map (REQ-003, REQ-008, REQ-009).

Optional future prefixes (not populated in this feature): e.g. `classificationLabels.regimeReason.*` — documents reuse of the same helper pattern (REQ-007, NFR-006).

### Fallback rule

| Condition | Behavior |
|-----------|----------|
| Catalog hit | Return locale English string |
| Missing key / empty catalog value | Return the raw API code string as the display fallback |

Rationale: raw code remains precise and inspectable; mapping never throws solely for catalog miss (REQ-004, NFR-005).

### Screen state

No new states. Existing `idle` | `loading` | `success` | `error` transitions from `view-market-analysis` remain authoritative (REQ-006).

## Error Handling

| Failure | Detection | Behavior |
|---------|-----------|----------|
| Structurally invalid / incomplete analysis payload | Existing mapper validation | Fail closed → analysis error state (unchanged) |
| Known DTO shape with unknown regime label | Catalog miss in label helper | Fallback to raw code; continue success mapping (REQ-004) |
| Known DTO shape with unknown reason code | Catalog miss in label helper | Fallback to raw code for that reason; continue mapping other reasons and fields (REQ-004) |
| Empty `reasons` array | Valid empty list | Success; empty or empty-equivalent summary per existing mapper rules; no error |
| Locale key typo for a known OpenAPI member | Helper miss | Same as unknown-code fallback; treat as defect to fix in tests/catalog, not as HTTP error |

Validation rules:

- Do not upgrade unknown-code fallback into a payload mapping failure.
- Do not catch structural validation errors and convert them into fake success via fallbacks.

## Testing Strategy

| Type | Scope | Expectations |
|------|-------|--------------|
| Unit | Label helpers | Every OpenAPI `AnalysisRegimeLabel` and `AnalysisRegimeReasonCode` resolves to the English listed in Copy / Wording; unknown code returns raw fallback |
| Unit | Locale catalog completeness | Keys exist for the full OpenAPI closed sets (REQ-008, REQ-009) |
| Unit | `mapMarketAnalysis` | Fixture with `TREND_UP` + mixed known reasons → VM shows humanized label and reason summary; mapper source does not contain hardcoded display phrases for those codes |
| Unit | Unknown code in valid payload | Mapping succeeds; fallback appears for the unknown value; other fields still mapped |
| Unit / component | Analysis flows | Idle, loading, error, retry unchanged; success shows humanized copy |
| Component | Boundary | Screen tests use view-model / fixtures with display strings; no component-level DTO code maps |

Coverage: every REQ-* and NFR-* must have at least one automated test or an explicit assertion in mapper/component tests. Prefer asserting against locale values (via `getMessage` or rendered text from the catalog) rather than duplicating English literals only in tests without linking them to the catalog.

## Copy / Wording

Follow `knowledge/writing/` (aligned with `@market-data/brand`).

Tone: precise, calm, formal, data-first. Sentence case for labels. Technical abbreviations that appear in reason codes (ADX, ATR, SMA, DI) may remain when they carry domain meaning. Prefer **Regime** and **Analysis** per terminology; do not use State / Mode / Insights as primary labels for these concepts.

### Design-system keys reused

| Key | Source |
|-----|--------|
| `labels.regime` | `@market-data/brand/wording` (section chrome; unchanged) |
| `common.loading` | `@market-data/brand/wording` (unchanged flows) |
| `common.error` | `@market-data/brand/wording` (unchanged flows) |
| `common.retry` | `@market-data/brand/wording` (unchanged flows) |

No new brand wording keys are required for analysis code catalogs (feature-owned strings).

### Feature keys to add

#### `analysisLabels.regime.*` (`AnalysisRegimeLabel`)

| Key | English | File |
|-----|---------|------|
| `analysisLabels.regime.TREND_UP` | Trend up | `src/locales/en.json` |
| `analysisLabels.regime.TREND_DOWN` | Trend down | `src/locales/en.json` |
| `analysisLabels.regime.RANGE` | Range | `src/locales/en.json` |
| `analysisLabels.regime.CHAOTIC` | Chaotic | `src/locales/en.json` |
| `analysisLabels.regime.NEWS_SPIKE` | News spike | `src/locales/en.json` |

#### `analysisLabels.regimeReason.*` (`AnalysisRegimeReasonCode`)

| Key | English | File |
|-----|---------|------|
| `analysisLabels.regimeReason.insufficient_candles` | Insufficient candles | `src/locales/en.json` |
| `analysisLabels.regimeReason.adx_low_band` | ADX in low band | `src/locales/en.json` |
| `analysisLabels.regimeReason.default` | Default | `src/locales/en.json` |
| `analysisLabels.regimeReason.abnormal_range_or_body` | Abnormal range or body | `src/locales/en.json` |
| `analysisLabels.regimeReason.relative_volume_spike` | Relative volume spike | `src/locales/en.json` |
| `analysisLabels.regimeReason.relative_trades_spike` | Relative trades spike | `src/locales/en.json` |
| `analysisLabels.regimeReason.volatility_expansion` | Volatility expansion | `src/locales/en.json` |
| `analysisLabels.regimeReason.low_adx_high_atr` | Low ADX with high ATR | `src/locales/en.json` |
| `analysisLabels.regimeReason.frequent_direction_changes` | Frequent direction changes | `src/locales/en.json` |
| `analysisLabels.regimeReason.sma_whipsaw` | SMA whipsaw | `src/locales/en.json` |
| `analysisLabels.regimeReason.adx_strong` | Strong ADX | `src/locales/en.json` |
| `analysisLabels.regimeReason.plus_di_dominant` | Plus DI dominant | `src/locales/en.json` |
| `analysisLabels.regimeReason.minus_di_dominant` | Minus DI dominant | `src/locales/en.json` |
| `analysisLabels.regimeReason.hh_hl_structure` | Higher highs and higher lows | `src/locales/en.json` |
| `analysisLabels.regimeReason.lh_ll_structure` | Lower highs and lower lows | `src/locales/en.json` |
| `analysisLabels.regimeReason.above_sma_rising` | Price above rising SMA | `src/locales/en.json` |
| `analysisLabels.regimeReason.below_sma_falling` | Price below falling SMA | `src/locales/en.json` |
| `analysisLabels.regimeReason.taker_buy_flow` | Taker buy flow | `src/locales/en.json` |
| `analysisLabels.regimeReason.taker_sell_flow` | Taker sell flow | `src/locales/en.json` |

Terminology constraints: see `knowledge/writing/terminology.md`. Prefer brand `wording` for shared chrome; keep analysis code catalogs in this app’s `src/locales/en.json`.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Mapper resolves `regime.regime` via `getAnalysisRegimeLabel` into VM display field |
| REQ-002 | Mapper resolves each `regime.reasons[]` via `getAnalysisRegimeReasonLabel` into humanized summary |
| REQ-003 | Locale keys in `src/locales/en.json`; helpers use `getMessage`; no inline English in mapper |
| REQ-004 | Catalog miss returns raw API code; mapping continues |
| REQ-005 | Screen binds view model only; no component-level DTO maps |
| REQ-006 | Analysis idle/loading/success/error/retry unchanged aside from success copy |
| REQ-007 | Generic label resolver + analysis-specific wrappers; classification catalogs deferred |
| REQ-008 | Full `AnalysisRegimeLabel` locale table |
| REQ-009 | Full `AnalysisRegimeReasonCode` locale table |
| NFR-001 | FE-only mapping; no BE/OpenAPI edits |
| NFR-002 | OpenAPI closed sets listed as Data Model SoT |
| NFR-003 | App locale + `getMessage` / label helpers |
| NFR-004 | Copy / Wording section follows writing guidelines |
| NFR-005 | Unknown code does not force error state |
| NFR-006 | Classification catalogs explicitly out of scope |
