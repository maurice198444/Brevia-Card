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
import { friendlyName, isUnavailable, resolveImageUrl } from '../utils/entity';

/** media_player: album art, volume, transport controls. */
export class MediaPlayerAdapter implements DomainAdapter {
  readonly domain = 'media_player' as const;

  buildViewModel(
    entity: HassEntity,
    hass: HomeAssistant,
    config: ResolvedConfig,
    ctx: DomainContext
  ): ViewModel {
    const attrs = entity.attributes;
    const playing = entity.state === 'playing';
    const active = ['playing', 'paused', 'buffering', 'on'].includes(entity.state);

    const title = (attrs.media_title as string) ?? prettyState(entity.state);
    const artist =
      (attrs.media_artist as string) ??
      (attrs.media_series_title as string) ??
      (attrs.app_name as string);

    // entity_picture may be a relative path → resolve against the connection.
    const picture = resolveImageUrl(hass, attrs.entity_picture as string | undefined);

    const supported = (attrs.supported_features as number) ?? 0;
    const controls: ControlButton[] = [];

    if (hasFeature(supported, FEATURE.PREVIOUS)) {
      controls.push({
        key: 'prev',
        icon: 'mdi:skip-previous',
        onClick: () => this.call(hass, entity, 'media_previous_track'),
      });
    }
    if (hasFeature(supported, FEATURE.PLAY | FEATURE.PAUSE)) {
      controls.push({
        key: 'play',
        icon: playing ? 'mdi:pause' : 'mdi:play',
        active: playing,
        onClick: () => this.call(hass, entity, 'media_play_pause'),
      });
    }
    if (hasFeature(supported, FEATURE.NEXT)) {
      controls.push({
        key: 'next',
        icon: 'mdi:skip-next',
        onClick: () => this.call(hass, entity, 'media_next_track'),
      });
    }

    const vm: ViewModel = {
      name: friendlyName(entity, config.name),
      icon: config.icon ?? (attrs.icon as string) ?? 'mdi:speaker',
      active,
      unavailable: isUnavailable(entity),
      stateLabel: title,
      secondary: artist,
      picture,
      controls,
      masterVisual: 'none',
    };

    const vol = attrs.volume_level as number | undefined;
    if (vol != null && hasFeature(supported, FEATURE.VOLUME_SET)) {
      const apply = (pct: number) => ({
        domain: 'media_player',
        service: 'volume_set',
        data: { entity_id: entity.entity_id, volume_level: pct / 100 },
      });
      vm.slider = {
        value: Math.round(vol * 100),
        label: `${Math.round(vol * 100)}%`,
        onInput: (v) => ctx.throttle.call(hass, apply(v)),
        onCommit: (v) => {
          ctx.throttle.call(hass, apply(v));
          ctx.throttle.flush(hass);
        },
      };
    }

    return vm;
  }

  private call(hass: HomeAssistant, entity: HassEntity, service: string): void {
    hass.callService('media_player', service, { entity_id: entity.entity_id });
  }

  defaultTapAction(): ActionConfig {
    return { action: 'more-info' };
  }
  defaultHoldAction(): ActionConfig {
    return { action: 'more-info' };
  }
}

/** media_player supported_features bit flags. */
const FEATURE = {
  PAUSE: 1,
  PREVIOUS: 16,
  NEXT: 32,
  VOLUME_SET: 4,
  PLAY: 16384,
} as const;

/** True if ANY of the bits in `flag` are present in `supported`. */
function hasFeature(supported: number, flag: number): boolean {
  return (supported & flag) !== 0;
}

function prettyState(state: string): string {
  return state.charAt(0).toUpperCase() + state.slice(1);
}
