# market-data-fe

Frontend for the market-data project. Consumes `@market-data/brand` for tokens, shared wording, logo, and UI kit.

## UI copy

- Shared / design-system: `import { wording } from '@market-data/brand/wording'`
- Feature / app: `src/locales/en.json` via `src/i18n/messages.ts`
- Agent guidelines: `knowledge/writing/` (aligned with `@market-data/brand` writing docs)

See `knowledge/conventions.md` and `HARNESS.md`.

## Brand package

Install `@market-data/brand` as a normal package dependency (see `package.json`). Import logo, tokens, wording, and UI kit from that package — do not fork brand assets in this app.
