# Requirements

## Overview

Content Resolve Boundary routes analysis and classification app-boundary message resolution through the Content module `resolve` API (from `content-catalogs-v1`) and retires feature-local DTO→label catalogs as the source of truth for analysis/classification **narrative** copy that is covered by Content v1 codes. Screens continue to consume view models; UI components do not own code→English maps. Full screen/view-model copy redesign for analysis and classification display belongs to later Feature `analysis-classification-copy`.

## Goals

- Resolve user-facing narrative `MessageRef` values at the app mapping/boundary layer via Content `resolve` with locale and `ui` channel.
- Replace (do not dual-maintain) human-readable-labels / extend-human-readable-labels catalogs as SoT for codes already registered in `content-catalogs-v1`.
- Preserve safe per-code fallback so unknown codes do not fail entire payload mapping.
- Keep the view-model boundary: screens bind VM fields; components do not implement code→English maps.
- Leave analysis and classification idle/loading/success/error/retry flows intact at the boundary.
- Do not invent new Content codes; only resolve codes from the v1 closed set.

## Functional Requirements

```text
REQ-001

WHEN the app mapping/boundary layer maps a successfully validated analysis or classification payload that includes one or more user-facing narrative MessageRef values whose codes are registered in Content catalogs v1,
THE SYSTEM SHALL resolve those MessageRefs through the Content module `resolve` API with channel `ui` and the application default locale (`en` for v1), and SHALL write the resulting display `text` onto the corresponding view-model narrative field(s).
```

```text
REQ-002

WHEN the mapping/boundary layer needs display text for a narrative code that is a member of the Content v1 closed set (analysis catalog narrative codes and classification signal-reason codes from `content-catalogs-v1`),
THE SYSTEM SHALL obtain that text from Content `resolve` (or a thin boundary adapter that calls Content `resolve`) and SHALL NOT use `analysisLabels.*`, `classificationLabels.*`, or equivalent feature-local code→English maps as the source of truth for that code.
```

```text
REQ-003

WHEN Content `resolve` returns a fallback `ResolvedMessage` for an unknown or untemplated narrative code (per `content-catalogs-v1` fallback rules),
THE SYSTEM SHALL apply that fallback text to the affected view-model field only and SHALL continue mapping the remainder of an otherwise valid payload without treating the unknown code as a full payload-mapping failure.
```

```text
REQ-004

WHEN Analysis or Classification screens render a successfully mapped view model after this Feature,
THE SYSTEM SHALL display only view-model fields for narrative copy; UI components SHALL NOT own or invoke code→English maps (neither legacy label catalogs nor Content catalogs) for those narrative values.
```

```text
REQ-005

WHEN Content resolve is introduced at the analysis and classification mapping boundary,
THE SYSTEM SHALL preserve existing analysis and classification idle/empty, loading, success, and error/retry observable flows, except that in-scope narrative success fields are populated via Content-resolved text instead of legacy label-SoT text.
```

```text
REQ-006

THE SYSTEM SHALL provide a thin app-boundary adapter (function or module) over Content `resolve` that fixes channel to `ui` and supplies the default locale, so analysis and classification mappers share one resolution entry point and do not each re-implement locale/channel selection.
```

```text
REQ-007

WHERE a classification signal reason (or equivalent narrative reason field) arrives as a MessageRef, or as a raw reason code string that matches a Content v1 classification signal-reason code,
THE SYSTEM SHALL resolve it via the boundary adapter / Content `resolve` and place the resolved `text` on the classification view-model reason field used by the Classification screen.
```

```text
REQ-008

WHERE an analysis payload includes MessageRef narrative fields for Content v1 analysis catalog codes (for example catalog wait / strategy-allowed / hard-gate narrative refs emitted by BE analysis MessageRef Features),
THE SYSTEM SHALL resolve those refs via the boundary adapter / Content `resolve` and place resolved `text` on the analysis view-model narrative field(s) that previously carried catalog rationale / hard-gate / recommendation narrative prose for those codes.
```

