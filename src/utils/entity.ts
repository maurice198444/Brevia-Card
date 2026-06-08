/** Entity helpers shared across domains and layouts. */
import type { HassEntity, HomeAssistant, BreviaDomain } from '../types';

/** Extract the domain portion of an entity id (`light.kitchen` -> `light`). */
export function entityDomain(entityId: string | undefined): string {
  if (!entityId) return '';
  const dot = entityId.indexOf('.');
  return dot === -1 ? '' : entityId.slice(0, dot);
}

/** Map an entity id to one of our supported Brevia domains, if possible. */
export function deriveBreviaDomain(
  entityId: string | undefined
): BreviaDomain | undefined {
  switch (entityDomain(entityId)) {
    case 'light':
      return 'light';
    case 'climate':
      return 'climate';
    case 'media_player':
      return 'media_player';
    case 'sensor':
    case 'binary_sensor':
      return 'sensor';
    default:
      return undefined;
  }
}

/** Is an entity in an "active"/on-ish state? */
export function isActive(entity: HassEntity | undefined): boolean {
  if (!entity) return false;
  const s = entity.state;
  return (
    s !== 'off' &&
    s !== 'unavailable' &&
    s !== 'unknown' &&
    s !== 'idle' &&
    s !== 'standby' &&
    s !== 'closed' &&
    s !== '' &&
    s != null
  );
}

export function isUnavailable(entity: HassEntity | undefined): boolean {
  return !entity || entity.state === 'unavailable' || entity.state === 'unknown';
}

/** A light/anything that supports brightness (HA exposes a `brightness` attr). */
export function isDimmable(entity: HassEntity | undefined): boolean {
  if (!entity || entityDomain(entity.entity_id) !== 'light') return false;
  // supported_color_modes containing anything beyond onoff implies brightness.
  const modes: string[] | undefined = entity.attributes.supported_color_modes;
  if (modes && modes.length) {
    return modes.some((m) => m !== 'onoff');
  }
  // Fallback for older integrations.
  return 'brightness' in entity.attributes;
}

/** Friendly name resolution with config override. */
export function friendlyName(
  entity: HassEntity | undefined,
  override?: string
): string {
  if (override) return override;
  if (!entity) return 'Unknown';
  return (entity.attributes.friendly_name as string) ?? entity.entity_id;
}

/**
 * Resolve a (possibly relative) image path against the HA connection so that
 * `entity_picture` works behind ingress / non-root base paths.
 */
export function resolveImageUrl(
  hass: HomeAssistant | undefined,
  path: string | undefined
): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  // `hassUrl()` exists on the real frontend HomeAssistant but not in the
  // custom-card-helpers typings (community package lags HA — plan §4 risk).
  // Mirror the access defensively; fall back to the document origin, which
  // resolves correctly for normal (non-ingress) installs.
  const hassUrl = (hass as { hassUrl?: (p?: string) => string } | undefined)
    ?.hassUrl;
  if (typeof hassUrl === 'function') return hassUrl(path);
  return path;
}
