# Design

## Overview

This Feature composes the **internals of the Diagnostics Region** (hosted by Feature `reading-layout-shell`) per `knowledge/ux/diagnostics-contract.md`: a cross-cutting trust / data-quality band that is **quiet when healthy** and **elevated when blocking or strongly qualifying**. Trust signals map to insufficient / partial / stale (or equivalent mapped codes from existing Analysis / Reading view-models). Diagnostics **qualify** Analysis and Classification; they do not conclude Assessments or Recommendation. Fidelity is gray-box / structural; hi-fi polish is out of scope.

Analysis remains the interpretive hero message (`knowledge/ux/reading-contract.md`). Confidence / data quality is never an Assessment peer inside Feature `reading-analysis-composition`. Hard trust failures are not owned solely by Evidence tables (`knowledge/ux/evidence-contract.md`).

### Post-ship presentation alignment

Wireframe SoT (Reading shell hosts Diagnostics as cross-cutting quiet band): https://www.figma.com/design/opTJ1E7ZHIgpLPQTw1YtKP/Reading-Layout-Wireframe?node-id=0-1

Gray-box fidelity only. Payload orientation (UI model, not a new API map): derive Diagnostics view-model signals from existing Analysis mapping (e.g. insufficient-input reason codes, hard-gate / capacity constraints, incomplete claim coverage) and present them in Diagnostics elevation states.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Diagnostics Region host | Provided by `reading-layout-shell`; this Feature fills the Diagnostics Region body only (REQ-012). |
| Diagnostics composition | Single Diagnostics workspace inside the Diagnostics Region; owns trust status chrome, quiet/elevated presentation, and signal list (REQ-001, REQ-010). |
| Trust signal mapper | Maps existing Analysis / Reading view-model fields into Diagnostics signals (`insufficient` / `partial` / `stale` / equivalent) with severity `healthy` \| `qualifying` \| `blocking` (REQ-004, NFR-009). |
| Quiet state chrome | Minimal healthy status when severity is healthy; does not compete with Analysis (REQ-002, REQ-009). |
| Elevated state chrome | Expands / elevates near the Reading when qualifying or blocking; unmistakable; Analysis remains hero (REQ-003, REQ-007, REQ-014). |
| Analysis boundary guard | Ensures no Confidence / data-quality Assessment peer is introduced under Assessments (REQ-005, REQ-015). |
| Evidence boundary guard | Blocking trust is not solely buried inside Evidence Drivers/Features/Contributions tables (REQ-006, REQ-013). |
| Locale layer | Diagnostics chrome / status / signal labels in `src/locales/en.json` via `src/i18n/messages.ts`; shared labels from `@market-data/brand/wording` when reused (REQ-011). |

### Placement rationale

| Decision | Rationale | Requirements |
|----------|-----------|--------------|
| Fill Diagnostics Region body only | Shell owns Region map; Diagnostics contract owns trust chrome | REQ-012 |
| Quiet when healthy | Contract hierarchy; do not compete with Analysis | REQ-002, REQ-009, REQ-010 |
| Elevate when blocking / strongly qualifying | Cross-cutting interrupt without becoming hero | REQ-003, REQ-007, REQ-014 |
| Map insufficient / partial / stale (or equivalents) | Epic + Diagnostics contract trust units | REQ-004 |
| No Confidence Assessment dimension | Analysis ownership boundary | REQ-005, REQ-015 |
| Not only page-end / not only Evidence tables | Contract anti-patterns | REQ-006 |
| Brand UI kit for chrome | Conventions + Feature acceptance | REQ-008, NFR-002, NFR-006 |
| Reuse existing Analysis mapping | No new BE/OpenAPI | REQ-004, NFR-009 |
| Gray-box quiet state allowed | Epic + contract fidelity | REQ-001, REQ-009, NFR-007 |

### Brand UI primitives

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Diagnostics spacing / bands | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Region / status titles | `SectionHeading`, `Label`, `Text` |
| Quiet / elevated containers (gray-box scanning) | `Card`, `CardHeader`, `CardTitle` when a bordered unit aids scanning — **not** as a primary equal-weight wall that outranks Analysis |
| Trust status / severity tokens | `Badge` when a short status token is shown |
| Elevated / blocking trust chrome | `Alert`, `AlertTitle`, `AlertDescription` for unmistakable elevated qualification |
| Collapse / expand when contextual | `Button` for non-blocking disclosure controls |
| Loading (if Diagnostics body loads independently) | `Skeleton` |

