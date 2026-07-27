# Requirements

## Overview

Reading App Navigation makes **Symbol Reading** the primary product surface in application chrome and resolves dual information architecture: legacy Market Data / Analysis / Classification destinations no longer compete as equal peers with the Reading workspace. Primary navigation exposes Reading as the sole primary destination for inspecting a Symbol. Legacy peer destinations are retired from primary navigation; their content continues as Regions inside Reading per `knowledge/ux/reading-contract.md`. Active destination indication, Symbol selection, and Reading loading/error flows remain intact. User-facing nav labels come from locale / brand wording.

## Product decision (epic Order 2)

**Choice: Reading replaces the three equal peer nav destinations.**

| Option | Decision |
|--------|----------|
| Reading replaces Market Data / Analysis / Classification as peer destinations | **Selected** |
| Reading becomes default home with legacy screens demoted but still peer-like in nav | Rejected — still presents competing equal product IA |
| Other subordinate pattern (e.g. secondary “legacy” nav cluster) | Rejected — unnecessary once Region composition hosts those concerns |

**Consequence:** Primary app navigation exposes **one** primary product destination for Symbol inspection: Symbol Reading. Standalone Market Data, Analysis, and Classification destinations are removed from primary navigation. Former routes for those destinations redirect into Reading. Market Data, Analysis, and Classification remain **Regions inside Reading** (hierarchy unchanged: Analysis primary; Market Data supporting; Classification compact/subordinate). Product brand identity “Market Data” in chrome is **not** a peer destination label.

Recorded for epic `reading-workspace-fidelity` Feature Order 2. Authority: `knowledge/ux/reading-contract.md` (one Symbol Reading workstation; Analysis primary; Market Data / Classification are Regions, not peer product homes).

## Goals

- Make Symbol Reading reachable as the primary way to inspect a Symbol from app chrome.
- Eliminate competing equal product IA among legacy Market Data, Analysis, and Classification destinations.
- Preserve Reading Region hierarchy from `knowledge/ux/reading-contract.md` (Analysis primary; no Market-Data-first Reading).
- Visually indicate the active destination / surface in navigation chrome.
- Keep existing Symbol selection, loading, and error flows usable on the Reading surface.
- Present all user-facing nav labels via locale / brand wording (no hardcoded English in components).

## Functional Requirements

```text
REQ-001

WHEN the user opens the application, THE SYSTEM SHALL present Symbol Reading as the primary product destination in application chrome for inspecting a Symbol.
```

```text
REQ-002

WHILE the shared application layout is visible, THE SYSTEM SHALL expose Symbol Reading as the sole primary product navigation destination for Symbol inspection, and SHALL NOT present Market Data, Analysis, and Classification as equal peer primary destinations alongside Reading.
```

```text
REQ-003

WHEN the user activates the Symbol Reading primary navigation control, THE SYSTEM SHALL display the Symbol Reading workspace inside the shared application layout.
```

```text
REQ-004

IF the user navigates to a legacy Market Data, Analysis, or Classification standalone destination path, THEN THE SYSTEM SHALL redirect that navigation into the Symbol Reading surface (so those paths do not remain competing equal product homes).
```

```text
REQ-005

WHILE a product surface is displayed inside the shared application layout, THE SYSTEM SHALL visually indicate which primary destination / surface is active in the navigation chrome.
```

```text
REQ-006

WHEN rendering the Symbol Reading workspace after this Feature, THE SYSTEM SHALL preserve the Reading Regions hierarchy from knowledge/ux/reading-contract.md: Analysis remains the primary interpretive Region; Market Data SHALL NOT become the primary interpretive Region of the Reading.
```

```text
REQ-007

WHILE the Symbol Reading surface is available, THE SYSTEM SHALL keep Symbol selection usable so the user can choose a supported trading Symbol for the Reading.
```

```text
REQ-008

WHILE a Reading-related data request for the selected Symbol is in progress, THE SYSTEM SHALL present a loading state on the Reading surface.
```

