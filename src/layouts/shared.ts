/** Shared render atoms used across layouts (structure only — no style logic). */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { ControlButton } from '../domains/base';
import type { LayoutContext, SliderKind } from './base';

/** Discrete control buttons (transport / hvac modes). */
export function renderControls(controls: ControlButton[]) {
  if (!controls.length) return nothing;
  return html`
    <div class="controls">
      ${controls.map(
        (c) => html`
          <button
            class="control-btn ${c.active ? 'active' : ''}"
            ?disabled=${c.disabled}
            aria-label=${c.label ?? c.key}
            aria-pressed=${c.active ? 'true' : 'false'}
            @click=${(e: Event) => {
              e.stopPropagation();
              c.onClick();
            }}
          >
            ${c.icon ? html`<ha-icon icon=${c.icon}></ha-icon>` : nothing}
            ${c.label && !c.icon ? html`<span>${c.label}</span>` : nothing}
          </button>
        `
      )}
    </div>
  `;
}

/** Horizontal slider with optimistic fill + accessible role. */
export function renderSlider(ctx: LayoutContext): TemplateResult | typeof nothing {
  if (!ctx.vm.slider) return nothing;
  const controller = ctx.sliderController('horizontal');
  const value = Math.round(ctx.sliderValue);
  return html`
    <div
      class="slider ${ctx.sliderActive ? 'active' : ''}"
      role="slider"
      tabindex="0"
      aria-label="${ctx.vm.name} level"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${value}
      aria-valuetext=${ctx.vm.slider.label}
      @pointerdown=${controller?.start}
      @keydown=${(e: KeyboardEvent) => onSliderKey(e, ctx)}
    >
      <div class="slider-fill" style="width:${value}%"></div>
      <div class="slider-label">${ctx.vm.slider.label}</div>
    </div>
  `;
}

/** Radial ring/knob master visual driven by the optimistic slider value. */
export function renderRadial(
  ctx: LayoutContext,
  kind: SliderKind = 'radial'
): TemplateResult {
  const vm = ctx.vm;
  const dimmable = !!vm.slider;
  const value = Math.round(ctx.sliderValue);
  const sweep = (value / 100) * 270;
  const arc = `conic-gradient(from 225deg,
    var(--brevia-accent) 0deg ${sweep}deg,
    var(--brevia-track) ${sweep}deg 270deg,
    transparent 270deg 360deg)`;
  const controller = dimmable ? ctx.sliderController(kind) : undefined;

  // Drag lives on the ring annulus; tap lives on the core. They are SIBLINGS,
  // not ancestor/descendant, so a centre tap never also starts a brightness
  // drag (which would otherwise toggle and re-set brightness at once).
  return html`
    <div
      class="master-visual ${vm.active ? 'active' : ''} ${dimmable ? 'dimmable' : ''}"
      data-visual=${vm.masterVisual}
      role=${dimmable ? 'slider' : 'button'}
      tabindex="0"
      aria-label=${vm.name}
      aria-valuenow=${dimmable ? value : nothing}
      @keydown=${(e: KeyboardEvent) => dimmable && onSliderKey(e, ctx)}
    >
      <div
        class="ring"
        style="background:${arc}"
        @pointerdown=${controller?.start}
      ></div>
      <div
        class="ring-core"
        @action=${ctx.primaryAction.onAction}
        .actionHandler=${ctx.primaryAction.handler}
      >
        ${vm.masterValue
          ? html`<span class="ring-value">${vm.masterValue}</span>
              ${vm.masterUnit
                ? html`<span class="ring-unit">${vm.masterUnit}</span>`
                : nothing}`
          : html`<ha-icon icon=${vm.icon}></ha-icon>`}
      </div>
    </div>
  `;
}

/** Keyboard support for sliders: arrows nudge by 5, Home/End jump. */
function onSliderKey(e: KeyboardEvent, ctx: LayoutContext): void {
  const slider = ctx.vm.slider;
  if (!slider) return;
  let next: number | undefined;
  const cur = ctx.sliderValue;
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = Math.min(100, cur + 5);
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      next = Math.max(0, cur - 5);
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = 100;
      break;
    default:
      return;
  }
  e.preventDefault();
  slider.onInput(next);
  slider.onCommit(next);
}
