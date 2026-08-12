# Design

## Overview

This Feature restyles the four **Assessment peer units** already composed by Feature `reading-analysis-composition` into dashboard-mockup **vertical cards**. Each card is a brand `Card` whose stacked body is: **icon → dimension label → outcome Badge → score → short summary**, omitting any slot that existing Analysis mapping does not supply. Cards remain **peer visual units inside one Assessments workspace** — not four Reading Regions and not per-peer Region Cards.

Recommendation stays a **compact composed band after the peer collection** (not the same vertical Assessment-card skeleton). Classification, Evidence, Market Data, Diagnostics, the Reading hero band, and app chrome stay outside this Feature’s ownership. Surface uses `@maguer/market-data-brand@^0.2.0` (established by Feature `dashboard-app-chrome`).

Contract authority: `knowledge/ux/analysis-contract.md` (inside Analysis) and `knowledge/ux/reading-contract.md` (Reading Regions). The adopted Analysis layout rule “no per-peer Region Cards” means do **not** promote each dimension to a Reading Region; it does **not** forbid brand `Card` as the Assessment peer scanning unit.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Analysis Region host | Existing Reading shell Analysis Region; unchanged Region map (REQ-016). |
| Assessments workspace | Existing single workspace from `reading-analysis-composition`; still owns four peers + Recommendation + claim-bound Narrative (REQ-002, REQ-007). |
| Assessment card restyle | Renders each peer as a vertical brand `Card` with icon, label, badge, score, summary slots (REQ-001, REQ-003, REQ-004). |
| Recommendation unit | Remains compact after peers; different visual treatment from Assessment cards (REQ-007, REQ-008). |
| Card field binder | Maps existing Analysis view-model outcomes into card slots; omits empty slots (REQ-004, REQ-017). |
| Locale / wording layer | Dimension labels from brand wording; optional score field label from app locale (REQ-015). |
| Host state | Idle / loading / error remain Reading / Analysis host-owned (REQ-012, REQ-013, REQ-014). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Restyle existing composition; no second Assessments tree | Feature owns card restyle only; composition rules already shipped | REQ-002, REQ-016, NFR-010 |
| Vertical brand `Card` per peer | Feature acceptance + conventions (mandatory Card primitive) | REQ-001, REQ-003, NFR-006 |
| Cards ≠ Region Cards | analysis-contract: one Analysis Region; peers share one workspace | REQ-002, NFR-007 |
| Slot omit-when-absent | Acceptance “as data allows”; no new API | REQ-004, REQ-017 |
| Conflicts stay visible | Anti-pattern: dimensions collapsed behind rollup | REQ-005, REQ-006 |
| Recommendation not Assessment-card skeleton | Contract: compact stance, not a fifth Assessment engine | REQ-007, REQ-008, AC-004 |
| Summary = claim-bound Narrative | Contract Narrative rule; not a Narrative Region | REQ-009 |
| Classification / Evidence / MD / Diagnostics not nested | Ownership boundaries | REQ-010, REQ-011, REQ-020, REQ-021 |
| Host keeps loading/error/idle | Acceptance: existing flows remain usable | REQ-012, REQ-013, REQ-014 |
| Brand kit only; no Tailwind utilities | conventions + dashboard package | REQ-003, NFR-002, NFR-006, NFR-009 |
| Icon exception if no brand Icon | Do not invent a third-party icon system | NFR-011 |
| Do not touch hero / chrome / Market Data body | Sibling Feature ownership | REQ-018, NFR-010 |

### Brand UI primitives

| Need | Use from `@maguer/market-data-brand/ui` |
|------|-----------------------------------------|
| Assessment card shell | `Card`, `CardHeader`, `CardTitle`, and related Card parts when exported |
| Outcome token | `Badge` |
| Dimension label, score value, summary | `Text`, `Label` |
| Peer collection / card internals | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Recommendation compact band | `Stack` / `Text` / `Badge` / optional `Card` **only if** it remains visually distinct from the four Assessment cards (not the same Assessment-card skeleton) |
| Loading (host / Analysis body) | `Skeleton` (existing host path) |
| Error chrome (host / Analysis body) | `Alert`, `AlertTitle`, `AlertDescription`, `Button` (existing host path) |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings (NFR-009).

