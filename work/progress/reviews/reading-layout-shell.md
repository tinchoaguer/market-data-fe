---
feature:
  slug: reading-layout-shell

decision: APPROVED

summary: >
  Implementation matches requirements, design, and tasks. Six-Region Reading
  workspace with structural hierarchy, brand UI chrome, locale keys, and
  host screen state machine are present and covered by strong layout/screen
  oracles. Scoped Vitest run: reading-layout-shell + AppLayout — 23 passed.
---

# Code Review: reading-layout-shell

**Decision:** APPROVED

## Requirements

| id | status | notes |
|----|--------|-------|
| REQ-001 | pass | Six regions from READING_REGIONS |
| REQ-002 | pass | Exactly one Context and one Analysis |
| REQ-003 | pass | Context + Analysis primary band, document order |
| REQ-004 | pass | Analysis sole primary prominence |
| REQ-005 | pass | Classification associated/compact |
| REQ-006 | pass | Evidence and Market Data supporting |
| REQ-007 | pass | Diagnostics cross-cutting |
| REQ-008 | pass | Canonical Region document order |
| REQ-009 | pass | Brand UI chrome; no Tailwind className |
| REQ-010 | pass | Gray-box placeholders when body omitted |
| REQ-011 | pass | Symbol selection on Reading surface |
| REQ-012 | pass | Loading state |
| REQ-013 | pass | Error + retry |
| REQ-014 | pass | Idle prompt before success |
| REQ-015 | pass | Locale / brand wording |
| REQ-016 | pass | Anti equal-weight / Market-Data-first |
| REQ-017 | pass | No Narrative/Overall Score regions |
| NFR-001–008 | pass | Architecture, brand, terminology, locales, gray-box scope |

## Acceptance criteria

All AC-001–AC-007: pass.

## Findings

- **recommendation** — `ReadingScreen.test.tsx`: add stale-response race oracle (REQ-012).
- **recommendation** — Classification/Market Data bodies remain gray-box placeholders (acceptable per REQ-010).

## Tasks verified

All tasks in `specs/reading-layout-shell/tasks.md`: done.
