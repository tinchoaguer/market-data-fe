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
- Brand is the source of truth for writing guidelines; this repo’s `knowledge/writing/` is a **mirror** — update it when brand guidelines change
- Include a **Copy / Wording** section in `design.md` when a feature adds or changes UI text

## Brand dependency

- Import tokens, wording, logo, and UI kit from `@market-data/brand`
- Do not fork brand tokens or rewrite shared DS copy locally
- Do not expect brand to know about this app

## Specifications

Follow `../harness/governance/spec_guidelines.md`:

- EARS notation in `requirements.md`
- REQ-NNN identifiers
- Traceability across requirements, design, tasks, code, and tests

## Git

- One feature per harness workflow cycle
- Commits after Implementation stage completes and review approves (project policy)
