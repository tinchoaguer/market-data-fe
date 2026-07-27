# Design

## Overview

This Feature composes the **internals of the Analysis Region** (hosted by Feature `reading-layout-shell`) into one **Assessments workspace** per `knowledge/ux/analysis-contract.md`: four peer Assessment units (Regime, Risk, Economic, Exposure), a compact Recommendation composed with that collection, and Narrative bound to those claims. Fidelity is gray-box / structural: labeled Assessment/Recommendation chrome and hierarchy are required; hi-fi polish and Evidence depth expansion are out of scope.

Existing Analysis payload mapping (Feature `view-market-analysis`) may supply dimension outcomes and Recommendation stance into the peer units when available. Units without composed detail remain labeled gray-box peers — structure never collapses into an Overall / Synthesis rollup.

### Post-ship presentation alignment

Wireframe SoT (Reading shell hosts Analysis): https://www.figma.com/design/opTJ1E7ZHIgpLPQTw1YtKP/Reading-Layout-Wireframe?node-id=0-1

Assessments communicate **label / score / level + short meaning**, not raw observation dumps. Mapper formats numeric levels (2 decimals) and exposes structured components as list rows. Claim Narrative is wired from the Reading host when payload text exists; Recommendation surfaces `hardGateReason` when present. Peer units remain equal in *role* but must not read as an equal-weight hero card wall.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Analysis Region host | Provided by `reading-layout-shell`; this Feature fills the Analysis Region body only (REQ-017). |
| Assessments workspace | Single primary workspace inside Analysis; owns peer Assessments + Recommendation composition + claim-bound Narrative slots (REQ-001, REQ-004, REQ-007). |
| Assessment peer units | Four independent units: Regime, Risk, Economic, Exposure — each shows dimension identity, available outcome, optional short Narrative bound to that claim, and structural hooks for Evidence/Diagnostics references (REQ-002, REQ-003, REQ-012, REQ-014). |
| Recommendation unit | Compact stance chrome composed inside Assessments (not a Reading Region, not a fifth Assessment engine) (REQ-004, REQ-005, REQ-006, REQ-013, REQ-016). |
| Claim-bound Narrative | Short takeaway text attached to an Assessment or Recommendation claim; never a peer Region or detached essay (REQ-007). |
| Locale layer | Dimension / Recommendation labels from `@market-data/brand/wording`; Analysis-composition chrome labels in `src/locales/en.json` via `src/i18n/messages.ts` (REQ-015). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Exactly one Assessments workspace inside Analysis | Contract: one Analysis → one Assessments Region | REQ-001 |
| Four peer Assessment units | Contract Assessment dimensions; no parent rollup | REQ-002, REQ-008 |
| Conflicts stay visible | Anti-pattern: dimensions collapsed behind rollup | REQ-003 |
| Recommendation inside Assessments | Contract: not its own Region; compact vs dimensions | REQ-004, REQ-016 |
| Stance in initial Analysis viewport | Contract scroll rule for Recommendation | REQ-005 |
| Dimensions before Recommendation before Narrative | Attention flow inside Analysis | REQ-006, REQ-009 |
| Narrative bound to claims | Anti detached Narrative Region | REQ-007, REQ-008 |
| No Classification / Evidence / Market Data / Diagnostics nested as Analysis Regions | Ownership boundaries; Reading Regions remain siblings | REQ-010, REQ-017 |
| Gray-box peers allowed | Epic + contract fidelity | REQ-012, NFR-007 |
| Brand UI kit for chrome | Conventions + Feature acceptance | REQ-011, NFR-002, NFR-006 |
| Reuse existing Analysis mapping | No new BE/OpenAPI | REQ-013, REQ-014, NFR-009 |

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Assessments / peer spacing | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Unit titles / labels | `SectionHeading`, `Label`, `Text` |
| Assessment / Recommendation containers (gray-box scanning) | `Card`, `CardHeader`, `CardTitle` when a bordered unit aids scanning — **not** as an equal-weight wall that competes with Reading Region hierarchy |
| Outcome tokens | `Badge` when a short level/label token is shown |
| Loading (if Analysis body loads independently) | `Skeleton` |
| Error chrome (if Analysis body surfaces local failure) | `Alert`, `AlertTitle`, `AlertDescription` |
| Retry | `Button` |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings.

