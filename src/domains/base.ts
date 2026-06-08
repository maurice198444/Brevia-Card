/**
 * Domain axis — the orthogonality contract.
 *
 * A domain knows how to read its entity and turn it into a NORMALISED
 * `ViewModel`. Layouts consume only that view model (plus a couple of
 * domain-provided render hooks), so adding a domain never requires editing a
 * layout, and adding a layout never requires editing a domain.
 */
import type {
  HassEntity,
  HomeAssistant,
  ResolvedConfig,
  ActionConfig,
  BreviaDomain,
} from '../types';
import type { ServiceThrottle } from '../interactions/service-calls';

/**
 * Per-card mutable state handed to adapters. The throttle is owned by the card
 * (persists across renders) so slider drags don't flood the websocket.
 */
export interface DomainContext {
  throttle: ServiceThrottle;
}

/** A button in the controls strip (transport, hvac mode, …). */
export interface ControlButton {
  key: string;
  icon?: string;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

/** A continuous control (brightness / temperature / volume). 0..100 domain. */
export interface SliderModel {
  /** Position 0..100. */
  value: number;
  /** Human label for the current value, e.g. "75%" or "21°". */
  label: string;
  /** Live drag → throttled service call. */
  onInput: (value: number) => void;
  /** Pointer release → guaranteed flush of the final value. */
  onCommit: (value: number) => void;
}

/** How the master-tiles big control renders. */
export type MasterVisual = 'ring' | 'knob' | 'none';

/** Everything a layout needs, normalised across domains. */
export interface ViewModel {
  name: string;
  icon: string;
  /** On-ish state, drives accent/active styling. */
  active: boolean;
  unavailable: boolean;
  /** Primary state text, e.g. "On", "21 °C", "Playing". */
  stateLabel: string;
  /** Secondary detail line. */
  secondary?: string;
  /** Picture URL (album art etc.), already resolved against the connection. */
  picture?: string;
  /** Dynamic accent (e.g. a light's current colour). Overrides token accent. */
  accent?: string;
  /** Continuous control, if the entity supports one. */
  slider?: SliderModel;
  /** Discrete controls (transport, modes). */
  controls: ControlButton[];
  /** Radial master visualisation kind. */
  masterVisual: MasterVisual;
  /** Big centre value for the ring/knob, e.g. "75" / "21". */
  masterValue?: string;
  /** Unit shown under the centre value, e.g. "%" / "°". */
  masterUnit?: string;
}

export interface DomainAdapter {
  readonly domain: BreviaDomain;
  buildViewModel(
    entity: HassEntity,
    hass: HomeAssistant,
    config: ResolvedConfig,
    ctx: DomainContext
  ): ViewModel;
  /** Default tap action when the user hasn't configured one. */
  defaultTapAction(): ActionConfig;
  /** Default hold action when the user hasn't configured one. */
  defaultHoldAction(): ActionConfig;
}
