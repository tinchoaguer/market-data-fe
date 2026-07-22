# Testing Policy

Project-specific testing rules for `market-data-fe`. Spec Writer, Implementer, and Reviewer must follow this document when producing or evaluating Feature tests.

Authority: project `knowledge/` (below harness governance). Complements `architecture.md` and `conventions.md` (UI copy, brand primitives).

---

## Purpose

Tests exist to **catch real defects** in:

1. **API → view-model contracts** — structural validation, fail-closed mapping, label/humanization boundaries
2. **Screen state machines** — idle, loading, success, error/retry, stale responses
3. **Closed-set copy completeness** — every OpenAPI / design closed-set member has a locale entry; unknown codes fall back safely

Tests do **not** exist to maximize file count, line coverage, or one-to-one AC↔test-file symmetry.

Primary metric: **oracle strength** — would this test fail if the important UI or mapping logic were wrong?

---

## Allowed techniques (priority order)

| Priority | Technique | When to use | Status |
|----------|-----------|-------------|--------|
| 1 | Example-based unit tests (Vitest) | Mappers, fetch helpers, i18n/label resolvers | **Required** |
| 2 | Component tests (Testing Library + user-event, jsdom) | Screen/layout observable behavior | **Required** for UI Features |
| 3 | Closed-set catalog completeness | Locale keys vs OpenAPI / design enums | **Required** when labels/codes change |
| 4 | Shared copy / wording guardrails | No hardcoded user-facing English in feature sources | **Optional as tests**; prefer one shared suite or lint over per-feature clones |
| 5 | E2E (Playwright/Cypress) | Few critical product smokes across layout + one fetch path | **Optional**, product-level — not per Feature |
| 6 | Network mocking libs (e.g. MSW) | When stubbing `fetch` per test becomes unwieldy | **Optional** |
| 7 | Property-based / fuzz / mutation | Rare; mappers with rich JSON shapes | **Optional**, not a Feature gate |
| 8 | Line/branch coverage % | Local/CI report only | **Never** a Feature success criterion |
| 9 | Symbolic execution / visual regression suites | — | **Out of scope** unless product adopts them |

Do not introduce coverage thresholds, mutation gates, fuzz, or E2E mandates in Feature specs unless product expands this policy.

---

## What to test by layer

| Layer | Path | Must test | Must not test (unless fixing a real bug) |
|-------|------|-----------|------------------------------------------|
| Labels / i18n | `src/i18n/*.test.ts` | Resolver happy path + unknown fallback; **completeness** of closed sets vs OpenAPI/design | Re-asserting every label again in every screen test |
| API mapper | `src/api/<area>/map*.test.ts` | Valid payload → VM (humanized where specified); structural fail-closed; unknown code → raw fallback without failing map | Duplicating full screen rendering |
| API fetch | `src/api/<area>/fetch*.test.ts` | Path/encoding; non-ok → request error; bad JSON/shape → mapping error | Large success fixtures already covered by mapper tests |
| Feature screen | `src/features/<feature>/*Screen.test.tsx` | Idle (no fetch); loading; **one** success with key visible content; error + retry; stale ignore when selection races | Exhaustive re-check of every mapped field / every label catalog entry |
| Layout | `src/features/app-layout/*.test.tsx` | Brand chrome; nav destinations; active state; outlet swaps | Remount/chrome asserts on every variant; copy identity checks already elsewhere |
| Copy sourcing | feature or shared | Prefer **one** shared guard (or eslint) that forbids hardcoded designed English | New `copy.source.test.ts` per feature that only lists `toBeTruthy` keys |

Prefer injecting loaders/fakes into screens (`loadMarketAnalysis`, etc.) over mounting the full network stack in component tests.

---

## Oracle rules (anti-bloat)

An automated test is **acceptable** only if at least one oracle is strong:

**Strong oracles (prefer)**

- Exact mapped field / humanized string via `getMessage(...)` or brand `wording` (not a duplicated English literal unbound to the catalog)
- Fail-closed: invalid payload → specific error type
- Unknown closed-set member → raw code fallback; mapping still succeeds
- Catalog completeness: every member of a declared closed set has a non-empty locale entry
- UI: role/name queries; loading/error/retry visible; fetch **not** called until selection; retry re-invokes loader; stale response ignored
- URL path encoding for symbols (`BTC/USDT` → `BTC-USDT`)

**Weak oracles (insufficient alone)**

- `expect(x).toBeTruthy()` on wording/locale keys
- `getMessage(k) === messages...` identity checks without behavioral use
- `expect(element).toBeInTheDocument()` for chrome already asserted in another test in the same file without new behavior
- Source `readFileSync` phrase bans as the **only** evidence for an AC about user-visible copy (pair with rendered catalog asserts, or treat as non-AC guardrail)
- Asserting section headings exist without checking at least one domain value from the fixture

**Anti-patterns**

- Scaffolding all four of `map` + `fetch` + `Screen` + `copy.source` for a Feature that only changes labels → extend `labels.test.ts` (and mapper if mapping changes)
- New test file per AC when an existing module in the same layer can host a case
- Copy-pasting large payload fixtures; share builders under `src/api/` or `src/test/`
- Screen success tests that re-list every mapper field already unit-tested
- Spec “coverage expectations” as a percentage
- Mandating E2E inside a single screen Feature