**Explicit exception:** Semantic landmarks for Assessment peers (e.g. `section` / list items with accessible names) are structural composition. They may be used with brand spacing/typography primitives and tokens; do not invent a parallel CSS design system.

### Out of scope (explicit)

- Hi-fi Figma / pixel polish as a delivery gate
- Reading-wide Region shell (Context, Classification, Evidence, Market Data, Diagnostics layout) — owned by `reading-layout-shell`
- Nesting Classification under Analysis
- Full Evidence depth expansion (Drivers → Features → Contributions) beyond claim-reference hooks / placeholders
- Treating confidence / data quality as an Assessment dimension (stays Diagnostics)
- New backend APIs, DTO fields, or OpenAPI changes
- Sibling-repo brand `visual-definitions` paths (use adopted `knowledge/ux/analysis-contract.md` only)
- Per-dimension mini-recommendations that replace the single Recommendation stance

## Data Flow

1. User opens a successful Symbol Reading; Analysis Region is present from the Reading shell (REQ-017).
2. Analysis Region body mounts the Assessments workspace (REQ-001).
3. Peer Assessment units render for Regime, Risk, Economic, Exposure — with mapped outcomes when available, otherwise labeled gray-box (REQ-002, REQ-012, REQ-014).
4. Recommendation renders after the peer collection, still inside Assessments, compact, stance visible in the initial Analysis viewport (REQ-004, REQ-005, REQ-006, REQ-013, REQ-016).
5. Narrative copy, when present, appears bound to the corresponding Assessment or Recommendation claim (REQ-007).
6. Evidence / Classification / Market Data / Diagnostics remain outside Assessments as Reading Regions; Analysis may only reference them (REQ-010).

```text
[Reading workspace — reading-layout-shell]
    └── Analysis Region (host)
          └── Assessments workspace
                ├── Assessment peers (independent)
                │     ├── Regime  (+ optional claim-bound Narrative)
                │     ├── Risk    (+ optional claim-bound Narrative)
                │     ├── Economic (+ optional claim-bound Narrative)
                │     └── Exposure (+ optional claim-bound Narrative)
                └── Recommendation (compact; + optional claim-bound Narrative)
                      └── stance visible without Analysis-only scroll

References (not owned / not nested as Analysis Regions):
  Evidence | Diagnostics | Classification | Market Data
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Assessments workspace | Exactly one workspace inside Analysis; stable accessible name / label for Assessments composition chrome |
| Assessment peers | Four units with stable ids and accessible names: Regime, Risk, Economic, Exposure |
| Recommendation unit | Composed inside Assessments; accessible name Recommendation; not marked as a Reading Region |
| Claim-bound Narrative | Associated with a specific Assessment or Recommendation claim node; no Region labeled Narrative |
| Evidence reference hooks | Optional structural affordance pointing to Reading Evidence Region — not Evidence content ownership |

### Unit identity (stable)

| Unit id | Label (canonical) | Role | Prominence inside Analysis |
|---------|-------------------|------|----------------------------|
| `assessments` | Assessments (workspace) | Primary workspace | Highest (P0) |
| `regime` | Regime | Assessment peer | Large within peer collection |
| `risk` | Risk | Assessment peer | Large within peer collection |
| `economic` | Economic | Assessment peer | Large within peer collection |
| `exposure` | Exposure | Assessment peer | Large within peer collection |
| `recommendation` | Recommendation | Composed stance | Compact (P1) |

Unit ids are implementation identifiers for tests and composition; user-facing labels come from brand wording / locale (REQ-015). There is **no** `overall`, `synthesis`, or `narrative` Region/unit id.

### External systems

No new HTTP endpoints. Reuse existing `GET /markets/{symbol}/analysis` mapping owned by prior Features when populating Assessment outcomes and Recommendation stance. Mapping rules remain in those Feature specs; this Feature owns composition structure and placement.

### Application configuration

None beyond existing Symbol selection / Analysis loading owned by the Reading host and prior Analysis Features.

## Data Model

### Assessments composition structure

```text
AssessmentsWorkspace
  peers:
    regime: AssessmentUnit
    risk: AssessmentUnit
    economic: AssessmentUnit
    exposure: AssessmentUnit
  recommendation: RecommendationUnit

