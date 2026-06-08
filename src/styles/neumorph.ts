import { css } from 'lit';

/**
 * Neumorph — the default look. The token defaults in `tokens.ts` already encode
 * it, so this file only needs to assert the soft-UI feel explicitly for the
 * `data-style="neumorph"` selector (and provide a dark refinement) so that
 * switching *to* neumorph from another style restores the full token set.
 */
export const neumorphStyle = css`
  ha-card[data-style='neumorph'] {
    --brevia-bg: var(--card-background-color, #e8ebf2);
    --brevia-surface: var(--brevia-bg);
    background: var(--brevia-bg);
  }

  :host([data-dark]) ha-card[data-style='neumorph'] {
    --brevia-bg: #20242e;
  }
`;
