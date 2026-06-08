import { css } from 'lit';

/**
 * Glass — frosted translucent surface.
 *
 * Stolperfalle (plan §0/#7): `ha-card`'s own background MUST be transparent or
 * `backdrop-filter` has nothing behind it to blur. We set the card background
 * to a faint tint and push the blur onto it. The dashboard background then
 * shows through — verify no opaque parent (`ha-card` theme var) covers it.
 */
export const glassStyle = css`
  ha-card[data-style='glass'] {
    --brevia-bg: transparent;
    --brevia-surface: rgba(255, 255, 255, 0.14);
    --brevia-text: var(--primary-text-color, #10131a);
    --brevia-text-dim: rgba(60, 66, 82, 0.75);
    --brevia-track: rgba(255, 255, 255, 0.18);
    --brevia-shadow-out: 0 8px 30px rgba(0, 0, 0, 0.18);
    --brevia-shadow-in: inset 0 1px 2px rgba(255, 255, 255, 0.4);

    background: rgba(255, 255, 255, 0.08);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.25);
  }

  :host([data-dark]) ha-card[data-style='glass'] {
    --brevia-surface: rgba(255, 255, 255, 0.08);
    --brevia-text: #f3f5fa;
    --brevia-text-dim: rgba(230, 234, 244, 0.7);
    --brevia-track: rgba(255, 255, 255, 0.1);
    background: rgba(20, 24, 34, 0.35);
    border-color: rgba(255, 255, 255, 0.12);
  }

  ha-card[data-style='glass'] .icon-badge,
  ha-card[data-style='glass'] .tile,
  ha-card[data-style='glass'] .control-btn {
    border: 1px solid rgba(255, 255, 255, 0.2);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }
`;
