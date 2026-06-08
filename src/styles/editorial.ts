import { css } from 'lit';

/**
 * Editorial — print-inspired: serif headings, hairline rules, generous accent,
 * flat surfaces, sharp corners. Magazine layout energy.
 */
export const editorialStyle = css`
  ha-card[data-style='editorial'] {
    --brevia-radius: 4px;
    --brevia-bg: var(--card-background-color, #fbfaf7);
    --brevia-surface: transparent;
    --brevia-text: var(--primary-text-color, #14110c);
    --brevia-text-dim: #8a8478;
    --brevia-track: rgba(20, 17, 12, 0.1);
    --brevia-accent: var(--primary-color, #b5462e);
    --brevia-shadow-out: none;
    --brevia-shadow-in: none;

    border: 1px solid var(--brevia-text);
    background: var(--brevia-bg);
  }

  ha-card[data-style='editorial'] .name {
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  ha-card[data-style='editorial'] .secondary,
  ha-card[data-style='editorial'] .tile-name {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.7rem;
  }
  ha-card[data-style='editorial'] .icon-badge,
  ha-card[data-style='editorial'] .tile,
  ha-card[data-style='editorial'] .control-btn,
  ha-card[data-style='editorial'] .album-art {
    border: 1px solid var(--brevia-text);
    border-radius: 2px;
  }
  ha-card[data-style='editorial'] .icon-badge {
    border-radius: 50%;
  }
  ha-card[data-style='editorial'] .slider {
    border: 1px solid var(--brevia-text);
  }

  :host([data-dark]) ha-card[data-style='editorial'] {
    --brevia-bg: #16140f;
    --brevia-text: #f3efe6;
    --brevia-text-dim: #9c958650;
    --brevia-track: rgba(243, 239, 230, 0.12);
  }
`;
