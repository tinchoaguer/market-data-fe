# Design

## Overview

This Feature replaces the Context Region gray-box / bare-ticker placeholder with a composed **Identity** body for the selected Symbol. Identity answers “What am I looking at?” using display name and/or base–quote / pair form (and venue when available). Context stays a compact persistent frame; Analysis remains the primary interpretive Region. Fidelity is gray-box / structural per `knowledge/ux/reading-contract.md`. No new backend Identity endpoint is introduced — Identity is derived from the selected Symbol plus frontend catalogs / pair-derivation rules.

Depends on Feature `reading-layout-shell` for the Context Region host. Does not redesign other Reading Regions.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Reading workspace / Context Region host | Existing Context Region slot from `reading-layout-shell`; this Feature supplies the Identity body (REQ-001, REQ-012). |
| Identity composer / mapper | Builds `SymbolIdentityViewModel` from selected Symbol + display-name catalog + pair/base/quote derivation (+ optional venue when present) (REQ-002–REQ-005, REQ-010, REQ-011). |
| Context Identity UI | Renders Identity fields inside Context with brand primitives; Identity-only content; small-frame prominence (REQ-006, REQ-007, REQ-008). |
| Locale / wording layer | Field labels and any Identity chrome copy via `src/locales/en.json` + `@market-data/brand/wording` (REQ-009). |
| Analysis Region (unchanged) | Remains primary interpretive Region; Context must not outrank it (REQ-007). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Identity only in Context | Reading contract: Context sole content is Identity | REQ-006, AC-002 |
| Beyond bare ticker | Feature objective + contract (display name / pair form) | REQ-002, REQ-003, AC-001 |
| FE derivation + catalog; no new API | PROJECT_ROOT scope; prior Features already select Symbol locally | REQ-010, REQ-011, AC-006 |
| Venue optional | Contract lists venue when available; do not invent fake venue | REQ-005 |
| Small frame vs Analysis | Relative space: Context small; Analysis extra large / primary | REQ-007, AC-003 |
| No timeframe in Identity | Contract rule 6: timeframe under Candles (Market Data) | REQ-013, AC-007 |
| Brand primitives for chrome | conventions.md UI kit mandatory | REQ-008, NFR-002, NFR-006 |

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Identity field cluster / strip layout | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Field labels / values | `Label`, `Text`, `SectionHeading` (Region title already owned by shell; Identity body prefers `Label` + `Text`) |
| Optional compact markers | `Badge` only if a short Identity token (e.g. pair shorthand) needs compact chrome — not for scores/signals |
| Optional container | `Card` / `CardHeader` only if needed for gray-box scanning of the Identity strip — must not become a large competing hero card |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings.

**Explicit exception:** Semantic landmarks (`section` / labeled Identity group) may wrap brand spacing/typography primitives. Do not invent a parallel CSS design system for Identity.

### Scope boundary

**In scope**

- Context Region Identity body: display name, base, quote, pair form; venue when available
- Identity view-model composition from selected Symbol + FE catalog / derivation
- Prominence: Context remains small frame; Analysis stays primary
- Locale keys for Identity field labels; reuse `labels.symbol` where appropriate
- Component / unit tests for Identity mapping + Context Identity rendering oracles
- Preserve Reading shell Region map and idle/loading/error ownership of the host

**Out of scope**

- New backend / OpenAPI Identity endpoints or DTO fields
- Price, scores, signals, recommendations, Analysis, Classification, Evidence, Market Data, or Diagnostics content inside Context
- Candle timeframe under Identity
- Hi-fi Figma polish
- Sibling-repo brand `visual-definitions` paths
- Redesign of Analysis Assessments, Evidence depth, Diagnostics elevation, Classification body, Market Data body (sibling Features)
- Changing Symbol selection / idle / loading / error state machine beyond feeding selected Symbol into Identity

## Data Flow

1. User has a selected Symbol on a successful Reading (host from prior Features) (REQ-001, REQ-014).
2. Identity composer resolves the Symbol against the display-name catalog (hit → display name; miss → omit display name but continue) (REQ-011).
3. Composer derives pair form and base/quote from the Symbol string using deterministic FE rules (REQ-002, REQ-004).
4. Optional venue is attached only if present on the Identity source model; otherwise omitted (REQ-005).
5. Context Region renders Identity fields only; no price/scores/signals/recommendations/timeframe (REQ-006, REQ-013).
6. Layout keeps Context as compact strip; Analysis remains primary prominence (REQ-007, REQ-012).

