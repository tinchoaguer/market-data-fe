# Requirements

## Overview

Reading Layout Shell presents a Symbol Reading as a structured analytical workspace: distinct Regions for Context, Analysis, Classification, Evidence, Market Data, and Diagnostics. Layout follows the adopted Reading UX contract (`knowledge/ux/reading-contract.md`) at gray-box / structural fidelity. Region chrome and spacing use brand tokens and UI kit primitives already available to the frontend. Hi-fi visual polish and Analysis Region internal composition are out of scope.

## Goals

- Present one Symbol Reading as a Region workspace, not a flat dump or equal-weight card wall.
- Make Context and Analysis available in the initial viewport so the Symbol and primary interpretation can be grasped without scrolling for the primary message.
- Keep Analysis the most prominent Region; keep Classification compact and subordinate; keep Market Data and Evidence from dominating the workspace.
- Style Region chrome and spacing with `@market-data/brand` tokens/components (no ad-hoc design system).
- Preserve existing Symbol selection, loading, and error flows for the Reading surface.
- Use canonical terminology: **Symbol** (never Asset as the root term).

## Functional Requirements

```text
REQ-001

WHEN the user opens the Symbol Reading surface, THE SYSTEM SHALL present a Reading workspace that exposes six distinct Regions: Context, Analysis, Classification, Evidence, Market Data, and Diagnostics.
```

```text
REQ-002

WHILE the Symbol Reading workspace is visible, THE SYSTEM SHALL present exactly one Context Region and exactly one Analysis Region.
```

```text
REQ-003

WHILE the Symbol Reading workspace is visible on a happy-path Reading, THE SYSTEM SHALL place Context and Analysis in the primary band of the workspace so the Symbol identity and primary interpretive Region are available without scrolling for that primary message.
```

```text
REQ-004

WHILE the Symbol Reading workspace is visible, THE SYSTEM SHALL present Analysis as the most prominent Region relative to Classification, Evidence, Market Data, and Diagnostics.
```

```text
REQ-005

WHILE the Symbol Reading workspace is visible, THE SYSTEM SHALL present Classification as a compact Region that is visually subordinate to Analysis and adjacent to Analysis (associated, not a substitute for Analysis).
```

```text
REQ-006

WHILE the Symbol Reading workspace is visible, THE SYSTEM SHALL present Evidence and Market Data as supporting Regions that do not dominate the workspace relative to Analysis.
```

```text
REQ-007

WHILE the Symbol Reading workspace is visible, THE SYSTEM SHALL present Diagnostics as a distinct cross-cutting Region that does not replace Analysis as the hero message on a healthy Reading.
```

```text
REQ-008

WHILE the Symbol Reading workspace is visible, THE SYSTEM SHALL order Region attention so interpretation precedes market microstructure: Context, then Analysis, then Classification, then Evidence, then Market Data (Diagnostics may elevate when trust is compromised, without becoming the sole content of the primary band).
```

```text
REQ-009

WHEN rendering Region chrome for the Reading workspace, THE SYSTEM SHALL use `@market-data/brand` tokens and UI kit primitives for region structure, spacing, and typography, and SHALL NOT introduce an ad-hoc parallel design system for that chrome.
```

```text
REQ-010

WHEN a Region’s full product content is not yet composed for this Feature, THE SYSTEM SHALL still expose that Region as a labeled gray-box structural placeholder within the Reading workspace.
```

```text
REQ-011

WHILE the Symbol Reading surface is available, THE SYSTEM SHALL keep Symbol selection usable so the user can choose a supported trading Symbol for the Reading.
```

```text
REQ-012

WHILE a Reading-related data request for the selected Symbol is in progress, THE SYSTEM SHALL present a loading state on the Reading surface.
```

```text
REQ-013

IF a Reading-related data request for the selected Symbol fails, THEN THE SYSTEM SHALL present an error state on the Reading surface with a recovery action that retries the failed request for that Symbol.
```

```text
REQ-014

WHEN no supported trading Symbol is selected, THE SYSTEM SHALL not treat the Reading as a successful Symbol Reading and SHALL present an empty / prompt state that asks the user to select a Symbol.
```

```text
REQ-015

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode user-facing English in components.
```

```text
REQ-016

THE SYSTEM SHALL NOT present Market Data as the primary interpretive Region of the Symbol Reading, and SHALL NOT present all Regions with equal visual weight.
```

```text
REQ-017

THE SYSTEM SHALL NOT introduce a standalone Narrative Region or an Overall State / Overall Score Region that replaces Analysis as the primary interpretive Region of the Reading.
```

## Non-Functional Requirements

```text
NFR-001

THE SYSTEM SHALL implement this Feature with React 19, TypeScript, and Vite, consistent with knowledge/architecture.md.
```

```text
NFR-002

THE SYSTEM SHALL consume shared UI primitives, tokens, and shared wording from `@market-data/brand` where applicable, and SHALL NOT fork brand tokens or rewrite shared design-system copy locally.
```

```text
NFR-003

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/reading-contract.md: Symbol (not Asset), Analysis, Classification, Market Data, Regime, Risk, Economic, Exposure, Recommendation.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in `src/locales/en.json` and read them via the application message helpers; shared product identity and shared domain labels SHALL prefer `@market-data/brand/wording`.
```

```text
NFR-006

WHEN a matching export exists in `@market-data/brand/ui`, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

Layout fidelity for this Feature SHALL be gray-box / structural per knowledge/ux/reading-contract.md; hi-fi Figma polish SHALL NOT be a completion gate.
```

```text
NFR-008

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Reading Region structure SHALL follow knowledge/ux/reading-contract.md only (no dependency on sibling-repo brand visual-definition paths).
```

## Acceptance Criteria

- [ ] AC-001: The Symbol Reading surface exposes distinct Context, Analysis, Classification, Evidence, Market Data, and Diagnostics Regions (gray-box structure acceptable).
- [ ] AC-002: Context and Analysis appear in the primary band so the Symbol and primary interpretation can be grasped without scrolling for the primary message.
- [ ] AC-003: Analysis is the most prominent Region; Classification is compact and subordinate; Market Data and Evidence do not dominate the workspace.
- [ ] AC-004: Region chrome and spacing use brand tokens/components already available to the FE (no ad-hoc design system).
- [ ] AC-005: Layout follows `knowledge/ux/reading-contract.md` hierarchy and anti-patterns (no equal-weight Region wall; no Market-Data-first Reading; no standalone Narrative or Overall Score Region).
- [ ] AC-006: Existing Symbol selection, loading, and error flows remain usable on the Reading surface.
- [ ] AC-007: User-facing strings come from locale catalogs / brand wording, not hardcoded English in components.
