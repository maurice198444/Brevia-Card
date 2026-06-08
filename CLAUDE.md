# Projekt: Brevia Card

Custom Home Assistant Lovelace Card (Lit 3 + TypeScript + Vite, Library-Mode → ein ES-Modul `dist/brevia-card.js`). Premium-Cards über **drei orthogonale Achsen** statt kartesischem Produkt aus Card-Typen.

## Architektur-Kernprinzip

Eine Card, drei Achsen:

- **domain** (`src/domains/`): liest die Entity und erzeugt ein **normalisiertes `ViewModel`** (`light`, `climate`, `media_player`, `sensor`).
- **layout** (`src/layouts/`): rendert Struktur aus dem ViewModel (`compact-row`, `single-large`, `master-tiles`).
- **style** (`src/styles/`): Token-Overrides (`neumorph`, `glass`, `editorial`, `minimal`, `cyber`).

Orthogonalität ist die Invariante: eine neue Domain ändert nie ein Layout, ein neues Layout nie eine Domain. Layouts lesen **niemals** `hass.states` direkt — nur das ViewModel + den `LayoutContext`.

## Gesetzte technische Entscheidungen

- TypeScript: `experimentalDecorators: true`, `useDefineForClassFields: false` (Pflicht — sonst überschreiben Class-Fields die `@state`/`@property`-Accessor und nichts rendert).
- Lit 3, in den Bundle mitgebündelt (HA teilt sein Lit nicht). Vite Library-Mode, `inlineDynamicImports` → genau **eine** Datei.
- Typen: `HomeAssistant` & Co. aus `custom-card-helpers`, `HassEntity` aus `home-assistant-js-websocket`. Lokales Spiegeln nur, wo das Community-Paket hinterherhinkt (`hassUrl`, `actionHandler`-Directive).

## HA-Stolperfallen (eingebaut, beibehalten)

1. `hass` ist **kein** `@property` — manueller Setter mit Referenzvergleich (`!==`) auf die eigenen Entities, `requestUpdate()` nur bei echter Änderung. Kein Deep-Compare.
2. Style-Switch = Attribut-Flip (`ha-card[data-style="…"]`), **kein** `adoptedStyleSheets` (Konflikt mit Lits `static styles`).
3. `getCardSize()` **und** `getGridOptions()` sind Pflicht (Sections-View Default-Dashboard).
4. `window.customCards.push()` einmalig für den Picker; `ha-card` als äußerstes Element (Theme-Variablen).
5. `setConfig` toleriert Editor-Zwischenzustände (leere `entity` → Placeholder statt Throw); throwt nur bei strukturell invalidem Config.
6. `custom-card-helpers` hat **keine** `actionHandler`-Directive — lokal in `interactions/action-handler.ts` implementiert; Dispatch über `handleAction`.
7. Slider-Service-Calls über `ServiceThrottle` (150 ms, garantierte Trailing-Edge). Pointer-Drag mit `setPointerCapture`, Freigabe auf `pointerup`/`pointercancel`.

## Build & Test

- `npm run build` (tsc strict + vite), `npm run typecheck`, `npm run dev` (watch).
- Querschnitts-DoD: rendert in Masonry **und** Sections-View, keine Konsolen-Errors, Re-Render nur bei relevanten State-Changes, hell- **und** dunkel-Theme (außer bewusst theme-ignorierende Styles wie `cyber`), Bundle baut ohne TS-Errors, < 100 KB minified.

## Doku prüfen

Lit-/HA-Frontend-/Custom-Card-Patterns ändern sich. Vor größeren Änderungen aktuelle Docs (Context7 MCP / Websuche) konsultieren, nicht auf Trainingsdaten verlassen.
