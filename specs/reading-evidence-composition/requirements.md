# Requirements

## Overview

Reading Evidence Composition fills the Reading’s Evidence Region with claim-attached explainability structured as Drivers → Features → Contributions per the adopted Evidence UX contract (`knowledge/ux/evidence-contract.md`). Assessment `components` and exposure `factors` are presented as Evidence (Drivers + Contributions), not as the primary body owned inside Assessment peers. Composition uses brand tokens and UI kit primitives already available to the frontend at gray-box / structural fidelity. This Feature depends on the Analysis and Evidence Regions from Feature `reading-layout-shell` and respects Analysis ownership from Feature `reading-analysis-composition`. Hi-fi visual polish is out of scope.

## Goals

- Present Evidence as the explainability layer for Analysis (and optionally Classification) claims using Drivers → Features → Contributions.
- Keep Evidence subordinate to a claim — never a free-floating metrics dashboard unrelated to a claim.
- Stop nesting assessment components / exposure factors as Analysis-owned Assessment primary body; host that explainability in the Evidence Region (or claim-attached Evidence depth).
- Preserve interpretation-before-Evidence: users must understand Analysis outcomes without opening Evidence depth.
- Forbid Metrics / Observations as Evidence kind labels; do not label Market Data as Evidence until cited as a Feature supporting a claim.
- Style Evidence chrome with `@market-data/brand` tokens/components (no ad-hoc design system).
- Use canonical terminology: **Symbol**, **Analysis**, **Evidence**, **Drivers**, **Features**, **Contributions**.

## Functional Requirements

```text
REQ-001

WHEN the Evidence Region of a successful Symbol Reading is shown, THE SYSTEM SHALL present claim-attached explainability structured with Evidence kinds Drivers, Features, and Contributions (gray-box structure acceptable).
```

```text
REQ-002

WHILE the Evidence Region is visible, THE SYSTEM SHALL associate Evidence content with at least one Analysis claim (Assessment dimension and/or Recommendation) when explainability data for that claim is available, and SHALL NOT present Evidence as a free-floating metrics dashboard with no claim context.
```

```text
REQ-003

WHILE the Evidence Region is visible, THE SYSTEM SHALL order Evidence depth so Drivers are the highest-prominence Evidence kind, with Features and Contributions available after Drivers via progressive disclosure (on demand / expandable depth).
```

```text
REQ-004

WHEN assessment component rows or exposure factor rows are available from existing Analysis mapping for the selected Symbol, THE SYSTEM SHALL present those rows as Evidence content (Drivers and/or Contributions) inside the Evidence Region or claim-attached Evidence depth, and SHALL NOT present them as the primary body owned inside Assessment peer units.
```

```text
REQ-005

WHILE a successful Symbol Reading shows Analysis outcomes, THE SYSTEM SHALL keep Assessment outcomes and Recommendation stance understandable without requiring the user to open Evidence depth (Features / Contributions tables or expanded Evidence) to grasp the interpretive message.
```

```text
REQ-006

THE SYSTEM SHALL NOT use “Metrics” or “Observations” as Evidence kind labels; Evidence kinds SHALL be Drivers, Features, and Contributions only.
```

```text
REQ-007

THE SYSTEM SHALL NOT label Market Data Region content as Evidence; raw Market Data may appear as Evidence Features only when cited as measured inputs supporting a claim.
```

```text
REQ-008

THE SYSTEM SHALL NOT nest full Evidence tables (Drivers / Features / Contributions bodies) as Analysis-owned Assessment primary content; Analysis MAY expose a path or reference into the Reading Evidence Region.
```

```text
REQ-009

WHEN rendering Evidence Region chrome and Evidence kind structure, THE SYSTEM SHALL use `@market-data/brand` tokens and UI kit primitives for structure, spacing, and typography, and SHALL NOT introduce an ad-hoc parallel design system for that chrome.
```

```text
REQ-010

WHEN Evidence depth for a claim or Evidence kind is not yet fully composed from mapped data, THE SYSTEM SHALL still expose the Evidence Region with labeled Drivers → Features → Contributions structure (gray-box placeholders acceptable for missing depth).
```

```text
REQ-011

WHILE the Evidence Region is visible, THE SYSTEM SHALL keep Evidence as a supporting Reading Region (default supporting prominence; may grow when expanded) and SHALL NOT present Evidence as the extra-large primary interpretive workspace of the Reading.
```

```text
REQ-012

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode user-facing English in components.
```

```text
REQ-013

THE SYSTEM SHALL host this composition inside the Evidence Region provided by the Reading layout shell and SHALL NOT redefine or replace the Reading-wide Region map (Context, Analysis, Classification, Market Data, Diagnostics) owned by Feature reading-layout-shell.
```

```text
REQ-014

THE SYSTEM SHALL NOT present Assessment outcomes, Recommendation stance, Narrative prose, Classification signal lists, Market Data microstructure, or Diagnostics trust flags as content owned by the Evidence Region.
```

```text
REQ-015

WHEN no claim-attached Evidence rows are available for the selected Symbol, THE SYSTEM SHALL still expose a labeled Evidence Region with claim-context structure (empty or placeholder depth) rather than inventing an unrelated metrics wall.
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

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/evidence-contract.md: Symbol (not Asset), Analysis, Evidence, Drivers, Features, Contributions; and SHALL NOT use Metrics or Observations as Evidence kind names.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in `src/locales/en.json` and read them via the application message helpers; shared domain labels (Regime, Risk, Economic, Exposure, Recommendation) SHALL prefer `@market-data/brand/wording` when reused for claim-attachment context.
```

```text
NFR-006

WHEN a matching export exists in `@market-data/brand/ui`, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

Composition fidelity for this Feature SHALL be gray-box / structural per knowledge/ux/evidence-contract.md; hi-fi Figma polish SHALL NOT be a completion gate.
```

```text
NFR-008

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Evidence composition SHALL follow knowledge/ux/evidence-contract.md only (no dependency on sibling-repo brand visual-definition paths).
```

```text
NFR-009

THE SYSTEM SHALL NOT require new backend APIs, DTO fields, or OpenAPI changes to complete this Feature; reuse existing Analysis payload mapping where Evidence rows are shown.
```

## Acceptance Criteria

- [ ] AC-001: Evidence Region presents claim-attached explainability using Drivers → Features → Contributions (gray-box structure acceptable).
- [ ] AC-002: Assessment components / exposure factors are not the primary body owned inside Assessment peers; explainability lives in Evidence (or claim-attached Evidence depth).
- [ ] AC-003: Users can understand Analysis outcomes without opening Evidence depth (interpretation before Evidence).
- [ ] AC-004: Evidence is never a free-floating metrics dashboard unrelated to a claim.
- [ ] AC-005: Composition follows `knowledge/ux/evidence-contract.md` anti-patterns (no Metrics/Observations kind labels; Market Data not labeled as Evidence until cited).
- [ ] AC-006: Evidence chrome uses brand tokens/components already available to the FE.
- [ ] AC-007: User-facing strings come from locale catalogs / brand wording, not hardcoded English in components.
