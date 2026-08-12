# Tasks

## Implementation Tasks

- [x] Update `package.json` so the app depends on `@maguer/market-data-brand@^0.2.0` (or newer compatible); install/resolve so dashboard kit exports (`AppHeaderBar` slim density, `ThemeToggle`, `StatusFooter`, `LiveStatus`, tokens/CSS, wording) are importable; migrate prior brand package import paths to this dependency (REQ-001, NFR-002)

- [x] Adapt shared application layout under `src/features/app-layout/` to compose brand `AppShell` / `AppHeader` / `AppHeaderBar` (`density="slim"`) / `AppBrand` / `AppNav` / `AppMain` with brand mark + `product.name` as primary chrome identity; keep chrome structure stable across the Reading outlet (REQ-002, REQ-003, REQ-013, NFR-006)

- [x] Preserve Reading-primary navigation IA: Symbol Reading remains the sole primary Symbol-inspection destination; do not render Market Data / Analysis / Classification as equal peer primary nav destinations or as competing breadcrumb destinations (REQ-004, REQ-006, NFR-003, NFR-007)

- [x] Wire brand `ThemeToggle` into the slim header (no ad-hoc FE theme control); apply theme through brand theme/token mechanisms and persist the user’s preference across reloads in this application (REQ-005, REQ-015, NFR-006)

- [x] Add quiet footer chrome using brand `StatusFooter` and/or `LiveStatus` for date, source, and Live/status; bind app-supplied values without inventing a parallel FE status kit (REQ-007, NFR-006)

- [x] If optional breadcrumb chrome is included, keep it Reading-scoped (or omit it); ensure it does not resurrect legacy peer destinations as equal IA (REQ-006)

- [x] Style chrome with brand tokens/CSS variables and brand UI components only; do not introduce a second FE token set, parallel component library, or Tailwind / utility `className` design system for chrome (REQ-008, NFR-002, NFR-009)

- [x] Ensure the Reading workspace host remains mounted in the outlet so Symbol selection, idle/prompt, loading, and error+retry flows remain usable after chrome changes (REQ-009, REQ-010, REQ-011, REQ-012, NFR-008)

- [x] Add or reuse locale / brand wording keys for chrome labels (prefer brand wording; add `src/locales/en.json` keys only when brand lacks equivalents); resolve all new user-facing chrome strings via wording/`getMessage` — no hardcoded designed English (REQ-014, NFR-003, NFR-004, NFR-005)

- [x] Extend `src/features/app-layout/*.test.tsx` for: slim header with brand mark + product name; Reading-primary nav (peer trio absent); `ThemeToggle` presence + theme application; theme preference persistence; optional breadcrumb non-competing or omitted; `StatusFooter` / `LiveStatus` date/source/Live slots; catalog-linked chrome copy (REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-014, REQ-015)

- [x] Extend or smoke-assert Reading host tests so idle/loading/error+retry (and selection) remain green with the updated chrome mount (REQ-009, REQ-010, REQ-011, REQ-012)

Tasks are ordered to minimize implementation dependencies.
