# Requirements

## Overview

Extend Human-Readable Labels extends the existing locale-backed label helpers (from Human-Readable Labels) beyond `AnalysisRegimeLabel` and `AnalysisRegimeReasonCode`. Classification reason codes, analysis strategy catalog tokens, exposure factor names, and analysis risk/economic component names shown in the UI are resolved to human-readable text in the frontend mapping layer. Screens continue to render view models only. This feature does not change the backend API or OpenAPI document.

## Goals

- Display classification regime, risk, economic, and exposure reason codes as human-readable copy instead of raw API tokens.
- Display analysis preferred strategy / catalog strategy tokens (for example `TREND_FOLLOWING`) as human-readable copy.
- Display analysis exposure factor names (for example `vol_budget_pct`) as human-readable copy.
- Display analysis risk and economic component names in component summaries as human-readable copy.
- Keep display English in locale catalogs; mappers use existing `resolveLabel` helpers (or thin wrappers) and must not hardcode display English inline.
- Fall back safely to the raw code for unknown values without failing payload mapping.
- Preserve the view-model boundary: UI components do not map raw DTO codes.
- Leave existing analysis and classification success, loading, and error flows intact.
- Reuse the label-resolution pattern already introduced for analysis regime labels and reason codes; do not re-implement those catalogs.

## Functional Requirements

```text
REQ-001

WHEN a successfully retrieved market classification payload includes a regime signal whose reason is a RegimeReasonCode value,
THE SYSTEM SHALL resolve that reason to the corresponding human-readable display text on the classification view model before the Classification UI is presented.
```

```text
REQ-002

WHEN a successfully retrieved market classification payload includes a risk signal whose reason is a RiskReasonCode value,
THE SYSTEM SHALL resolve that reason to the corresponding human-readable display text on the classification view model before the Classification UI is presented.
```

```text
REQ-003

WHEN a successfully retrieved market classification payload includes an economic signal whose reason is an EconomicReasonCode value,
THE SYSTEM SHALL resolve that reason to the corresponding human-readable display text on the classification view model before the Classification UI is presented.
```

```text
REQ-004

WHEN a successfully retrieved market classification payload includes an exposure signal whose reason is an ExposureReasonCode value,
THE SYSTEM SHALL resolve that reason to the corresponding human-readable display text on the classification view model before the Classification UI is presented.
```

```text
REQ-005

WHEN a successfully retrieved market analysis payload includes a preferred strategy (or catalog strategy token used as recommendation name or catalog identifier) from the closed StrategyType set,
THE SYSTEM SHALL resolve that token to the corresponding human-readable display text on the market analysis view model before the Analysis UI is presented.
```

```text
REQ-006

WHEN a successfully retrieved market analysis payload includes exposure component factor keys from ExposureComponentsResponse,
THE SYSTEM SHALL resolve each factor key to the corresponding human-readable display name on the exposure factors presented via the market analysis view model.
```

```text
REQ-007

WHEN a successfully retrieved market analysis payload includes risk assessment component name tokens used in the risk components summary,
THE SYSTEM SHALL resolve each known component name to the corresponding human-readable display text in the summary (or equivalent view-model field) presented to the UI.
```

```text
REQ-008

WHEN a successfully retrieved market analysis payload includes economic assessment component name tokens used in the economic components summary,
THE SYSTEM SHALL resolve each known component name to the corresponding human-readable display text in the summary (or equivalent view-model field) presented to the UI.
```

```text
REQ-009

WHEN the frontend maps a successful classification or analysis payload to a view model for codes in scope for this feature,
THE SYSTEM SHALL obtain human-readable text from the application locale catalog via the existing resolveLabel helper (or thin wrappers over it), and SHALL NOT embed display English string literals for those codes inside the mapper.
```

```text
REQ-010

IF a classification reason code, strategy token, exposure factor key, or risk/economic component name in an otherwise valid payload is absent from the frontend label catalog,
THEN THE SYSTEM SHALL fall back to the raw code string for that value and SHALL continue mapping the remainder of the payload to a view model without treating the unknown code as a full payload-mapping failure.
```

```text
REQ-011

WHEN the Classification or Analysis screen renders a successfully mapped view model,
THE SYSTEM SHALL display only view-model fields for the humanized values in scope; UI components SHALL NOT read or map raw DTO reason codes, strategy tokens, factor keys, or component names for display.
```

```text
REQ-012

WHEN extended human-readable label resolution is introduced,
THE SYSTEM SHALL preserve the existing market analysis and market classification success, loading, idle/empty, and error flows (including retry behavior) without changing their observable outcomes except the humanization of the in-scope success display strings.
```

