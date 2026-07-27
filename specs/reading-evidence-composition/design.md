# Design

## Overview

This Feature composes the **internals of the Evidence Region** (hosted by Feature `reading-layout-shell`) into claim-attached explainability per `knowledge/ux/evidence-contract.md`: **Drivers → Features → Contributions**, with progressive disclosure (Drivers first). Assessment `components` and exposure `factors` from existing Analysis mapping are presented as Evidence (Drivers + Contributions), not as the primary body inside Assessment peers from Feature `reading-analysis-composition`. Fidelity is gray-box / structural; hi-fi polish is out of scope.

Analysis remains the interpretive message. Evidence answers “why does this say that?” and stays subordinate to a claim. Users must grasp Assessment outcomes and Recommendation stance without opening Evidence depth.

### Post-ship presentation alignment

Wireframe SoT (Reading shell hosts Evidence as supporting Region): https://www.figma.com/design/opTJ1E7ZHIgpLPQTw1YtKP/Reading-Layout-Wireframe?node-id=0-1

Gray-box fidelity only. Payload orientation (UI model, not a new API map): assessment component rows and exposure factor rows map into Evidence Drivers / Contributions attached to the corresponding claim.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Evidence Region host | Provided by `reading-layout-shell`; this Feature fills the Evidence Region body only (REQ-013). |
| Evidence composition | Single Evidence workspace inside the Evidence Region; owns Drivers / Features / Contributions structure and claim-attachment context (REQ-001, REQ-002, REQ-011). |
| Claim attachment | Links Evidence depth to an Analysis claim (Regime, Risk, Economic, Exposure, and/or Recommendation). Optional Classification claim attachment may reuse the same pattern when Classification Evidence is available later; Classification signal packaging remains owned by the Classification Region (REQ-002, REQ-014). |
| Drivers depth | Highest-prominence Evidence kind; may surface named forces / component-like causes for the attached claim (REQ-003, REQ-004). |
| Features depth | Secondary; measured inputs behind Drivers; disclosed on demand after Drivers (REQ-003). |
| Contributions depth | Deepest; quantified attribution / weights toward a score; disclosed on demand (REQ-003, REQ-004). |
| Analysis peer cleanup | Assessment peer units retain outcome + claim-bound Narrative + Evidence **reference**; they must not own full component/factor tables as primary body (REQ-004, REQ-008). |
| Locale layer | Evidence kind / chrome labels in `src/locales/en.json` via `src/i18n/messages.ts`; claim dimension labels from `@market-data/brand/wording` when showing attachment context (REQ-012). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Fill Evidence Region body only | Shell owns Region map; Evidence contract owns depth | REQ-013 |
| Drivers → Features → Contributions kinds only | Adopted Evidence kinds; anti Metrics/Observations | REQ-001, REQ-006 |
| Claim attachment required for Evidence content | Anti free-floating metrics dashboard | REQ-002, REQ-015 |
| Drivers before Features/Contributions disclosure | Progressive disclosure / prominence inside Evidence | REQ-003 |
| components / factors → Evidence | Payload orientation; stop Assessment-owned metric body | REQ-004, REQ-008 |
| Analysis understandable without Evidence open | Interpretation before Evidence | REQ-005 |
| Market Data stays observation Region | Cite as Features only when supporting a claim | REQ-007 |
| Gray-box depth allowed | Epic + contract fidelity | REQ-010, NFR-007 |
| Brand UI kit for chrome | Conventions + Feature acceptance | REQ-009, NFR-002, NFR-006 |
| Reuse existing Analysis mapping | No new BE/OpenAPI | REQ-004, NFR-009 |

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Evidence / depth spacing | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Region / kind titles | `SectionHeading`, `Label`, `Text` |
| Evidence / claim-attachment containers (gray-box scanning) | `Card`, `CardHeader`, `CardTitle` when a bordered unit aids scanning — **not** as a primary equal-weight wall that outranks Analysis |
| Driver / Feature / Contribution row lists | `Table`, `TableHeader`, `TableRow`, `TableCell` when tabular depth is shown; otherwise `Stack` + `Text` / `Label` for gray-box lists |
| Claim / kind tokens | `Badge` when a short claim or kind token is shown |
| Depth disclosure control | `Button` for expand / show Features or Contributions |
| Loading (if Evidence body loads independently) | `Skeleton` |
| Error chrome (if Evidence body surfaces local failure) | `Alert`, `AlertTitle`, `AlertDescription` |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings.

**Explicit exception:** Semantic landmarks for Evidence kinds and claim attachments (e.g. `section` / disclosure regions with accessible names) are structural composition. They may be used with brand spacing/typography primitives and tokens; do not invent a parallel CSS design system.

### Out of scope (explicit)

