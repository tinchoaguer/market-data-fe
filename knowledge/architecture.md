# Architecture

## System overview

`market-data-fe` is the product web application for Market Data. It consumes the design system from `@market-data/brand` and calls the backend API.

```
market-data-fe/
├── knowledge/
│   ├── writing/          # mirrored brand writing guidelines
│   └── ux/               # adopted UX contracts
├── src/
│   ├── locales/          # feature / app locale catalogs
│   ├── i18n/             # default-locale message helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── specs/
├── work/
└── package.json
```

## Dependencies

| Package | Role |
|---------|------|
| `@market-data/brand` | Design tokens, shared wording, logo, UI kit |
| Backend API | Market data, analysis, classification (via HTTP) |

**Dependency direction:** this app depends on `@market-data/brand`. Brand must not reference this app.

## UI kit consumption

Product screens compose feature layout and call the API. Shared interactive and chrome primitives come from `@market-data/brand/ui` only.

- Mandatory: use brand exports for Select, Button, Table, Alert, Skeleton, Badge, Card, AppShell/Page/Stack/Text (and related layout helpers), and any future kit primitive that matches the need
- Forbidden: native HTML stand-ins for those roles (e.g. `<select>` instead of brand `Select`) even when styled with brand CSS variables
- Forbidden: Tailwind / utility `className` strings in this app (they are not compiled for consumers)
- Details and exceptions: `knowledge/conventions.md` → **UI primitives (mandatory)**

## UI copy ownership

| Kind | Location | Access |
|------|----------|--------|
| Design-system / shared | `@market-data/brand` (`src/locales/en.json` → `@market-data/brand/wording`) | `import { wording } from '@market-data/brand/wording'` |
| Feature / screen-specific | `src/locales/en.json` in this app | `getMessage(...)` from `src/i18n/messages.ts` |

Writing guidelines (tone, terminology, DS inventory) live under `knowledge/writing/`.

## UX contracts (`knowledge/ux/`)

Adopted UX contracts (`<topic>-contract.md`) that Features may reference. Payload/API field maps belong in that Feature's `specs/<slug>/design.md`, not here.

## Writable paths (Implementer)

- `src/`
- `public/` (if present)
- `package.json` (dependencies, scripts)
- Build / Vite / TypeScript / ESLint config at repo root
- `knowledge/`, `work/`, `specs/` as required by harness stages

## Technology

- React 19 + TypeScript + Vite
- Design system: `@market-data/brand` (file dependency or published)
- Locale catalogs: JSON (`en` default); no i18n library yet
- Tests: Vitest + Testing Library; see [`testing-policy.md`](testing-policy.md) (authoritative for Spec Writer / Implementer / Reviewer)

## Related documents

- [`knowledge/testing-policy.md`](testing-policy.md)
- [`knowledge/conventions.md`](conventions.md)
- [`knowledge/writing/`](writing/)
- [`knowledge/ux/`](ux/) (adopted contracts when present)