```text
REQ-009

IF a Reading-related data request for the selected Symbol fails, THEN THE SYSTEM SHALL present an error state on the Reading surface with a recovery action that retries the failed request for that Symbol.
```

```text
REQ-010

WHEN no supported trading Symbol is selected, THE SYSTEM SHALL not treat the Reading as a successful Symbol Reading and SHALL present an empty / prompt state that asks the user to select a Symbol.
```

```text
REQ-011

WHILE the shared application layout is visible, THE SYSTEM SHALL keep layout chrome structure (header and navigation) consistent across Reading and any remaining non-Reading outlet content, and SHALL NOT restructure that chrome per destination.
```

```text
REQ-012

WHILE the shared application layout is visible, THE SYSTEM SHALL present the Market Data product brand as a primary chrome identity signal, distinct from any retired Market Data peer destination and distinct from the Market Data Region inside Reading.
```

```text
REQ-013

THE SYSTEM SHALL present all user-facing labels and messages for this Feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode user-facing English in components.
```

## Non-Functional Requirements

```text
NFR-001

THE SYSTEM SHALL implement this Feature with React 19, TypeScript, and Vite, consistent with knowledge/architecture.md.
```

```text
NFR-002

THE SYSTEM SHALL consume shared UI primitives, tokens, logo, and shared wording from @market-data/brand where applicable, and SHALL NOT fork brand tokens or rewrite shared design-system copy locally.
```

```text
NFR-003

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md and knowledge/ux/reading-contract.md: Symbol (not Asset); Reading as the primary surface label for Symbol inspection; Analysis, Classification, and Market Data as Region concepts inside Reading — not as equal peer primary nav destinations after this Feature.
```

```text
NFR-004

User-facing copy for this Feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in src/locales/en.json and read them via the application message helpers; shared product identity and shared chrome SHALL prefer @market-data/brand/wording.
```

```text
NFR-006

WHEN a matching export exists in @market-data/brand/ui, THE SYSTEM SHALL use that brand primitive for the corresponding control or chrome role (including AppShell / AppHeader / AppNav / AppMain when applicable) and SHALL NOT substitute a native HTML stand-in for that role.
```

```text
NFR-007

THE SYSTEM SHALL scope this Feature to PROJECT_ROOT market-data-fe. Navigation and Reading hierarchy SHALL follow knowledge/ux/reading-contract.md only (no dependency on sibling-repo brand visual-definition paths).
```

```text
NFR-008

This Feature SHALL NOT change Analysis Region internal Assessment composition, Evidence depth composition, Diagnostics elevation behavior, Context Identity enrichment, or Market Data / Classification Region body fidelity beyond what is required to host Reading as the primary destination (those remain owned by sibling Features in epic reading-workspace-fidelity).
```

## Acceptance Criteria

- [ ] AC-001: Symbol Reading is reachable as the primary way to inspect a Symbol from app chrome (default / primary destination).
- [ ] AC-002: Primary navigation does not present Market Data, Analysis, and Classification as equal peer destinations alongside Reading (those peer destinations are removed from primary nav).
- [ ] AC-003: Legacy standalone Market Data / Analysis / Classification paths redirect into Symbol Reading rather than remaining competing product homes.
- [ ] AC-004: Reading Regions hierarchy from `knowledge/ux/reading-contract.md` remains intact on the Reading surface (Analysis primary; no Market-Data-first Reading).
- [ ] AC-005: The active destination / surface is visually indicated in navigation chrome.
- [ ] AC-006: Existing Symbol selection, loading, and error flows remain usable on the Reading surface.
- [ ] AC-007: User-facing nav and related chrome labels resolve from locale catalogs / brand wording — no hardcoded English in components.
- [ ] AC-008: Product brand “Market Data” remains a chrome identity signal and is not used as a peer destination competing with Reading.