---

## Spec Writer rules

In `design.md` → **Testing Strategy**:

1. Map each risk to a **layer** and an **oracle type** (not “add component coverage”).
2. Prefer a table: `| Behavior | Layer | Oracle | Location |`.
3. “Coverage expectations” means **which behaviors/ACs have an automated oracle**, not line coverage.
4. Do **not** require a new test module per REQ. Require that each AC has a **verifiable oracle** (parametrized / shared suite OK).
5. Label/catalog Features: require completeness + resolver fallback + mapper humanization; do **not** require a new `copy.source.test.ts` by default.
6. Screen Features: require state machine + one success oracle; put DTO shape detail in mapper tests.
7. Do not mandate E2E, MSW, coverage %, mutation, or fuzz unless this policy’s optional rows apply.

In `tasks.md`:

- Prefer “Extend `labels.test.ts` for …” / “Extend `mapMarketAnalysis.test.ts` …” over “Create tests for REQ-00N”.
- Avoid separate tasks that only add key-identity or `toBeTruthy` copy checks.

Copy / Wording section remains mandatory when UI text changes (`conventions.md`); testing that copy is **catalog-linked**, not string-duplicated.

---

## Implementer rules

1. Follow the Feature Testing Strategy **and** this policy. If they conflict, follow this policy and report BLOCKED for spec fix.
2. Extend existing test modules in the affected layer before adding files.
3. Reuse fixtures; do not duplicate large API payloads across map/fetch/screen files.
4. For closed-set changes: update locale JSON + completeness tests; assert expected humanized output in mapper (and screen only if rendering path is new).
5. For screen changes: keep idle/loading/error/retry/stale; add at most one focused success case for new UI.
6. Do not add per-feature `copy.source.test.ts` unless the Feature introduces a **new** copy-ownership boundary and no shared guard exists yet. Prefer extending a shared guard under `src/test/` or eslint.
7. Do not add coverage config, E2E, MSW, or mutation as part of a Feature unless the Testing Strategy explicitly adopts an optional technique.
8. A Feature may ship with **fewer** tests than ACs if one parametrized test covers multiple ACs with strong oracles.

---

## Reviewer rules

Approve tests only if:

1. Every AC has a **strong oracle** somewhere (labels, mapper, fetch, or screen as appropriate).
2. No new test relies solely on weak oracles listed above.
3. Label/OpenAPI Features have completeness and fallback coverage.
4. Screen Features exercise the state machine; success asserts catalog-linked text where humanization matters.
5. Duplication across mapper and screen is limited to what the design required.

Reject (or mark required fix) when:

- Tests only prove key identity / `toBeTruthy` / “headings exist”
- New per-feature copy.source clone with no new risk
- Spec claimed mapping behavior but only screen smoke exists (or the reverse for structural fail-closed)
- Line coverage or E2E is treated as an AC without policy adoption

Recommendations (non-blocking): consolidate duplicated screen/layout asserts; move phrase-ban guards to a single shared module; suggest MSW only if fetch stubbing is clearly painful.

---

## Decision matrix (Feature design)

| Question | If yes → |
|----------|----------|
| Does it add/change OpenAPI-aligned codes or locale catalogs? | Completeness + resolver fallback (+ mapper humanization if mapping changes) |
| Does it change JSON → view-model rules? | Mapper unit tests (required) |
| Does it change HTTP path, encoding, or error mapping? | Thin fetch tests (required) |
| Does it change idle/loading/error/retry/stale or success chrome? | Screen component tests (required) |
| Does it only change English strings for existing keys? | Locale + any snapshot of `getMessage` / rendered text; **no** new file scaffolding |
| Does it change app nav / layout shell? | Layout component tests |
| Is it a critical cross-feature user journey? | Consider product E2E later — not a default Feature task |
| Is it brand primitive usage only? | Prefer Reviewer check against conventions; UI test only if behavior/contract changes |

---

## Tooling baseline

- Runner: Vitest (`npm test` / `vitest run`)
- Environment: jsdom (`vite.config.ts` → `test.environment`)
- Component: `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- Setup: `src/test/setup.ts`
- Include: `src/**/*.{test,spec}.{ts,tsx}`

Do not expand `devDependencies` for optional techniques unless the Feature Testing Strategy adopts them.

---

## Relationship to existing suites

Historical tests may include weak oracles, per-feature `copy.source.test.ts`, or duplicated success asserts. Do **not** mass-refactor them inside unrelated Features.

When touching a module:

- Prefer strengthening oracles in the tests you edit
- Prefer extending `labels.test.ts` / shared fixtures over new copies
- Leave unrelated weak tests alone unless the Feature’s review requires cleanup

---

## Related documents

- `knowledge/architecture.md` — app layout and writable paths
- `knowledge/conventions.md` — UI copy and brand primitives (defer testing detail here)
- `knowledge/writing/` — wording guidelines for Copy / Wording sections
- `governance/spec_guidelines.md` — Testing Strategy section shape
- Feature `specs/<slug>/design.md` — per-Feature test plan (must align with this policy)
