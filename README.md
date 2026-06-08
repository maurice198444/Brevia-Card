# Brevia Card

A premium multi-domain [Home Assistant](https://www.home-assistant.io/) Lovelace card built on **three orthogonal axes** — pick a **domain**, a **layout**, and a **style**, and they compose freely. One card, no cartesian explosion of card types.

```yaml
type: custom:brevia-card
entity: light.living_room
layout: single-large
style: neumorph
```

| Axis | Values |
|------|--------|
| **domain** | `light`, `climate`, `media_player`, `sensor` |
| **layout** | `compact-row`, `single-large`, `master-tiles` |
| **style** | `neumorph`, `glass`, `editorial`, `minimal`, `cyber` |

The HTML structure is identical across every style — only design tokens (`--brevia-*`) change — so a style switch is a pure attribute flip with no remount. Adding a domain never touches a layout, and adding a layout never touches a domain.

## Features

- **Real controls** — tap to toggle, hold for more-info, drag a slider/ring for brightness, temperature or volume (throttled so it never floods the websocket).
- **Sections-view aware** — implements both `getCardSize()` and `getGridOptions()`, so it sizes correctly in the modern grid dashboard instead of grabbing all 12 columns.
- **Selective re-render** — only repaints when one of *its* entities actually changes.
- **GUI editor** — configure domain / layout / style / entity without YAML.
- **Theme bridge** — every token falls back to a HA theme variable, with automatic dark-mode following (and per-card overrides).

## Installation

### HACS (recommended)

1. HACS → **Frontend** → ⋮ → *Custom repositories* → add this repo as a **Lovelace** plugin.
2. Install **Brevia Card**, then reload your browser.

### Manual

1. Download `brevia-card.js` from a [release](https://github.com/maurice198444/brevia-card/releases).
2. Copy it to `config/www/`.
3. Add a Lovelace resource (Settings → Dashboards → ⋮ → Resources):
   - URL: `/local/brevia-card.js`
   - Type: **JavaScript Module**

See [SETUP.md](./SETUP.md) for local development / build instructions.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | — | Primary entity. |
| `domain` | string | derived from `entity` | Force the domain axis. |
| `layout` | string | `single-large` | Layout axis. |
| `style` | string | `neumorph` | Style axis. |
| `name` | string | entity friendly name | Display name. |
| `icon` | string | domain default | Icon override (`mdi:…`). |
| `master_entity` | string | `entity` | Master-tiles: the large control. |
| `tile_entities` | list | — | Master-tiles: the surrounding tiles. |
| `tap_action` / `hold_action` / `double_tap_action` | action | per-domain | Standard HA actions. |
| `overrides` | object | — | `accent`, `radius`, `shadow_intensity`, `density`, `dark`. |

Each `tile_entities` entry may be a bare entity id or `{ entity, name?, icon?, tap_action?, hold_action? }`.

### Examples

Ready-to-paste configs live in [`docs/examples/`](./docs/examples). For instance, a light master with a tile grid:

```yaml
type: custom:brevia-card
domain: light
layout: master-tiles
style: neumorph
master_entity: light.living_room
tile_entities:
  - light.kitchen
  - light.hallway
  - { entity: light.desk, name: Desk, icon: mdi:desk-lamp }
```

> **Glass style:** `glass` sets `ha-card`'s background transparent so `backdrop-filter` can blur what is behind it. It only looks frosted when the dashboard/view has a visible background behind the card.

## License

MIT