```text
REQ-009

WHEN this Feature is complete,
THE SYSTEM SHALL retire feature-local locale catalog entries and label helpers as SoT for every Content v1 code that overlaps prior `classificationLabels.*` / narrative `analysisLabels.*` maps (delete or stop consulting those keys for resolution), so Content catalogs/templates are the sole SoT for those codes.
```

```text
REQ-010

THE SYSTEM SHALL NOT register, invent, or resolve Content codes outside the closed set defined by `content-catalogs-v1`; non-v1 token humanization (for example AnalysisRegimeLabel `TREND_UP`, AnalysisRegimeReasonCode, StrategyType display tokens, exposure factor keys, risk/economic component names) SHALL NOT be migrated into Content in this Feature.
```

```text
REQ-011

THE Content module and boundary adapter SHALL continue to avoid owning brand chrome / design-system wording from `@market-data/brand` (including `@market-data/brand/wording`); brand product identity and shared chrome remain outside Content.
```

```text
REQ-012

WHEN this Feature is complete,
THE SYSTEM SHALL NOT require Analysis or Classification screens to be redesigned or to gain new narrative sections beyond binding existing view-model fields populated at the boundary; fuller VM/screen copy wiring belongs to Feature `analysis-classification-copy`.
```

## Non-Functional Requirements

```text
NFR-001

Maintainability: Boundary resolution SHALL call into `src/content` public exports (`resolve` / types) and SHALL keep locale/channel defaults in one adapter so later locale selection does not fork per mapper.
```

```text
NFR-002

Compatibility: This Feature SHALL NOT change backend API contracts, OpenAPI documents, or HTTP clients beyond consuming MessageRef-shaped narrative fields already defined by completed BE MessageRef Features / existing FE DTO types.
```

```text
NFR-003

Scope: Full analysis/classification screen and view-model copy redesign (summaries, rationale, levels presentation beyond boundary-populated existing fields), remote content-service, additional locales/channels, ICU plurals, and inventing Content codes for non-v1 tokens are OUT OF SCOPE.
```

```text
NFR-004

Reliability: Structural/type validation failures of analysis or classification payloads SHALL continue to fail closed to the error state; Content fallback applies only to per-message resolve misses, not to invalid payload shape.
```

```text
NFR-005

Compatibility: Existing idle/loading/error/retry chrome and brand UI primitives for Analysis and Classification screens SHALL remain those already specified by prior view Features; this Feature does not introduce new interactive UI chrome.
```

```text
NFR-006

Maintainability: User-facing narrative text for Content v1 codes SHALL come from Content `en`/`ui` templates (already shipped by `content-catalogs-v1`); this Feature SHALL NOT reintroduce duplicate English string tables for those codes in `src/locales/en.json`.
```

## Acceptance Criteria

- [ ] **AC-001 (REQ-001, REQ-006):** Analysis and classification mapping/boundary paths resolve in-scope narrative MessageRefs via Content `resolve` through a shared `ui` + default-locale boundary adapter.
- [ ] **AC-002 (REQ-002, REQ-009, NFR-006):** Feature-local DTO→label maps (`analysisLabels.*` / `classificationLabels.*` style) are no longer the source of truth for Content v1 narrative codes; overlapping locale keys/helpers are retired from resolution.
- [ ] **AC-003 (REQ-003, NFR-004):** Unknown/untemplated narrative codes fall back per Content resolve rules without failing the entire payload mapping; structural invalid payloads still fail closed.
- [ ] **AC-004 (REQ-004, REQ-005, NFR-005):** Screens continue to consume view models only; UI components do not own code→English maps; analysis and classification idle/loading/success/error/retry flows remain intact at the boundary.
- [ ] **AC-005 (REQ-007, REQ-008):** Classification signal reasons and analysis catalog narrative MessageRefs in the v1 set are resolved at the boundary onto existing VM narrative fields.
- [ ] **AC-006 (REQ-010, REQ-011, REQ-012, NFR-001–NFR-003):** No new Content codes; brand chrome stays outside Content; full screen/VM copy wiring is deferred to `analysis-classification-copy`; non-v1 token catalogs are not migrated into Content here.
