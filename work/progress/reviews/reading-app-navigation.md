# Review: reading-app-navigation

```yaml
feature:
  slug: reading-app-navigation

decision: APPROVED

summary: >
  Reading replaces the three equal peer destinations in app chrome.
  Default/primary destination is `reading`; legacy peer ids redirect via
  `resolveActiveDestination`; outlet hosts `ReadingScreen`; nav label and
  brand identity resolve from locale / brand wording. Tests cover IA,
  redirects, active indication, hierarchy smoke, and catalog-linked copy.

requirements:
  - id: REQ-001
    status: pass
    notes: DEFAULT_DESTINATION / PRIMARY_DESTINATION is `reading`; App.tsx mounts AppLayout with no override.
  - id: REQ-002
    status: pass
    notes: NAV_ITEMS contains only Reading; peer nav controls absent.
  - id: REQ-003
    status: pass
    notes: Reading nav activation keeps Reading workspace; aria-current asserted.
  - id: REQ-004
    status: pass
    notes: Legacy destination ids redirect via resolveActiveDestination into Reading.
  - id: REQ-005
    status: pass
    notes: Active Reading control uses aria-current="page" and Button variant primary.
  - id: REQ-006
    status: pass
    notes: ReadingWorkspace hierarchy unchanged; Analysis primary; Market Data not primary.
  - id: REQ-007
    status: pass
    notes: Symbol combobox remains on ReadingScreen.
  - id: REQ-008
    status: pass
    notes: ReadingScreen loading test still green.
  - id: REQ-009
    status: pass
    notes: ReadingScreen error + retry re-invokes loader.
  - id: REQ-010
    status: pass
    notes: Idle prompt shown when no Symbol selected.
  - id: REQ-011
    status: pass
    notes: AppShell chrome structure unchanged across outlet.
  - id: REQ-012
    status: pass
    notes: wording.product.name + Logo in AppBrand; Market Data not a peer nav destination.
  - id: REQ-013
    status: pass
    notes: Nav label via getMessage('appLayout.navReading'); no hardcoded English in components.
  - id: NFR-001
    status: pass
    notes: React 19 + TypeScript + Vite stack unchanged.
  - id: NFR-002
    status: pass
    notes: Consumes @market-data/brand ui, logo, wording; no token forks.
  - id: NFR-003
    status: pass
    notes: Nav label “Reading”; Region terminology preserved.
  - id: NFR-004
    status: pass
    notes: Sentence-case “Reading” nav label in en.json.
  - id: NFR-005
    status: pass
    notes: appLayout.navReading in src/locales/en.json.
  - id: NFR-006
    status: pass
    notes: Brand AppShell primitives used; no native stand-ins.
  - id: NFR-007
    status: pass
    notes: Changes scoped to market-data-fe; reading-contract hierarchy preserved.
  - id: NFR-008
    status: pass
    notes: No Analysis / Evidence / Diagnostics / Region body redesign.

acceptance_criteria:
  - criterion: AC-001 Symbol Reading primary from app chrome
    status: pass
  - criterion: AC-002 No equal peer Market Data / Analysis / Classification nav
    status: pass
  - criterion: AC-003 Legacy paths/ids redirect into Reading
    status: pass
  - criterion: AC-004 Reading Regions hierarchy intact
    status: pass
  - criterion: AC-005 Active destination visually indicated
    status: pass
  - criterion: AC-006 Symbol selection/loading/error usable on Reading
    status: pass
  - criterion: AC-007 Locale / brand wording for nav labels
    status: pass
  - criterion: AC-008 Product brand remains chrome identity only
    status: pass

findings:
  - severity: recommendation
    location: src/features/app-layout/copy.source.test.ts
    description: >
      Historical copy.source suite remains a weak phrase-ban guard; AC-007 already
      has strong rendered catalog oracles in AppLayout.test.tsx.
    related_req: REQ-013
  - severity: recommendation
    location: src/features/app-layout/destinations.ts
    description: >
      resolveActiveDestination second isDestinationId branch is redundant; harmless.
    related_req: REQ-004
  - severity: recommendation
    location: src/locales/en.json
    description: >
      Retired peer nav and placeholder keys remain unused; optional catalog cleanup.
    related_req: REQ-002

tasks_verified:
  - task: IA decision — Reading default/primary; remove peer primary nav
    status: done
  - task: Add appLayout.navReading; keep brand product.name as identity
    status: done
  - task: Reading-only nav with active indication; stable chrome
    status: done
  - task: Legacy destination paths/ids redirect into Reading
    status: done
  - task: Reading host hierarchy and selection/idle/loading/error usable
    status: done
  - task: Nav/chrome strings from brand wording or locale keys
    status: done
  - task: Extend app-layout tests
    status: done
  - task: Extend/smoke Reading host tests
    status: done
```
