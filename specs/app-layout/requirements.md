# Requirements

## Overview

App Layout provides a shared application chrome that wraps all product views. The layout presents the Market Data product brand as a primary chrome signal and enables navigation between Market Data, Analysis, and Classification. Chrome structure remains consistent across views; the active destination is visually indicated.

## Goals

- Give every product view a single shared shell so header and navigation do not diverge per screen.
- Make the Market Data product brand a primary, always-visible chrome signal.
- Let users move between Market Data, Analysis, and Classification from the layout.
- Indicate which destination is active.
- Support navigation to Analysis and Classification even when those product features are not fully built yet (placeholder or stub content is acceptable for those destinations).

## Functional Requirements

```text
REQ-001

WHEN the user opens any product view, THE SYSTEM SHALL render that view inside a shared application layout.
```

```text
REQ-002

WHILE the shared application layout is visible, THE SYSTEM SHALL present the Market Data product brand as a primary chrome signal in the layout.
```

```text
REQ-003

WHILE the shared application layout is visible, THE SYSTEM SHALL present navigation controls that allow the user to navigate to the Market Data view, the Analysis view, and the Classification view.
```

```text
REQ-004

WHEN the user activates a navigation control for Market Data, Analysis, or Classification, THE SYSTEM SHALL display the corresponding product view inside the shared application layout.
```

```text
REQ-005

WHILE a product view is displayed inside the shared application layout, THE SYSTEM SHALL visually indicate which of Market Data, Analysis, or Classification is the active destination in the navigation.
```

```text
REQ-006

WHEN the user navigates between Market Data, Analysis, and Classification, THE SYSTEM SHALL keep the layout chrome structure (header and navigation) consistent and SHALL NOT replace or restructure that chrome per destination.
```

```text
REQ-007

IF the Analysis or Classification product feature is not yet fully implemented, THEN THE SYSTEM SHALL still provide a navigable destination for that view inside the shared layout (placeholder or stub content is acceptable).
```

```text
REQ-008

THE SYSTEM SHALL present all user-facing labels and messages for this feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode user-facing English in components.
```

## Non-Functional Requirements

```text
NFR-001

THE SYSTEM SHALL implement this feature with React 19, TypeScript, and Vite, consistent with knowledge/architecture.md.
```

```text
NFR-002

THE SYSTEM SHALL consume shared UI primitives, tokens, logo, and shared wording from @market-data/brand where applicable, and SHALL NOT fork brand tokens or rewrite shared design-system copy locally.
```

```text
NFR-003

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md: Market Data for the product brand and the market-data destination label; Analysis and Classification as the primary navigation labels for those destinations.
```

```text
NFR-004

User-facing copy for this feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; sentence-case labels unless a proper noun or product name).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in src/locales/en.json and read them via the application message helpers; shared product identity and shared chrome SHALL prefer @market-data/brand/wording.
```

```text
NFR-006

WHEN a matching export exists in @market-data/brand/ui, THE SYSTEM SHALL use that brand primitive for the corresponding control role and SHALL NOT substitute a native HTML stand-in for that role.
```

## Acceptance Criteria

- [ ] All product views render inside a shared application layout.
- [ ] The layout shows the Market Data product brand as a primary chrome signal.
- [ ] The user can navigate between Market Data, Analysis, and Classification views from the layout.
- [ ] The active view is visually indicated in the navigation.
- [ ] Layout chrome remains consistent across views (header/nav structure does not change per screen).
- [ ] Analysis and Classification remain navigable destinations even if only placeholder or stub content is shown.
- [ ] User-facing strings come from locale catalogs / brand wording, not hardcoded English in components.
