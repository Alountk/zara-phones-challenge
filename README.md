# Zara Phones Challenge

A web application for browsing, searching and managing a shopping cart of mobile phones, built as a technical test.

## Tech stack

- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: SASS Modules + CSS custom properties (design tokens extracted from Figma)
- **State management**: React Context API (cart)
- **Testing**: Jest + React Testing Library
- **Linting/formatting**: ESLint + Prettier + Husky + lint-staged
- **Package manager**: pnpm

## Architecture

This project uses a **BFF (Backend For Frontend)** pattern to fulfil the "Backend: Node 18" requirement without exposing the external API's `x-api-key` to the browser. The key insight is that "backend" in Next.js doesn't mean "must be a Route Handler" — it means "code that runs on the server, never shipped to the client bundle". Both Route Handlers and Server Components satisfy that:

```
Server Component (page.tsx, no "use client")
→ getPhonesFromExternalApi(search) [src/services/phones-server.ts, server-only]
→ fetch('https://prueba-tecnica-api-tienda-moviles.onrender.com/products...', { headers: { x-api-key } })
```

Since the listing page's search is driven entirely by URL search params (rather than client-side state), there is no Client Component that ever needs to fetch phone data — the only consumer is `page.tsx`, a Server Component. Calling `getPhonesFromExternalApi` directly avoids Node making a self-referential HTTP call to its own API just to fetch data it could resolve in-process, and it stays exactly as secure as a Route Handler: `phones-server.ts` imports the `server-only` package, so an accidental import from a Client Component fails the build instead of leaking the key into the browser bundle.

This function is also responsible for **data correction** before the response reaches any component — the external API has known inconsistencies (see below), so raw data is cleaned at this boundary rather than trusted downstream:

- **Deduplication** — the external API returns at least one duplicate `id` in `/products`.
- **Price normalization** — `basePrice` can contain decimals (e.g. `553.31`); invalid/non-numeric prices are normalized to `null` rather than a misleading `0`.
- **URL normalization** — images are served over `http://`; normalized to `https://` to avoid mixed-content issues once deployed.

These corrections live in `src/utils/phone-formatters.ts` as pure, unit-tested functions, decoupled from any HTTP concern. Presentation-only formatting (e.g. turning a `number` into `"619 EUR"`) is intentionally **not** done at this layer — it happens in the UI components, so the raw numeric value stays available for business logic (like summing the cart total).

Errors from the external API surface as a typed `ExternalApiError` (`src/services/errors.ts`, carrying the original HTTP status), which the Server Component can let bubble up to Next's nearest `error.tsx` boundary rather than parsing a generic message string.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the actual API key
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (or the next available port).

### Environment variables

| Variable              | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `PHONES_API_BASE_URL` | Base URL of the external phones API                       |
| `PHONES_API_KEY`      | API key required by the external API (`x-api-key` header) |

Both are server-only (no `NEXT_PUBLIC_` prefix) — they are only ever read inside Route Handlers, never in Client Components, so they never reach the browser bundle.

