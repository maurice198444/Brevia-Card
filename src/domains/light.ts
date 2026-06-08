import type {
  HassEntity,
  HomeAssistant,
  ResolvedConfig,
  ActionConfig,
} from '../types';
import type { DomainAdapter, DomainContext, ViewModel } from './base';
import { friendlyName, isDimmable, isUnavailable } from '../utils/entity';
import { brightnessToPercent } from '../utils/format';

/** light: toggle on tap, brightness via slider/ring, dynamic colour accent. */
export class LightAdapter implements DomainAdapter {
  readonly domain = 'light' as const;

  buildViewModel(
    entity: HassEntity,
    hass: HomeAssistant,
    config: ResolvedConfig,
    ctx: DomainContext
  ): ViewModel {
    const on = entity.state === 'on';
    const dimmable = isDimmable(entity);
    const pct = brightnessToPercent(entity.attributes.brightness as number);
    const accent = on ? rgbAccent(entity) : undefined;

    const name = friendlyName(entity, config.name);
    const icon = config.icon ?? (entity.attributes.icon as string) ?? 'mdi:lightbulb';

    const stateLabel = !on ? 'Off' : dimmable ? `${pct}%` : 'On';

    const vm: ViewModel = {
      name,
      icon,
      active: on,
      unavailable: isUnavailable(entity),
      stateLabel,
      secondary: lightSecondary(entity),
      accent,
      controls: [],
      masterVisual: 'ring',
      masterValue: dimmable ? String(on ? pct : 0) : on ? 'On' : 'Off',
      masterUnit: dimmable ? '%' : undefined,
    };

    if (dimmable) {
      const apply = (value: number) => ({
        domain: 'light',
        service: 'turn_on',
        data: {
          entity_id: entity.entity_id,
          brightness_pct: Math.round(value),
        },
      });
      vm.slider = {
        value: on ? pct : 0,
        label: `${Math.round(on ? pct : 0)}%`,
        onInput: (v) => ctx.throttle.call(hass, apply(v)),
        onCommit: (v) => {
          ctx.throttle.call(hass, apply(v));
          ctx.throttle.flush(hass);
        },
      };
    }

    return vm;
  }

  defaultTapAction(): ActionConfig {
    return { action: 'toggle' };
  }
  defaultHoldAction(): ActionConfig {
    return { action: 'more-info' };
  }
}

function lightSecondary(entity: HassEntity): string | undefined {
  if (entity.state !== 'on') return undefined;
  const temp = entity.attributes.color_temp_kelvin as number | undefined;
  const effect = entity.attributes.effect as string | undefined;
  if (effect && effect !== 'None') return effect;
  if (temp) return `${temp} K`;
  return undefined;
}

/** Build an `rgb(...)` accent from the light's reported colour, if any. */
function rgbAccent(entity: HassEntity): string | undefined {
  const rgb = entity.attributes.rgb_color as [number, number, number] | undefined;
  if (rgb && rgb.length === 3) return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  return undefined;
}