**Package naming:** Use `@maguer/market-data-brand` at `^0.2.0` (or newer compatible already on the app from Feature `dashboard-app-chrome`). Older knowledge docs may still say `@market-data/brand`; imports for this Feature follow the published `@maguer/market-data-brand` entry points (`/ui`, `/wording`).

**Explicit exception (NFR-011):** If the brand package exports an Icon (or equivalent graphic) primitive usable for dimension identity, use it. If it does not, a decorative identity mark built from brand-exported SVGs/graphics and brand tokens is allowed. Do **not** add `lucide-react`, Font Awesome, or another icon library for Assessment cards.

**Explicit exception:** Semantic landmarks (`section` / list) for the peer collection may wrap brand Cards for accessibility. They are not a parallel design system.

### Scope boundary

**In scope**

- Restyle Regime / Risk / Economic / Exposure peers to vertical Assessment cards
- Bind existing mapped outcomes to badge / score / summary slots (omit when absent)
- Dimension identity icon (brand Icon or documented decorative exception)
- Preserve Recommendation composition (compact, after peers, not a fifth Assessment card)
- Preserve no-Overall / no-Synthesis / Classification-not-nested / Evidence-not-owned-in-cards
- Preserve host idle / loading / error usability
- Locale keys only if a new field label (e.g. Score) is shown
- Tests for card structure, ownership anti-patterns, catalog-linked labels, host state preservation

**Out of scope**

- App chrome — Feature `dashboard-app-chrome`
- Reading hero band — Feature `dashboard-hero-band`
- Market Data middle observation row — Feature `dashboard-observation-row` / `reading-market-data-body`
- Classification Factor/Score/Reason table — Feature `dashboard-classification-surface` / `reading-classification-body`
- Evidence Drivers → Features → Contributions depth — Feature `reading-evidence-composition`
- Diagnostics elevation — Feature `reading-diagnostics`
- Redesigning Recommendation as a fifth vertical Assessment card
- New backend APIs, DTO fields, or OpenAPI changes
- Sibling-repo brand visual-definition paths or Epic coordination artifacts
- Hi-fi Figma pixel polish as a delivery gate
- Inventing FE token sets, Tailwind design system, or a parallel card/icon library

## Data Flow

1. User opens a successful Symbol Reading; Analysis Region mounts the existing Assessments workspace (REQ-016).
2. Existing Analysis mapping supplies dimension outcomes and Recommendation stance (REQ-017).
3. Each Assessment peer renders as a vertical `Card`: icon + label always; badge / score / summary only when mapped values exist (REQ-001, REQ-003, REQ-004).
4. Peer collection layout: Regime → Risk → Economic → Exposure; row or 2×2 at `md+`; stack below `md` (REQ-019).
5. Recommendation renders after the collection, compact, not using the Assessment-card skeleton (REQ-007, REQ-008).
6. Idle / loading / error remain host-owned; cards are not claimed as success without Analysis success (REQ-012, REQ-013, REQ-014).
7. Classification / Evidence / Market Data / Diagnostics / hero / chrome remain outside this restyle (REQ-010, REQ-011, REQ-018).

