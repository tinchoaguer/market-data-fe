# Requirements

## Overview

Dashboard Classification Surface restyles the Reading **Classification Region body** into the dashboard-mockup **Factor / Score / Reason** tabular presentation (and optional compact per-signal score visualization when needed), using `@maguer/market-data-brand@^0.2.0` `Table` / `Card` / `Text` (and related) primitives. Each displayed classification signal continues to expose factor (or source), score, and reason when available from existing Classification mapping and Content-resolved reason strings. Classification remains a **sibling** Reading Region — compact, adjacent, and visually subordinate to Analysis — and is **not** nested as an Analysis-owned Region inside Assessments. This Feature **does not** introduce an Overall Assessment, Overall Score, Synthesis, or any rollup that replaces the four Analysis Assessment dimensions (Regime, Risk, Economic, Exposure). This Feature owns **Classification Region body restyle only** — not app chrome, not the Reading hero band, not Analysis Assessment cards, and not Market Data / Evidence / Diagnostics restyle. Behavioral packaging rules from Feature `reading-classification-body` remain in force; this Feature changes **presentation fidelity** to the dashboard mockup tabular surface.

## Goals

- Present classification signals in a Factor / Score / Reason table (or equivalent compact tabular packaging) inside the Classification Region.
- Show factor (or source), score, and reason for each displayed signal when data allows.
- Use `@maguer/market-data-brand/ui` `Table`, `Card`, `Text`, and related kit primitives — not a parallel frontend table or card system.
- Keep Classification compact, adjacent to Analysis, and visually subordinate — never equal prominence to Analysis.
- Forbid nesting Classification under Assessments; forbid Overall Assessment / Overall Score / Synthesis rollups in Classification packaging.
- Allow optional compact score visualization (e.g. gauge) only as **per-signal or per-dimension-group** Classification packaging — never as an Overall Score hero.
- Preserve existing Classification loading and error usability on the Reading surface.
- Resolve all user-facing labels and bind reason narrative from locale catalogs / Content-resolved view-model strings — no hardcoded designed English in components.
- Use canonical terminology: **Symbol**, **Classification**, **Regime**, **Risk**, **Economic**, **Exposure**, **Factor** (column label for source when shown as factor).

## Functional Requirements

```text
REQ-001

WHEN the Classification Region of a successful Symbol Reading is shown and Classification content for the selected Symbol is available, THE SYSTEM SHALL present the Classification Region body as compact Factor / Score / Reason tabular packaging for classification signals, using brand `Table` (and related Table parts) as the primary row/column structure for each displayed signal.
```

```text
REQ-002

WHILE the Classification Region body is visible on a successful Reading with Classification content, THE SYSTEM SHALL organize signals across the four Classification dimensions Regime, Risk, Economic, and Exposure (empty dimension groups allowed), and SHALL NOT replace those four axes with a Primary/Secondary Classification taxonomy or a fifth analytical engine.
```

```text
REQ-003

WHEN a classification signal is displayed inside the Classification Region body, THE SYSTEM SHALL show that signal’s factor (or source), score, and reason in the tabular row (or equivalent compact tabular cell layout) when each field is available from existing Classification mapping.
```

```text
REQ-004

WHEN a displayed signal’s reason is available as a human-readable narrative string from the existing Classification view model (Content-resolved or otherwise already mapped display text), THE SYSTEM SHALL present that narrative as the signal’s reason and SHALL NOT replace per-signal source / score / reason packaging with a count-only summary as the sole Classification body content.
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

THE SYSTEM SHALL NOT introduce an Overall Assessment Region, Overall Score Region, Synthesis Region, Overall Classification score, or any rollup ownership node in the Classification Region body that replaces or collapses the four Analysis Assessment dimensions (Regime, Risk, Economic, Exposure) or the four Classification dimension groups.
```

```text
REQ-008

WHEN rendering the Classification Region body, THE SYSTEM SHALL use `@maguer/market-data-brand/ui` `Table`, `Card`, `Text`, `Label`, and related layout helpers for structure, spacing, and typography, and SHALL NOT introduce a parallel frontend table, card, or typography system for that surface.
```