```text
[Selected Symbol]
        │
        v
[Identity composer]
        │  displayName? (catalog)
        │  pairForm / base / quote (derivation)
        │  venue? (optional)
        v
[SymbolIdentityViewModel]
        │
        v
[Context Region — Identity body]
        │  small frame; Identity only
        v
[Analysis Region remains primary interpretive Region]
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Context Region Identity | On successful Reading with selection: shows Identity fields answering “What am I looking at?” |
| Identity beyond bare ticker | At least display name **or** base–quote / pair form visible (preferably both when available) |
| Forbidden in Context | Price, scores, signals, recommendations, Assessment outcomes, Classification signals, Evidence metrics, Market Data observations, candle timeframe |
| Prominence | Context remains non-primary relative to Analysis (Analysis keeps primary prominence marker from shell) |

### Identity view-model contract (FE)

| Field | Required when | Notes |
|-------|---------------|-------|
| `symbol` | Always (selected) | Canonical selected Symbol identifier used for fetch paths / selection |
| `displayName` | When catalog entry exists | Human-readable name; not raw ticker alone when present |
| `pairForm` | When derivable from Symbol | e.g. `BTC/USDT` style pair presentation |
| `base` | When pair splits cleanly | Base asset code |
| `quote` | When pair splits cleanly | Quote asset code |
| `venue` | Only when available | Omit when unknown; do not invent |

### Pair derivation rules (deterministic)

| Input Symbol shape | Derivation |
|--------------------|------------|
| Contains `/` (e.g. `BTC/USDT`) | `pairForm` = normalized pair with `/`; `base` / `quote` = segments |
| Contains `-` (e.g. `BTC-USDT`) | Treat `-` as pair separator for Identity presentation; normalize `pairForm` to `/` form for display consistency |
| No separator / opaque ticker | Do not invent fake base/quote; present the best available non-bare Identity (catalog `displayName` if present). If neither display name nor pair/base–quote can be formed, Implementation must still avoid a **sole** bare-ticker Identity presentation by pairing the Symbol with catalog-linked Symbol labeling (`labels.symbol`) **and** documenting the supported-Symbol set expectation that pair-form Symbols are the product default — Reviewer verifies supported fixtures used in tests include pair-capable Symbols |

Supported Symbols used by the product Reading selector are expected to be pair-capable for this Feature’s primary AC path. Tests use pair-form fixtures.

### External systems

No new HTTP endpoints. Identity does not call a dedicated Identity API. Existing market/analysis/classification fetches remain owned by prior Features and must not be mirrored into Context as price/scores/signals.

### Application configuration

| Name | Purpose |
|------|---------|
| Existing `SUPPORTED_SYMBOLS` (or equivalent) | Selected Symbol source for Identity composition |
| Feature display-name catalog (locale or colocated map resolved via locale/helpers) | Optional human display names keyed by Symbol |

## Data Model

### SymbolIdentityViewModel

```text
SymbolIdentityViewModel
  symbol: string
  displayName: string | null
  pairForm: string | null
  base: string | null
  quote: string | null
  venue: string | null
