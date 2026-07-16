# Requirements

## Overview

Human-Readable Labels maps backend market-analysis DTO enum and reason-code values to human-readable UI text in the frontend mapping and locale layer. Analysis screens continue to render view models only; users see readable regime labels and reason summaries instead of raw API tokens (for example `TREND_UP`). This feature does not change the backend API.

## Goals

- Display analysis regime labels as human-readable copy instead of raw OpenAPI enum tokens.
- Display analysis regime reason codes as human-readable copy in regime summaries.
- Keep all display English in locale catalogs (or shared label helpers fed by those catalogs); mappers must not hardcode display strings inline.
- Fall back safely for unknown codes without failing mapping of an otherwise valid payload.
- Preserve the view-model boundary: UI components do not map raw DTO codes.
- Leave existing market analysis success, loading, and error flows intact.
- Introduce reusable label-resolution infrastructure that analysis uses now and classification can adopt later, without implementing classification catalogs in this feature.

## Functional Requirements

```text
REQ-001

WHEN a successfully retrieved market analysis payload includes a regime label from the OpenAPI enum AnalysisRegimeLabel,
THE SYSTEM SHALL resolve that label to the corresponding human-readable display text before the market analysis view model is presented to the UI.
```

```text
REQ-002

WHEN a successfully retrieved market analysis payload includes one or more regime reason codes from the OpenAPI enum AnalysisRegimeReasonCode,
THE SYSTEM SHALL resolve each reason code to the corresponding human-readable display text that appears in the regime summary presented via the market analysis view model.
```

```text
REQ-003

WHEN the frontend maps a market analysis success payload to a view model,
THE SYSTEM SHALL obtain human-readable label and reason-code text from the application locale catalog (or shared label helpers that read that catalog), and SHALL NOT embed display English string literals for those codes inside the mapper.
```

```text
REQ-004

IF a regime label or regime reason code in a market analysis payload is absent from the frontend label catalog,
THEN THE SYSTEM SHALL apply a documented safe fallback for that value and SHALL continue mapping the remainder of the payload to a view model without treating the unknown code as a full payload-mapping failure.
```

```text
REQ-005

WHEN the market analysis screen renders a successfully mapped view model,
THE SYSTEM SHALL display only view-model fields for regime label and reason text; UI components SHALL NOT read or map raw DTO enum or reason-code tokens for display.
```

```text
REQ-006

WHEN human-readable label resolution is introduced for market analysis,
THE SYSTEM SHALL preserve the existing market analysis success, loading, idle/empty, and error flows (including retry behavior) without changing their observable outcomes except the humanization of regime label and reason text on success.
```

```text
REQ-007

THE SYSTEM SHALL provide a reusable label-resolution helper (or helpers) that map a catalog key path and an API code to display text, such that market analysis uses that helper for AnalysisRegimeLabel and AnalysisRegimeReasonCode, and future features (for example classification) can register additional catalogs without inventing a second mapping pattern.
```

```text
REQ-008

WHERE OpenAPI documents AnalysisRegimeLabel as TREND_UP, TREND_DOWN, RANGE, CHAOTIC, and NEWS_SPIKE,
THE SYSTEM SHALL include a locale catalog entry for each of those values with human-readable English display text.
```

```text
REQ-009

WHERE OpenAPI documents AnalysisRegimeReasonCode as the closed set of analysis regime reason codes,
THE SYSTEM SHALL include a locale catalog entry for each documented value with human-readable English display text.
```

## Non-Functional Requirements

```text
NFR-001

Compatibility: THIS FEATURE SHALL NOT require or introduce backend API contract changes; humanization SHALL occur entirely in the frontend.
```

```text
NFR-002

Compatibility: OpenAPI enums AnalysisRegimeLabel and AnalysisRegimeReasonCode (from the shared OpenAPI document) SHALL be the source of truth for which analysis codes must have catalog entries in scope for this feature.
```

```text
NFR-003

Maintainability: UI copy for analysis labels and reason codes SHALL live under the application locale catalog `src/locales/en.json` and be read via existing message helpers (or thin label helpers built on them), consistent with `knowledge/architecture.md` and `knowledge/conventions.md`.
```

```text
NFR-004

Maintainability: User-facing copy SHALL follow `knowledge/writing/` (voice, capitalization, terminology). Canonical domain terms such as Regime and Analysis SHALL be used; new lasting concepts introduced in labels SHALL align with terminology guidance.
```

```text
NFR-005

Reliability: An unknown analysis label or reason code SHALL NOT cause the market analysis screen to enter the error state solely because of that unknown code, when the rest of the payload maps successfully.
```

```text
NFR-006

Scope: Classification reason-code locale catalogs and classification screen wiring are OUT OF SCOPE for this feature; only the reusable label-resolution pattern (REQ-007) is required to support later reuse.
```

## Acceptance Criteria

- [ ] On a successful analysis response with `regime.regime` = `TREND_UP` (or any other AnalysisRegimeLabel), the Analysis UI shows the catalog human-readable text for that label, not the raw token.
- [ ] On a successful analysis response with one or more `regime.reasons` values, the regime summary shown via the view model uses human-readable reason text for each known code (not a raw comma-joined token list as the sole presentation).
- [ ] Locale keys for every OpenAPI `AnalysisRegimeLabel` and `AnalysisRegimeReasonCode` value exist in `src/locales/en.json` (or an equivalent app locale catalog path approved in design.md).
- [ ] The market analysis mapper (or its label helpers) does not hardcode display English for those codes; it resolves text through the locale / label helper layer.
- [ ] When an undeclared or uncatalogued regime label or reason code appears in an otherwise valid payload, mapping succeeds with a safe fallback for the unknown value and the Analysis screen remains in the success state for that payload.
- [ ] Analysis UI components continue to consume the market analysis view model only and do not implement DTO-code → label maps.
- [ ] Idle/empty, loading, success, and error/retry flows for market analysis remain intact aside from the humanized success copy.
- [ ] A reusable label-resolution helper exists and is used by the analysis mapping path.
