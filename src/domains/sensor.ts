import type {
  HassEntity,
  HomeAssistant,
  ResolvedConfig,
  ActionConfig,
} from '../types';
import type { DomainAdapter, ViewModel } from './base';
import { friendlyName, isUnavailable } from '../utils/entity';
import { formatSensor } from '../utils/format';

const DEVICE_CLASS_ICONS: Record<string, string> = {
  temperature: 'mdi:thermometer',
  humidity: 'mdi:water-percent',
  pressure: 'mdi:gauge',
  power: 'mdi:flash',
  energy: 'mdi:lightning-bolt',
  battery: 'mdi:battery',
  illuminance: 'mdi:brightness-5',
  co2: 'mdi:molecule-co2',
  pm25: 'mdi:air-filter',
};

/** sensor: read-only, device_class-aware formatting. No controls. */
export class SensorAdapter implements DomainAdapter {
  readonly domain = 'sensor' as const;

  buildViewModel(
    entity: HassEntity,
    hass: HomeAssistant,
    config: ResolvedConfig
  ): ViewModel {
    const deviceClass = entity.attributes.device_class as string | undefined;
    const value = formatSensor(entity, hass);

    return {
      name: friendlyName(entity, config.name),
      icon:
        config.icon ??
        (entity.attributes.icon as string) ??
        (deviceClass ? DEVICE_CLASS_ICONS[deviceClass] : undefined) ??
        'mdi:gauge',
      active: !isUnavailable(entity),
      unavailable: isUnavailable(entity),
      stateLabel: value,
      secondary: deviceClass
        ? deviceClass.charAt(0).toUpperCase() + deviceClass.slice(1)
        : undefined,
      controls: [],
      masterVisual: 'none',
      masterValue: value,
    };
  }

  defaultTapAction(): ActionConfig {
    return { action: 'more-info' };
  }
  defaultHoldAction(): ActionConfig {
    return { action: 'more-info' };
  }
}
