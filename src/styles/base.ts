import { css } from 'lit';

/**
 * Structural CSS — identical HTML across every style.
 *
 * Only layout/structure lives here; visual identity (backgrounds, shadows,
 * borders) is expressed through `--brevia-*` tokens so a style switch never
 * touches structure. Per the plan, one HTML structure per layout — never mix
 * style logic into the render method.
 */
export const baseStructure = css`
  ha-card {
    background: var(--brevia-bg);
    border-radius: var(--brevia-radius);
    color: var(--brevia-text);
    padding: var(--brevia-pad);
    border: none;
    box-shadow: none;
    overflow: hidden;
    transition: background 0.3s ease, box-shadow 0.3s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .unavailable {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--brevia-text-dim);
    font-size: 0.95rem;
  }

  ha-icon {
    --mdc-icon-size: 24px;
    color: var(--brevia-text);
  }

  /* ---------- shared atoms ---------- */
  .icon-badge {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--brevia-surface);
    box-shadow: var(--brevia-shadow-out);
    color: var(--brevia-text-dim);
    flex: 0 0 auto;
    transition: color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
    cursor: pointer;
  }
  .icon-badge.active {
    color: var(--brevia-accent);
    box-shadow: var(--brevia-shadow-in);
  }

  .name {
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.2;
    color: var(--brevia-text);
  }
  .secondary {
    font-size: 0.82rem;
    color: var(--brevia-text-dim);
    line-height: 1.2;
  }
  .state {
    font-variant-numeric: tabular-nums;
    color: var(--brevia-text-dim);
    font-size: 0.9rem;
  }

  /* ---------- slider (horizontal) ---------- */
  .slider {
    position: relative;
    height: 40px;
    border-radius: 999px;
    background: var(--brevia-track);
    box-shadow: var(--brevia-shadow-in);
    cursor: ew-resize;
    touch-action: none;
    overflow: hidden;
    user-select: none;
  }
  .slider-fill {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: 999px;
    background: var(--brevia-accent);
    opacity: 0.85;
    transition: width 0.08s linear;
  }
  .slider-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 14px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--brevia-text);
    mix-blend-mode: difference;
    pointer-events: none;
  }

  /* ---------- radial master visual (ring / knob) ---------- */
  .master-visual {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    margin: 4px auto;
    touch-action: none;
    user-select: none;
    cursor: pointer;
  }
  .master-visual.dimmable {
    cursor: pointer;
  }
  .ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    cursor: pointer;
    touch-action: none;
  }
  .ring-core {
    position: absolute;
    inset: 22px;
    border-radius: 50%;
    background: var(--brevia-bg);
    box-shadow: var(--brevia-shadow-out);
    display: grid;
    place-items: center;
    text-align: center;
    cursor: pointer;
  }
  .ring-core ha-icon {
    --mdc-icon-size: 30px;
    color: var(--brevia-text-dim);
  }
  .master-visual.active .ring-core ha-icon {
    color: var(--brevia-accent);
  }
  .ring-value {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--brevia-text);
    font-variant-numeric: tabular-nums;
  }
  .ring-unit {
    font-size: 0.8rem;
    color: var(--brevia-text-dim);
  }

  /* ---------- controls (transport / mode buttons) ---------- */
  .controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
  .control-btn {
    display: grid;
    place-items: center;
    min-width: 40px;
    height: 40px;
    padding: 0 10px;
    border-radius: 14px;
    background: var(--brevia-surface);
    box-shadow: var(--brevia-shadow-out);
    color: var(--brevia-text);
    border: none;
    cursor: pointer;
    font: inherit;
    font-size: 0.85rem;
    transition: box-shadow 0.15s ease, color 0.15s ease;
  }
  .control-btn:active {
    box-shadow: var(--brevia-shadow-in);
  }
  .control-btn.active {
    color: var(--brevia-accent);
    box-shadow: var(--brevia-shadow-in);
  }
  .control-btn:focus-visible {
    outline: 2px solid var(--brevia-accent);
    outline-offset: 2px;
  }

  /* ---------- album art ---------- */
  .album-art {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    object-fit: cover;
    background: var(--brevia-track);
    box-shadow: var(--brevia-shadow-out);
    flex: 0 0 auto;
  }
  .album-art.large {
    width: 120px;
    height: 120px;
    border-radius: 18px;
  }

  /* =================== LAYOUTS =================== */

  /* compact-row */
  .layout-compact-row {
    display: flex;
    align-items: center;
    gap: var(--brevia-gap);
  }
  .layout-compact-row .body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1 1 auto;
  }
  .layout-compact-row .name,
  .layout-compact-row .secondary {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .layout-compact-row .trailing {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* single-large */
  .layout-single-large {
    display: flex;
    flex-direction: column;
    gap: var(--brevia-gap);
  }
  .layout-single-large .header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .layout-single-large .header .body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .layout-single-large .header .state {
    margin-left: auto;
  }

  /* master-tiles */
  .layout-master-tiles {
    display: flex;
    flex-direction: column;
    gap: var(--brevia-gap);
  }
  .layout-master-tiles .master {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  .layout-master-tiles .master .body {
    text-align: center;
  }
  .tile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--brevia-tile-min), 1fr));
    gap: var(--brevia-gap);
  }
  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 6px;
    border-radius: var(--brevia-radius);
    background: var(--brevia-surface);
    box-shadow: var(--brevia-shadow-out);
    cursor: pointer;
    transition: box-shadow 0.2s ease, color 0.2s ease;
    text-align: center;
  }
  .tile.active {
    box-shadow: var(--brevia-shadow-in);
  }
  .tile.active ha-icon {
    color: var(--brevia-accent);
  }
  .tile .tile-name {
    font-size: 0.72rem;
    color: var(--brevia-text-dim);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  .tile:focus-visible {
    outline: 2px solid var(--brevia-accent);
    outline-offset: 2px;
  }

  /* Generic focus ring for keyboard users. */
  [tabindex]:focus-visible {
    outline: 2px solid var(--brevia-accent);
    outline-offset: 2px;
    border-radius: var(--brevia-radius);
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }
`;
