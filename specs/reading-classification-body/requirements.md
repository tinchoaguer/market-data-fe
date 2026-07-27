# Requirements

## Overview

Reading Classification Body fills the Reading’s Classification Region with compact signal packaging per dimension (Regime, Risk, Economic, Exposure): each displayed signal shows source, score, and reason — not a count-only summary. Classification remains a Reading sibling Region, visually subordinate and adjacent to Analysis, never nested as an Analysis-owned Region inside Assessments. Composition follows the adopted Reading UX contract (`knowledge/ux/reading-contract.md`) at gray-box / structural fidelity, reuses existing Classification mapping and Content-resolved reason strings, and uses brand tokens and UI kit primitives already available to the frontend. This Feature depends on the Classification Region host from Feature `reading-layout-shell` and respects Analysis ownership from Feature `reading-analysis-composition`. Hi-fi visual polish is out of scope.

## Goals

- Fill Classification with discrete signal packaging for the same four axes as Analysis (Regime / Risk / Economic / Exposure).
- Show source, score, and reason for each displayed signal (reason as human-readable narrative when available from existing Content-resolved mapping).
- Keep Classification compact, adjacent to Analysis, and visually subordinate — never equal prominence to Analysis.
- Forbid nesting Classification as an Analysis-owned Region inside Assessments.
- Forbid count-only or rollup packaging that replaces per-signal source / score / reason.
- Style Classification body chrome with `@market-data/brand` tokens/components (no ad-hoc design system).
- Bind user-facing labels and reasons from locale catalogs / brand wording / Content-resolved view-model strings — no hardcoded designed English in components.
- Use canonical terminology: **Symbol**, **Classification**, **Regime**, **Risk**, **Economic**, **Exposure**.

## Functional Requirements

```text
REQ-001

WHEN the Classification Region of a successful Symbol Reading is shown and Classification content for the selected Symbol is available, THE SYSTEM SHALL present Classification body composition that packages signals into four dimension groups: Regime, Risk, Economic, and Exposure (empty groups allowed).
```

```text
REQ-002

WHILE the Classification Region body is visible on a successful Reading with Classification content, THE SYSTEM SHALL expose each of the four dimension groups (Regime, Risk, Economic, Exposure) as a distinct signal group, including when a group’s signal list is empty.
```

```text
REQ-003

WHEN a classification signal is displayed inside the Classification Region body, THE SYSTEM SHALL show that signal’s source, score, and reason.
```

```text
REQ-004

WHEN a displayed signal’s reason is available as a human-readable narrative string from the existing Classification view model (Content-resolved or otherwise already mapped display text), THE SYSTEM SHALL present that narrative as the signal’s reason and SHALL NOT present a count-only summary of signals as a substitute for that packaging.
```

```text
REQ-005

WHILE the Classification Region body is visible, THE SYSTEM SHALL keep Classification compact and visually subordinate to Analysis, and SHALL keep Classification adjacent to Analysis as an associated Reading Region (not a substitute for Analysis).
```

```text
REQ-006

THE SYSTEM SHALL NOT nest Classification as an Analysis-owned Region inside the Assessments workspace; Classification SHALL remain a sibling Reading Region of Analysis.
```

```text
REQ-007

THE SYSTEM SHALL NOT introduce a Primary/Secondary Classification taxonomy, a fifth analytical engine, or an Overall Classification / Overall Score rollup that replaces the four dimension signal groups.
```

```text
REQ-008

WHEN rendering Classification Region body chrome and signal packaging structure, THE SYSTEM SHALL use `@market-data/brand` tokens and UI kit primitives for structure, spacing, and typography, and SHALL NOT introduce an ad-hoc parallel design system for that chrome.
```

```text
REQ-009

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise) and SHALL bind signal reason text from the Classification view-model display string; components SHALL NOT hardcode designed English or map MessageRef / Content codes to English inline.
```

```text
REQ-010

THE SYSTEM SHALL host this composition inside the Classification Region provided by the Reading layout shell and SHALL NOT redefine or replace the Reading-wide Region map (Context, Analysis, Evidence, Market Data, Diagnostics) owned by Feature reading-layout-shell.
```

```text
REQ-011

THE SYSTEM SHALL NOT present Assessment outcomes, Recommendation stance, Evidence Drivers / Features / Contributions tables, Market Data microstructure, or Diagnostics trust elevation chrome as content owned by the Classification Region body.
```

```text
REQ-012

WHEN Classification content for the selected Symbol is not yet available beyond Region chrome (loading, error, or idle Reading host states), THE SYSTEM SHALL defer to the Reading host’s existing selection / loading / error behavior and SHALL NOT invent a parallel Classification-only success packaging that claims a successful Reading Classification body without host success.
```

```text
REQ-013

WHEN Classification mapping for the selected Symbol yields empty signal arrays for one or more dimension groups, THE SYSTEM SHALL still expose those dimension groups in the Classification body and SHALL NOT treat empty groups alone as a Classification fetch failure.
```

```text
REQ-014

WHEN Classification signal content is available from existing Classification mapping for the selected Symbol, THE SYSTEM SHALL surface that mapped content (source, score, reason per signal) inside the Classification Region body without requiring a new backend API, DTO field, or OpenAPI change.
```

```text
REQ-015

WHILE the Classification Region body is visible on a successful Reading, THE SYSTEM SHALL package signals per dimension and SHALL NOT replace that packaging with a count-only summary (for example “3 regime signals”) as the sole Classification body content.
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

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/reading-contract.md: Symbol (not Asset), Classification (not Tags or Categories), Regime, Risk, Economic, Exposure; and SHALL NOT use Overall Classification / Overall Score as owned Classification Regions.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in `src/locales/en.json` and read them via the application message helpers; shared domain labels (Regime, Risk, Economic, Exposure, Classification) SHALL prefer `@market-data/brand/wording`.
```

```text
NFR-006

WHEN a matching export exists in `@market-data/brand/ui`, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

Composition fidelity for this Feature SHALL be gray-box / structural per knowledge/ux/reading-contract.md; hi-fi Figma polish SHALL NOT be a completion gate.
```

```text
NFR-008

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Classification Region packaging SHALL follow knowledge/ux/reading-contract.md (and Analysis ownership boundaries from knowledge/ux/analysis-contract.md where they forbid nesting Classification under Analysis); no dependency on sibling-repo brand visual-definition paths.
```

```text
NFR-009

THE SYSTEM SHALL NOT require new backend APIs, DTO fields, or OpenAPI changes to complete this Feature; reuse existing Classification payload mapping and Content-resolved reason strings from prior Features (`view-market-classification`, `analysis-classification-copy` / Content boundary).
```

## Acceptance Criteria

- [ ] AC-001: Classification Region shows regime, risk, economic, and exposure signal groups (empty groups allowed).
- [ ] AC-002: Each displayed signal shows source, score, and reason (reason as human-readable narrative when available).
- [ ] AC-003: Classification remains compact and visually subordinate / adjacent to Analysis — not equal prominence.
- [ ] AC-004: Classification is not nested as an Analysis-owned Region inside Assessments.
- [ ] AC-005: Region body uses brand tokens/components already available to the FE.
- [ ] AC-006: User-facing labels and reasons come from locale / Content-resolved copy — no hardcoded designed English in components.
- [ ] AC-007: Classification body is not a count-only summary; per-signal source / score / reason packaging is present when signals exist.
- [ ] AC-008: Composition follows `knowledge/ux/reading-contract.md` anti-patterns (no Primary/Secondary Classification taxonomy; no Overall Classification rollup; Classification sibling of Analysis).
