# Requirements

## Overview

View Market Classification lets users select a supported trading symbol and inspect the market classification signals generated from the deterministic analysis pipeline for that symbol: regime, risk, economic, and exposure signals. Each signal presents its source, score, and reason. The UI presents loading and error states while retrieving data.

## Goals

- Enable users to inspect backend market classification signals for a chosen symbol without leaving the product UI.
- Surface regime, risk, economic, and exposure classification signals in a clear, data-first layout.
- Make each signal’s source, score, and reason observable and scannable.
- Communicate fetch progress and failures with recoverable error handling.
- Use canonical Market Data terminology and shared design-system wording.
- Replace any Classification destination stub with the full classification product view inside the shared application layout.

## Functional Requirements

```text
REQ-001

WHEN the user opens the market classification view, THE SYSTEM SHALL present a control that allows the user to select one symbol from the set of supported trading symbols.
```

```text
REQ-002

WHEN the user selects a supported trading symbol, THE SYSTEM SHALL retrieve market classification for that symbol from GET /markets/{symbol}/classification.
```

```text
REQ-003

WHEN market classification for the selected symbol has been retrieved successfully, THE SYSTEM SHALL display the regime classification signals.
```

```text
REQ-004

WHEN market classification for the selected symbol has been retrieved successfully, THE SYSTEM SHALL display the risk classification signals.
```

```text
REQ-005

WHEN market classification for the selected symbol has been retrieved successfully, THE SYSTEM SHALL display the economic classification signals.
```

```text
REQ-006

WHEN market classification for the selected symbol has been retrieved successfully, THE SYSTEM SHALL display the exposure classification signals.
```

```text
REQ-007

WHEN a classification signal is displayed, THE SYSTEM SHALL show that signal’s source, score, and reason.
```

```text
REQ-008

WHILE a market classification request for the selected symbol is in progress, THE SYSTEM SHALL present a loading state to the user.
```

```text
REQ-009

IF the market classification request for the selected symbol fails, THEN THE SYSTEM SHALL present an error state to the user.
```

```text
REQ-010

WHEN the market classification view is showing an error state for a selected symbol, THE SYSTEM SHALL provide a recovery action that retries GET /markets/{symbol}/classification for that symbol.
```

```text
REQ-011

WHEN no supported trading symbol is selected, THE SYSTEM SHALL not call GET /markets/{symbol}/classification and SHALL present an empty state that prompts the user to select a symbol.
```

```text
REQ-012

THE SYSTEM SHALL present all user-facing labels and messages for this feature using locale catalog keys (design-system shared wording where applicable; feature-specific keys otherwise), and SHALL NOT hardcode user-facing English in components.
```

```text
REQ-013

WHEN the user navigates to the Classification destination in the shared application layout, THE SYSTEM SHALL render this market classification view as the Classification product content (not a placeholder stub).
```

## Non-Functional Requirements

```text
NFR-001

THE SYSTEM SHALL implement this feature with React 19, TypeScript, and Vite, consistent with knowledge/architecture.md.
```

```text
NFR-002

THE SYSTEM SHALL consume shared UI primitives, tokens, and shared wording from @market-data/brand where applicable, and SHALL NOT fork brand tokens or rewrite shared design-system copy locally.
```

```text
NFR-003

THE SYSTEM SHALL use canonical product terminology from knowledge/writing/terminology.md for Symbol, Regime, Risk, Economic, Exposure, and Classification in requirements-facing and user-facing language.
```

```text
NFR-004

User-facing copy for this feature SHALL follow knowledge/writing/writing-guidelines.md (precise, calm, formal, data-first; ellipsis character for loading; sentence-case labels).
```

```text
NFR-005

THE SYSTEM SHALL keep feature-specific locale strings in src/locales/en.json and read them via the application message helpers; shared chrome and domain labels SHALL prefer @market-data/brand/wording.
```

```text
NFR-006

When a matching export exists in @market-data/brand/ui, THE SYSTEM SHALL use that brand primitive for the corresponding UI need (Select, Skeleton, Alert, Button, Page, Stack, Text, SectionHeading, Badge, Card, Table) and SHALL NOT substitute native HTML controls for those roles.
```

## Acceptance Criteria

- [ ] The user can select a supported trading symbol.
- [ ] The UI retrieves data from GET /markets/{symbol}/classification for the selected symbol.
- [ ] Regime classification signals are displayed after a successful response.
- [ ] Risk classification signals are displayed after a successful response.
- [ ] Economic classification signals are displayed after a successful response.
- [ ] Exposure classification signals are displayed after a successful response.
- [ ] Each displayed signal shows its source, score, and reason.
- [ ] A loading state is presented while the request is in progress.
- [ ] An error state is presented when the request fails, with a retry action available.
- [ ] No classification request is made until a symbol is selected; an empty state prompts selection.
- [ ] The Classification layout destination renders this feature view (not a stub).
- [ ] User-facing strings come from locale catalogs / brand wording, not hardcoded English in components.