```text
[Reading workspace]
  ├── Hero band — dashboard-hero-band (unchanged)
  ├── Analysis Region (host — reading-layout-shell)
  │     └── Assessments workspace (reading-analysis-composition)
  │           ├── Assessment cards (this Feature restyle)
  │           │     ├── regime   Card[icon | label | badge? | score? | summary?]
  │           │     ├── risk     Card[icon | label | badge? | score? | summary?]
  │           │     ├── economic Card[icon | label | badge? | score? | summary?]
  │           │     └── exposure Card[icon | label | badge? | score? | summary?]
  │           └── Recommendation (compact band; NOT Assessment-card skeleton)
  ├── Classification — sibling Region (not Analysis-owned)
  ├── Evidence | Market Data | Diagnostics — unchanged ownership
  └── App chrome — dashboard-app-chrome (unchanged)

Data (reuse; no new API):
  GET /markets/{symbol}/analysis → existing Analysis view-model → card slots
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Assessment card (×4) | Vertical `Card` with stable accessible name from dimension label (Regime, Risk, Economic, Exposure) |
| Icon | Decorative identity mark associated with the dimension; not a substitute for the text label |
| Label | Brand wording dimension label; always present on a visible card |
| Badge | Brand `Badge` showing mapped outcome label/level when present; omitted when absent |
| Score | Numeric/level score from existing mapping when present; omitted when absent |
| Summary | Short claim-bound Narrative / mapped summary when present; omitted when absent |
| Recommendation | Compact unit after peers; accessible name Recommendation; not `role="assessment-peer"` and not the Assessment-card skeleton |
| Forbidden | Overall Assessment / Overall Score / Synthesis card or Region; Classification nested under Assessments; Evidence tables as card body |

### Unit identity (stable)

| Unit id | Label (canonical) | Role | Presentation |
|---------|-------------------|------|----------------|
| `assessments` | Assessments (workspace) | Primary workspace | Host; not a fifth card |
| `regime` | Regime | Assessment peer | Vertical Assessment card |
| `risk` | Risk | Assessment peer | Vertical Assessment card |
| `economic` | Economic | Assessment peer | Vertical Assessment card |
| `exposure` | Exposure | Assessment peer | Vertical Assessment card |
| `recommendation` | Recommendation | Composed stance | Compact band after peers |

Unit ids are implementation identifiers for tests and composition; user-facing labels come from brand wording / locale (REQ-015). There is **no** `overall`, `synthesis`, or `narrative` Region/unit id.

### Card slot contract (FE)

Each Assessment card binds existing Analysis view-model fields. This Feature does **not** invent a new HTTP DTO. Slot sources:

| Slot | Required? | Source guidance |
|------|-----------|-----------------|
| `icon` | Yes (decorative) | Dimension-id → brand Icon or allowed decorative mark (NFR-011). Not from API. |
| `label` | Yes | Brand `labels.regime` / `labels.risk` / `labels.economic` / `labels.exposure` |
| `badge` | When mapped | Existing humanized outcome label / level token already on the Analysis VM for that dimension |
| `score` | When mapped | Existing numeric/level score already on the Analysis VM for that dimension |
| `summary` | When mapped | Existing claim-bound Narrative / short summary already on the Analysis VM for that dimension |

If the existing VM exposes only some of badge / score / summary, show what exists and omit the rest (REQ-004). Do not fail mapping or hide the peer. Do not dump `components` / `factors` into the card body (REQ-020).

Exact numeric formatting (decimals) remains the existing Analysis mapping convention; this Feature does not change mapper fail-closed rules unless a thin presentation adapter is needed to pick slots. Prefer binding existing VM fields over a new mapper module.

### External systems

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/markets/{symbol}/analysis` | Existing Analysis fetch (owned by Feature `view-market-analysis`) |

No new HTTP endpoints. Mapping rules remain those of prior Analysis / Content Features; this Feature owns card presentation and slot omission.

### Application configuration

None beyond existing Symbol selection / Analysis loading owned by the Reading host.

## Data Model

### Assessment card structure

```text
AssessmentsWorkspace
  peers:
    regime: AssessmentCard
    risk: AssessmentCard
    economic: AssessmentCard
    exposure: AssessmentCard
  recommendation: RecommendationUnit   // not AssessmentCard

AssessmentCard
  id: "regime" | "risk" | "economic" | "exposure"
  role: "assessment-peer"
  presentation: "vertical-card"
  icon: DecorativeIdentityMark
  identityLabel: brand wording (Regime | Risk | Economic | Exposure)
  badge: mappedOutcomeToken | null     // omit UI when null
  score: mappedScore | null            // omit UI when null
  summary: claimBoundNarrative | null  // omit UI when null
  shell: brand Card

RecommendationUnit
  id: "recommendation"
  role: "recommendation"
  presentation: "compact-band"         // not "vertical-card"
  identityLabel: brand wording (Recommendation)
  stance: mappedStance | null
  compact: true
```

### Attention / layout structure (observable)

| Priority | Content | Notes |
|----------|---------|-------|
| P0 | Four Assessment cards | Always visible as peers; vertical card skeleton |
| P1 | Recommendation | Compact; after peers; not Assessment-card skeleton |
| P2 | Claim-bound summary on cards | With claims; not a Region |
| P3 | Evidence references | On demand; Reading Evidence Region |

