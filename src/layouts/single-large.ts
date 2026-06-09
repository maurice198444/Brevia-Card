import { html, nothing } from 'lit';
import type { Layout, LayoutContext } from './base';
import { renderControls, renderSlider } from './shared';

/**
 * single-large — one focused entity: header (icon/art + name + state), a big
 * brightness/temperature/volume slider where applicable, and a controls strip.
 */
export const singleLarge: Layout = {
  render(ctx: LayoutContext) {
    const vm = ctx.vm;
    const leading = vm.picture
      ? html`<img class="album-art large" src=${vm.picture} alt="" />`
      : html`<div
          class="icon-badge ${vm.active ? 'active' : ''}"
          style=${vm.active && vm.accent ? `color:${vm.accent}` : ''}
          @action=${ctx.primaryAction.onAction}
          ${ctx.primaryAction.handler}
          role="button"
          tabindex="0"
          aria-label=${vm.name}
        >
          <ha-icon icon=${vm.icon}></ha-icon>
        </div>`;

    return html`
      <div class="layout-single-large">
        <div class="header">
          ${leading}
          <div class="body">
            <span class="name">${vm.name}</span>
            ${vm.secondary
              ? html`<span class="secondary">${vm.secondary}</span>`
              : nothing}
          </div>
          <span class="state">${vm.stateLabel}</span>
        </div>
        ${vm.slider ? renderSlider(ctx) : nothing}
        ${renderControls(vm.controls)}
      </div>
    `;
  },
};