```text
REQ-013

WHERE OpenAPI documents RegimeReasonCode, RiskReasonCode, EconomicReasonCode, and ExposureReasonCode closed sets,
THE SYSTEM SHALL include a locale catalog entry for each documented member with human-readable English display text.
```

```text
REQ-014

WHERE the closed StrategyType token set used for catalog preferred_strategy (and catalog strategy identifiers shown via recommendation name or catalogId) is TREND_FOLLOWING, RANGE_BOUNDING, PING_PONG, NEWS_TRADING, and OTHER,
THE SYSTEM SHALL include a locale catalog entry for each of those values with human-readable English display text.
```

```text
REQ-015

WHERE ExposureComponentsResponse defines factor keys vol_budget_pct and liquidity_cap_value,
THE SYSTEM SHALL include a locale catalog entry for each of those keys with human-readable English display text.
```

```text
REQ-016

WHERE analysis risk component names used in components summaries are the closed set volatility, atr_expansion, regime, and liquidity_stress, and economic component names are microstructure, activity, range_economics, and cost_drag,
THE SYSTEM SHALL include a locale catalog entry for each of those values with human-readable English display text.
```

```text
REQ-017

THE SYSTEM SHALL reuse the existing resolveLabel(catalogPrefix, code) pattern (and existing AnalysisRegimeLabel / AnalysisRegimeReasonCode catalogs unchanged) rather than introducing a second label-resolution approach for the catalogs added by this feature.
```

## Non-Functional Requirements

```text
NFR-001

Compatibility: THIS FEATURE SHALL NOT require or introduce backend API or OpenAPI contract changes; humanization SHALL occur entirely in the frontend.
```

```text
NFR-002

Compatibility: API OpenAPI enums RegimeReasonCode, RiskReasonCode, EconomicReasonCode, ExposureReasonCode, and schema ExposureComponentsResponse property names SHALL be the source of truth for those closed sets. StrategyType tokens and risk/economic component name tokens SHALL match the closed sets documented in design.md Data Model (aligned with analysis StrategyType and component-summary usage).
```

```text
NFR-003

Maintainability: UI copy for the new label catalogs SHALL live under the application locale catalog `src/locales/en.json` and be read via existing message helpers / resolveLabel (or thin wrappers), consistent with `knowledge/architecture.md` and `knowledge/conventions.md`.
```

```text
NFR-004

Maintainability: User-facing copy SHALL follow `knowledge/writing/` (voice, capitalization, terminology). Canonical domain terms such as Regime, Risk, Economic, Exposure, Analysis, Classification, and Recommendation SHALL be used; technical abbreviations that are domain-meaningful (for example ATR) MAY remain in labels.
```

```text
NFR-005

Reliability: An unknown in-scope code SHALL NOT cause the Analysis or Classification screen to enter the error state solely because of that unknown code, when the rest of the payload maps successfully.
```

```text
NFR-006

Scope: Re-humanizing AnalysisRegimeLabel and AnalysisRegimeReasonCode catalogs, humanizing free-text catalog_reason / hard_gate_reason prose, humanizing classification signal.source values, and changing idle/loading/error chrome or retry semantics are OUT OF SCOPE.
```

## Acceptance Criteria

- [ ] On a successful classification response, each regime / risk / economic / exposure signal reason from the OpenAPI reason-code enums is shown as catalog human-readable text (not the raw token as the sole presentation for known codes).
- [ ] On a successful analysis response, preferred strategy / catalog strategy tokens such as `TREND_FOLLOWING` are shown as human-readable text via the recommendation view-model fields.
- [ ] On a successful analysis response, exposure factor names such as `vol_budget_pct` are shown as human-readable text.
- [ ] On a successful analysis response, risk and economic component names in summaries are shown as human-readable text.
- [ ] Locale keys for every in-scope closed-set member exist in `src/locales/en.json`; mappers resolve via `resolveLabel` (or thin wrappers) and do not hardcode display English for those codes.
- [ ] When an uncatalogued in-scope code appears in an otherwise valid payload, mapping succeeds with raw-code fallback for that value and the screen remains in the success state.
- [ ] Analysis and Classification UI components continue to consume view models only and do not implement DTO-code → label maps.
- [ ] Idle/empty, loading, success, and error/retry flows for analysis and classification remain intact aside from the humanized success copy.
- [ ] Existing `analysisLabels.regime.*` and `analysisLabels.regimeReason.*` catalogs and their helpers remain in place without being reworked as part of this feature’s functional scope.