- Hi-fi Figma / pixel polish as a delivery gate
- Reading-wide Region shell layout (Context, Analysis, Classification, Market Data, Diagnostics placement) — owned by `reading-layout-shell`
- Replacing Assessment outcomes / Recommendation / Narrative ownership — owned by `reading-analysis-composition`
- Diagnostics trust elevation behavior — Feature `reading-diagnostics`
- Classification Region signal packaging — Feature `reading-classification-body`
- New backend APIs, DTO fields, or OpenAPI changes
- Sibling-repo brand `visual-definitions` paths (use adopted `knowledge/ux/evidence-contract.md` only)
- Treating Market Data candles / order book as Evidence kinds or Region content
- Requiring Features/Contributions data that the existing Analysis payload does not provide (gray-box placeholders are sufficient)

## Data Flow

1. User opens a successful Symbol Reading; Evidence Region is present from the Reading shell (REQ-013).
2. Evidence Region body mounts Evidence composition with Drivers → Features → Contributions structure (REQ-001, REQ-010).
3. Claim attachments are derived from available Analysis claims (Assessment peers and/or Recommendation). Evidence content is shown under claim context — never as an unscoped metric wall (REQ-002, REQ-015).
4. When mapped assessment components / exposure factors exist, they render as Drivers and/or Contributions under the matching claim attachment inside Evidence; Assessment peers no longer own those rows as primary body (REQ-004, REQ-008).
5. Features and Contributions remain behind disclosure after Drivers (or as clearly secondary depth) (REQ-003).
6. Analysis Region continues to show outcomes + Recommendation without requiring Evidence expansion (REQ-005).
7. Market Data Region remains separate; its content is not labeled Evidence (REQ-007).

```text
[Reading workspace — reading-layout-shell]
    ├── Analysis Region (reading-analysis-composition)
    │     └── Assessment peers + Recommendation
    │           outcome / Narrative / Evidence reference only
    │           (no primary components/factors tables)
    └── Evidence Region (this Feature)
          └── Evidence composition (supporting)
                ├── Claim attachment(s)
                │     ├── Drivers (highest prominence)
                │     ├── Features (on demand)
                │     └── Contributions (on demand)
                └── Gray-box placeholders when depth missing

Not owned by Evidence: Market Data Region, Diagnostics, Classification lists, Assessment outcomes
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Evidence composition | Exactly one composition inside Evidence Region; stable accessible name / label for Evidence body |
| Claim attachment | Each Evidence block identifies the claim it explains (dimension / Recommendation label from brand wording or locale) |
| Drivers | Labeled Evidence kind; highest prominence within Evidence; may list named causes / component-like rows |
| Features | Labeled Evidence kind; secondary; expandable / on-demand |
| Contributions | Labeled Evidence kind; deepest; expandable / on-demand; may list weighted factor/component attribution |
| Analysis Evidence reference | Optional path/control from Assessment/Recommendation into Evidence Region — not Evidence content ownership |
| Absence of Metrics / Observations kinds | No Evidence kind labeled Metrics or Observations |

### Unit identity (stable)

| Unit id | Label (canonical) | Role | Prominence |
|---------|-------------------|------|------------|
| `evidence` | Evidence (Region host; existing shell) | Supporting Reading Region | Supporting (P4 Reading priority) |
| `evidence-composition` | Evidence body | Composition root | Inside Evidence Region |
| `claim-attachment` | Claim context (Regime / Risk / Economic / Exposure / Recommendation) | Attachment | Context for depth |
| `drivers` | Drivers | Evidence kind | Highest within Evidence |
| `features` | Features | Evidence kind | Secondary; on demand |
| `contributions` | Contributions | Evidence kind | Deepest; on demand |

Unit ids are implementation identifiers for tests and composition; user-facing labels come from locale / wording (REQ-012). There is **no** `metrics` or `observations` Evidence kind id.

### External systems

No new HTTP endpoints. Reuse existing `GET /markets/{symbol}/analysis` mapping owned by prior Features when populating Evidence rows from assessment components and exposure factors. Mapping rules for humanized names/weights remain in those Feature specs; this Feature owns Evidence composition structure, claim attachment, and relocation of that explainability out of Assessment primary body.

### Application configuration

None beyond existing Symbol selection / Analysis loading owned by the Reading host and prior Analysis Features.

## Data Model

### Evidence composition structure

```text
EvidenceComposition
  claimAttachments: ClaimAttachment[]   // zero or more; empty → labeled empty/placeholder Evidence (REQ-015)

ClaimAttachment
  claimId: "regime" | "risk" | "economic" | "exposure" | "recommendation"
  claimLabel: brand wording / locale
  drivers: EvidenceKindDepth
  features: EvidenceKindDepth
  contributions: EvidenceKindDepth

