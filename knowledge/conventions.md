# Conventions

## Language

- Code, specs, and harness artifacts: **English**

## UI copy

Spec Writer and Implementer **must** read `knowledge/writing/` before writing specs or implementing user-facing text:

- [`writing/writing-guidelines.md`](./writing/writing-guidelines.md)
- [`writing/terminology.md`](./writing/terminology.md)
- [`writing/ui-copy.md`](./writing/ui-copy.md)

Rules:

- Prefer shared keys from `@market-data/brand/wording` for product identity, shared chrome, and shared domain labels
- Feature-specific strings go in `src/locales/en.json` and are read via `src/i18n/messages.ts`
- Do not hardcode user-facing English in components
- Brand writing guidelines are published with `@market-data/brand`; this repo’s `knowledge/writing/` stays aligned with that package’s guidance
- Include a **Copy / Wording** section in `design.md` when a feature adds or changes UI text

## Brand dependency

- Import tokens, wording, logo, and UI kit from `@market-data/brand`
- Do not fork brand tokens or rewrite shared DS copy locally
- Do not expect brand to know about this app

## UI primitives (mandatory)

When the UI needs a control that exists in `@market-data/brand/ui`, Spec Writer and Implementer **must** use that brand component. Styling a native HTML element with brand tokens is **not** a substitute.

Current brand primitives (extend as the UI kit grows):

| Need | Use from `@market-data/brand/ui` |
|------|----------------------------------|
| Button / actions | `Button` |
| Select / dropdown | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, … |
| Card layout | `Card`, `CardHeader`, `CardTitle`, … |
| Tables | `Table`, `TableHeader`, `TableRow`, `TableCell`, … |
| Badge | `Badge` |
| Loading placeholder | `Skeleton` |
| Inline alert / error chrome | `Alert`, `AlertTitle`, `AlertDescription` |
| App chrome / shell | `AppShell`, `AppHeader`, `AppHeaderBar`, `AppBrand`, `AppNav`, `AppMain` |
| Page structure | `Page`, `PageHeader`, `PageEyebrow`, `PageTitle` |
| Spacing / clusters | `Stack`, `Inline`, `Cluster`, `ClusterItem` |
| Typography helpers | `Text`, `Label`, `SectionHeading` |

Rules:

- Specs (`design.md` / `tasks.md`) must name the brand primitive when one applies (e.g. “use brand `Select` for symbol selection”)
- Implementers must import from `@market-data/brand/ui`, not reimplement or wrap native equivalents for the same role
- Reviewers treat missing brand primitives as a **required** finding when a matching export exists
- If no brand primitive exists yet: either extend `@market-data/brand` (separate Brand Feature) first, or document an explicit exception in `design.md` (why native/custom is allowed)
- Do **not** put Tailwind / utility `className` strings in this app — those utilities are not compiled for consumers
- Feature composition may nest brand primitives; avoid hand-authored CSS for shared chrome, page width, or typography that the kit already covers

## Tests

Follow [`testing-policy.md`](testing-policy.md) (authoritative).

Summary:

- Vitest + Testing Library (jsdom); colocated `*.test.ts(x)` under `src/`
- Strong oracles over file count or line coverage
- Prefer mapper + labels + screen state machine; avoid per-AC scaffolding and weak `copy.source` clones
- “Coverage” in specs means AC oracles, not line %

## Specifications

Follow harness `governance/spec_guidelines.md` (see `HARNESS.md`):

- EARS notation in `requirements.md`
- REQ-NNN identifiers
- Traceability across requirements, design, tasks, code, and tests
- Specs stay inside this PROJECT_ROOT
- Testing Strategy in `design.md` must align with [`testing-policy.md`](testing-policy.md)

## Git

- One feature per harness workflow cycle
- Commits after Implementation stage completes and review approves (project policy)
