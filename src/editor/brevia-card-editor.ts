import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { fireEvent } from 'custom-card-helpers';
import type {
  BreviaConfig,
  HomeAssistant,
  LovelaceCardEditor,
} from '../types';
import { DOMAINS, LAYOUTS, STYLES } from '../types';

/** Build a select option list for `ha-form`. */
const opts = (values: readonly string[]) =>
  values.map((value) => ({ value, label: pretty(value) }));

function pretty(s: string): string {
  return s
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

@customElement('brevia-card-editor')
export class BreviaCardEditor extends LitElement implements LovelaceCardEditor {
  @state() private _config?: BreviaConfig;
  public hass?: HomeAssistant;

  setConfig(config: BreviaConfig): void {
    this._config = config;
  }

  private get _schema() {
    return [
      { name: 'entity', selector: { entity: {} } },
      {
        name: 'domain',
        selector: { select: { options: opts(DOMAINS), mode: 'dropdown' } },
      },
      {
        name: 'layout',
        selector: { select: { options: opts(LAYOUTS), mode: 'dropdown' } },
      },
      {
        name: 'style',
        selector: { select: { options: opts(STYLES), mode: 'dropdown' } },
      },
      { name: 'name', selector: { text: {} } },
    ] as const;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _computeLabel = (schema: { name: string }): string => pretty(schema.name);

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const config = ev.detail.value as BreviaConfig;
    fireEvent(this, 'config-changed', { config });
  }

  static override styles = css`
    ha-form {
      display: block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'brevia-card-editor': BreviaCardEditor;
  }
}
