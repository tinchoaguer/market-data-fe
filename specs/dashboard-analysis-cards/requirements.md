# Requirements

## Overview

Dashboard Analysis Cards restyles the four Analysis Assessment peers (Regime, Risk, Economic, Exposure) into the dashboard-mockup **vertical card** presentation: icon, dimension label, outcome badge, score, and short summary as existing Analysis data allows. Cards use `@maguer/market-data-brand@^0.2.0` `Card` / `Badge` / `Text` (and related) primitives. Assessment peer ownership and Recommendation composition remain those defined by `knowledge/ux/analysis-contract.md` and Feature `reading-analysis-composition`: four independent peers inside one Assessments workspace; Recommendation stays a compact composed stance (not a fifth Assessment card); no Overall Assessment / Overall Score / Synthesis rollup. Classification remains a Reading sibling. This Feature owns **Assessment card restyle only** — not app chrome, not the Reading hero band, and not Market Data / Classification / Evidence / Diagnostics restyle.

## Goals

- Present Regime, Risk, Economic, and Exposure as four vertical Assessment cards matching the mockup card structure (icon, label, badge, score, summary as data allows).
- Use `@maguer/market-data-brand/ui` `Card`, `Badge`, `Text`, and related kit primitives — not a parallel frontend card system.
- Keep the four Assessment dimensions as the interpretation; forbid Overall Assessment / Overall Score / Synthesis ownership or rollup.
- Preserve Recommendation composition: compact stance after peers; not a fifth Assessment card and not a standalone Region.
- Keep Assessment cards as the primary interpretive surface; keep Classification out of Analysis ownership.
- Preserve existing Analysis loading and error usability on the Reading surface.
- Resolve all user-facing labels from locale catalogs / brand wording.
- Use canonical terminology: **Symbol**, **Analysis**, **Regime**, **Risk**, **Economic**, **Exposure**, **Recommendation**.

## Functional Requirements

```text
REQ-001

WHEN the Analysis Region of a successful Symbol Reading is shown, THE SYSTEM SHALL present the four Assessment peers Regime, Risk, Economic, and Exposure as vertical cards, each using the card structure icon, dimension label, outcome badge, score, and summary as existing mapped Analysis data allows.
```

```text
REQ-002

WHILE Assessment cards are visible, THE SYSTEM SHALL keep those four cards as independent peer Assessment units inside the single existing Assessments workspace, and SHALL NOT treat any Assessment card as its own Reading Region or as a per-peer Region Card that replaces the Analysis Region host.
```

```text
REQ-003

WHEN rendering each Assessment card, THE SYSTEM SHALL use `@maguer/market-data-brand/ui` `Card` (and related Card parts when exported) as the card shell, brand `Badge` for the outcome token when an outcome label or level is shown, and brand `Text` and/or `Label` for the dimension label, score, and summary, and SHALL NOT introduce a parallel frontend card, badge, or typography system for those roles.
```

```text
REQ-004

WHEN an Assessment card slot (icon, badge, score, or summary) has no corresponding value from existing Analysis mapping for that dimension, THE SYSTEM SHALL omit that slot without removing the peer card and without failing the Reading; the card SHALL still present the dimension label.
```

```text
REQ-005

WHILE Assessment cards are visible, THE SYSTEM SHALL keep contradictory Assessment outcomes visible when present and SHALL NOT hide dimensional conflicts behind a single rollup outcome.
```

```text
REQ-006

THE SYSTEM SHALL NOT present an Overall Assessment Region, Overall Score Region, Synthesis Region, Overall Score card, or any rollup ownership node that replaces the four Assessment dimensions as the interpretation.
```

```text
REQ-007

WHILE the Assessments workspace is visible, THE SYSTEM SHALL compose Recommendation inside the Assessments workspace after the Assessment peer collection, as a compact stance unit that is not a fifth Assessment card and not a standalone primary Reading Region.
```

```text
REQ-008

WHEN the Analysis Region is shown in the initial Analysis viewport of a successful Reading, THE SYSTEM SHALL keep the Recommendation stance (or the labeled Recommendation unit when stance is not yet mapped) visible without requiring the user to scroll within Analysis solely to see that stance.
```

```text
REQ-009

WHILE Assessment cards are visible, THE SYSTEM SHALL present Narrative material only as the card summary (and/or other claim-bound copy already owned by Feature reading-analysis-composition), and SHALL NOT introduce a detached Narrative Region or a chrome-labeled essay Region as a peer of the Assessment cards.
```

```text
REQ-010

THE SYSTEM SHALL NOT nest Classification, Evidence, Market Data, or Diagnostics as Analysis-owned Regions or as additional Assessment cards; those remain Reading Regions referenced from Analysis claims when applicable.
```

```text
REQ-011

THE SYSTEM SHALL NOT present Classification packaging (signal lists, Factor/Score/Reason tables, or compact score visualizations) as the primary interpretive surface of the Analysis Region, and SHALL keep Assessment cards as that primary interpretive surface.
```

```text
REQ-012

WHILE a Reading-related Analysis request for the selected Symbol is in progress, THE SYSTEM SHALL continue to present the existing Analysis / Reading loading state, and SHALL NOT replace that loading flow with an unusable or success-claimed Assessment card body.
```

```text
REQ-013

IF a Reading-related Analysis request for the selected Symbol fails, THEN THE SYSTEM SHALL continue to present the existing Analysis / Reading error state with a recovery action that retries the failed request, and SHALL NOT leave the user without a usable error/retry path.
```

