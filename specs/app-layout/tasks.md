# Tasks

## Implementation Tasks

- [x] Add feature locale keys `appLayout.navMarketData`, `appLayout.navAnalysis`, `appLayout.navClassification`, `appLayout.analysisPlaceholder`, and `appLayout.classificationPlaceholder` to `src/locales/en.json` and ensure they are readable via `src/i18n/messages.ts` (REQ-008, NFR-003, NFR-004, NFR-005)

- [x] Define destination identifiers and routing (or equivalent navigation state) for `market-data`, `analysis`, and `classification`, including a default active destination (REQ-003, REQ-004, REQ-005)

- [x] Implement the shared application layout with brand chrome (`product.name` from `@market-data/brand/wording` and brand logo), primary navigation, and a content outlet; keep header/nav outside per-screen trees (REQ-001, REQ-002, REQ-006, NFR-002)

- [x] Implement primary navigation controls for Market Data, Analysis, and Classification using brand `Button` from `@market-data/brand/ui`, with labels from the feature locale keys; visually indicate `activeDestination` (REQ-003, REQ-005, REQ-008, NFR-006)

- [x] Wire the existing Market Data product view into the layout outlet for the `market-data` destination (REQ-001, REQ-004)

- [x] Add Analysis and Classification destination views that render placeholder/stub content from the feature locale keys when full product features are not yet available (REQ-004, REQ-007, REQ-008)

- [x] Integrate the shared layout at the app entry/routing surface so all product destinations render inside it and chrome remains consistent across navigation (REQ-001, REQ-006, NFR-001)

- [x] Write component tests for brand chrome presence, three-destination navigation, active indication, chrome consistency across switches, and stub content for Analysis and Classification (REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007)

- [x] Verify user-facing strings resolve from brand wording or feature locale keys (no hardcoded English in components) (REQ-008, NFR-002, NFR-005)

Tasks are ordered to minimize implementation dependencies.