Desktop (`md+`): single row of four cards when outcomes stay clear; 2×2 allowed if a single row would make outcomes unreadable. Below `md`: stack Regime → Risk → Economic → Exposure. Recommendation remains full-width compact after the collection.

Forbidden nodes: Overall Assessment, Overall Score, Synthesis Region, standalone Narrative Region, Classification nested under Assessments, Confidence-as-Assessment, Evidence tables as Assessment card primary body.

### Ownership invariants (observable)

| Invariant | Rule |
|-----------|------|
| Four peers only | Exactly the four Assessment cards; Recommendation is not `assessment-peer` |
| No rollup | No unit labeled Overall Assessment, Overall Score, or Synthesis |
| Classification out | Classification Region is not a child of Assessments |
| Evidence out of card body | No Drivers/Features/Contributions tables as card primary content |
| Hero / chrome / Market Data untouched | This Feature does not remount or restyle those surfaces |

### Screen state (host-owned)

| State | Assessment cards behavior |
|-------|---------------------------|
| `idle` | No successful Assessment card body claim (REQ-014) |
| `loading` | Host / Analysis loading chrome; no false success card body (REQ-012) |
| `success` | Four Assessment cards; omit empty slots; Recommendation compact after peers |
| `error` | Host / Analysis error + retry; no parallel success card claim (REQ-013) |

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| No Symbol / idle | Selection empty | Host empty/prompt; no success Assessment cards (REQ-014) | User selects Symbol |
| Analysis fetch loading | Host status | Existing loading (Skeleton); do not claim success cards (REQ-012) | Wait |
| Analysis fetch failure | Host / prior Feature error | Existing error + retry (REQ-013) | Retry via host |
| Partial mapped content | Some slots null | Show label (+ icon); omit missing badge/score/summary (REQ-004) | None required |
| Missing Recommendation stance | Stance null | Labeled compact Recommendation unit still after peers (REQ-007) | None required |
| Stale Analysis response | Host stale-ignore | Cards follow current Symbol only | None |
| Missing brand Icon export | Kit has no Icon | Decorative mark via NFR-011 exception; still no third-party icon lib | None |
| Attempt to introduce Overall / Synthesis / fifth Assessment card | Design / review gate | Not allowed | Spec + Reviewer reject |

Validation rules:

- Exactly four Assessment peer cards when Analysis composition is shown successfully (REQ-001, REQ-002).
- Recommendation is not rendered with the Assessment-card skeleton and is not an Assessment peer (REQ-007).
- No Region/unit labeled Overall Assessment, Overall Score, Synthesis, or Narrative (REQ-006, REQ-009).
- Classification is not rendered as a child Region of Assessments (REQ-010, REQ-011).
- Card shells import brand `Card`; outcome tokens import brand `Badge`; label/score/summary import brand `Text`/`Label` (REQ-003).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a **UI composition restyle** of existing Analysis peers: prefer extending existing `reading-analysis-composition` (and Reading host) component tests. Do **not** add a new mapper/fetch suite unless a thin slot-adapter is introduced (then unit-test omit-when-absent only). Do **not** re-list every mapped Analysis field already covered by prior mapper tests. No E2E, MSW, coverage %, mutation, or new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Four vertical Assessment cards | Component | Success fixture: four peers labeled Regime, Risk, Economic, Exposure; each is a card unit (accessible name / labeled container) | Extend `src/features/reading-analysis-composition/*.test.tsx` (prefer existing module) |
| Card slots as data allows | Component | Fixture with all slots → badge + score + summary visible; fixture with only label/outcome → omitted slots absent, peer still present | same |
| Brand Card / Badge / Text | Reviewer + light UI | Imports from `@maguer/market-data-brand/ui`; rendered outcome uses Badge role/name; no parallel card primitive | Reviewer; optional render smoke |
| No Overall / Synthesis | Component | No unit labeled Overall Assessment, Overall Score, or Synthesis | same |
| Recommendation not a fifth Assessment card | Component | Recommendation present after peers; not matching Assessment-card slot structure / not `assessment-peer` | same |
| Classification not nested | Component | Classification Region remains outside Assessments tree | same or extend Reading shell tests |
| Loading / error usable | Component / host | Extend existing Reading/Analysis state-machine: loading visible; error + retry re-invokes loader; idle does not claim success cards | extend existing Reading / Analysis screen tests |
| Catalog-linked labels | Component | Dimension labels via brand `wording` / `getMessage`; score field label (if shown) via `getMessage` | same |
| No new Analysis API | Reviewer | Reuses existing analysis fetch/map | Reviewer |
| No Tailwind utilities / no third-party icon lib | Reviewer | No utility `className` chrome; no new icon-package dependency | Reviewer |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 four vertical cards + slots as data allows | Yes — composition tests (full-slot + omit-slot fixtures) |
| AC-002 brand Card / Badge / Text | Reviewer (required) + light UI smoke |
| AC-003 no Overall / Synthesis | Yes — absence asserts |
| AC-004 Recommendation not a fifth Assessment card | Yes — composition (present, after peers, not peer-card skeleton) |
| AC-005 Assessment cards primary; Classification out | Yes — Classification not nested; four peers present as Analysis body |
| AC-006 loading / error remain usable | Yes — extend host state-machine oracles |
| AC-007 catalog copy | Yes — catalog-linked label asserts |
| AC-008 omit slots; no new API | Yes — omit-slot fixture + Reviewer (reuse fetch/map) |
| AC-009 hero / chrome / Market Data not redesigned | Reviewer (no unrelated surface edits) |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`. Prefer extending existing Analysis composition tests over a new `src/features/dashboard-analysis-cards/` test island unless the restyle module must live there for isolation — default is extend `reading-analysis-composition`.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared domain labels. Add a feature key only if a new field label is rendered.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.regime` | `@maguer/market-data-brand` wording | Regime card label |
| `labels.risk` | brand wording | Risk card label |
| `labels.economic` | brand wording | Economic card label |
| `labels.exposure` | brand wording | Exposure card label |
| `labels.recommendation` | brand wording | Recommendation unit label |
| `common.loading` / `common.error` / `common.retry` | brand wording | Existing host loading/error chrome only |

