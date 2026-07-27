# Review Report — reading-evidence-composition

```yaml
feature:
  slug: reading-evidence-composition

decision: APPROVED

summary: >
  Implementation satisfies REQ-001–REQ-015, NFR-001–NFR-009, and AC-001–AC-007.
  EvidenceComposition mounts in the Reading shell Evidence Region with claim
  attachments, Drivers visible and Features/Contributions on demand, Assessment
  peer cleanup, brand UI kit chrome, and catalog-linked labels. Automated tests
  provide strong structural oracles for composition, peer ownership, interpretation
  before Evidence, and anti-patterns. Minor recommendations only (not blocking).

requirements:
  - id: REQ-001
    status: pass
    notes: >
      EvidenceComposition + ClaimAttachmentBlock render Drivers, Features, and
      Contributions under Evidence (gray-box lists). Covered by EvidenceComposition.test
      and ReadingScreen.test.

  - id: REQ-002
    status: pass
    notes: >
      ClaimAttachmentBlock titles use readingEvidence.claimAttachment with brand
      claim labels; rows bind under risk/economic/exposure claims. Empty path keeps
      claim-structured depth via mapEvidenceFromAnalysis emptyAttachment.

  - id: REQ-003
    status: pass
    notes: >
      DriversKind always visible (prominence primary). Features/Contributions use
      DisclosableKind with collapsed default and brand Button disclosure controls.

  - id: REQ-004
    status: pass
    notes: >
      mapEvidenceFromAnalysis maps assessment.components and exposure.factors into
      Drivers/Contributions. AssessmentPeerUnit outcomes only (+ Evidence reference);
      no component/factor tables in peer body.

  - id: REQ-005
    status: pass
    notes: >
      Analysis Region still shows levels/stance without opening Features/Contributions.
      ReadingScreen.test asserts outcomes visible while features disclosure=collapsed;
      document order keeps analysis before evidence.

  - id: REQ-006
    status: pass
    notes: >
      Evidence kinds are only drivers|features|contributions. Test asserts absence of
      Metrics/Observations text and data-evidence-kind values.

  - id: REQ-007
    status: pass
    notes: >
      Market Data remains reading-region-market-data; Evidence body does not adopt
      market-data region id or label. ReadingScreen.test asserts Region separation.

  - id: REQ-008
    status: pass
    notes: >
      Full Evidence depth lives in EvidenceComposition. AssessmentPeerUnit exposes
      EvidenceReference scroll-to #reading-region-evidence-anchor only.

  - id: REQ-009
    status: pass
    notes: >
      Chrome uses @market-data/brand/ui (Stack, Text, Label, Button, Card*, Badge,
      Inline). No Tailwind/utility className in the feature module.

  - id: REQ-010
    status: pass
    notes: >
      KindBody and EmptyKindStructure use readingEvidence.kindPlaceholder when rows
      are missing; kind labels remain present.

  - id: REQ-011
    status: pass
    notes: >
      Composition marks data-supporting=true; shell keeps Evidence band/prominence
      supporting (regions.ts / ReadingWorkspace). Not primary interpretive workspace.

  - id: REQ-012
    status: pass
    notes: >
      User-facing Evidence strings via getMessage('readingEvidence.*'); claim labels
      from @market-data/brand/wording. No hardcoded designed English in feature sources.

  - id: REQ-013
    status: pass
    notes: >
      ReadingScreen EvidenceRegionBody mounts EvidenceComposition into
      regionBodies.evidence only; REGION_IDS / ReadingWorkspace map unchanged.

  - id: REQ-014
    status: pass
    notes: >
      Evidence owns Drivers/Features/Contributions only. Assessment outcomes,
      Recommendation stance, Narrative, Classification, Market Data, Diagnostics
      remain outside Evidence composition.

  - id: REQ-015
    status: pass
    notes: >
      With empty components/factors, mapEvidenceFromAnalysis still emits a claim
      attachment with emptyForClaim + kind structure (not a free-floating metrics wall).

  - id: NFR-001
    status: pass
    notes: React 19 + TypeScript + Vite feature module under src/features/.

  - id: NFR-002
    status: pass
    notes: Consumes brand/ui and brand/wording; no forked tokens.

  - id: NFR-003
    status: pass
    notes: Uses Symbol/Analysis/Evidence/Drivers/Features/Contributions; no Metrics/Observations kinds.

  - id: NFR-004
    status: pass
    notes: Locale copy matches design Copy/Wording (sentence-case, calm, formal).

  - id: NFR-005
    status: pass
    notes: Feature keys in src/locales/en.json; claim labels prefer brand wording.

  - id: NFR-006
    status: pass
    notes: Matching brand primitives used for chrome roles (no native Button/select stand-ins).

  - id: NFR-007
    status: pass
    notes: Gray-box/structural fidelity; no hi-fi polish gate.

  - id: NFR-008
    status: pass
    notes: Scoped to market-data-fe; follows knowledge/ux/evidence-contract.md only.

  - id: NFR-009
    status: pass
    notes: Reuses existing Analysis VM components/factors; no new API/OpenAPI.

acceptance_criteria:
  - criterion: >
      AC-001: Evidence Region presents claim-attached explainability using
      Drivers → Features → Contributions (gray-box structure acceptable).
    status: pass
    notes: Composition + shell mount tests; claim attachments and three kinds present.

  - criterion: >
      AC-002: Assessment components / exposure factors are not the primary body
      owned inside Assessment peers; explainability lives in Evidence.
    status: pass
    notes: >
      AssessmentsWorkspace.test and ReadingScreen.test assert rows under Evidence
      and absent from Assessment peer primary body.

  - criterion: >
      AC-003: Users can understand Analysis outcomes without opening Evidence depth
      (interpretation before Evidence).
    status: pass
    notes: Outcomes/Recommendation visible; Features collapsed; Analysis before Evidence in order.

  - criterion: >
      AC-004: Evidence is never a free-floating metrics dashboard unrelated to a claim.
    status: pass
    notes: Claim attachment headings/context; empty path remains claim-structured.

  - criterion: >
      AC-005: Composition follows evidence-contract anti-patterns (no Metrics/Observations;
      Market Data not labeled as Evidence until cited).
    status: pass
    notes: Absence asserts + Market Data Region distinct from Evidence body.

  - criterion: >
      AC-006: Evidence chrome uses brand tokens/components already available to the FE.
    status: pass
    notes: Reviewer inspection of brand/ui imports; no ad-hoc className DS.

  - criterion: >
      AC-007: User-facing strings come from locale catalogs / brand wording,
      not hardcoded English in components.
    status: pass
    notes: >
      Rendered labels assert getMessage / wording; locale keys present in en.json.
      Supplementary messages object equality test is weak alone but not sole oracle.

findings:
  - severity: recommendation
    location: src/features/reading-evidence-composition/EvidenceComposition.test.tsx
    description: >
      The catalog-shape equality test alone is a weak oracle per testing-policy.md;
      keep relying on rendered getMessage asserts (already present) and consider
      dropping or strengthening the identity-only case later.
    related_req: REQ-012

  - severity: recommendation
    location: src/features/reading-evidence-composition/mapEvidenceFromAnalysis.ts
    description: >
      Assessment components / exposure factors are mirrored into both Drivers and
      Contributions. Acceptable gray-box per “Drivers and/or Contributions”; a later
      pass could differentiate contribution weights vs driver names if payload allows.
    related_req: REQ-004

  - severity: recommendation
    location: src/features/view-market-analysis/
    description: >
      Legacy view-market-analysis still renders factors lists. Out of scope for Reading
      Assessment peers / this Feature; only relevant if product retires that surface.
    related_req: REQ-004

tasks_verified:
  - task: Add readingEvidence.* locale keys to en.json (readable via messages.ts)
    status: done
  - task: Create reading-evidence-composition module with claim-attached Drivers → Features → Contributions and brand primitives
    status: done
  - task: Progressive disclosure + anti-patterns (no Metrics/Observations; supporting Evidence)
    status: done
  - task: Bind components/factors into Evidence; gray-box/empty claim structure
    status: done
  - task: Update Assessment peers — outcome + Narrative + Evidence reference only
    status: done
  - task: Mount Evidence composition as Evidence Region body in Reading shell
    status: done
  - task: Analysis understandable without Features/Contributions open
    status: done
  - task: Catalog / brand wording for user-facing strings
    status: done
  - task: Composition tests for structure, claim attachment, disclosure, anti-patterns, catalog labels
    status: done
  - task: Extend shell / Analysis tests for ownership, document order, Market Data separation
    status: done
```