```text
REQ-014

WHEN no supported trading Symbol is selected (idle Reading), THE SYSTEM SHALL not treat Assessment cards as a successful Analysis body and SHALL defer to the existing empty / prompt Reading behavior.
```

```text
REQ-015

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode designed English in components.
```

```text
REQ-016

THE SYSTEM SHALL restyle Assessment peers inside the existing Assessments composition hosted by the Analysis Region and SHALL NOT redefine or replace the Reading-wide Region map (Context, Classification, Evidence, Market Data, Diagnostics) or the hero band owned by Feature dashboard-hero-band.
```

```text
REQ-017

THE SYSTEM SHALL populate Assessment card badge, score, and summary from existing Analysis view-model / mapping already consumed by Feature reading-analysis-composition, and SHALL NOT require a new backend API, DTO field, or OpenAPI change for this Feature.
```

```text
REQ-018

THE SYSTEM SHALL NOT change shared application chrome owned by Feature dashboard-app-chrome, SHALL NOT restyle the Reading hero band owned by Feature dashboard-hero-band, and SHALL NOT restyle the Market Data Region observation body (owned by Feature reading-market-data-body and subsequent Market Data surface Features) as part of this Feature.
```

```text
REQ-019

WHEN presenting Assessment card collection layout, THE SYSTEM SHALL keep all four peer cards visible in Regime → Risk → Economic → Exposure order, using a readable single row or 2×2 arrangement on `md` and above when outcomes stay clear, and stacking in that same order below `md`.
```

```text
REQ-020

THE SYSTEM SHALL NOT embed Evidence Drivers / Features / Contributions tables or Assessment `components` / exposure `factors` dumps as the primary body of an Assessment card; cards SHALL show outcome (badge / score) and short summary, with Evidence remaining a Reading Region reference.
```

```text
REQ-021

THE SYSTEM SHALL NOT present confidence or data quality as an Assessment card or Assessment dimension; trust qualification remains Diagnostics-owned.
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

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/analysis-contract.md: Symbol (not Asset); Analysis; Regime; Risk; Economic; Exposure; Recommendation; and SHALL NOT use Overall Assessment, Overall Score, Synthesis, Insights, Advice, or Tip as owned Analysis units or card labels.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in `src/locales/en.json` and read them via the application message helpers; shared domain labels (Regime, Risk, Economic, Exposure, Recommendation) SHALL prefer `@maguer/market-data-brand` wording exports.
```

```text
NFR-006

WHEN a matching export exists in `@maguer/market-data-brand/ui`, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role (`Card` and related Card parts, `Badge`, `Text`, `Label`, `Stack` / `Inline` / `Cluster` / `ClusterItem`, `Skeleton`, `Alert`, `Button` as applicable) and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

Assessment card restyle SHALL follow knowledge/ux/analysis-contract.md: one Assessments workspace; four independent peers; Recommendation compact after peers; no Overall / Synthesis; Classification not nested; interpretation before Evidence. Vertical Assessment cards are peer visual units, not additional Reading Regions.
```

```text
NFR-008

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Analysis card restyle SHALL follow knowledge/ux/analysis-contract.md and knowledge/ux/reading-contract.md only (no dependency on sibling-repo brand visual-definition paths; no Epic coordination deliverables in this specification).
```

```text
NFR-009

Do NOT put Tailwind / utility `className` strings in this application for Assessment card styling; brand tokens/CSS variables and brand primitives SHALL provide the visual surface.
```

```text
NFR-010

This Feature SHALL NOT redesign app chrome, the Reading hero band, Market Data Region observation, Classification tabular packaging, Evidence depth, or Diagnostics elevation beyond restyling the four Assessment peer cards and preserving Recommendation composition.
```

```text
NFR-011

IF `@maguer/market-data-brand` does not export an Icon primitive suitable for Assessment dimension identity marks, THEN a decorative identity mark implemented with brand-exported graphics and/or brand tokens is an allowed exception; THE SYSTEM SHALL NOT add a third-party icon library for that role.
```

```text
NFR-012

Hi-fi Figma pixel polish SHALL NOT be a completion gate; gray-box structure with brand Card/Badge/Text matching the stated card slots is sufficient.
```

## Acceptance Criteria

- [ ] AC-001: Analysis Region presents four Assessment peers (Regime, Risk, Economic, Exposure) as vertical cards matching mockup card structure (icon, label, badge, score, summary as data allows).
- [ ] AC-002: Cards use `@maguer/market-data-brand/ui` `Card`, `Badge`, `Text` (and related) primitives — not a parallel FE card system.
- [ ] AC-003: No Overall Assessment / Overall Score / Synthesis Region or rollup that replaces the four Assessment dimensions.
- [ ] AC-004: Recommendation composition rules from `knowledge/ux/analysis-contract.md` remain intact (not a fifth Assessment card).
- [ ] AC-005: Assessment cards remain the primary interpretive surface; Classification stays out of Analysis ownership.
- [ ] AC-006: Existing Analysis loading and error flows remain usable.
- [ ] AC-007: User-facing labels come from locale catalogs / brand wording — no hardcoded designed English in components.
- [ ] AC-008: Unavailable card slots are omitted without dropping the peer card or requiring a new backend API.
- [ ] AC-009: Hero band, app chrome, and Market Data Region body are not redesigned by this Feature.