EvidenceKindDepth
  id: "drivers" | "features" | "contributions"
  prominence: "primary" | "secondary" | "deep"
  disclosure: "visible" | "collapsed" | "placeholder"
  rows: EvidenceRow[] | empty
  body: composedContent | GrayBoxPlaceholder

EvidenceRow
  name: string          // humanized when available from existing mapping
  value: string | number | null   // weight / contribution / feature measure when available
  source: "assessment-component" | "exposure-factor" | "cited-feature" | "placeholder"
```

### Payload → Evidence binding (UI model)

| Existing Analysis view-model source | Evidence presentation |
|-------------------------------------|------------------------|
| Risk / economic (and similar) component list rows when present on the mapped Analysis VM | `ClaimAttachment` for that dimension → Drivers and/or Contributions rows (`source: assessment-component`) |
| `exposure.factors[]` `{ name, weight }` | `ClaimAttachment` for Exposure → Drivers and/or Contributions rows (`source: exposure-factor`) |
| Cited measured input supporting a claim (when available) | Features rows (`source: cited-feature`) |
| Missing Features/Contributions data | GrayBoxPlaceholder for that kind; structure remains (REQ-010) |

Assessment peer `body` after this Feature: outcome (label/score/level) + optional claim-bound Narrative + Evidence reference — **not** full `components` / `factors` tables as primary owned content (REQ-004, REQ-008).

### Attention / disclosure structure (observable)

| Priority | Content | Notes |
|----------|---------|-------|
| Reading P1 | Analysis outcomes + Recommendation | Must remain understandable without Evidence expansion (REQ-005) |
| Reading P4 | Evidence Region | Supporting; after Classification in Reading flow |
| Evidence P0 | Drivers | Highest kind prominence; default visible depth |
| Evidence P1 | Features | On demand after Drivers |
| Evidence P2 | Contributions | On demand after Drivers (and typically after Features) |

Forbidden nodes: Metrics kind, Observations kind, Evidence as primary Reading workspace, Market Data labeled as Evidence, Assessment-owned primary components/factors tables.

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| Reading / Analysis host idle or loading | Host status | Evidence composition not claimed as success until Reading success body is available | Host selection / wait |
| Analysis fetch failure | Host / prior Feature error state | Host error + retry; do not invent a parallel Evidence-only error Region that replaces Analysis | Retry via host |
| Partial Evidence rows | Some claims have components/factors, others do not | Show attachments with available rows; keep missing kinds as labeled gray-box (REQ-010) | None required for structure |
| Empty factors / no components | Valid mapped Analysis with empty explainability arrays | Labeled Evidence Region with claim-context empty/placeholder depth (REQ-015); not an error | None |
| Stale Analysis response | Host stale-ignore | Composition follows current Symbol only | None |
| Attempt to label Metrics / Observations / Market Data as Evidence | Design / review gate | Not allowed in model or UI | Spec + Reviewer reject |

Validation rules:

- Exactly one Evidence composition when Evidence body is shown (REQ-001, REQ-013).
- Evidence kinds are only Drivers, Features, Contributions (REQ-006).
- Evidence content blocks identify claim context when rows are shown (REQ-002).
- Assessment peers must not render full components/factors tables as primary owned body after this Feature (REQ-004).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a **layout / composition** Feature for Evidence (plus Assessment-body cleanup for components/factors ownership). Prefer component tests with strong structural oracles. Extend existing Analysis/Reading host tests where Assessment peers currently render component/factor tables. Do not add mapper/fetch suites unless this Feature changes those modules. No E2E, MSW, coverage %, or new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Drivers → Features → Contributions structure in Evidence | Layout / component | Accessible names / labels for Drivers, Features, Contributions present under Evidence Region | `src/features/reading-evidence-composition/*.test.tsx` (new) and/or extend Reading shell Evidence body tests |
| Claim attachment present | Layout / component | Evidence depth is associated with a claim label (e.g. Risk / Exposure) when fixture includes explainability rows; no unscoped “metrics wall” without claim context | same |
| components / factors not Assessment primary body | Layout / component | With fixture containing components/factors, those rows appear under Evidence (Drivers/Contributions); Assessment peer primary body does not own the full table | same + extend `reading-analysis-composition` / Reading host tests as needed |
| Interpretation before Evidence | Layout / component | Assessment outcomes + Recommendation remain visible in Analysis without requiring Features/Contributions disclosure to be open; document order keeps Analysis interpretation before Evidence Region | composition + shell tests |
| Progressive disclosure | Layout / component | Drivers visible by default (or as first Evidence depth); Features and/or Contributions require disclosure control or are marked secondary/collapsed in the fixture | same |
| No Metrics / Observations kinds | Layout / component | No Evidence kind labeled Metrics or Observations | same |
| Market Data not labeled Evidence | Layout / component | Market Data Region remains distinct; Evidence composition does not adopt Market Data region label for its body | same or shell + composition suite |
| Empty Evidence still claim-structured | Layout / component | With empty factors/components fixture, Evidence Region still labeled; placeholder/empty claim structure — not a free-floating metric dashboard | same |
| Brand primitives / no ad-hoc DS | Reviewer + light UI | Imports from `@market-data/brand/ui`; no Tailwind utility `className` for Evidence chrome | Reviewer; optional render smoke |
| Copy from catalogs | Component / Reviewer | Evidence kind and chrome labels resolve via `getMessage` / brand `wording`; no hardcoded designed English in feature sources | assert catalog-linked labels |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 Drivers → Features → Contributions claim-attached | Yes — composition tests |
| AC-002 components/factors in Evidence, not Assessment primary body | Yes — composition + Analysis peer cleanup asserts |
| AC-003 Analysis understandable without Evidence depth open | Yes — Analysis outcomes visible; Features/Contributions not required open |
| AC-004 not free-floating metrics dashboard | Yes — claim context / empty structured Evidence |
| AC-005 anti-patterns (no Metrics/Observations; Market Data ≠ Evidence) | Yes — absence + Region separation asserts |
| AC-006 brand tokens/components | Reviewer (required) + optional render smoke |
| AC-007 catalog copy | Yes — rendered labels from wording/locale keys |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared claim dimension labels; Evidence-composition chrome that is feature-specific lives in the app locale catalog.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.regime` / `labels.risk` / `labels.economic` / `labels.exposure` | `@market-data/brand/wording` | Claim-attachment context labels |
| `labels.recommendation` | `@market-data/brand/wording` | Recommendation claim-attachment context |
| `common.loading` / `common.error` / `common.retry` | `@market-data/brand/wording` | Only if Evidence body surfaces local loading/error chrome |

Reuse existing Reading shell Region label `readingLayout.regionEvidence` for the Evidence Region chrome (do not invent a second Region name).

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `readingEvidence.drivers` | Drivers | `src/locales/en.json` | Drivers Evidence kind label |
| `readingEvidence.features` | Features | `src/locales/en.json` | Features Evidence kind label |
| `readingEvidence.contributions` | Contributions | `src/locales/en.json` | Contributions Evidence kind label |
| `readingEvidence.claimAttachment` | Evidence for {claim} | `src/locales/en.json` | Claim-attachment heading pattern (`{claim}` = brand dimension / Recommendation label) |
| `readingEvidence.kindPlaceholder` | Content for this Evidence depth will appear here. | `src/locales/en.json` | Gray-box body when a kind has no composed rows |
| `readingEvidence.emptyForClaim` | No Evidence rows for this claim yet. | `src/locales/en.json` | Empty claim-attached depth |
| `readingEvidence.showFeatures` | Show Features | `src/locales/en.json` | Disclosure control for Features |
| `readingEvidence.showContributions` | Show Contributions | `src/locales/en.json` | Disclosure control for Contributions |
| `readingEvidence.hideDepth` | Hide | `src/locales/en.json` | Collapse secondary Evidence depth |

Do not use “Metrics”, “Observations”, “Insights”, or “Analytics” as Evidence kind labels. Do not use “Asset”. Do not label Market Data content as Evidence.

If Assessment peers previously exposed a local “Factors” / component-list chrome label as primary Assessment body, remove or demote that ownership so explainability copy lives under Evidence keys above (existing `viewMarketAnalysis.factors` may remain only if reused inside Evidence Contributions/Drivers presentation — not as Assessment-owned primary body chrome).

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | EvidenceComposition with Drivers / Features / Contributions kinds |
| REQ-002 | ClaimAttachment model; no unscoped metrics wall |
| REQ-003 | Disclosure / prominence table; Drivers first |
| REQ-004 | Payload → Evidence binding; Assessment peer cleanup |
| REQ-005 | Analysis outcomes remain visible without Evidence depth open |
| REQ-006 | Forbidden Metrics / Observations kind ids |
| REQ-007 | Market Data excluded from Evidence ownership; cite-only Features |
| REQ-008 | Evidence tables owned by Evidence Region; Analysis reference only |
| REQ-009 / NFR-002 / NFR-006 | Brand UI primitives table |
| REQ-010 | GrayBoxPlaceholder for missing kind depth |
| REQ-011 | Evidence supporting prominence; not primary workspace |
| REQ-012 / NFR-005 | Feature locale keys + brand wording for claim labels |
| REQ-013 | Fills Evidence Region body only; shell Regions unchanged |
| REQ-014 | Evidence ownership boundary table / out of scope |
| REQ-015 | Empty Evidence still labeled with claim-context structure |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines in Copy / Wording |
| NFR-007 | Gray-box fidelity explicit |
| NFR-008 | Adopted `evidence-contract.md` only; PROJECT_ROOT scope |
| NFR-009 | Reuse existing Analysis fetch/mapping; no new API |
