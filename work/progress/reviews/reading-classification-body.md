# Review: reading-classification-body

```yaml
feature:
  slug: reading-classification-body

decision: APPROVED

summary: >
  Classification Region body composition meets REQ-001–REQ-015 and AC-001–AC-008
  at gray-box fidelity. Four dimension groups always exposed (empty allowed);
  displayed signals show source, score, and Content-resolved reason; count-only
  packaging and Overall/Primary/Secondary taxonomy absent; Classification remains
  a Reading sibling of Analysis via shell host; brand UI + catalog copy used.
  Strong oracles present for composition ACs; brand chrome verified by Reviewer.
  No required fixes.

requirements:
  - id: REQ-001
    status: pass
    notes: >
      ClassificationBody + mapClassificationBody expose four dimension groups
      (regime/risk/economic/exposure) from MarketClassificationViewModel.
  - id: REQ-002
    status: pass
    notes: >
      All four groups always rendered with stable unit ids
      (classification-regime|risk|economic|exposure), including empty arrays.
  - id: REQ-003
    status: pass
    notes: >
      Each signal row TableCell shows signal.source, signal.score, signal.reason.
  - id: REQ-004
    status: pass
    notes: >
      Reason bound from VM string; success fixture uses Content-resolved
      narrative (resolveUiMessages); no count-only substitute.
  - id: REQ-005
    status: pass
    notes: >
      Body data-compact=true, data-prominence=associated; Region associated;
      shell keeps Classification content-sized aside adjacent to primary Analysis.
  - id: REQ-006
    status: pass
    notes: >
      Mounted only as regionBodies.classification; AssessmentsWorkspace has no
      Classification child Region (composition + ReadingScreen nesting asserts).
  - id: REQ-007
    status: pass
    notes: >
      No overall-classification / primary-classification / secondary-classification
      units or Overall Score packaging.
  - id: REQ-008
    status: pass
    notes: >
      Stack, SectionHeading, Text, Card, Table parts from @market-data/brand/ui;
      no Tailwind className; section landmarks per design exception.
  - id: REQ-009
    status: pass
    notes: >
      Dimension labels via wording.labels.*; columns via
      viewMarketClassification.source|score|reason; chrome via
      readingClassification.*; reason from VM only.
  - id: REQ-010
    status: pass
    notes: >
      ClassificationBody hosted inside existing Classification Region; REGION_IDS
      unchanged.
  - id: REQ-011
    status: pass
    notes: >
      Body owns only dimension signal packaging; no Analysis/Evidence/Market Data/
      Diagnostics content owned here.
  - id: REQ-012
    status: pass
    notes: >
      Body mounts only on Reading success when classification VM present; idle/
      loading/error remain host-owned; null classification leaves Region placeholder.
  - id: REQ-013
    status: pass
    notes: >
      Empty groups still labeled with readingClassification.emptyGroup; not treated
      as fetch failure.
  - id: REQ-014
    status: pass
    notes: >
      Reuses fetchMarketClassification + MarketClassificationViewModel; no new API/
      DTO/OpenAPI.
  - id: REQ-015
    status: pass
    notes: >
      Per-signal packaging when signals exist; tests assert absence of count-only
      sole body content.
  - id: NFR-001
    status: pass
    notes: React/TS module under src/features; consistent with architecture.
  - id: NFR-002
    status: pass
    notes: Brand UI + wording consumed; no local token fork.
  - id: NFR-003
    status: pass
    notes: Canonical Classification / Regime / Risk / Economic / Exposure terminology.
  - id: NFR-004
    status: pass
    notes: Locale strings sentence-case, calm, data-first.
  - id: NFR-005
    status: pass
    notes: >
      readingClassification.* in src/locales/en.json; shared labels from brand wording.
  - id: NFR-006
    status: pass
    notes: Matching brand primitives used for structure/table/card roles.
  - id: NFR-007
    status: pass
    notes: Gray-box structural packaging; hi-fi not gated.
  - id: NFR-008
    status: pass
    notes: Scoped to market-data-fe; reading-contract placement preserved.
  - id: NFR-009
    status: pass
    notes: No backend changes; reuses prior Classification mapping + Content reasons.

acceptance_criteria:
  - criterion: >
      AC-001 Classification Region shows regime, risk, economic, and exposure
      signal groups (empty groups allowed).
    status: pass
    notes: >
      ClassificationBody.test empty + success fixtures; mapClassificationBody
      group order; ReadingScreen host success assert.
  - criterion: >
      AC-002 Each displayed signal shows source, score, and reason (reason as
      human-readable narrative when available).
    status: pass
    notes: >
      Success fixture asserts catalog column labels + fixture source/score +
      Content-resolved reason text.
  - criterion: >
      AC-003 Classification remains compact and visually subordinate / adjacent
      to Analysis — not equal prominence.
    status: pass
    notes: >
      data-compact / associated prominence; shell adjacency row; Analysis sole primary.
  - criterion: >
      AC-004 Classification is not nested as an Analysis-owned Region inside
      Assessments.
    status: pass
    notes: >
      AssessmentsWorkspace.test ownership boundary; ReadingScreen nest query under
      analysis region.
  - criterion: >
      AC-005 Region body uses brand tokens/components already available to the FE.
    status: pass
    notes: Reviewer inspection of ClassificationBody imports; no ad-hoc DS.
  - criterion: >
      AC-006 User-facing labels and reasons come from locale / Content-resolved
      copy — no hardcoded designed English in components.
    status: pass
    notes: >
      getMessage / wording in ClassificationBody; reason from VM; no hardcoded
      English in feature sources.
  - criterion: >
      AC-007 Classification body is not a count-only summary; per-signal source /
      score / reason packaging is present when signals exist.
    status: pass
    notes: Success packaging fields present; count-only strings absent.
  - criterion: >
      AC-008 Composition follows reading-contract anti-patterns (no Primary/
      Secondary Classification taxonomy; no Overall Classification rollup;
      Classification sibling of Analysis).
    status: pass
    notes: >
      Anti-unit asserts in body + shell + Assessments tests; sibling placement in
      ReadingWorkspace.

findings:
  - severity: recommendation
    location: src/features/reading-classification-body/ClassificationBody.test.tsx
    description: >
      The standalone locale key-identity case
      (“resolves Classification body chrome from feature locale keys”) is a weak
      oracle; AC-006 is already covered by catalog-linked render asserts. Prefer
      dropping or folding into the packaging success case later.
    related_req: REQ-009
  - severity: recommendation
    location: src/features/reading-classification-body/ClassificationBody.tsx
    description: >
      Four Card-wrapped dimension groups are allowed by design for gray-box
      scanning; if Classification ever reads heavy next to Analysis Assessments,
      consider denser non-Card list packaging while keeping Table rows.
    related_req: REQ-005

tasks_verified:
  - task: >
      Reuse/add Classification body locale keys in en.json via messages helpers
    status: done
  - task: >
      Create reading-classification-body composition with four groups and
      source/score/reason packaging using brand primitives
    status: done
  - task: >
      Wire to existing Classification VM without new HTTP/OpenAPI; empty groups
      visible
    status: done
  - task: >
      Mount as Classification Region body in ReadingScreen; keep compact adjacent
      subordinate
    status: done
  - task: >
      Enforce ownership / anti-patterns (no nest under Assessments; no Overall/
      Primary/Secondary; no count-only; no foreign Region ownership)
    status: done
  - task: >
      Resolve user-facing strings from locale / brand wording / VM reason only
    status: done
  - task: >
      Add composition tests for four groups, packaging, not-count-only, catalog copy
    status: done
  - task: >
      Extend shell / Analysis tests for sibling placement, non-primary, anti-taxonomy
    status: done
```