### Scripts

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm start        # run production build
pnpm lint         # run ESLint
pnpm test         # run Jest test suite
pnpm test:watch   # Jest in watch mode
```

## Git workflow

- Initial project bootstrap was committed directly to `main`.
- From that point on, every feature/fix lives on its own branch (`feat/...`, `docs/...`, `chore/...`) and goes through a Pull Request, merged with squash.
- Commit messages follow conventional commits style (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).

## Testing approach

Given the time constraints of this test, testing effort was focused on **pure business logic** (the formatter/dedup helpers in `src/utils/phone-formatters.ts`), built with a strict Red-Green-Refactor TDD cycle where the expected behaviour was known upfront. Network I/O and framework glue code were deprioritized in favor of covering the logic most likely to break silently or regress.
Component-level coverage was later added with React Testing Library for the interactive/client components (search, cart, product hero, navbar, cards, grid), including regression tests for accessibility attributes (labels, `aria-pressed`) and for the `next/image` `sizes`-missing console warning fixed in `CartLine`. Note: Jest cannot test `async` Server Components directly, so `src/app/page.tsx` and `src/app/phone/[id]/page.tsx` remain untested at the unit level.

## Deployment

The app is deployed on [Vercel](https://vercel.com) and available at **[https://zara-phones-challenge-k3rtmvaqy-alountks-projects.vercel.app/]**.

### How it is deployed

- The GitHub repository is connected to a Vercel project (Framework Preset: Next.js, default build settings).
- Every push to `main` triggers a production deployment. Pull requests get their own preview deployment.

### Environment variables

Set these in _Vercel → Project → Settings → Environment Variables_ (they are documented in `.env.example`):

| Variable              | Description                            |
| --------------------- | -------------------------------------- |
| `PHONES_API_BASE_URL` | Base URL of the external phones API    |
| `PHONES_API_KEY`      | API key sent as the `x-api-key` header |

Both variables are read only on the server, inside the Route Handler that acts as a BFF. They deliberately have no `NEXT_PUBLIC_` prefix, so the API key is never exposed to the browser.

### Notes

- Product images are served from the API host over https, which is allowed through `images.remotePatterns` in `next.config.ts`.
- The external API is hosted on Render. If it is on a free tier it may spin down when idle, so the first request after a while can be noticeably slow.

## Progress checklist

### Phone listing view

- [x] Grid displaying phones from the API
- [x] Search filtering by name/brand (via API `?search=`)
- [x] Results count indicator
- [x] Navbar with home link and cart count
- [x] Cart persisted via localStorage
- [x] Click navigates to detail view

### Phone detail view

- [x] Name, brand, description, specs
- [x] Large image, changes with selected color
- [x] Storage/color selectors with live price update
- [x] "Add to cart" enabled only when color + storage selected
- [x] Similar products section

### Cart view

- [x] Items with image, spec, individual price
- [x] Remove individual item
- [x] Total price
- [x] "Continue shopping" button

### Cross-cutting requirements

- [x] Testing (unit tests for pure helpers so far)
- [x] Responsive design
- [x] Accessibility
- [x] Linters and formatters (ESLint + Prettier + Husky)
- [x] Clean browser console
- [x] Detailed README (this one, work in progress)

### Optional

- [x] Deployment
- [x] SSR (Next.js App Router, Server Components by default)
- [x] CSS variables

## Open questions / assumptions

Throughout development, some requirements were ambiguous or not fully covered by the written spec, the API, or the Figma designs. Where no definitive answer was available, a reasonable decision was made and documented here rather than left unresolved.

- **Color filter (mobile design)**: a "FILTRAR" button and a color-swatch panel appear in the mobile Figma design, but this is not part of the written functional requirements (which only mention search by name/brand) nor supported by any parameter on the external API. Left out of scope; see Roadmap.
- **"PAY" button (cart view)**: present in the Figma design next to "Continue shopping", but no checkout/payment flow is specified anywhere in the requirements or the API. Rendered for visual fidelity, without any real checkout logic behind it.
- **Missing/broken product image**: neither the API nor the Figma designs define a fallback state for when `imageUrl` is empty or invalid. A neutral placeholder is rendered instead of passing an invalid `src` to `next/image`, to keep the browser console free of warnings as required.
- **`basePrice` decimals and rounding**: the API can return non-integer prices (e.g. `553.31`), while the Figma design shows rounded whole numbers with an "EUR" suffix (e.g. `"1219 EUR"`) rather than a currency-formatted string. Prices are rounded and suffixed accordingly for display; the underlying numeric value is preserved for calculations (e.g. cart total).
- **`basePrice` is not always the cheapest storage option**: the API can return a `basePrice` higher than its lowest `storageOptions[].price` — e.g. the Galaxy S24 Ultra ships `basePrice: 1329` while its 256 GB option costs `1229`. The spec asks for the _"precio base"_ next to the storage variations, so we render `basePrice` as the initial figure and swap it for the selected option's price as soon as one is picked. We never derive or invent a price the API did not return.
- **Duplicate `id` in the listing endpoint**: the external API returns at least one duplicate entry in `/products`. Deduplication is applied defensively in the Route Handler.
- **First 20 results, no pagination**: both the spec ("primeros 20 teléfonos") and the Figma design (fixed "20 RESULTS" counter, no "load more" or infinite scroll in any breakpoint) point to a fixed cap rather than paginated/infinite loading. Implemented as a fixed limit via the API's `?limit=20`.
- **UI copy language inconsistency**: the Figma designs mix English and Spanish inconsistently (e.g. the search placeholder is in English, while spec labels within the phone detail design are in Spanish, though the spec _values_ themselves come from the API in whatever language it returns). In the absence of an i18n requirement, all UI copy written by us (labels, placeholders, empty states) is in English for consistency; content that comes from the external API is rendered as-is, untranslated.
- **Loading bar duration vs. actual fetch time**: the Figma design shows a single-pass progress bar animation with no defined relationship to real load time. Implemented as a fixed 1s CSS animation for simplicity, matching the design's literal behavior — this means a fetch slower than 1s will show a "complete" bar while still loading. Flagged for discussion with design; a proper indeterminate/looping animation would avoid the misleading state at the cost of diverging from the exact Figma motion.
- **Missing "back" link in tablet design**: the tablet mockup for the phone detail view omits the back navigation link/button present in mobile. Assumed to be an oversight; kept visible across all breakpoints for consistency and usability, pending confirmation from design.
- **Repeated items in the cart**: the Figma cart design shows a single line per product with one "Remove" action and no quantity control, and nothing in the spec defines what should happen when the same variant is added more than once. The same phone + storage + color is merged into a single line with a quantity (shown as `xN` only when greater than 1, which is not part of the design), while different variants remain separate lines. "Remove" removes the whole line regardless of its quantity, and the total accounts for every unit. Flagged for discussion with design: removing one unit at a time, or adding +/- quantity controls to each line, would be the alternatives.

## Roadmap / Future improvements

Given the time constraints of this technical test, the following were consciously left out of scope. They would be natural next steps in a production version of this project:

- **Color filter (mobile)**: implement the filter panel seen in the mobile Figma design, if/when the API supports filtering by color.
- **Checkout flow**: wire the "PAY" button in the cart view to an actual payment flow, once a payment provider/API is defined.
- **Infinite scroll / pagination**: the listing is currently capped at the first 20 results per spec. A production app would likely paginate or infinite-scroll beyond that.
- **E2E tests**: current coverage focuses on unit tests for pure helpers. Adding Playwright/Cypress coverage for the full search → detail → add to cart → remove flow would increase confidence.