Native HTML stand-ins for those roles are forbidden. Do **not** introduce Tailwind / utility `className` strings.

**Explicit exception:** Semantic landmarks for Diagnostics status (e.g. `section` / `status` regions with accessible names) are structural composition. They may be used with brand spacing/typography primitives and tokens; do not invent a parallel CSS design system.

### Out of scope (explicit)

- Hi-fi Figma / pixel polish as a delivery gate
- Reading-wide Region shell layout (Context, Analysis, Classification, Evidence, Market Data placement) — owned by `reading-layout-shell`
- Replacing Assessment outcomes / Recommendation / Narrative ownership — owned by `reading-analysis-composition`
- Evidence Drivers → Features → Contributions ownership — owned by `reading-evidence-composition`
- Classification Region signal packaging — Feature `reading-classification-body`
- Market Data Region body fidelity — Feature `reading-market-data-body`
- New backend APIs, DTO fields, or OpenAPI changes
- Sibling-repo brand `visual-definitions` paths (use adopted `knowledge/ux/diagnostics-contract.md` only)
- Strategy recommendations or Assessment conclusions owned by Diagnostics
- Marketing empty states presented as Analysis

## Data Flow

1. User opens a successful Symbol Reading; Diagnostics Region is present from the Reading shell (REQ-012).
2. Diagnostics Region body mounts Diagnostics composition (REQ-001).
3. Trust signal mapper derives zero or more signals from existing Analysis / Reading view-model fields (REQ-004, NFR-009).
4. If severity is healthy (no active qualifying/blocking signals) → quiet / minimal Diagnostics chrome; Analysis remains primary attention (REQ-002, REQ-009, REQ-010).
5. If severity is qualifying or blocking → elevate Diagnostics near the Reading (Alert/status chrome expanded); Analysis still owns interpretation; Diagnostics qualify only (REQ-003, REQ-007, REQ-014).
6. Analysis Assessments workspace continues without a Confidence / data-quality peer dimension (REQ-005).
7. Evidence Region continues to own explainability tables; hard trust failures also appear in Diagnostics, not only inside Evidence (REQ-006, REQ-013).

```text
[Reading workspace — reading-layout-shell]
    ├── Analysis Region (reading-analysis-composition)
    │     └── Assessment peers + Recommendation
    │           (no Confidence / data-quality Assessment peer)
    ├── Evidence Region (reading-evidence-composition)
    │     └── Drivers → Features → Contributions (explainability only)
    └── Diagnostics Region (this Feature)
          └── Diagnostics composition (cross-cutting)
                ├── quiet / minimal   when healthy
                └── elevated status   when qualifying | blocking
                      └── signals: insufficient | partial | stale | equivalent

Not owned by Diagnostics: Assessment outcomes, Recommendation stance,
Narrative Region, Classification lists, Market Data, Evidence tables
```

## Interfaces

### Public UI surface

| Surface | Contract |
|---------|----------|
| Diagnostics composition | Exactly one composition inside Diagnostics Region; stable accessible name / label for Diagnostics body |
| Quiet state | Minimal chrome when healthy; Region still present and labeled |
| Elevated state | Unmistakable trust chrome near Reading when qualifying or blocking; Analysis Region remains the interpretive hero |
| Trust signals | Zero or more labeled signals of kinds insufficient / partial / stale / equivalent |
| Absence of Confidence Assessment | No Assessment peer labeled Confidence / Data quality inside Analysis |
| Blocking discoverability | Elevated Diagnostics not solely after Market Data-only scroll epilogue; not solely inside Evidence tables |

### Unit identity (stable)

| Unit id | Label (canonical) | Role | Prominence |
|---------|-------------------|------|------------|
| `diagnostics` | Diagnostics (Region host; existing shell) | Cross-cutting Reading Region | Minimal when healthy; elevated when blocking |
| `diagnostics-composition` | Diagnostics body | Composition root | Inside Diagnostics Region |
| `diagnostics-status` | Trust status | Quiet or elevated status chrome | Grows with severity |
| `diagnostics-signal` | Trust signal row | Insufficient / partial / stale / equivalent | Listed under status |

