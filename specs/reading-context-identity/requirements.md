# Requirements

## Overview

Reading Context Identity fills the Context Region of the Symbol Reading with full Identity content: display name and/or base–quote / pair form (not a bare ticker string alone). Context remains Identity-only — no price, scores, signals, or recommendations — and stays a small persistent frame that does not compete with Analysis for message prominence. Composition follows `knowledge/ux/reading-contract.md` at gray-box / structural fidelity, using brand tokens and UI kit primitives already available to the frontend. This Feature depends on the Context Region host from Feature `reading-layout-shell`.

## Goals

- Present Symbol Identity in Context beyond a bare ticker string (display name and/or base–quote / pair form as available).
- Keep Context content limited to Identity; exclude price, scores, signals, and recommendations.
- Preserve Context as a small frame that does not outrank Analysis for message prominence.
- Style Identity chrome with `@market-data/brand` tokens/components (no ad-hoc design system).
- Source user-facing Identity labels from locale catalogs / brand wording (no hardcoded English in components).
- Use canonical terminology: **Symbol** (never Asset as the root term).

## Functional Requirements

```text
REQ-001

WHEN a successful Symbol Reading is shown with a selected Symbol, THE SYSTEM SHALL present Identity content inside the Context Region for that Symbol.
```

```text
REQ-002

WHILE Identity is shown in the Context Region, THE SYSTEM SHALL present Identity beyond a bare ticker string alone by showing at least one of: a display name for the Symbol, or a base–quote / pair form derived from the selected Symbol.
```

```text
REQ-003

WHILE both a display name and a base–quote / pair form are available for the selected Symbol, THE SYSTEM SHALL present both in the Context Region Identity.
```

```text
REQ-004

WHILE a base and quote can be derived from the selected Symbol’s pair form, THE SYSTEM SHALL present base and quote as distinct Identity fields (in addition to or as part of the pair form presentation).
```

```text
REQ-005

IF a venue value is available on the Identity view model for the selected Symbol, THEN THE SYSTEM SHALL present that venue in the Context Region Identity; IF venue is not available, THEN THE SYSTEM SHALL omit venue without failing the Reading.
```

```text
REQ-006

WHILE the Context Region is visible on a successful Reading, THE SYSTEM SHALL present Identity as the sole content of Context and SHALL NOT present price, scores, signals, recommendations, Analysis outcomes, Classification signals, Evidence depth, Market Data observations, or candle timeframes inside Context.
```

```text
REQ-007

WHILE the Symbol Reading workspace is visible, THE SYSTEM SHALL keep the Context Region as a small Identity frame that does not outrank the Analysis Region for message prominence (Analysis remains the primary interpretive Region).
```

```text
REQ-008

WHEN rendering Identity chrome inside the Context Region, THE SYSTEM SHALL use `@market-data/brand` tokens and UI kit primitives for structure, spacing, and typography, and SHALL NOT introduce an ad-hoc parallel design system for that chrome.
```

```text
REQ-009

THE SYSTEM SHALL present all user-facing Identity field labels and related Context Identity messages using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode user-facing English in components.
```

```text
REQ-010

WHEN composing Identity for the Context Region, THE SYSTEM SHALL build an Identity view model from the selected Symbol and frontend-owned Identity catalogs / derivation rules, and SHALL NOT require a new backend Identity endpoint for this Feature.
```

```text
REQ-011

WHEN a display-name catalog entry exists for the selected Symbol, THE SYSTEM SHALL use that catalog display name in Identity; WHEN no display-name entry exists, THE SYSTEM SHALL still satisfy REQ-002 via base–quote / pair form (or an equivalent non-bare Identity presentation derived from the Symbol) without failing the Reading.
```

```text
REQ-012

THE SYSTEM SHALL host this Identity composition inside the Context Region provided by the Reading layout shell and SHALL NOT redefine or replace the Reading-wide Region map (Analysis, Classification, Evidence, Market Data, Diagnostics) owned by Feature reading-layout-shell.
```

```text
REQ-013

THE SYSTEM SHALL NOT place candle timeframe controls or timeframe labels under Identity / Context; timeframe remains under Market Data (Candles) per knowledge/ux/reading-contract.md.
```

```text
REQ-014

WHILE no Symbol is selected (idle Reading), THE SYSTEM SHALL NOT claim a successful Identity Reading body in Context; empty / prompt behavior remains owned by the Reading surface host.
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

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/reading-contract.md: Symbol (not Asset), Context, Identity, Analysis, Market Data.
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

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT `market-data-fe`. Context Identity structure SHALL follow knowledge/ux/reading-contract.md only (no dependency on sibling-repo brand visual-definition paths).
```

```text
NFR-009

This Feature SHALL NOT change Analysis Region internal Assessment composition, Evidence depth composition, Diagnostics elevation behavior, Classification Region body fidelity, or Market Data Region body fidelity beyond what is required to keep Context Identity from competing with those Regions.
```

## Acceptance Criteria

- [ ] AC-001: Context Region shows Identity beyond a bare ticker string (display name and/or base–quote / pair form as available).
- [ ] AC-002: Context does not show price, scores, signals, or recommendations.
- [ ] AC-003: Context remains a small frame and does not outrank Analysis for message prominence.
- [ ] AC-004: Identity chrome uses brand tokens/components already available to the FE.
- [ ] AC-005: User-facing Identity labels come from locale catalogs / brand wording.
- [ ] AC-006: Identity is composed without a new backend Identity API; missing optional fields (e.g. venue, display-name catalog miss) do not fail the Reading.
- [ ] AC-007: Candle timeframe is not presented under Identity / Context.
