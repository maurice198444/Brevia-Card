# Projekt: Brevia Card

Custom Home Assistant Lovelace Card als JavaScript-Modul (LitElement + TypeScript + Vite). Ziel: Premium-Cards auf Dribbble-Niveau über drei orthogonale Konfigurationsachsen statt karthesisches Produkt aus Card-Typen.

## Architektur-Kernprinzip

Eine Card mit drei Config-Achsen:

- **domain**: welche HA-Entity-Kategorie (light, climate, media_player, sensor)
- **layout**: visuelle Struktur innerhalb der Domain (master-tiles, single-large, compact-row, …)
- **style**: Look-Variante (neumorph, glass, editorial, minimal, cyber)

HTML-Struktur bleibt identisch über alle Stile – nur das Stylesheet wechselt. Style-Switching via `adoptedStyleSheets`. Inspiration: Bubble Card's `card_type:`-Parameter-Pattern, ergänzt um orthogonale Style-Trennung.

## Tech-Stack (gesetzt, nicht verhandelbar ohne Begründung)

- TypeScript mit `experimentalDecorators: true` und `useDefineForClassFields: false`
- Lit 3.x als Web-Component-Framework (gleiches Framework wie HA-Frontend)
- Vite im Library-Mode, Single-File-Output nach `dist/brevia-card.js`
- Keine `custom-card-helpers`-Dependency – Types selbst-definiert in `src/types.ts`
- Keine externen Imports von `unpkg.com` – alles gebundelt

## HA-spezifische Stolperfallen (proaktiv beachten)

1. `hass` darf NICHT als reactive `@property` deklariert werden – triggert Re-Render bei jeder unrelated Entity-Änderung. Stattdessen Setter mit Filter, der nur bei Änderung der eigenen Entity einen lokalen `@state` updated.
2. Bare-Specifier-Imports (`from 'lit'`) funktionieren nur durch Bundling. Niemals `https://unpkg.com/...` URLs in `src`.
3. `customElements.define()` darf pro Element-Name nur EINMAL aufgerufen werden. Bei Hot-Reload kommen Errors – Lösung: Existenz-Check vor Registrierung.
4. `ha-card` als äußerstes Element nutzen (HA-Konvention, Theme-Variablen wirken nur dort).
5. `setConfig()` muss bei invalidem Config eine Error throwen, dann zeigt HA das hübsch.
6. `window.customCards.push()` für Card-Picker-Registrierung – nur einmal, nicht bei jedem Re-Render.

## Code-Qualität

- Eine HTML-Struktur pro Layout, niemals Style-Logik in der Render-Methode mischen
- CSS-Custom-Properties (`--brevia-*`) für alle thematischen Werte, nie hardcoded Hex außerhalb der Style-Files
- Pro Style-Variante eine eigene `.ts`-Datei in `src/styles/`, die nur eine `` css`…` ``-Konstante exportiert
- Defensive Templates: immer prüfen ob Entity existiert (`!hass.states[id]`) und einen Fallback rendern
- Theme-Bridge: Wo möglich HA-Theme-Variablen (`var(--primary-text-color)`) als Fallback nutzen

## Aktuelle Doku immer prüfen

Lit-API, HA-Frontend-Patterns und Custom-Card-Best-Practices ändern sich. Vor jeder größeren Implementierung Context7 MCP oder Websuche konsultieren – nicht auf Trainingsdaten verlassen. Besonders relevant: HA Developer Docs (Custom Cards), Lit 3 Migration Notes, Mushroom/Bubble Card Source als Referenz für etablierte Patterns.

## Roadmap-Verständnis

- **v0.1** – Skeleton mit Build-Pipeline-Smoke-Test (Placeholder rendert)
- **v0.2** – Erste echte Card: domain=light, layout=master-tiles, style=neumorph
- **v0.3** – Zweite Style-Variante als Beweis für Style-Orthogonalität
- **v0.4** – Dynamic Style-Switching via `adoptedStyleSheets`
- **v0.5+** – Weitere Domains, GUI-Editor, HACS-Distribution