Unit ids are implementation identifiers for tests and composition; user-facing labels come from locale / wording (REQ-011). There is **no** `confidence` Assessment unit id under Analysis.

### Elevation contract (observable)

| Severity | UI behavior | Notes |
|----------|-------------|-------|
| `healthy` | Quiet / minimal; collapsible or compact status acceptable | Do not compete with Analysis |
| `qualifying` | Elevated near Reading; status visible without Market-Data-only epilogue | Strong qualification; still not hero |
| `blocking` | Elevated + expanded (not collapsed-only); unmistakable via `Alert` (or equivalent brand status chrome) | Does not replace Analysis conclusions |

“Near the affected Reading” means Diagnostics remain in the Reading workspace cross-cutting band and, when elevated, appear in reading order before a Market-Data-only late epilogue would be required to discover them. Document order may keep Diagnostics after supporting Regions when healthy; when elevated, status chrome must be discoverable without treating Diagnostics as an optional page-footer-only notice.

### External systems

No new HTTP endpoints. Reuse existing `GET /markets/{symbol}/analysis` (and any already-composed Reading host view-model) owned by prior Features. Mapping rules for Assessment outcomes remain in those Feature specs; this Feature owns Diagnostics signal derivation and presentation.

### Application configuration

None beyond existing Symbol selection / Analysis loading owned by the Reading host and prior Analysis Features.

## Data Model

### Diagnostics composition structure

```text
DiagnosticsComposition
  severity: "healthy" | "qualifying" | "blocking"
  presentation: "quiet" | "elevated"
  signals: DiagnosticSignal[]

DiagnosticSignal
  id: string
  kind: "insufficient" | "partial" | "stale" | "equivalent"
  severity: "qualifying" | "blocking"
  label: catalogResolvedCopy
  detail: catalogResolvedCopy | null
  sourceRef: mappedFieldPath | null
```

### Trust signal mapping (from existing Analysis / Reading VM)

| Mapped source (examples; adapt to current VM field names) | DiagnosticSignal.kind | Typical severity |
|----------------------------------------------------------|----------------------|------------------|
| Insufficient-input reason codes (e.g. `insufficient_candles` and equivalent insufficient-data flags already mapped) | `insufficient` | `blocking` when conclusion is blocked; else `qualifying` |
| Incomplete claim coverage / missing series / empty-book style gaps already detectable in mapped content | `partial` | `qualifying` (or `blocking` when contract marks hard failure) |
| Explicit stale / freshness indicators already present on mapped payloads | `stale` | `qualifying` or `blocking` per mapped meaning |
| Hard-gate / capacity / no-conclusion constraints already surfaced (e.g. recommendation hard-gate reason) when they qualify trust rather than state stance | `equivalent` | `blocking` when they block trust in the reading |
| No mapped trust signals | — | `healthy` → quiet composition |

Rules:

- Prefer catalog-linked labels for known codes; unknown codes fall back to raw code without failing the Reading map (consistent with prior label Features).
- Do not invent synthetic Assessment conclusions from Diagnostics.
- Do not require OpenAPI fields that do not already exist; gray-box quiet state satisfies healthy Readings (REQ-009, NFR-009).
- If a mapped code is both an Evidence-related reason and a trust constraint, trust status chrome lives in Diagnostics; Evidence may still explain “why” without being the only home for hard failures (REQ-006).

### Attention / layout structure (observable)

| State | Diagnostics | Analysis |
|-------|-------------|----------|
| Healthy | Quiet / minimal cross-cutting | Extra-large hero |
| Qualifying / blocking | Elevated near Reading; expanded when blocking | Remains hero interpretive message |

Forbidden nodes: Confidence-as-Assessment peer; Diagnostics as Extra-large primary workspace; Diagnostics-owned Regime/Risk/Economic/Exposure conclusions; Diagnostics-owned Recommendation stance; Evidence-only burial of blocking trust.

## Error Handling

