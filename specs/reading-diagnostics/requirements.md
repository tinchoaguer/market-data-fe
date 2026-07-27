# Requirements

## Overview

Reading Diagnostics wires the Reading’s Diagnostics Region per the adopted Diagnostics UX contract (`knowledge/ux/diagnostics-contract.md`): quiet when healthy, elevated when blocking or strongly qualifying trust; trust qualification signals (insufficient / partial / stale or equivalent mapped signals) without becoming the hero message. Confidence / data quality stays in Diagnostics and is never presented as an Assessment dimension inside Analysis. Composition uses brand tokens and UI kit primitives already available to the frontend at gray-box / structural fidelity. This Feature depends on the Diagnostics Region host from Feature `reading-layout-shell` and respects Analysis ownership from Feature `reading-analysis-composition` and Evidence ownership from Feature `reading-evidence-composition`. Hi-fi visual polish is out of scope.

## Goals

- Present Diagnostics as the trust / data-quality layer answering “Can I trust this reading?”
- Keep Diagnostics quiet / minimal when healthy so they do not compete with Analysis for primary attention.
- Elevate Diagnostics near the affected Reading when blocking or strongly qualifying trust, unmistakably, without replacing Analysis as the hero message.
- Wire trust qualification for insufficient / partial / stale (or equivalent mapped signals) into the Diagnostics Region.
- Forbid confidence / data quality as an Assessment dimension inside Analysis.
- Forbid burying blocking Diagnostics only at page end or only inside Evidence tables.
- Style Diagnostics chrome with `@market-data/brand` tokens/components (no ad-hoc design system).
- Use canonical terminology: **Symbol**, **Analysis**, **Diagnostics**, **Evidence**.

## Functional Requirements

```text
REQ-001

WHEN the Diagnostics Region of a successful Symbol Reading is shown, THE SYSTEM SHALL present a distinct Diagnostics composition that communicates trust / data-quality status for the Reading (gray-box structure acceptable when no active Diagnostics signals are present).
```

```text
REQ-002

WHILE the Diagnostics Region is visible and no blocking or strongly qualifying trust signals are active for the Reading, THE SYSTEM SHALL present Diagnostics in a quiet / minimal state that does not compete with Analysis for primary attention and SHALL NOT present Diagnostics as the hero message.
```

```text
REQ-003

WHEN one or more blocking or strongly qualifying trust signals are active for the Reading, THE SYSTEM SHALL elevate Diagnostics near the affected Reading so the qualification is unmistakable, and SHALL NOT replace Analysis as the hero interpretive message.
```

```text
REQ-004

WHEN trust-qualification signals are available from existing Reading / Analysis mapping for the selected Symbol, THE SYSTEM SHALL surface insufficient, partial, stale, or equivalent mapped trust signals inside the Diagnostics Region (not as Assessment peer dimensions).
```

```text
REQ-005

THE SYSTEM SHALL NOT present confidence, data quality, or trust qualification as an Assessment dimension inside the Analysis Assessments workspace.
```

```text
REQ-006

THE SYSTEM SHALL NOT bury blocking Diagnostics solely as an epilogue discoverable only after scrolling past Market Data, and SHALL NOT present hard trust failures solely inside Evidence tables without elevating them in the Diagnostics Region.
```

```text
REQ-007

WHILE Diagnostics are elevated for blocking or strongly qualifying trust, THE SYSTEM SHALL keep Analysis outcomes and Recommendation stance as the interpretive message; Diagnostics SHALL qualify that message and SHALL NOT conclude Regime / Risk / Economic / Exposure or issue Recommendation stance.
```

```text
REQ-008

WHEN rendering Diagnostics Region chrome and trust-status structure, THE SYSTEM SHALL use `@market-data/brand` tokens and UI kit primitives for structure, spacing, and typography, and SHALL NOT introduce an ad-hoc parallel design system for that chrome.
```

```text
REQ-009

WHEN no active trust-qualification signals are mapped for the selected Symbol, THE SYSTEM SHALL still expose a labeled Diagnostics Region in the quiet / minimal state (gray-box or equivalent healthy status chrome acceptable).
```

```text
REQ-010

WHILE the Diagnostics Region is visible, THE SYSTEM SHALL keep Diagnostics as a cross-cutting Reading Region (minimal when healthy; may grow when elevated) and SHALL NOT present Diagnostics as the Extra-large primary interpretive workspace of the Reading.
```

```text
REQ-011

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode user-facing English in components.
```

```text
REQ-012

THE SYSTEM SHALL host this composition inside the Diagnostics Region provided by the Reading layout shell and SHALL NOT redefine or replace the Reading-wide Region map (Context, Analysis, Classification, Evidence, Market Data) owned by Feature reading-layout-shell.
```

```text
REQ-013

THE SYSTEM SHALL NOT present Assessment outcomes, Recommendation stance, Narrative prose, Classification signal lists, Market Data microstructure, or Evidence Drivers / Features / Contributions tables as content owned by the Diagnostics Region.
```

```text
REQ-014

WHEN Diagnostics elevate for blocking trust, THE SYSTEM SHALL expand or otherwise present elevated Diagnostics status chrome (collapsible / contextual when not blocking) so blocking status is not hidden behind a collapsed-only control.
```

```text
REQ-015

THE SYSTEM SHALL NOT show diagnostic plumbing codes as the primary Analysis Region body text; trust status copy SHALL live in Diagnostics (Narrative MAY state a limitation when inputs are weak, without owning Diagnostics status chrome).
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

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/diagnostics-contract.md: Symbol (not Asset), Analysis, Diagnostics, Evidence; and SHALL NOT use Confidence as an Assessment dimension label.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in `src/locales/en.json` and read them via the application message helpers; shared domain labels SHALL prefer `@market-data/brand/wording` when reused.
```

```text
NFR-006

WHEN a matching export exists in `@market-data/brand/ui`, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

Composition fidelity for this Feature SHALL be gray-box / structural per knowledge/ux/diagnostics-contract.md; hi-fi Figma polish SHALL NOT be a completion gate.
```

```text
NFR-008

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Diagnostics composition SHALL follow knowledge/ux/diagnostics-contract.md only (no dependency on sibling-repo brand visual-definition paths).
```

```text
NFR-009

THE SYSTEM SHALL NOT require new backend APIs, DTO fields, or OpenAPI changes to complete this Feature; reuse existing Analysis / Reading payload mapping and map equivalent trust signals into Diagnostics when present.
```

## Acceptance Criteria

- [ ] AC-001: Diagnostics Region is distinct and present on a successful Reading (gray-box acceptable when no active diagnostics).
- [ ] AC-002: When healthy, Diagnostics stay quiet / minimal and do not compete with Analysis for primary attention.
- [ ] AC-003: When blocking or strongly qualifying trust, Diagnostics elevate near the affected Reading and are unmistakable without replacing Analysis as the hero message.
- [ ] AC-004: Confidence / data-quality is not presented as an Assessment dimension inside Analysis.
- [ ] AC-005: Composition follows `knowledge/ux/diagnostics-contract.md` anti-patterns (no burying blocking Diagnostics only at page end or only inside Evidence tables).
- [ ] AC-006: Diagnostics chrome uses brand tokens/components already available to the FE.
- [ ] AC-007: User-facing strings come from locale catalogs / brand wording, not hardcoded English in components.
