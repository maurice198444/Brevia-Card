import { css } from 'lit';

/**
 * Minimal — flat, quiet, mostly monochrome. No shadows, thin weights, small
 * radius. Leans on the HA theme so it disappears into any dashboard.
 */
export const minimalStyle = css`
  ha-card[data-style='minimal'] {
    --brevia-radius: 12px;
    --brevia-bg: var(--card-background-color, #ffffff);
    --brevia-surface: var(--secondary-background-color, #f3f4f6);
    --brevia-text: var(--primary-text-color, #111827);
    --brevia-text-dim: var(--secondary-text-color, #9ca3af);
    --brevia-track: var(--secondary-background-color, #eceef1);
    --brevia-shadow-out: none;
    --brevia-shadow-in: none;

    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    background: var(--brevia-bg);
  }

  ha-card[data-style='minimal'] .name {
    font-weight: 500;
  }
  ha-card[data-style='minimal'] .icon-badge {
    background: transparent;
    width: 40px;
    height: 40px;
  }
  ha-card[data-style='minimal'] .icon-badge.active {
    background: color-mix(in srgb, var(--brevia-accent) 14%, transparent);
  }
  ha-card[data-style='minimal'] .tile,
  ha-card[data-style='minimal'] .control-btn {
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
  }
  ha-card[data-style='minimal'] .ring-core {
    box-shadow: none;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  :host([data-dark]) ha-card[data-style='minimal'] {
    --brevia-bg: #1b1e24;
    --brevia-surface: #262a32;
    --brevia-text: #f4f6fa;
    --brevia-text-dim: #8b93a1;
    --brevia-track: #2c313a;
  }
`;