```text
REQ-009

IF an optional compact score visualization (for example a gauge or meter) is shown for Classification packaging, THEN THE SYSTEM SHALL bind it only to an individual displayed signal or to an individual dimension signal group, and SHALL NOT present it as an Overall Score, Overall Assessment, or Synthesis rollup for the Symbol Reading.
```

```text
REQ-010

THE SYSTEM SHALL present all user-facing labels and column headers for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise) and SHALL bind signal reason text from the Classification view-model display string; components SHALL NOT hardcode designed English or map MessageRef / Content codes to English inline.
```

```text
REQ-011

THE SYSTEM SHALL restyle the Classification Region body inside the existing Reading layout shell host and SHALL NOT redefine or replace the Reading-wide Region map (Context, Analysis, Evidence, Market Data, Diagnostics) or surfaces owned by Features `dashboard-app-chrome`, `dashboard-hero-band`, `dashboard-analysis-cards`, or `dashboard-observation-row`.
```

```text
REQ-012

THE SYSTEM SHALL populate Factor / Score / Reason rows from existing Classification view-model / mapping already consumed by Feature `reading-classification-body`, and SHALL NOT require a new backend API, DTO field, or OpenAPI change for this Feature.
```

```text
REQ-013

WHEN Classification content for the selected Symbol is not yet available beyond Region chrome (loading, error, or idle Reading host states), THE SYSTEM SHALL defer to the Reading host’s existing selection / loading / error behavior and SHALL NOT invent a parallel Classification-only success table that claims a successful Classification body without host success.
```

```text
REQ-014

WHEN Classification mapping for the selected Symbol yields empty signal arrays for one or more dimension groups, THE SYSTEM SHALL still expose those dimension groups in the Classification tabular packaging (for example labeled group chrome with an empty table body or explicit empty-group copy) and SHALL NOT treat empty groups alone as a Classification fetch failure.
```

```text
REQ-015

WHEN a tabular row field (factor/source, score, or reason) is not available from existing Classification mapping for a displayed signal, THE SYSTEM SHALL omit that cell or field without removing the signal row (when other fields exist) and without failing the Reading; IF all three fields are absent for a signal, THE SYSTEM MAY omit that signal row.
```

```text
REQ-016

THE SYSTEM SHALL NOT present Assessment outcomes, Recommendation stance, Evidence Drivers / Features / Contributions tables, Market Data microstructure, or Diagnostics trust elevation chrome as content owned by the Classification Region body.
```

```text
REQ-017

WHILE the Classification Region body is visible on a successful Reading, THE SYSTEM SHALL keep the Factor / Score / Reason table (or equivalent compact tabular packaging) as the primary Classification body scanning unit and SHALL NOT promote Classification to equal visual prominence with Analysis Assessment cards.
```

```text
REQ-018

THE SYSTEM SHALL NOT change shared application chrome owned by Feature `dashboard-app-chrome`, SHALL NOT restyle the Reading hero band owned by Feature `dashboard-hero-band`, SHALL NOT restyle Analysis Assessment cards owned by Feature `dashboard-analysis-cards`, and SHALL NOT restyle the Market Data Region observation row owned by Feature `dashboard-observation-row` as part of this Feature.
```

```text
REQ-019

WHEN presenting Factor / Score / Reason column headers, THE SYSTEM SHALL use stable column semantics Factor (or Source), Score, and Reason, resolved from locale catalogs, and SHALL map the Factor column to the existing signal `source` field from Classification mapping when no separate factor field exists.
```

```text
REQ-020

WHILE a Reading-related Classification request for the selected Symbol is in progress, THE SYSTEM SHALL continue to present the existing Classification / Reading loading state, and SHALL NOT replace that loading flow with an unusable or success-claimed Classification table body.
```

```text
REQ-021

IF a Reading-related Classification request for the selected Symbol fails, THEN THE SYSTEM SHALL continue to present the existing Classification / Reading error state with a recovery action that retries the failed request, and SHALL NOT leave the user without a usable error/retry path.
```

```text
REQ-022

WHEN no supported trading Symbol is selected (idle Reading), THE SYSTEM SHALL not treat the Classification table as a successful Classification body and SHALL defer to the existing empty / prompt Reading behavior.
```

