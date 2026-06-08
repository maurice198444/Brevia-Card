import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { handleAction, hasAction } from 'custom-card-helpers';

import type {
  BreviaConfig,
  ResolvedConfig,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
  ActionConfig,
  ActionHandlerEvent,
  BreviaTile,
  BreviaDomain,
} from './types';
import { LAYOUTS, STYLES, DOMAINS } from './types';
import { deriveBreviaDomain, entityDomain } from './utils/entity';
import { getDomainAdapter } from './domains';
import type { ViewModel } from './domains';
import { getLayout } from './layouts';
import type {
  ActionBinding,
  LayoutContext,
  SliderKind,
  TileModel,
} from './layouts/base';
import { ServiceThrottle } from './interactions/service-calls';
import {
  DragController,
  horizontalValue,
  radialValue,
} from './interactions/drag';
import { actionHandler } from './interactions/action-handler';

import { tokens } from './styles/tokens';
import { baseStructure } from './styles/base';
import { neumorphStyle } from './styles/neumorph';
import { glassStyle } from './styles/glass';
import { editorialStyle } from './styles/editorial';
import { minimalStyle } from './styles/minimal';
import { cyberStyle } from './styles/cyber';

const VERSION = '1.0.0';

/* eslint-disable no-console */
console.info(
  `%c BREVIA-CARD %c v${VERSION} `,
  'color:#fff;background:#5b8def;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px',
  'color:#5b8def;background:#11131a;border-radius:0 4px 4px 0;padding:2px 6px'
);
/* eslint-enable no-console */

@customElement('brevia-card')
export class BreviaCard extends LitElement implements LovelaceCard {
  /** Re-render trigger. `hass` is intentionally NOT a reactive property. */
  @state() private _config?: ResolvedConfig;

  private _hass?: HomeAssistant;
  /** Optimistic slider value during a drag (0..100). */
  @state() private _optimistic: number | null = null;
  @state() private _dragging = false;

  /** Persistent throttle so slider drags never flood the websocket. */
  private readonly _throttle = new ServiceThrottle(150);

  static override styles = [
    tokens,
    baseStructure,
    neumorphStyle,
    glassStyle,
    editorialStyle,
    minimalStyle,
    cyberStyle,
  ];

