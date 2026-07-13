# Review: app-layout

```yaml
feature:
  slug: app-layout

decision: APPROVED

summary: >
  Implementation satisfies specs/app-layout. Shared AppLayout with brand chrome,
  three-destination nav, stubs, locale copy, and tests. No required findings.

requirements:
  - id: REQ-001
    status: pass
  - id: REQ-002
    status: pass
  - id: REQ-003
    status: pass
  - id: REQ-004
    status: pass
  - id: REQ-005
    status: pass
  - id: REQ-006
    status: pass
  - id: REQ-007
    status: pass
  - id: REQ-008
    status: pass

acceptance_criteria:
  - criterion: All product views render inside a shared application layout.
    status: pass
  - criterion: The layout shows the Market Data product brand as a primary chrome signal.
    status: pass
  - criterion: The user can navigate between Market Data, Analysis, and Classification views from the layout.
    status: pass
  - criterion: The active view is visually indicated in the navigation.
    status: pass
  - criterion: Layout chrome remains consistent across views.
    status: pass

findings:
  - severity: recommendation
    location: src/App.tsx / tests
    description: No dedicated App.test for entry integration; covered via AppLayout tests + App.tsx wiring.
  - severity: recommendation
    location: src/features/app-layout/AppLayout.test.tsx
    description: Active-state tests assert aria-current; primary vs ghost not asserted.
  - severity: recommendation
    location: src/api/marketData/fetchMarketData.test.ts
    description: Out of scope — fails when VITE_API_BASE_URL is set.

tasks_verified:
  - task: All app-layout tasks.md items
    status: done
```