## Non-Functional Requirements

```text
NFR-001

THE SYSTEM SHALL implement this Feature with React 19, TypeScript, and Vite, consistent with knowledge/architecture.md.
```

```text
NFR-002

THE SYSTEM SHALL consume shared UI primitives, tokens/CSS variables, and shared wording from `@maguer/market-data-brand` at `^0.2.0` (or newer compatible already established by Feature dashboard-app-chrome), and SHALL NOT fork brand tokens or rewrite shared design-system copy locally.
```

```text
NFR-003

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/reading-contract.md: Symbol (not Asset); Classification; Regime; Risk; Economic; Exposure; and SHALL NOT use Overall Assessment, Overall Score, Synthesis, Primary Classification, Secondary Classification, Tags, or Categories as owned Classification units or Region labels.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in `src/locales/en.json` and read them via the application message helpers; shared domain labels (Regime, Risk, Economic, Exposure, Classification) SHALL prefer `@maguer/market-data-brand` wording exports.
```

```text
NFR-006

WHEN a matching export exists in `@maguer/market-data-brand/ui`, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role (`Table` and related Table parts, `Card` and related Card parts, `Text`, `Label`, `SectionHeading`, `Stack` / `Inline` / `Cluster`, `Badge`, `Skeleton`, `Alert`, `Button` as applicable) and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

Classification tabular restyle SHALL follow knowledge/ux/reading-contract.md: compact associated Region; four dimension axes; no Overall / Synthesis rollup; Classification sibling of Analysis, not nested; interpretation before Evidence. Dashboard tabular fidelity is presentation-only; Region ownership unchanged from Feature reading-classification-body.
```

```text
NFR-008

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Classification restyle SHALL follow knowledge/ux/reading-contract.md and Analysis nesting boundaries from knowledge/ux/analysis-contract.md only (no dependency on sibling-repo brand visual-definition paths; no Epic coordination deliverables in this specification).
```

```text
NFR-009

Do NOT put Tailwind / utility `className` strings in this application for Classification table styling; brand tokens/CSS variables and brand primitives SHALL provide the visual surface.
```

```text
NFR-010

This Feature SHALL NOT redesign app chrome, the Reading hero band, Analysis Assessment cards, Market Data observation row, Evidence depth, or Diagnostics elevation beyond restyling the Classification Region body tabular surface.
```

```text
NFR-011

IF `@maguer/market-data-brand` does not export a Gauge (or equivalent compact score visualization) primitive suitable for optional per-signal packaging, THEN omit the visualization rather than adding a third-party chart/gauge library; numeric score in the Score column remains sufficient for completion.
```

```text
NFR-012

Hi-fi Figma pixel polish SHALL NOT be a completion gate; dashboard-mockup-aligned tabular structure with brand Table/Card/Text is sufficient.
```

## Acceptance Criteria

- [ ] AC-001: Classification Region presents a Factor / Score / Reason table (or equivalent compact tabular packaging) for classification signals.
- [ ] AC-002: Each displayed row/signal shows factor (or source), score, and reason when available.
- [ ] AC-003: Any compact score visualization is Classification packaging only — it does not become an Overall Assessment / Overall Score / Synthesis rollup that replaces Regime/Risk/Economic/Exposure peers.
- [ ] AC-004: Classification remains compact and visually subordinate / adjacent to Analysis — not equal prominence.
- [ ] AC-005: Classification is not nested as an Analysis-owned Region inside Assessments.
- [ ] AC-006: Surface uses `@maguer/market-data-brand` Table/Card/Text (and related) primitives and tokens only.
- [ ] AC-007: User-facing labels and reasons come from locale / Content-resolved copy — no hardcoded designed English in components.
- [ ] AC-008: Four dimension groups (Regime, Risk, Economic, Exposure) remain represented; empty groups allowed; not count-only summary when signals exist.
- [ ] AC-009: Existing Classification loading and error flows remain usable.
- [ ] AC-010: Hero band, app chrome, Analysis Assessment cards, and Market Data observation row are not redesigned by this Feature.
