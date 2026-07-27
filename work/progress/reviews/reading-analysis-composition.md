# Review: reading-analysis-composition

```yaml
feature:
  slug: reading-analysis-composition

decision: APPROVED

summary: >-
  Gray-box Assessments composition inside the Analysis Region matches
  requirements, design, analysis-contract hierarchy, and testing-policy
  oracles. Approve for Completed.

requirements:
  - id: REQ-001
    status: pass
    notes: >-
      Single AssessmentsWorkspace section (data-unit-id=assessments,
      data-testid=assessments-workspace) mounted as Analysis Region body.
  - id: REQ-002
    status: pass
    notes: >-
      Four peer units with data-unit-role=assessment-peer and stable ids
      regime|risk|economic|exposure; none owns another.
  - id: REQ-003
    status: pass
    notes: >-
      Peers always render independently with per-unit outcomes; no rollup
      node or conflict-hiding ownership.
  - id: REQ-004
    status: pass
    notes: >-
      RecommendationUnit rendered inside AssessmentsWorkspace after peer
      Cluster; role=recommendation (not assessment-peer, not Reading Region).
  - id: REQ-005
    status: pass
    notes: >-
      Stance/unit present in Analysis composition after peers per approved
      Testing Strategy document-order oracle (jsdom); shell mounts composition
      in Analysis body.
  - id: REQ-006
    status: pass
    notes: >-
      Document order asserted: regime → risk → economic → exposure →
      recommendation.
  - id: REQ-007
    status: pass
    notes: >-
      ClaimNarrative / recommendation narrative use data-claim-narrative +
      data-bound-to; no data-unit-id=narrative and no Narrative Region label.
  - id: REQ-008
    status: pass
    notes: >-
      No overall/synthesis unit ids or Overall Assessment / Overall Score /
      Synthesis labels in composition.
  - id: REQ-009
    status: pass
    notes: >-
      Peers then Recommendation inside Analysis; Reading shell keeps Evidence
      after Analysis in document order; Evidence not owned under Assessments.
  - id: REQ-010
    status: pass
    notes: >-
      Assessments tree has no classification/evidence/market-data/diagnostics
      region children; shell test confirms Classification/Evidence outside.
  - id: REQ-011
    status: pass
    notes: >-
      Imports Stack, Cluster, ClusterItem, SectionHeading, Card*, Badge,
      Label, Text, Inline from @market-data/brand/ui; no Tailwind className;
      section landmarks per design exception.
  - id: REQ-012
    status: pass
    notes: >-
      Missing peer outcomes render labeled unit + readingAnalysis.unitPlaceholder.
  - id: REQ-013
    status: pass
    notes: >-
      Mapped recommendation.name (Badge stance) + rationale when present;
      labeled placeholder when null.
  - id: REQ-014
    status: pass
    notes: >-
      Mapped Assessment level/summary and Exposure summary/factors when
      present; gray-box peers otherwise.
  - id: REQ-015
    status: pass
    notes: >-
      Dimension/Recommendation labels from brand wording; Assessments chrome /
      placeholders via getMessage readingAnalysis.*; no hardcoded designed
      English in feature components.
  - id: REQ-016
    status: pass
    notes: >-
      Four peers always in collection; Recommendation uses data-compact=true
      and Label/Inline (no Card) vs peer Cards.
  - id: REQ-017
    status: pass
    notes: >-
      ReadingScreen regionBodies.analysis mounts AssessmentsWorkspace only;
      READING_REGIONS map unchanged.
  - id: NFR-001
    status: pass
    notes: React/TS feature modules under src/features consistent with architecture.
  - id: NFR-002
    status: pass
    notes: Brand ui + wording consumed; no forked tokens.
  - id: NFR-003
    status: pass
    notes: Canonical labels; forbidden Overall/Synthesis Region labels absent.
  - id: NFR-004
    status: pass
    notes: Locale English matches design Copy/Wording (sentence case, calm).
  - id: NFR-005
    status: pass
    notes: readingAnalysis keys in src/locales/en.json; domain labels from brand wording.
  - id: NFR-006
    status: pass
    notes: Matching brand primitives used for chrome roles (no native stand-ins).
  - id: NFR-007
    status: pass
    notes: Gray-box structural fidelity; hi-fi polish not required.
  - id: NFR-008
    status: pass
    notes: Scoped to market-data-fe; uses adopted analysis-contract.md.
  - id: NFR-009
    status: pass
    notes: Reuses MarketAnalysisViewModel fields; no new API/OpenAPI.

acceptance_criteria:
  - criterion: >-
      AC-001: The Analysis Region contains one Assessments workspace with peer
      units for Regime, Risk, Economic, and Exposure (gray-box structure acceptable).
    status: pass
    notes: Composition + ReadingScreen tests assert one workspace and four peer labels/roles under Analysis.
  - criterion: >-
      AC-002: Recommendation is composed with Assessments (not a standalone
      primary Region) and is visible in the initial Analysis viewport without
      scrolling for the stance.
    status: pass
    notes: Recommendation inside Assessments after peers; stance Badge when mapped; document-order oracle.
  - criterion: >-
      AC-003: Narrative appears bound to Assessment/Recommendation claims —
      not as a detached essay Region.
    status: pass
    notes: Bound narrative nodes + absence of Narrative Region/unit.
  - criterion: >-
      AC-004: No Overall Assessment / Overall Score / Synthesis Region or
      rollup that replaces the four Assessment dimensions.
    status: pass
    notes: Absence asserts on unit ids and labels; four peers remain the interpretation.
  - criterion: >-
      AC-005: Composition follows knowledge/ux/analysis-contract.md hierarchy
      and anti-patterns (interpretation before Evidence; Classification not
      nested as an Analysis-owned Region).
    status: pass
    notes: Order peers→Recommendation; shell Analysis before Evidence; no nested Classification/Evidence under Assessments.
  - criterion: >-
      AC-006: Assessment/Recommendation chrome uses brand tokens/components
      already available to the FE.
    status: pass
    notes: Reviewer-verified brand/ui imports and structure; no ad-hoc DS / Tailwind.
  - criterion: >-
      AC-007: User-facing strings come from locale catalogs / brand wording,
      not hardcoded English in components.
    status: pass
    notes: Rendered getMessage/wording labels and placeholders; locale keys present in en.json.

findings:
  - severity: recommendation
    location: src/features/reading-analysis-composition/RecommendationUnit.tsx
    description: >-
      Mapped hardGateReason is not surfaced when non-null. Spec stance binding is
      satisfied via name/rationale; consider showing hard-gate when present for
      parity with existing Analysis mapping.
    related_req: REQ-013
  - severity: recommendation
    location: src/features/reading-analysis-composition/AssessmentsWorkspace.test.tsx
    description: >-
      Some cases include tautological/identity checks. Strong structural/catalog-linked
      oracles already cover ACs elsewhere; consolidate weak identity asserts if
      touching this file again.
    related_req: REQ-015

tasks_verified:
  - task: Add feature locale keys readingAnalysis.* to src/locales/en.json
    status: done
  - task: Create Assessments composition module with four peers + compact Recommendation using brand primitives
    status: done
  - task: Implement attention order and anti-patterns (Narrative bound; no Overall/Synthesis; no nested Reading Regions)
    status: done
  - task: Recommendation stance/placeholder present without Analysis-only scroll-only discovery; keep Recommendation compact
    status: done
  - task: Wire mapped outcomes/stance or gray-box placeholders; optional claim-bound Narrative
    status: done
  - task: Mount composition as Analysis Region body without redefining Reading Regions
    status: done
  - task: User-facing strings from brand wording / feature locale keys
    status: done
  - task: Composition/component tests for workspace, peers, Recommendation order, absences, catalog-linked labels
    status: done
  - task: Extend Reading shell / Analysis host tests for mount + Evidence outside ownership/order
    status: done
```
