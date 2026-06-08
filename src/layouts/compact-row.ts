import { html, nothing } from 'lit';
import type { Layout, LayoutContext } from './base';
import { renderControls } from './shared';

/**
 * compact-row — the simplest layout (the v0.1 tracer-bullet target): a leading
 * badge/art, a name + secondary block, and a trailing state/controls slot.
 */
export const compactRow: Layout = {
  render(ctx: LayoutContext) {
    const vm = ctx.vm;
    const leading = vm.picture
      ? html`<img class="album-art" src=${vm.picture} alt="" />`
      : html`<div
          class="icon-badge ${vm.active ? 'active' : ''}"
          style=${vm.active && vm.accent ? `color:${vm.accent}` : ''}
          @action=${ctx.primaryAction.onAction}
          .actionHandler=${ctx.primaryAction.handler}
          role="button"
          tabindex="0"
          aria-label=${vm.name}
        >
          <ha-icon icon=${vm.icon}></ha-icon>
        </div>`;

    return html`
      <div class="layout-compact-row">
        ${leading}
        <div class="body">
          <span class="name">${vm.name}</span>
          ${vm.secondary
            ? html`<span class="secondary">${vm.secondary}</span>`
            : nothing}
        </div>
        <div class="trailing">
          ${vm.controls.length
            ? renderControls(vm.controls)
            : html`<span class="state">${vm.stateLabel}</span>`}
        </div>
      </div>
    `;
  },
};
