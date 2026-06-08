import type {
  HassEntity,
  HomeAssistant,
  ResolvedConfig,
  ActionConfig,
} from '../types';
import type {
  ControlButton,
  DomainAdapter,
  DomainContext,
  ViewModel,
} from './base';
import { friendlyName, isUnavailable } from '../utils/entity';

const HVAC_ICONS: Record<string, string> = {
  off: 'mdi:power',
  heat: 'mdi:fire',
  cool: 'mdi:snowflake',
  heat_cool: 'mdi:autorenew',
  auto: 'mdi:thermostat-auto',
  dry: 'mdi:water-percent',
  fan_only: 'mdi:fan',
};

/** climate: target-temperature knob + hvac-mode buttons read from the entity. */
export class ClimateAdapter implements DomainAdapter {
  readonly domain = 'climate' as const;

  buildViewModel(
    entity: HassEntity,
    hass: HomeAssistant,
    config: ResolvedConfig,
    ctx: DomainContext
  ): ViewModel {
    const attrs = entity.attributes;
    const min = (attrs.min_temp as number) ?? 7;
    const max = (attrs.max_temp as number) ?? 35;
    const step = (attrs.target_temp_step as number) ?? 0.5;
    const target = attrs.temperature as number | undefined;
    const current = attrs.current_temperature as number | undefined;
    const unit = (hass.config?.unit_system?.temperature as string) ?? '°C';
    const active = entity.state !== 'off' && !isUnavailable(entity);

    // hvac_modes is entity-specific — never hardcode the list (plan v0.5).
    const modes: string[] = (attrs.hvac_modes as string[]) ?? [];
    const controls: ControlButton[] = modes.map((mode) => ({
      key: mode,
      icon: HVAC_ICONS[mode] ?? 'mdi:thermostat',
      label: prettyMode(mode),
      active: entity.state === mode,
      onClick: () =>
        hass.callService('climate', 'set_hvac_mode', {
          entity_id: entity.entity_id,
          hvac_mode: mode,
        }),
    }));

    const action = (attrs.hvac_action as string | undefined) ?? entity.state;
    const stateLabel =
      current != null ? `${formatTemp(current)} ${unit}` : prettyMode(entity.state);
    const secondary =
      target != null ? `Set ${formatTemp(target)} ${unit} · ${prettyMode(action)}` : prettyMode(action);

    const vm: ViewModel = {
      name: friendlyName(entity, config.name),
      icon: config.icon ?? (attrs.icon as string) ?? 'mdi:thermostat',
      active,
      unavailable: isUnavailable(entity),
      stateLabel,
      secondary,
      controls,
      masterVisual: 'knob',
      masterValue: target != null ? formatTemp(target) : '—',
      masterUnit: unit.replace('C', '').replace('F', '') || '°',
    };

    if (target != null && entity.state !== 'off') {
      const toTemp = (pct: number) => {
        const raw = min + (pct / 100) * (max - min);
        return Math.round(raw / step) * step;
      };
      const toPct = (temp: number) => ((temp - min) / (max - min)) * 100;
      const apply = (pct: number) => ({
        domain: 'climate',
        service: 'set_temperature',
        data: { entity_id: entity.entity_id, temperature: toTemp(pct) },
      });
      vm.slider = {
        value: clampPct(toPct(target)),
        label: `${formatTemp(target)}${unit.startsWith('°') ? unit : ' ' + unit}`,
        onInput: (v) => ctx.throttle.call(hass, apply(v)),
        onCommit: (v) => {
          ctx.throttle.call(hass, apply(v));
          ctx.throttle.flush(hass);
        },
      };
      // Reflect live drag value in the centre label.
      vm.masterValue = formatTemp(target);
    }

    return vm;
  }

  defaultTapAction(): ActionConfig {
    return { action: 'more-info' };
  }
  defaultHoldAction(): ActionConfig {
    return { action: 'more-info' };
  }
}

function formatTemp(t: number): string {
  return Number.isInteger(t) ? String(t) : t.toFixed(1);
}
function prettyMode(mode: string): string {
  return mode
    .split('_')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}
function clampPct(v: number): number {
  return Math.min(100, Math.max(0, v));
}