  // ---------------------------------------------------------------- editor
  static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor/brevia-card-editor');
    return document.createElement('brevia-card-editor') as LovelaceCardEditor;
  }

  static getStubConfig(): BreviaConfig {
    return {
      type: 'custom:brevia-card',
      entity: '',
      layout: 'single-large',
      style: 'neumorph',
    };
  }

  // ----------------------------------------------------------------- config
  setConfig(config: BreviaConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration');
    }
    if (config.layout && !LAYOUTS.includes(config.layout)) {
      throw new Error(`Unknown layout "${config.layout}"`);
    }
    if (config.style && !STYLES.includes(config.style)) {
      throw new Error(`Unknown style "${config.style}"`);
    }
    if (config.domain && !DOMAINS.includes(config.domain)) {
      throw new Error(`Unknown domain "${config.domain}"`);
    }

    const primaryEntity = config.master_entity ?? config.entity;
    const domain =
      config.domain ?? deriveBreviaDomain(primaryEntity) ?? 'light';
    const adapter = getDomainAdapter(domain);

    // Editor tolerance (plan v0.7): a missing entity is NOT a hard error here —
    // we render a friendly placeholder instead so the editor stays usable.
    this._config = {
      ...config,
      domain,
      layout: config.layout ?? 'single-large',
      style: config.style ?? 'neumorph',
      overrides: config.overrides ?? {},
      tap_action: config.tap_action ?? adapter.defaultTapAction(),
      hold_action: config.hold_action ?? adapter.defaultHoldAction(),
    };
  }

  // ------------------------------------------------------------------- hass
  set hass(hass: HomeAssistant) {
    const prev = this._hass;
    this._hass = hass;
    if (!this._config) return;

    // Selective re-render: only repaint when one of OUR entities changed.
    // HA swaps the HassEntity object on change, so reference `!==` is enough —
    // no deep compare, no JSON.stringify (plan v0.3 stolperfalle).
    if (!prev || this._relevantChanged(prev, hass)) {
      if (!this._dragging) this._optimistic = null;
      this.requestUpdate();
    }
  }
  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  private _relevantChanged(a: HomeAssistant, b: HomeAssistant): boolean {
    for (const id of this._trackedEntities()) {
      if (a.states[id] !== b.states[id]) return true;
    }
    return false;
  }

  private _trackedEntities(): string[] {
    const cfg = this._config;
    if (!cfg) return [];
    const ids: string[] = [];
    const primary = cfg.master_entity ?? cfg.entity;
    if (primary) ids.push(primary);
    for (const tile of cfg.tile_entities ?? []) {
      ids.push(typeof tile === 'string' ? tile : tile.entity);
    }
    return ids;
  }

  // ------------------------------------------------------------ HA sizing
  getCardSize(): number {
    const layout = this._config?.layout ?? 'single-large';
    if (layout === 'compact-row') return 1;
    if (layout === 'master-tiles') {
      const tiles = this._config?.tile_entities?.length ?? 0;
      return 3 + Math.ceil(tiles / 3);
    }
    return 3;
  }

  /** Sections-view (12-column) sizing — without this the card grabs all 12. */
  getGridOptions(): {
    rows?: number;
    columns?: number;
    min_rows?: number;
    min_columns?: number;
  } {
    const layout = this._config?.layout ?? 'single-large';
    switch (layout) {
      case 'compact-row':
        return { rows: 1, columns: 6, min_rows: 1, min_columns: 4 };
      case 'master-tiles': {
        const tiles = this._config?.tile_entities?.length ?? 0;
        return {
          rows: 3 + Math.ceil(tiles / 3),
          columns: 12,
          min_rows: 3,
          min_columns: 6,
        };
      }
      case 'single-large':
      default:
        return { rows: 3, columns: 6, min_rows: 2, min_columns: 4 };
    }
  }

  // ------------------------------------------------------------- lifecycle
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._throttle.cancel();
  }

  protected override willUpdate(): void {
    const cfg = this._config;
    if (!cfg) return;

    // Density / dark are host attributes scoped by tokens.ts.
    if (cfg.overrides.density === 'compact') {
      this.setAttribute('data-density', 'compact');
    } else {
      this.removeAttribute('data-density');
    }

    const dark =
      cfg.overrides.dark ??
      Boolean((this._hass?.themes as { darkMode?: boolean } | undefined)?.darkMode);
    this.toggleAttribute('data-dark', dark);

    // Override custom properties live on :host and win over every style.
    this._applyHostVar('--brevia-radius', cfg.overrides.radius != null ? `${cfg.overrides.radius}px` : null);
    this._applyHostVar(
      '--brevia-shadow-intensity',
      cfg.overrides.shadow_intensity != null
        ? String(cfg.overrides.shadow_intensity)
        : null
    );
  }

  private _applyHostVar(name: string, value: string | null): void {
    if (value == null) this.style.removeProperty(name);
    else this.style.setProperty(name, value);
  }

  // ---------------------------------------------------------------- render
  protected override render(): TemplateResult {
    const cfg = this._config;
    if (!cfg) return html`<ha-card></ha-card>`;
    const hass = this._hass;

    const primaryId = cfg.master_entity ?? cfg.entity;
    const entity = primaryId ? hass?.states[primaryId] : undefined;

    if (!primaryId) {
      return this._shell(cfg, this._placeholder('mdi:gesture-tap', 'Choose an entity'));
    }
    if (!hass) {
      return this._shell(cfg, this._placeholder('mdi:loading', 'Loading…'));
    }
    if (!entity) {
      return this._shell(
        cfg,
        this._placeholder('mdi:alert-circle-outline', `Entity not found: ${primaryId}`)
      );
    }

    const adapter = getDomainAdapter(cfg.domain);
    const vm = adapter.buildViewModel(entity, hass, cfg, {
      throttle: this._throttle,
    });

    if (vm.unavailable) {
      return this._shell(cfg, this._placeholder('mdi:help-circle-outline', `${vm.name} unavailable`));
    }

    // Resolve accent: explicit override wins, else dynamic (light colour).
    const accent = cfg.overrides.accent ?? vm.accent ?? 'var(--brevia-accent)';
    this._applyHostVar(
      '--brevia-accent',
      cfg.overrides.accent ?? vm.accent ?? null
    );

    const ctx = this._buildContext(cfg, hass, vm, accent);
    return this._shell(cfg, getLayout(cfg.layout).render(ctx));
  }

  private _shell(cfg: ResolvedConfig, body: unknown): TemplateResult {
    return html`<ha-card data-style=${cfg.style}>${body}</ha-card>`;
  }

  private _placeholder(icon: string, text: string) {
    return html`<div class="unavailable">
      <ha-icon icon=${icon}></ha-icon><span>${text}</span>
    </div>`;
  }

  // ------------------------------------------------------- layout context
  private _buildContext(
    cfg: ResolvedConfig,
    hass: HomeAssistant,
    vm: ViewModel,
    accent: string
  ): LayoutContext {
    const sliderValue = this._optimistic ?? vm.slider?.value ?? 0;
    return {
      hass,
      config: cfg,
      vm,
      accent,
      sliderValue,
      sliderActive: this._dragging,
      sliderController: (kind: SliderKind) =>
        this._makeSlider(vm, kind),
      primaryAction: this._actionBinding({
        entity: cfg.master_entity ?? cfg.entity,
        tap_action: cfg.tap_action,
        hold_action: cfg.hold_action,
        double_tap_action: cfg.double_tap_action,
      }),
      tiles: () => this._buildTiles(cfg, hass),
    };
  }

  private _makeSlider(vm: ViewModel, kind: SliderKind): DragController | undefined {
    const slider = vm.slider;
    if (!slider) return undefined;
    const compute = kind === 'radial' ? radialValue : horizontalValue;
    return new DragController({
      computeValue: compute,
      onInput: (value) => {
        this._optimistic = value;
        slider.onInput(value);
        this.requestUpdate();
      },
      onCommit: (value) => {
        this._optimistic = value;
        slider.onCommit(value);
      },
      onActiveChange: (active) => {
        this._dragging = active;
        this.requestUpdate();
      },
    });
  }

  private _actionBinding(actionConfig: {
    entity?: string;
    tap_action?: ActionConfig;
    hold_action?: ActionConfig;
    double_tap_action?: ActionConfig;
  }): ActionBinding {
    return {
      handler: actionHandler({
        hasHold: hasAction(actionConfig.hold_action),
        hasDoubleClick: hasAction(actionConfig.double_tap_action),
      }),
      onAction: (ev: ActionHandlerEvent) => {
        if (!this._hass || !ev.detail?.action) return;
        handleAction(this, this._hass, actionConfig, ev.detail.action);
      },
    };
  }

  private _buildTiles(cfg: ResolvedConfig, hass: HomeAssistant): TileModel[] {
    const result: TileModel[] = [];
    for (const tile of cfg.tile_entities ?? []) {
      const t = normalizeTile(tile);
      const entity = hass.states[t.entity];
      if (!entity) continue;
      const domain = deriveBreviaDomain(t.entity) ?? 'sensor';
      const adapter = getDomainAdapter(domain);
      const vm = adapter.buildViewModel(
        entity,
        hass,
        { ...cfg, entity: t.entity, name: t.name, icon: t.icon } as ResolvedConfig,
        { throttle: this._throttle }
      );
      result.push({
        entityId: t.entity,
        vm,
        action: this._actionBinding({
          entity: t.entity,
          tap_action: t.tap_action ?? defaultTileTap(domain, t.entity),
          hold_action: t.hold_action ?? { action: 'more-info' },
        }),
      });
    }
    return result;
  }
}

function normalizeTile(tile: BreviaTile): Exclude<BreviaTile, string> {
  return typeof tile === 'string' ? { entity: tile } : tile;
}

/** Toggleable domains get tap=toggle; everything else opens more-info. */
function defaultTileTap(domain: BreviaDomain, entityId: string): ActionConfig {
  const ed = entityDomain(entityId);
  const toggleable = ['light', 'switch', 'fan', 'input_boolean', 'media_player'];
  if (domain === 'light' || toggleable.includes(ed)) {
    return { action: 'toggle' };
  }
  return { action: 'more-info' };
}

// -------------------------------------------------------------- registration
(window as unknown as { customCards?: unknown[] }).customCards =
  (window as unknown as { customCards?: unknown[] }).customCards || [];
(window as unknown as { customCards: unknown[] }).customCards.push({
  type: 'brevia-card',
  name: 'Brevia Card',
  description: 'Premium multi-domain card (Domain × Layout × Style)',
  preview: true,
  documentationURL: 'https://github.com/maurice198444/brevia-card',
});

declare global {
  interface HTMLElementTagNameMap {
    'brevia-card': BreviaCard;
  }
}
