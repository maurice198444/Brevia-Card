# Development setup

## Prerequisites

- Node.js 18+
- A running Home Assistant instance for testing.

## Install & build

```bash
npm install
npm run build      # type-checks then bundles to dist/brevia-card.js
```

Other scripts:

| Script | Purpose |
|--------|---------|
| `npm run typecheck` | `tsc --noEmit` (strict). |
| `npm run dev` | Vite watch build — rebuilds `dist/` on save. |

The output is a **single self-contained ES module** (`dist/brevia-card.js`, ~70 KB / ~19 KB gzipped). Lit is bundled in; HA does **not** share its copy with custom cards. Dynamic imports (the editor) are inlined so there is exactly one file to deploy.

## Local testing in Home Assistant

1. `npm run dev` (keeps `dist/brevia-card.js` fresh).
2. Copy / symlink `dist/brevia-card.js` into `config/www/`.
3. Add a Lovelace resource pointing at `/local/brevia-card.js` (type: *JavaScript Module*).
4. Add a card with `type: custom:brevia-card`. Hard-refresh the browser after each rebuild (resources are cached aggressively — append `?v=N` while iterating).

## Project layout

```
src/
  brevia-card.ts          # the custom element: config, hass setter, sizing, render
  types.ts                # config + re-exported HA types
  editor/                 # GUI editor (lazily imported)
  domains/                # domain axis — entity → normalised ViewModel
  layouts/                # layout axis — ViewModel → structure
  styles/                 # style axis — tokens + per-style token overrides
  interactions/           # action-handler directive, drag, throttled service calls
  utils/                  # entity + formatting helpers
```

### Key technical decisions

- **TypeScript:** `experimentalDecorators: true`, `useDefineForClassFields: false`. The second is mandatory — without it, class fields shadow Lit's `@state`/`@property` accessors and the card silently never renders.
- **`hass` is a manual setter, not a `@property`.** It filters to the card's own entities and only calls `requestUpdate()` when one of them changes (reference compare — HA swaps the entity object on change).
- **Style switching = attribute flip.** All styles live in one `static styles`; the active one is selected by `ha-card[data-style="…"]`. No `adoptedStyleSheets` (would conflict with Lit's `static styles`).
- **Action handling.** `custom-card-helpers` ships `handleAction`/`hasAction` but **not** an `actionHandler` directive, so the canonical tap/hold/double-tap directive is implemented locally in `interactions/action-handler.ts`.
