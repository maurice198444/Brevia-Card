import { html, nothing } from 'lit';
import type { Layout, LayoutContext } from './base';
import { renderControls, renderRadial } from './shared';

/**
 * master-tiles — a large master control (radial ring for light, knob for
 * climate, plain header otherwise) above a responsive grid of secondary tiles.
 * Each tile toggles / opens independently.
 */
export const masterTiles: Layout = {
  render(ctx: LayoutContext) {
    const vm = ctx.vm;
    const tiles = ctx.tiles();

    const master =
      vm.masterVisual === 'none'
        ? html`<div class="header">
              <div
                class="icon-badge ${vm.active ? 'active' : ''}"
                @action=${ctx.primaryAction.onAction}
                .actionHandler=${ctx.primaryAction.handler}
                role="button"
                tabindex="0"
                aria-label=${vm.name}
              >
                <ha-icon icon=${vm.icon}></ha-icon>
              </div>
              <div class="body">
                <span class="name">${vm.name}</span>
                <span class="secondary">${vm.stateLabel}</span>
              </div>
            </div>`
        : html`${renderRadial(ctx)}
            <div class="body">
              <span class="name">${vm.name}</span>
              ${vm.secondary
                ? html`<span class="secondary">${vm.secondary}</span>`
                : nothing}
            </div>`;

    return html`
      <div class="layout-master-tiles">
        <div class="master">${master} ${renderControls(vm.controls)}</div>
        ${tiles.length
          ? html`<div class="tile-grid">
              ${tiles.map(
                (t) => html`
                  <div
                    class="tile ${t.vm.active ? 'active' : ''}"
                    style=${t.vm.active && t.vm.accent
                      ? `color:${t.vm.accent}`
                      : ''}
                    @action=${t.action.onAction}
                    .actionHandler=${t.action.handler}
                    role="button"
                    tabindex="0"
                    aria-label=${t.vm.name}
                  >
                    <ha-icon icon=${t.vm.icon}></ha-icon>
                    <span class="tile-name">${t.vm.name}</span>
                  </div>
                `
              )}
            </div>`
          : nothing}
      </div>
    `;
  },
};