| Failure | Detection | User-visible behavior | Recovery |
|---------|-----------|------------------------|----------|
| Reading host idle or loading | Host status | Diagnostics composition not claimed as success until Reading success | Host selection / wait |
| Analysis fetch failure | Host / prior Feature error state | Host error + retry; do not invent a parallel Diagnostics-only transport error as Analysis | Retry via host |
| No mapped trust signals | Empty signals | Quiet / minimal labeled Diagnostics (REQ-009) | None |
| Partial signal set | Some codes mapped, others unknown | Show known signals with catalog labels; unknown → raw fallback; severity from strongest mapped signal | None |
| Stale Analysis response | Host stale-ignore | Composition follows current Symbol only | None |
| Attempt to add Confidence Assessment peer | Design / review gate | Not allowed in Analysis model or UI | Spec + Reviewer reject |
| Blocking signal present but only in Evidence table | Composition check | Must also elevate in Diagnostics (REQ-006) | Implement elevation |

Validation rules:

- Exactly one Diagnostics composition when Diagnostics body is shown (REQ-001, REQ-012).
- `presentation` is `quiet` iff `severity` is `healthy` (REQ-002).
- `presentation` is `elevated` when `severity` is `qualifying` or `blocking` (REQ-003, REQ-014).
- No Assessment peer id `confidence` / data-quality under Analysis (REQ-005).
- Diagnostics do not own Evidence kind tables or Assessment outcomes (REQ-013).

## Testing Strategy

Aligns with `knowledge/testing-policy.md`. This is a **composition / screen** Feature for Diagnostics: prefer component tests with strong structural and state oracles. Add a thin unit suite for the trust signal mapper when mapping rules live in a dedicated module. Do not add fetch suites unless this Feature changes HTTP modules. No E2E, MSW, coverage %, or new `copy.source.test.ts`.

| Behavior | Layer | Oracle | Location |
|----------|-------|--------|----------|
| Diagnostics composition present on success Reading | Layout / component | Diagnostics Region / composition landmark or catalog-linked label present | `src/features/reading-diagnostics/*.test.tsx` (new) and/or extend Reading shell Diagnostics body tests |
| Quiet when healthy | Component | Healthy fixture → quiet/minimal presentation; Analysis still marked primary / more prominent than Diagnostics | same |
| Elevate when blocking / qualifying | Component | Blocking/qualifying fixture → elevated status chrome (e.g. `Alert` role/name) visible; Analysis still present as interpretive Region | same |
| Blocking not collapsed-only | Component | Blocking fixture shows expanded elevated chrome without requiring a user expand to discover blocking status | same |
| Trust signals mapped | Unit (mapper) and/or component | Fixture with insufficient / partial / stale / equivalent mapped source → corresponding Diagnostics signal label (catalog-linked) | `src/features/reading-diagnostics/*` mapper test and/or composition test |
| No Confidence Assessment dimension | Layout / component | Analysis Assessments peers do not include a Confidence / Data quality Assessment unit | composition + Analysis composition / shell tests |
| Not buried only at page end | Layout / component | Elevated Diagnostics discoverable without Market-Data-only epilogue (elevated chrome present in Reading workspace before requiring scroll past Market Data as sole discovery path — assert elevated node presence with Analysis still primary) | same |
| Not only inside Evidence tables | Layout / component | Blocking fixture shows Diagnostics elevated chrome; Evidence may exist but is not the sole home for the hard trust failure | same |
| Ownership boundaries | Layout / component | Diagnostics body does not render Assessment outcomes / Recommendation stance / Evidence kind tables as owned content | same |
| Brand primitives / no ad-hoc DS | Reviewer + light UI | Imports from `@market-data/brand/ui`; no Tailwind utility `className` for Diagnostics chrome | Reviewer; optional render smoke |
| Copy from catalogs | Component / Reviewer | Status / signal labels resolve via `getMessage` / brand `wording`; no hardcoded designed English in feature sources | assert catalog-linked labels |

### Coverage expectations (AC oracles, not line %)

| Acceptance criterion | Automated oracle? |
|----------------------|-------------------|
| AC-001 Diagnostics present | Yes — composition / shell tests |
| AC-002 quiet when healthy | Yes — healthy fixture presentation + Analysis primacy |
| AC-003 elevate when blocking without replacing Analysis | Yes — elevated chrome + Analysis still present / primary |
| AC-004 no Confidence Assessment | Yes — absence assert under Assessments |
| AC-005 anti-patterns (not only page end / not only Evidence) | Yes — elevated Diagnostics presence + Evidence not sole home |
| AC-006 brand tokens/components | Reviewer (required) + optional render smoke |
| AC-007 catalog copy | Yes — rendered labels from locale/wording keys |

