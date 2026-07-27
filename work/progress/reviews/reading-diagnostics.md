---
feature:
  slug: reading-diagnostics

decision: APPROVED

summary: >
  Implementation satisfies the approved reading-diagnostics specification.
  DiagnosticsComposition is mounted in the shell Diagnostics Region; quiet
  Card chrome when healthy; elevated Alert when qualifying/blocking; trust
  signals mapped from Analysis VM; no Confidence Assessment peer; brand UI
  and locale catalogs used. Strong oracles for AC-001–AC-007. No required fixes.

requirements:
  - id: REQ-001
    status: pass
    notes: DiagnosticsComposition fills Diagnostics Region; quiet gray-box when healthy.
  - id: REQ-002
    status: pass
    notes: Healthy → quiet Card; Analysis remains primary.
  - id: REQ-003
    status: pass
    notes: Qualifying/blocking → elevated Alert; Analysis stays hero.
  - id: REQ-004
    status: pass
    notes: Maps insufficient / partial / stale / equivalent from Analysis VM.
  - id: REQ-005
    status: pass
    notes: No Confidence Assessment peer.
  - id: REQ-006
    status: pass
    notes: Blocking trust elevated in Diagnostics Region, not Evidence-only.
  - id: REQ-007
    status: pass
    notes: Diagnostics owns trust chrome only.
  - id: REQ-008
    status: pass
    notes: Brand UI primitives used.
  - id: REQ-009
    status: pass
    notes: Empty signals → quiet labeled gray-box.
  - id: REQ-010
    status: pass
    notes: data-prominence cross-cutting.
  - id: REQ-011
    status: pass
    notes: Strings via getMessage readingDiagnostics.*.
  - id: REQ-012
    status: pass
    notes: Mounted as regionBodies.diagnostics only.
  - id: REQ-013
    status: pass
    notes: Ownership boundary asserts pass.
  - id: REQ-014
    status: pass
    notes: Blocking expands without Show details gate.
  - id: REQ-015
    status: pass
    notes: Trust copy in Diagnostics; Analysis keeps Assessments body.

acceptance_criteria:
  - criterion: AC-001 Diagnostics Region distinct and present
    status: pass
  - criterion: AC-002 Healthy Diagnostics quiet / minimal
    status: pass
  - criterion: AC-003 Blocking/qualifying elevate without replacing Analysis hero
    status: pass
  - criterion: AC-004 No Confidence Assessment dimension
    status: pass
  - criterion: AC-005 Anti-patterns avoided
    status: pass
  - criterion: AC-006 Brand chrome
    status: pass
  - criterion: AC-007 Locale catalog strings
    status: pass

findings:
  - severity: recommendation
    location: src/features/reading-diagnostics/DiagnosticsComposition.test.tsx
    description: Weak identity oracle for locale keys; AC-007 covered elsewhere.
    related_req: REQ-011
  - severity: recommendation
    location: src/features/reading-diagnostics/mapDiagnosticsFromAnalysis.ts
    description: isStale always false until VM exposes freshness; NFR-009 compliant.
    related_req: REQ-004
  - severity: recommendation
    location: src/features/reading-layout-shell/ReadingWorkspace.tsx
    description: Elevated Diagnostics after Market Data in document order is shell-owned; acceptable under REQ-012.
    related_req: REQ-006

tasks_verified:
  - task: Locale keys
    status: done
  - task: Diagnostics composition module
    status: done
  - task: Trust signal mapper
    status: done
  - task: Quiet/elevate/expand rules
    status: done
  - task: Ownership and anti-patterns
    status: done
  - task: No Confidence Assessment peer
    status: done
  - task: Mount in Diagnostics Region
    status: done
  - task: Catalog-linked strings
    status: done
  - task: Mapper + composition tests
    status: done
  - task: Extend shell / Analysis tests
    status: done
---

# Code Review: reading-diagnostics

**Decision:** APPROVED

**Date:** 2026-07-27

No required fixes. Three non-blocking recommendations recorded above.
