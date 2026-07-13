# market-data-fe

Frontend for the market-data project. Consumes `@market-data/brand` for tokens, shared wording, logo, and UI kit.

## UI copy

- Shared / design-system: `import { wording } from '@market-data/brand/wording'`
- Feature / app: `src/locales/en.json` via `src/i18n/messages.ts`
- Agent guidelines (mirrored from brand): `knowledge/writing/`

See `knowledge/conventions.md` and `HARNESS.md`.

## Logo / favicon

Logo design lives in the separate [`market-data-brand`](../market-data-brand) repository.

After exporting there (`npm run logo:export`), copy `market-data-brand/public/favicon.svg` to `public/favicon.svg` in this repo.
