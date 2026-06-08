/**
 * Layout axis — structural shells.
 *
 * A layout consumes the normalised `ViewModel` plus a small `LayoutContext`
 * the card supplies (action wiring, optimistic slider value, tile models). It
 * never reads HA entities directly, so a new domain works in every layout for
 * free, and a new layout works for every domain for free.
 */
import type { TemplateResult } from 'lit';
import type { DirectiveResult } from 'lit/directive.js';
import type { HomeAssistant, ResolvedConfig, ActionHandlerEvent } from '../types';
import type { ViewModel } from '../domains/base';
import type { DragController } from '../interactions/drag';

export type SliderKind = 'horizontal' | 'radial';

/** Everything needed to wire tap/hold/double-tap onto one element. */
export interface ActionBinding {
  /** Value for `.actionHandler=${...}`. */
  handler: DirectiveResult;
  /** Handler for `@action=${...}`. */
  onAction: (ev: ActionHandlerEvent) => void;
}

/** A single tile in the master-tiles grid. */
export interface TileModel {
  entityId: string;
  vm: ViewModel;
  action: ActionBinding;
}

export interface LayoutContext {
  hass: HomeAssistant;
  config: ResolvedConfig;
  /** View model of the primary / master entity. */
  vm: ViewModel;
  /** Resolved accent CSS value (dynamic light colour or token accent). */
  accent: string;
  /** Optimistic 0..100 slider display value (drag-aware). */
  sliderValue: number;
  /** Whether a slider drag is currently active. */
  sliderActive: boolean;
  /** Build a drag controller bound to the primary slider, or undefined if none. */
  sliderController(kind: SliderKind): DragController | undefined;
  /** Action wiring for the primary entity. */
  primaryAction: ActionBinding;
  /** Tile models for the master-tiles layout. */
  tiles(): TileModel[];
}

export interface Layout {
  render(ctx: LayoutContext): TemplateResult;
}