```

Invariant for successful Identity render (REQ-002):  
`displayName != null` **OR** `pairForm != null` **OR** (`base != null` AND `quote != null`).

### Context Region body (observable)

| State | Context body |
|-------|--------------|
| Idle (no Symbol) | No successful Identity claim; host empty/prompt owns UX (REQ-014) |
| Success + Symbol | Identity fields only; small frame |
| Loading / error | Host status chrome; do not invent Identity from stale Symbol unless host already shows prior success for that Symbol |

### Prominence (unchanged shell contract)

| Region | Prominence |
|--------|------------|
| Context | Small frame (Identity) — not primary interpretive |
| Analysis | Primary / extra large |

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| No Symbol selected | Selection empty | No Identity success body (REQ-014) | User selects Symbol |
| Missing display-name catalog entry | Lookup miss | Omit display name; still show pair/base–quote when derivable (REQ-011) | Optional catalog add later |
| Opaque Symbol (no pair split, no display name) | Derivation + catalog both empty | Prefer preventing via supported pair Symbols; if encountered, do not crash Reading; keep Context labeled; do not invent price/scores | Fix supported Symbol set / catalog |
| Venue absent | Field null | Omit venue row (REQ-005) | None |
| Attempt to show price/scores in Context | Design forbidden | Out of scope; tests assert absence | N/A |

Validation rules:

- Context body on success must not include price, recommendation, regime/risk/economic/exposure scores/signals, or timeframe controls (REQ-006, REQ-013).
- Analysis remains the only Region with primary interpretive prominence (REQ-007).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This Feature is primarily **Identity mapper + Context body UI**. Prefer unit tests for derivation/catalog mapping and focused Context/Identity component tests. Extend existing Reading layout/shell tests lightly for prominence and forbidden-content oracles. No new fetch/mapper API suites, E2E, MSW, coverage %, or `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Pair Symbol → pairForm + base + quote | Unit (Identity composer) | Exact fields for fixtures like `BTC/USDT` and `BTC-USDT` | `src/features/reading-context-identity/*.test.ts` (or colocated mapper test) |
| Catalog hit → displayName | Unit | `displayName` equals catalog-resolved string via `getMessage` / catalog helper (not unbound English literal) | same |
| Catalog miss → still non-bare Identity | Unit | `displayName` null; pair/base/quote present; mapping succeeds | same |
| Venue optional | Unit | Present when provided; omitted/null when absent | same |
| Context shows Identity beyond bare ticker | Component | On success fixture, visible display name and/or base–quote / pair form | extend `reading-layout-shell` Context tests or `reading-context-identity` component tests |
| Context excludes price/scores/signals/recommendation | Component | Query absence of price / recommendation / score signal labels in Context Region | same |
| Context does not outrank Analysis | Layout / component | Analysis still primary; Context not marked primary interpretive | extend shell/layout test lightly |
| No timeframe under Identity | Component | No timeframe control/label inside Context Region | same |
| Copy from catalogs | Component / Reviewer | Identity field labels resolve via `getMessage` / brand `wording` | assert catalog-linked labels |
| Brand primitives | Reviewer (+ light UI) | Imports from `@market-data/brand/ui`; no Tailwind utility `className` for Identity chrome | Reviewer |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 Identity beyond bare ticker | Yes — mapper + component |
| AC-002 no price/scores/signals/recommendations in Context | Yes — component absence oracles |
| AC-003 small frame / does not outrank Analysis | Yes — prominence marker / layout smoke |
| AC-004 brand tokens/components | Reviewer (required) + optional render smoke |
| AC-005 catalog labels | Yes — catalog-linked label asserts |
| AC-006 no new Identity API; optional fields safe | Yes — unit (miss/venue omit) + Reviewer (no new fetch module for Identity) |
| AC-007 no timeframe under Identity | Yes — component absence |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared domain labels; Identity field labels that are Context-specific live in the app locale catalog.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.symbol` | `@market-data/brand/wording` | Symbol field / Identity chrome when labeling the Symbol identifier |

Do **not** reuse `labels.price`, `labels.recommendation`, regime/risk/economic/exposure labels inside Context Identity (those belong to other Regions).

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `readingContext.displayName` | Display name | `src/locales/en.json` | Label for display-name Identity field |
| `readingContext.pair` | Pair | `src/locales/en.json` | Label for pair-form Identity field |
| `readingContext.base` | Base | `src/locales/en.json` | Label for base Identity field |
| `readingContext.quote` | Quote | `src/locales/en.json` | Label for quote Identity field |
| `readingContext.venue` | Venue | `src/locales/en.json` | Label for venue Identity field (shown only when venue present) |

### Display-name catalog

| Key pattern | English examples | File | Purpose |
|-------------|------------------|------|---------|
| `readingContext.symbols.<symbolKey>.displayName` | e.g. Bitcoin / Tether for `BTC/USDT` (symbolKey stable, not locale-grammar) | `src/locales/en.json` | Optional human display names for supported Symbols |

Use stable symbol keys (e.g. encode `/` as a safe key segment such as `BTC_USDT` — exact encoding is an implementation choice; document in code comments). Do not hardcode display English in components.

Do not use “Asset”, “Ticker” (as UI field label), “Instrument ID”, or “Overall” in Identity chrome. Prefer **Symbol** terminology.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Context Region hosts Identity body on successful Reading |
| REQ-002 | Beyond-bare-ticker invariant on `SymbolIdentityViewModel` |
| REQ-003 | Render both display name and pair/base–quote when available |
| REQ-004 | Distinct base and quote fields when derivable |
| REQ-005 | Optional venue field |
| REQ-006 | Identity-only Context; forbidden content list |
| REQ-007 | Small frame; Analysis remains primary |
| REQ-008 / NFR-002 / NFR-006 | Brand UI primitives table |
| REQ-009 / NFR-005 | Copy / Wording keys |
| REQ-010 | FE composer; no new Identity API |
| REQ-011 | Catalog hit/miss behavior |
| REQ-012 | Mount in existing Context Region; Region map unchanged |
| REQ-013 | No timeframe under Identity |
| REQ-014 | Idle: no Identity success claim |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines |
| NFR-007 | Gray-box fidelity |
| NFR-008 | Adopted `reading-contract.md` only; PROJECT_ROOT scope |
| NFR-009 | Sibling Region bodies out of scope |
