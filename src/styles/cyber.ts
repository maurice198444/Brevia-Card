import { css } from 'lit';

/**
 * Cyber — neon-on-black, glow shadows, monospace numerics. Deliberately
 * theme-ignoring (it sets its own dark palette in both light and dark HA
 * themes), which the cross-cutting DoD explicitly allows.
 */
export const cyberStyle = css`
  ha-card[data-style='cyber'] {
    --brevia-radius: 10px;
    --brevia-bg: #0a0e16;
    --brevia-surface: #111726;
    --brevia-text: #e6f1ff;
    --brevia-text-dim: #5d7290;
    --brevia-track: #1a2336;
    --brevia-accent: var(--primary-color, #00f0ff);
    --brevia-shadow-out: 0 0 0 1px rgba(0, 240, 255, 0.18),
      0 0 14px rgba(0, 240, 255, 0.12);
    --brevia-shadow-in: inset 0 0 10px rgba(0, 240, 255, 0.2);

    background: var(--brevia-bg);
    border: 1px solid rgba(0, 240, 255, 0.25);
  }

  ha-card[data-style='cyber'] .state,
  ha-card[data-style='cyber'] .ring-value,
  ha-card[data-style='cyber'] .slider-label {
    font-family: 'SF Mono', 'Roboto Mono', ui-monospace, monospace;
    text-shadow: 0 0 8px var(--brevia-accent);
  }
  ha-card[data-style='cyber'] .name {
    letter-spacing: 0.04em;
  }
  ha-card[data-style='cyber'] .icon-badge.active,
  ha-card[data-style='cyber'] .tile.active ha-icon {
    color: var(--brevia-accent);
    filter: drop-shadow(0 0 6px var(--brevia-accent));
  }
  ha-card[data-style='cyber'] .slider-fill {
    box-shadow: 0 0 16px var(--brevia-accent);
    opacity: 1;
  }
`;
