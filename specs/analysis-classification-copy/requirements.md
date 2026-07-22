# Requirements

## Overview

Analysis & Classification Copy Wiring completes view-model and screen binding for Content-resolved narrative deferred from `content-resolve-boundary`. The boundary already resolves Content v1 MessageRefs onto some existing VM fields (classification signal reasons; analysis `catalog_reason` → recommendation rationale). This Feature exposes remaining deferred narrative (notably `hard_gate_reason`) on the analysis view model, ensures Analysis and Classification screens bind resolved display strings only for in-scope Content narrative, and forbids showing raw MessageRef codes, MessageRef objects, or legacy prose dumps as the primary user-facing narrative where MessageRefs are provided. No new Content codes are invented; brand chrome remains outside Content; transitional non-v1 token humanization stays outside Content ownership.

## Goals

- Complete analysis VM exposure for Content-resolved catalog narrative, including deferred `hard_gate_reason`.
- Keep classification VM signal reasons as Content-resolved display strings for Content v1 reason codes.
- Bind Analysis and Classification screens to resolved strings only for in-scope narrative (no component-owned MessageRef→English maps).
- Prefer Content-resolved text over raw API tokens or prose dumps as the primary narrative wherever MessageRefs are provided.
- Preserve existing analysis and classification idle, loading, success, and error/retry flows.
- Use only the closed Content v1 code set from `content-catalogs-v1`; do not reintroduce `analysisLabels.*` as SoT for those codes.

## Functional Requirements

```text
REQ-001

WHEN the analysis mapping/boundary layer maps a successfully validated analysis payload whose `catalog.catalog_reason` is a MessageRef with a Content v1 analysis catalog code,
THE SYSTEM SHALL place Content-resolved display `text` (via the existing `ui` + default-locale boundary adapter from `content-resolve-boundary`) on the analysis view-model recommendation rationale field used by the Analysis screen.
```

```text
REQ-002

WHEN the analysis mapping/boundary layer maps a successfully validated analysis payload whose `catalog.hard_gate_reason` is a MessageRef with a Content v1 analysis catalog code,
THE SYSTEM SHALL place Content-resolved display `text` on a dedicated analysis view-model field for hard-gate narrative (conceptual `hardGateReason`), distinct from recommendation rationale.
```

```text
REQ-003

WHEN the analysis mapping/boundary layer maps a successfully validated analysis payload whose `catalog.hard_gate_reason` is null,
THE SYSTEM SHALL set the hard-gate narrative view-model field to null (or equivalent absent value) and SHALL NOT invent hard-gate copy.
```

```text
REQ-004

WHEN the Classification screen renders a successfully mapped classification view model,
THE SYSTEM SHALL display each signal’s `reason` from the view-model string field only; UI components SHALL NOT map MessageRef codes, raw reason codes, or Content catalog entries to English inline.
```

```text
REQ-005

WHEN the Analysis screen renders a successfully mapped analysis view model,
THE SYSTEM SHALL display recommendation rationale from the view-model rationale string field only; UI components SHALL NOT map MessageRef codes or Content catalogs to English inline for that narrative.
```

```text
REQ-006

WHEN the analysis view model’s hard-gate narrative field is a non-null resolved string,
THE SYSTEM SHALL present that string on the Analysis success UI as hard-gate narrative (within or adjacent to the Recommendation section), and SHALL NOT present the raw MessageRef object or raw message `code` as the primary hard-gate narrative when resolved text is available.
```

```text
REQ-007

WHEN the analysis view model’s hard-gate narrative field is null,
THE SYSTEM SHALL omit hard-gate narrative from the Analysis success UI (no empty hard-gate prose, no placeholder MessageRef).
```

```text
REQ-008

WHERE a MessageRef was provided for an in-scope Content v1 narrative field (analysis `catalog_reason`, analysis `hard_gate_reason`, or classification signal `reason`),
THE SYSTEM SHALL NOT show raw API prose dumps or unstructured token dumps as the primary user-facing narrative for that field; the primary narrative SHALL be the Content-resolved view-model string (including Content per-message fallback text when resolve falls back).
```

```text
REQ-009

WHEN Content resolve / boundary mapping produces fallback text for an unknown or untemplated in-scope narrative code,
THE SYSTEM SHALL still expose that fallback as the view-model string for the affected field and SHALL continue success mapping for an otherwise valid payload (behavior established by `content-resolve-boundary` / `content-catalogs-v1`).
```

```text
REQ-010

THE SYSTEM SHALL NOT register, invent, or resolve Content codes outside the closed set defined by `content-catalogs-v1`.
```