Reuse existing `readingAnalysis.*` keys from Feature `reading-analysis-composition` for Assessments workspace / placeholders when those states still apply.

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `readingAnalysis.score` | Score | `src/locales/en.json` | Optional field label next to a numeric score **only if** a visible/accessible field label is rendered |

Do **not** add keys named Overall Score, Synthesis, Insights, Advice, or Tip. Do not label a Region “Narrative”. Do not use “Asset”.

If the numeric score is presented without a separate field label (dimension label + badge already identify the card), **do not** add `readingAnalysis.score` — omit the key rather than unused copy.

Icons are decorative; they have no user-facing copy. Accessible name of each card is the dimension label.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Vertical Assessment cards with icon / label / badge / score / summary slots |
| REQ-002 | Peers remain inside one Assessments workspace; not Region Cards |
| REQ-003 / NFR-002 / NFR-006 / NFR-009 | Brand UI primitives table; no parallel card system; no Tailwind utilities |
| REQ-004 | Slot omit-when-absent; peer remains |
| REQ-005 | Independent peers; conflicts visible |
| REQ-006 | Forbidden Overall / Synthesis / Overall Score nodes |
| REQ-007 | RecommendationUnit `presentation: compact-band` after peers |
| REQ-008 | Recommendation in initial Analysis viewport / document order |
| REQ-009 | Summary = claim-bound Narrative; no Narrative Region |
| REQ-010 | No nested Classification / Evidence / Market Data / Diagnostics Regions |
| REQ-011 | Assessment cards remain primary interpretive surface |
| REQ-012 / REQ-013 / REQ-014 | Host-owned idle / loading / error |
| REQ-015 / NFR-005 | Copy / Wording keys |
| REQ-016 | Restyle existing composition; Reading Region map unchanged |
| REQ-017 | Reuse GET analysis + existing VM |
| REQ-018 / NFR-010 | Sibling Feature surfaces out of scope |
| REQ-019 | Collection layout: row or 2×2 at `md+`; stack below `md` in fixed order |
| REQ-020 | No Evidence tables / components / factors as card primary body |
| REQ-021 | Confidence stays Diagnostics |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines |
| NFR-007 | analysis-contract peer + Recommendation rules |
| NFR-008 | PROJECT_ROOT scope; adopted UX contracts only |
| NFR-011 | Icon primitive or decorative exception; no third-party icon lib |
| NFR-012 | No Figma pixel-polish gate |
