# Review Report — reading-context-identity

```yaml
feature:
  slug: reading-context-identity

decision: APPROVED

summary: >
  Context Identity replaces the bare-ticker Context placeholder with a
  composed SymbolIdentityViewModel rendered by ContextIdentity inside the
  existing reading-layout-shell Context Region. Pair derivation, catalog
  display names, optional venue, Identity-only content, brand chrome, and
  locale-linked labels match the approved spec. Tests cover mapper and UI
  oracles with strong catalog-linked assertions; shell/screen tests cover
  prominence, idle (no Identity claim), and forbidden Context content.

requirements:
  - id: REQ-001
    status: pass
    notes: >
      ReadingWorkspace mounts ContextIdentity for the selected Symbol;
      ReadingScreen success path renders reading-workspace with context-identity.
  - id: REQ-002
    status: pass
    notes: >
      composeSymbolIdentity derives pairForm/base/quote; UI shows display
      name and/or pair/base–quote. Tests use pair fixtures (BTC/USDT, BTC-USDT).
  - id: REQ-003
    status: pass
    notes: >
      When catalog hit and pair derivable (BTC/USDT), both displayName and
      pair/base/quote render (ContextIdentity + ReadingWorkspace tests).
  - id: REQ-004
    status: pass
    notes: Distinct base and quote IdentityField rows when pair splits cleanly.
  - id: REQ-005
    status: pass
    notes: >
      venue null when absent/blank; rendered with readingContext.venue when provided.
  - id: REQ-006
    status: pass
    notes: >
      ContextIdentity is Identity fields only; absence oracles for price,
      recommendation, regime/risk/economic/exposure labels in Context.
  - id: REQ-007
    status: pass
    notes: >
      Context prominence remains supporting; Analysis primary (shell markers
      asserted in ReadingWorkspace tests). Context uses compact strip chrome,
      not Analysis Card/primary heading treatment.
  - id: REQ-008
    status: pass
    notes: >
      ContextIdentity imports Stack, Inline, Label, Text from
      @market-data/brand/ui; no Tailwind className on Identity chrome;
      semantic section wrapper allowed by design.
  - id: REQ-009
    status: pass
    notes: >
      Field labels via getMessage(readingContext.*) and wording.labels.symbol;
      no hardcoded user-facing English in ContextIdentity.
  - id: REQ-010
    status: pass
    notes: FE composeSymbolIdentity only; no Identity fetch/API module introduced.
  - id: REQ-011
    status: pass
    notes: >
      Catalog hit resolves displayName via getMessage; miss (SOL/USDT in unit
      test) yields null displayName with pair Identity still produced.
      Supported Symbols BTC/USDT and ETH/USDT have locale displayName entries.
  - id: REQ-012
    status: pass
    notes: >
      Identity hosted in existing Context Region; READING_REGIONS map unchanged;
      ReadingScreen only supplies analysis/classification/market-data bodies.
  - id: REQ-013
    status: pass
    notes: >
      No timeframe label/control inside Context Identity (absence of
      viewMarketData.timeframe / Timeframe asserted).
  - id: REQ-014
    status: pass
    notes: >
      Idle ReadingScreen shows selectSymbolPrompt; no reading-workspace /
      context-identity until success with selection.
  - id: NFR-001
    status: pass
    notes: React/TS feature modules under Vite FE project layout.
  - id: NFR-002
    status: pass
    notes: Consumes @market-data/brand/ui and wording; no forked tokens.
  - id: NFR-003
    status: pass
    notes: Uses Symbol terminology; labels.symbol from brand wording.
  - id: NFR-004
    status: pass
    notes: >
      Locale copy is sentence-case formal field labels per design
      (Display name, Pair, Base, Quote, Venue).
  - id: NFR-005
    status: pass
    notes: Feature strings in src/locales/en.json via getMessage.
  - id: NFR-006
    status: pass
    notes: Brand primitives used for Identity field chrome roles.
  - id: NFR-007
    status: pass
    notes: Gray-box structural Identity strip; no hi-fi polish gate.
  - id: NFR-008
    status: pass
    notes: Scoped to market-data-fe; reading-contract Identity rules only.
  - id: NFR-009
    status: pass
    notes: >
      Sibling Region bodies not redesigned; only Context default body
      replaced with Identity.

acceptance_criteria:
  - criterion: >
      AC-001 Context Region shows Identity beyond a bare ticker string
      (display name and/or base-quote / pair form as available).
    status: pass
    notes: >
      Mapper + ContextIdentity + ReadingWorkspace/ReadingScreen assert
      display name and pair/base/quote values via getMessage / composed fields.
  - criterion: >
      AC-002 Context does not show price, scores, signals, or recommendations.
    status: pass
    notes: >
      Strong absence oracles in ContextIdentity, ReadingWorkspace, and
      ReadingScreen success path.
  - criterion: >
      AC-003 Context remains a small frame and does not outrank Analysis
      for message prominence.
    status: pass
    notes: >
      data-prominence primary only on Analysis; Context not primary.
  - criterion: >
      AC-004 Identity chrome uses brand tokens/components already available
      to the FE.
    status: pass
    notes: Reviewer-verified brand/ui imports; no ad-hoc CSS/Tailwind chrome.
  - criterion: >
      AC-005 User-facing Identity labels come from locale catalogs / brand wording.
    status: pass
    notes: >
      Rendered labels queried via getMessage / wording.labels.symbol
      (catalog-linked, not unbound English literals alone).
  - criterion: >
      AC-006 Identity composed without a new backend Identity API; missing
      optional fields do not fail the Reading.
    status: pass
    notes: >
      FE composer only; catalog miss and venue omit unit-tested; no Identity
      HTTP module.
  - criterion: >
      AC-007 Candle timeframe is not presented under Identity / Context.
    status: pass
    notes: Absence of timeframe copy inside Context Identity body.

findings:
  - severity: recommendation
    location: src/features/reading-layout-shell/ReadingWorkspace.tsx
    description: >
      Default Context Identity is set then spread with ...regionBodies,
      so a caller could override bodies.context and replace Identity.
      ReadingScreen does not do this today; consider merging so context
      Identity cannot be overwritten, or documenting that context is reserved.
    related_req: REQ-012
  - severity: recommendation
    location: src/features/reading-context-identity/ContextIdentity.test.tsx
    description: >
      Secondary getMessage === messages.* identity checks are weak oracles;
      they are not sole evidence (strong render asserts exist). Consider
      dropping them on next touch to reduce noise per testing-policy.md.

tasks_verified:
  - task: Add readingContext locale keys + display-name catalog for supported Symbols
    status: done
  - task: Implement Identity composer (SymbolIdentityViewModel, no Identity API)
    status: done
  - task: Build Context Identity UI with brand primitives and catalog labels
    status: done
  - task: Enforce Identity-only Context (no price/scores/signals/timeframe)
    status: done
  - task: Mount Identity in layout-shell Context; keep Analysis primary
    status: done
  - task: Idle Reading does not claim Identity success body
    status: done
  - task: Unit tests for composer (pair, catalog hit/miss, venue)
    status: done
  - task: Context/layout component tests for Identity, absences, prominence, labels
    status: done
```