```text
REQ-011

THE SYSTEM SHALL NOT reintroduce `analysisLabels.*` (or equivalent feature-local narrative maps) as the source of truth for Content v1 analysis catalog narrative codes (`catalog.wait`, `catalog.strategy_allowed`, `catalog.no_strategy_allowed`, `catalog.hard_gate.*`).
```

```text
REQ-012

WHERE analysis assessment summaries and levels are not Content v1 MessageRefs (regime label/level, regime-reason summary joins, risk/economic/exposure summary/level construction via transitional `analysisLabels.*` token catalogs),
THE SYSTEM SHALL leave that transitional humanization path intact for this Feature and SHALL NOT migrate those tokens into Content.
```

```text
REQ-013

THE Content module and narrative resolution path SHALL continue to avoid owning brand chrome / design-system wording from `@market-data/brand` (including `@market-data/brand/wording`); brand product identity and shared chrome remain outside Content.
```

```text
REQ-014

WHEN this Feature completes copy wiring,
THE SYSTEM SHALL preserve existing analysis and classification idle/empty, loading, success, and error/retry observable flows, except for binding Content-resolved narrative fields (including hard-gate narrative when present) on success.
```

```text
REQ-015

THE SYSTEM SHALL keep Analysis and Classification screens free of Content catalog imports and free of code→English maps for in-scope narrative; resolution remains at the mapping/boundary layer only.
```

## Non-Functional Requirements

```text
NFR-001

Maintainability: Hard-gate and catalog rationale resolution SHALL continue to use the shared boundary adapter (`resolveUiMessages` or equivalent) from `content-resolve-boundary`; this Feature SHALL NOT fork a second locale/channel policy per screen.
```

```text
NFR-002

Compatibility: This Feature SHALL NOT change backend API contracts, OpenAPI documents, or HTTP client paths beyond consuming MessageRef-shaped narrative fields already defined by completed BE MessageRef Features / existing FE DTO types.
```

```text
NFR-003

Scope: Remote content-service, additional locales/channels, ICU plurals, inventing Content codes for non-v1 tokens (regime SCREAMING_SNAKE labels, AnalysisRegimeReasonCode, StrategyType display tokens, exposure factor keys, risk/economic component names, classification HTTP error machine codes), and migrating brand chrome into Content are OUT OF SCOPE.
```

```text
NFR-004

Reliability: Structural/type validation failures of analysis or classification payloads SHALL continue to fail closed to the error state; Content fallback applies only to per-message resolve misses.
```

```text
NFR-005

Compatibility: Existing idle/loading/error/retry chrome and brand UI primitives for Analysis and Classification screens SHALL remain those already specified by prior view Features; this Feature may add display of an existing/new VM narrative string using existing brand typography/section primitives, but SHALL NOT introduce new interactive chrome patterns.
```

```text
NFR-006

Maintainability: User-facing narrative text for Content v1 codes SHALL come from Content `en`/`ui` templates; this Feature SHALL NOT add duplicate English narrative tables for those codes in `src/locales/en.json`. Feature locale keys MAY be added only for non-narrative chrome labels needed to present hard-gate narrative (e.g. a “Hard gate” field label).
```

## Acceptance Criteria

- [ ] **AC-001 (REQ-001, REQ-005, REQ-008, REQ-015):** Analysis recommendation rationale on the VM and Analysis screen is Content-resolved display text for `catalog_reason` MessageRefs; screens do not map MessageRef codes inline; raw MessageRef / prose dump is not the primary rationale narrative.
- [ ] **AC-002 (REQ-002, REQ-003, REQ-006, REQ-007):** Analysis VM exposes dedicated hard-gate narrative (`hardGateReason` or equivalent): resolved text when `hard_gate_reason` MessageRef is present; null/absent when wire null; Analysis success UI shows it only when non-null.
- [ ] **AC-003 (REQ-004, REQ-008, REQ-015):** Classification signal reasons on the VM and Classification screen are Content-resolved display strings for in-scope reasons; screens do not map MessageRef codes inline; raw MessageRef / prose dump is not the primary reason narrative.
- [ ] **AC-004 (REQ-009, REQ-014, NFR-004, NFR-005):** Unknown-code Content fallback still yields success mapping for valid payloads; analysis and classification idle/loading/success/error/retry flows remain intact.
- [ ] **AC-005 (REQ-010, REQ-011, REQ-012, REQ-013, NFR-001–NFR-003, NFR-006):** No new Content codes; no `analysisLabels.*` SoT for v1 catalog narrative; non-v1 assessment summary/level humanization stays transitional; brand chrome stays outside Content; no duplicate Content narrative strings in app locale JSON.
