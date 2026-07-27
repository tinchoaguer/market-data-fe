# Requirements

## Overview

Reading Analysis Composition structures the internals of the Reading’s Analysis Region as one Assessments workspace: peer Assessment units for Regime, Risk, Economic, and Exposure; a compact Recommendation composed with those Assessments; and Narrative bound to Assessment/Recommendation claims. Composition follows the adopted Analysis UX contract (`knowledge/ux/analysis-contract.md`) at gray-box / structural fidelity. Assessment and Recommendation chrome use brand tokens and UI kit primitives already available to the frontend. This Feature depends on the Analysis Region host from Feature `reading-layout-shell`. Hi-fi visual polish and Evidence depth expansion are out of scope.

## Goals

- Present interpretation inside Analysis as one Assessments workspace with four independent peer dimensions (Regime, Risk, Economic, Exposure).
- Compose Recommendation with Assessments (stance visible without scrolling for the stance) rather than as a standalone primary Region.
- Bind Narrative to Assessment/Recommendation claims; never present a detached Narrative Region or essay block as a peer Region.
- Forbid Overall Assessment / Overall Score / Synthesis rollups that replace the four peer dimensions.
- Keep Evidence, Diagnostics, Classification, and Market Data as Reading-level references — not Analysis-owned Regions nested under Assessments.
- Style Assessment/Recommendation chrome with `@market-data/brand` tokens/components (no ad-hoc design system).
- Use canonical terminology: **Symbol**, **Analysis**, **Regime**, **Risk**, **Economic**, **Exposure**, **Recommendation**.

## Functional Requirements

```text
REQ-001

WHEN the Analysis Region of a successful Symbol Reading is shown, THE SYSTEM SHALL present exactly one Assessments workspace inside that Analysis Region.
```

```text
REQ-002

WHILE the Assessments workspace is visible, THE SYSTEM SHALL present four peer Assessment units for Regime, Risk, Economic, and Exposure as an independent peer collection (no Assessment unit owns another).
```

```text
REQ-003

WHILE the Assessments workspace is visible, THE SYSTEM SHALL keep contradictory Assessment outcomes visible when present and SHALL NOT hide dimensional conflicts behind a single rollup outcome.
```

```text
REQ-004

WHILE the Assessments workspace is visible, THE SYSTEM SHALL compose Recommendation inside the Assessments workspace (not as a standalone primary Reading Region and not as a fifth Assessment engine).
```

```text
REQ-005

WHEN the Analysis Region is shown in the initial Analysis viewport of a successful Reading, THE SYSTEM SHALL make the Recommendation stance visible without requiring the user to scroll within Analysis solely to see that stance.
```

```text
REQ-006

WHILE the Assessments workspace is visible, THE SYSTEM SHALL present Recommendation after the Assessment peer collection in attention order (dimensional interpretation before stance).
```

```text
REQ-007

WHILE the Assessments workspace is visible, THE SYSTEM SHALL present Narrative material only as content bound to Assessment and/or Recommendation claims, and SHALL NOT introduce a detached Narrative Region or chrome-labeled essay Region as a peer of Assessments.
```

```text
REQ-008

THE SYSTEM SHALL NOT present an Overall Assessment Region, Overall Score Region, Synthesis Region, or any rollup ownership node that replaces the four Assessment dimensions as the interpretation.
```

```text
REQ-009

WHILE the Assessments workspace is visible, THE SYSTEM SHALL order Analysis attention so interpretation precedes explanation references: Assessment dimensions, then Recommendation, then claim-bound Narrative, then Evidence references on demand (Diagnostics may interrupt when blocking without becoming a fifth Assessment dimension).
```

```text
REQ-010

THE SYSTEM SHALL NOT nest Classification, Evidence, Market Data, or Diagnostics as Analysis-owned Regions inside the Assessments workspace; those remain Reading Regions referenced from Analysis claims when applicable.
```

```text
REQ-011

WHEN rendering Assessment unit and Recommendation chrome inside Analysis, THE SYSTEM SHALL use `@market-data/brand` tokens and UI kit primitives for structure, spacing, and typography, and SHALL NOT introduce an ad-hoc parallel design system for that chrome.
```

```text
REQ-012

WHEN an Assessment unit’s full product detail is not yet composed for this Feature, THE SYSTEM SHALL still expose that unit as a labeled gray-box structural placeholder within the Assessments peer collection.
```

```text
REQ-013

WHEN Recommendation stance content is available from existing Analysis mapping for the selected Symbol, THE SYSTEM SHALL surface that stance inside the Assessments-composed Recommendation unit; WHEN stance detail is not yet composed beyond structure, THE SYSTEM SHALL still expose a labeled Recommendation placeholder composed with Assessments.
```

```text
REQ-014

WHEN Assessment outcome content is available from existing Analysis mapping for the selected Symbol, THE SYSTEM SHALL surface each available dimension outcome (label/score/level as already mapped) inside its peer Assessment unit; WHEN a dimension outcome is not yet composed beyond structure, THE SYSTEM SHALL keep the peer unit visible as a labeled gray-box.
```

```text
REQ-015

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode user-facing English in components.
```

```text
REQ-016

WHILE the Assessments workspace is visible, THE SYSTEM SHALL keep Assessment outcomes structurally always visible in the peer collection (detail may expand) and SHALL keep Recommendation chrome compact relative to the Dimension collection.
```

```text
REQ-017

THE SYSTEM SHALL host this composition inside the Analysis Region provided by the Reading layout shell and SHALL NOT redefine or replace the Reading-wide Region map (Context, Classification, Evidence, Market Data, Diagnostics) owned by Feature reading-layout-shell.
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

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/analysis-contract.md: Symbol (not Asset), Analysis, Regime, Risk, Economic, Exposure, Recommendation; and SHALL NOT use Overall Assessment, Overall Score, or Synthesis as owned Analysis Regions.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in `src/locales/en.json` and read them via the application message helpers; shared domain labels (Regime, Risk, Economic, Exposure, Recommendation) SHALL prefer `@market-data/brand/wording`.
```

```text
NFR-006

WHEN a matching export exists in `@market-data/brand/ui`, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

Composition fidelity for this Feature SHALL be gray-box / structural per knowledge/ux/analysis-contract.md; hi-fi Figma polish SHALL NOT be a completion gate.
```

```text
NFR-008

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Analysis composition SHALL follow knowledge/ux/analysis-contract.md only (no dependency on sibling-repo brand visual-definition paths).
```

```text
NFR-009

THE SYSTEM SHALL NOT require new backend APIs, DTO fields, or OpenAPI changes to complete this Feature; reuse existing Analysis payload mapping where content is shown.
```

## Acceptance Criteria

- [ ] AC-001: The Analysis Region contains one Assessments workspace with peer units for Regime, Risk, Economic, and Exposure (gray-box structure acceptable).
- [ ] AC-002: Recommendation is composed with Assessments (not a standalone primary Region) and is visible in the initial Analysis viewport without scrolling for the stance.
- [ ] AC-003: Narrative appears bound to Assessment/Recommendation claims — not as a detached essay Region.
- [ ] AC-004: No Overall Assessment / Overall Score / Synthesis Region or rollup that replaces the four Assessment dimensions.
- [ ] AC-005: Composition follows `knowledge/ux/analysis-contract.md` hierarchy and anti-patterns (interpretation before Evidence; Classification not nested as an Analysis-owned Region).
- [ ] AC-006: Assessment/Recommendation chrome uses brand tokens/components already available to the FE.
- [ ] AC-007: User-facing strings come from locale catalogs / brand wording, not hardcoded English in components.