AssessmentUnit
  id: "regime" | "risk" | "economic" | "exposure"
  role: "assessment-peer"
  identityLabel: brand wording (Regime | Risk | Economic | Exposure)
  outcome: mappedOutcome | null
  narrative: claimBoundNarrative | null
  body: composedContent | GrayBoxPlaceholder

RecommendationUnit
  id: "recommendation"
  role: "recommendation"
  identityLabel: brand wording (Recommendation)
  stance: mappedStance | null
  narrative: claimBoundNarrative | null
  body: composedContent | GrayBoxPlaceholder
  compact: true

claimBoundNarrative
  boundTo: AssessmentUnit.id | "recommendation"
  text: catalogOrMappedCopy
```

### Attention / layout structure (observable)

| Priority | Content | Notes |
|----------|---------|-------|
| P0 | Assessment peer collection | Always visible; peers independent |
| P1 | Recommendation | Compact; after peers; stance in initial Analysis viewport |
| P2 | Claim-bound Narrative | With claims; not a Region |
| P3 | Evidence references | On demand; Reading Evidence Region |

Forbidden nodes: Overall Assessment, Overall Score, Synthesis Region, standalone Narrative Region, Classification nested under Assessments, Confidence-as-Assessment.

### Content binding

| Source | Consumed as |
|--------|-------------|
| Existing Analysis view-model regime / risk / economic / exposure fields | AssessmentUnit.outcome (when present) |
| Existing Analysis view-model recommendation / catalog recommendation | RecommendationUnit.stance (when present) |
| Existing short explanatory copy already mapped to a claim (if any) | claimBoundNarrative |
| Missing composed detail | GrayBoxPlaceholder; unit remains labeled |

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| Reading / Analysis host idle or loading | Host status | Assessments composition not claimed as success until Analysis body is available | Host selection / wait |
| Analysis fetch failure | Host / prior Feature error state | Host error + retry; do not invent a parallel Assessments-only error Region | Retry via host |
| Partial mapped content | Some dimensions present, others missing | Show available outcomes; keep missing peers as labeled gray-box (REQ-012, REQ-014) | None required for structure |
| Missing Recommendation stance | Stance null | Labeled Recommendation placeholder still composed with Assessments (REQ-013) | None required for structure |
| Stale Analysis response | Host stale-ignore | Composition follows current Symbol only | None |
| Attempt to introduce Overall / Synthesis | Design / review gate | Not allowed in model or UI | Spec + Reviewer reject |

Validation rules:

- Exactly one Assessments workspace when Analysis composition is shown (REQ-001).
- Exactly four Assessment peer units; Recommendation is not an Assessment peer (REQ-002, REQ-004).
- No Region/unit labeled Overall Assessment, Overall Score, Synthesis, or Narrative (REQ-007, REQ-008).
- Classification is not rendered as a child Region of Assessments (REQ-010).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a **layout / composition** Feature inside Analysis: prefer component tests with strong structural oracles. Extend existing Analysis/Reading host tests only where the Analysis body mounts. Do not add mapper/fetch suites unless this Feature changes those modules. No E2E, MSW, coverage %, or new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| One Assessments workspace inside Analysis | Layout / component | Assessments composition landmark/label present once under Analysis Region | `src/features/reading-analysis-composition/*.test.tsx` (new) and/or extend Reading shell Analysis body tests |
| Four peer Assessment units | Layout / component | Accessible names / labels for Regime, Risk, Economic, Exposure all present as peers | same |
| Recommendation composed with Assessments | Layout / component | Recommendation labeled unit is inside Assessments composition; not a separate Reading Region sibling of Analysis | same |
| Stance in initial Analysis viewport | Layout / component | Recommendation stance (or labeled Recommendation unit) appears without requiring scroll-only discovery in the Analysis composition fixture (document order: peers then Recommendation within Analysis) | same |
| Narrative not a Region | Layout / component | No Region/unit labeled Narrative as peer of Assessments; narrative text (if fixture includes it) is associated with a claim unit | same |
| No Overall / Synthesis rollup | Layout / component | No unit labeled Overall Assessment, Overall Score, or Synthesis | same |
| Classification not nested under Assessments | Layout / component | Classification Region remains outside Assessments (Reading shell); Assessments tree has no Classification child Region | same or shell + composition suite |
| Interpretation before Evidence | Layout / component | Assessment peers + Recommendation appear before Evidence Region in Reading document order (shell order preserved; Analysis body does not hoist Evidence) | composition + shell tests |
| Gray-box peers allowed | Layout / component | Peer units still labeled when body is placeholder | same |
| Brand primitives / no ad-hoc DS | Reviewer + light UI | Imports from `@market-data/brand/ui`; no Tailwind utility `className` for Assessment chrome | Reviewer; optional render smoke |
| Copy from catalogs | Component / Reviewer | Dimension and Recommendation labels resolve via brand `wording` / `getMessage`; no hardcoded designed English in feature sources | assert catalog-linked labels |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 Assessments + four peers | Yes — composition tests |
| AC-002 Recommendation composed + stance visibility / order | Yes — composition tests (inside Assessments; after peers; present in Analysis body) |
| AC-003 Narrative claim-bound / not Region | Yes — absence of Narrative Region + optional bound-text association |
| AC-004 no Overall / Synthesis | Yes — absence asserts |
| AC-005 hierarchy / anti-patterns | Yes — order + Classification not nested + Evidence after Analysis interpretation |
| AC-006 brand tokens/components | Reviewer (required) + optional render smoke |
| AC-007 catalog copy | Yes — rendered labels from wording/locale keys |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared domain labels; Analysis-composition chrome that is feature-specific lives in the app locale catalog.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.regime` | `@market-data/brand/wording` | Regime Assessment unit label |
| `labels.risk` | `@market-data/brand/wording` | Risk Assessment unit label |
| `labels.economic` | `@market-data/brand/wording` | Economic Assessment unit label |
| `labels.exposure` | `@market-data/brand/wording` | Exposure Assessment unit label |
| `labels.recommendation` | `@market-data/brand/wording` | Recommendation unit label |
| `common.loading` / `common.error` / `common.retry` | `@market-data/brand/wording` | Only if Analysis body surfaces local loading/error chrome |

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `readingAnalysis.assessmentsLabel` | Assessments | `src/locales/en.json` | Assessments workspace label |
| `readingAnalysis.unitPlaceholder` | Content for this Assessment will appear here. | `src/locales/en.json` | Gray-box body when an Assessment peer has no composed content |
| `readingAnalysis.recommendationPlaceholder` | Recommendation stance will appear here. | `src/locales/en.json` | Gray-box body when Recommendation stance is not yet composed |
| `readingAnalysis.narrativePlaceholder` | Narrative for this claim will appear here. | `src/locales/en.json` | Optional bound Narrative placeholder (must remain claim-associated, not a Region title) |

Do not use “Overall”, “Synthesis”, “Insights”, “Advice”, or “Tip” as unit labels. Do not label a Region “Narrative”. Do not use “Asset”.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | Single Assessments workspace under Analysis Region |
| REQ-002 | Four Assessment peer units with stable ids |
| REQ-003 | Peers independent; no rollup that hides conflicts |
| REQ-004 | RecommendationUnit inside AssessmentsWorkspace |
| REQ-005 | Recommendation in initial Analysis viewport / document order after peers |
| REQ-006 | Attention order: peers → Recommendation |
| REQ-007 | claimBoundNarrative model; no Narrative Region id |
| REQ-008 | Forbidden Overall / Synthesis nodes |
| REQ-009 | Priority table P0→P3; Evidence references last |
| REQ-010 | Ownership boundary: no nested Classification/Evidence/Market Data/Diagnostics Regions |
| REQ-011 / NFR-002 / NFR-006 | Brand UI primitives table |
| REQ-012 | GrayBoxPlaceholder for Assessment peers |
| REQ-013 | Recommendation stance or placeholder |
| REQ-014 | Mapped outcomes or gray-box peers |
| REQ-015 / NFR-005 | Brand wording + feature locale keys |
| REQ-016 | Peers always visible; Recommendation compact |
| REQ-017 | Fills Analysis Region body only; shell Regions unchanged |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines in Copy / Wording |
| NFR-007 | Gray-box fidelity explicit |
| NFR-008 | Adopted `analysis-contract.md` only; PROJECT_ROOT scope |
| NFR-009 | Reuse existing Analysis fetch/mapping; no new API |
