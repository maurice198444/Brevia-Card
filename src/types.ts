/**
 * Brevia Card — shared types.
 *
 * HA has no official npm typings. We source `HomeAssistant` & friends from
 * `custom-card-helpers` and `HassEntity` from `home-assistant-js-websocket`.
 * Per the plan's risk note, if those community types ever drift behind HA we
 * mirror the few members we need locally — but for now we re-export them so
 * the rest of the codebase has a single import site.
 */
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
  ActionConfig,
  ActionHandlerEvent,
  ActionHandlerOptions,
} from 'custom-card-helpers';
import type { HassEntity } from 'home-assistant-js-websocket';

export type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
  ActionConfig,
  ActionHandlerEvent,
  ActionHandlerOptions,
  HassEntity,
};

/** The three orthogonal configuration axes. */
export type BreviaDomain = 'light' | 'climate' | 'media_player' | 'sensor';
export type BreviaLayout = 'compact-row' | 'single-large' | 'master-tiles';
export type BreviaStyle =
  | 'neumorph'
  | 'glass'
  | 'editorial'
  | 'minimal'
  | 'cyber';

export const DOMAINS: BreviaDomain[] = [
  'light',
  'climate',
  'media_player',
  'sensor',
];
export const LAYOUTS: BreviaLayout[] = [
  'compact-row',
  'single-large',
  'master-tiles',
];
export const STYLES: BreviaStyle[] = [
  'neumorph',
  'glass',
  'editorial',
  'minimal',
  'cyber',
];

export type Density = 'comfortable' | 'compact';

/** Per-instance look overrides — independent of the active style. */
export interface BreviaOverrides {
  /** Accent colour, any valid CSS colour. Maps to `--brevia-accent`. */
  accent?: string;
  /** Corner radius in px. Maps to `--brevia-radius`. */
  radius?: number;
  /** 0..1 multiplier for shadow strength. Maps to `--brevia-shadow-intensity`. */
  shadow_intensity?: number;
  /** Spacing density. Sets the `data-density` host attribute. */
  density?: Density;
  /** Force dark token variant regardless of HA theme. */
  dark?: boolean;
}

/** A tile entry for the master-tiles layout. */
export type BreviaTile =
  | string
  | {
      entity: string;
      name?: string;
      icon?: string;
      tap_action?: ActionConfig;
      hold_action?: ActionConfig;
    };

/** Full card configuration. */
export interface BreviaConfig extends LovelaceCardConfig {
  type: string;
  /** Primary entity. Required for every layout except master-tiles where it is the master. */
  entity?: string;
  /** Domain axis. Auto-derived from the entity id if omitted. */
  domain?: BreviaDomain;
  /** Layout axis. */
  layout?: BreviaLayout;
  /** Style axis. */
  style?: BreviaStyle;

  /** Display name override. */
  name?: string;
  /** Icon override (mdi:...). */
  icon?: string;

  /** master-tiles: the large master entity (falls back to `entity`). */
  master_entity?: string;
  /** master-tiles: the surrounding tile grid. */
  tile_entities?: BreviaTile[];

  /** Tap / hold / double-tap actions (defaults derived per domain). */
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;

  /** Look overrides. */
  overrides?: BreviaOverrides;
}

/** Config after `setConfig` has applied defaults — fields are guaranteed present. */
export interface ResolvedConfig extends BreviaConfig {
  domain: BreviaDomain;
  layout: BreviaLayout;
  style: BreviaStyle;
  overrides: BreviaOverrides;
}
