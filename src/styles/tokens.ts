import { css } from 'lit';

/**
 * Design tokens — the contract every style and layout consumes.
 *
 * The `:host` block defines the DEFAULT token set (the `neumorph` look). Each
 * style file overrides these via `ha-card[data-style="…"]` selectors, so style
 * switching is a pure attribute flip — no `adoptedStyleSheets`, no remount.
 *
 * Theme bridge: every token falls back to a HA theme variable where one makes
 * sense, so the card blends into the active dashboard theme by default.
 *
 * Overrides (`config.overrides.*`) are written as inline custom properties on
 * `:host` by the card and therefore win over everything below.
 */
export const tokens = css`
  :host {
    /* ---- Look tokens (neumorph defaults) ---- */
    --brevia-accent: var(--primary-color, #5b8def);
    --brevia-radius: 22px;
    --brevia-shadow-intensity: 1;

    --brevia-bg: var(--card-background-color, #e8ebf2);
    --brevia-surface: var(--brevia-bg);
    --brevia-text: var(--primary-text-color, #1c2230);
    --brevia-text-dim: var(--secondary-text-color, #6b7280);
    --brevia-track: rgba(0, 0, 0, 0.08);

    /* Neumorphic dual shadow, scaled by intensity. */
    --brevia-shadow-light: rgba(255, 255, 255, 0.9);
    --brevia-shadow-dark: rgba(28, 34, 48, 0.18);
    --brevia-shadow-out: calc(6px * var(--brevia-shadow-intensity))
        calc(6px * var(--brevia-shadow-intensity))
        calc(14px * var(--brevia-shadow-intensity)) var(--brevia-shadow-dark),
      calc(-6px * var(--brevia-shadow-intensity))
        calc(-6px * var(--brevia-shadow-intensity))
        calc(14px * var(--brevia-shadow-intensity)) var(--brevia-shadow-light);
    --brevia-shadow-in: inset 4px 4px 8px var(--brevia-shadow-dark),
      inset -4px -4px 8px var(--brevia-shadow-light);

    /* ---- Spacing (density-aware) ---- */
    --brevia-gap: 14px;
    --brevia-pad: 18px;
    --brevia-tile-min: 64px;

    display: block;
  }

  /* Compact density tightens spacing globally. */
  :host([data-density='compact']) {
    --brevia-gap: 8px;
    --brevia-pad: 12px;
    --brevia-radius: 16px;
  }

  /* Dark token variant for the default look. Styles may override further. */
  :host([data-dark]) {
    --brevia-bg: #20242e;
    --brevia-text: #eef1f6;
    --brevia-text-dim: #9aa3b2;
    --brevia-track: rgba(255, 255, 255, 0.1);
    --brevia-shadow-light: rgba(255, 255, 255, 0.04);
    --brevia-shadow-dark: rgba(0, 0, 0, 0.5);
  }
`;