Do **not** add: E2E, MSW, coverage thresholds, per-AC new files, visual regression, or a new `copy.source.test.ts`.

## Copy / Wording

Follow `knowledge/writing/`. Prefer brand `wording` for shared domain labels; Diagnostics chrome that is feature-specific lives in the app locale catalog.

### Design-system keys reused

| Key | Source | Use |
|-----|--------|-----|
| `labels.regime` / `labels.risk` / `labels.economic` / `labels.exposure` / `labels.recommendation` | `@market-data/brand/wording` | Only if a Diagnostics signal references a claim dimension in detail text |
| `common.loading` / `common.error` / `common.retry` | `@market-data/brand/wording` | Only if Diagnostics body surfaces local loading/error chrome |
| `readingLayout.regionDiagnostics` | App locale (existing shell key) | Diagnostics Region label (reuse; do not duplicate) |

### Feature keys to add or change

| Key | English | File | Purpose |
|-----|---------|------|---------|
| `readingDiagnostics.statusHealthy` | Trust status: healthy. | `src/locales/en.json` | Quiet healthy status copy |
| `readingDiagnostics.statusQualifying` | Trust status: qualified. | `src/locales/en.json` | Elevated qualifying status heading |
| `readingDiagnostics.statusBlocking` | Trust status: blocked. | `src/locales/en.json` | Elevated blocking status heading |
| `readingDiagnostics.kindInsufficient` | Insufficient data | `src/locales/en.json` | Insufficient signal kind label |
| `readingDiagnostics.kindPartial` | Partial data | `src/locales/en.json` | Partial signal kind label |
| `readingDiagnostics.kindStale` | Stale data | `src/locales/en.json` | Stale signal kind label |
| `readingDiagnostics.kindEquivalent` | Data-quality constraint | `src/locales/en.json` | Equivalent mapped constraint kind label |
| `readingDiagnostics.signalPlaceholder` | Trust details for this Reading will appear here. | `src/locales/en.json` | Gray-box / empty quiet body when no signals |
| `readingDiagnostics.showDetails` | Show details | `src/locales/en.json` | Expand control for non-blocking / contextual detail |
| `readingDiagnostics.hideDetails` | Hide details | `src/locales/en.json` | Collapse control for non-blocking detail |

Reuse existing humanized reason labels (e.g. `analysisLabels.regimeReason.insufficient_candles`) for signal detail when the mapped source is that code — do not duplicate those English strings under a second key.

Do not use “Asset”. Do not label an Assessment peer “Confidence” or “Data quality”. Do not use “Insights”, “Advice”, or marketing empty-state copy as Diagnostics status. Prefer “Diagnostics” / “Trust status” over inventing synonym Region names.

## Requirement Traceability

| Requirement | Design decision |
|-------------|-----------------|
| REQ-001 | DiagnosticsComposition fills Diagnostics Region body |
| REQ-002 | `severity: healthy` → `presentation: quiet` |
| REQ-003 | `qualifying` / `blocking` → `presentation: elevated`; Analysis remains hero |
| REQ-004 | Trust signal mapper from existing Analysis / Reading VM |
| REQ-005 | Forbidden Confidence Assessment peer |
| REQ-006 | Elevation contract + Evidence not sole home for hard trust failures |
| REQ-007 | Diagnostics qualify only; no Assessment/Recommendation ownership |
| REQ-008 / NFR-002 / NFR-006 | Brand UI primitives table |
| REQ-009 | Quiet labeled Region when signals empty |
| REQ-010 | Cross-cutting prominence; never Extra-large primary |
| REQ-011 / NFR-005 | Feature locale keys + brand wording reuse |
| REQ-012 | Fills Diagnostics Region body only; shell Regions unchanged |
| REQ-013 | Ownership boundary: no Assessment / Evidence / Market Data / Classification ownership |
| REQ-014 | Blocking → expanded elevated chrome |
| REQ-015 | Trust copy in Diagnostics; not primary Analysis body |
| NFR-001 | React 19 + TypeScript + Vite |
| NFR-003 / NFR-004 | Terminology + writing guidelines in Copy / Wording |
| NFR-007 | Gray-box fidelity explicit |
| NFR-008 | Adopted `diagnostics-contract.md` only; PROJECT_ROOT scope |
| NFR-009 | Reuse existing Analysis fetch/mapping; no new API |
