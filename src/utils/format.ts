/** Value formatting helpers — primarily for the read-only sensor domain. */
import type { HassEntity, HomeAssistant } from '../types';

/** Round to at most `digits` decimals, dropping trailing zeros. */
function trim(n: number, digits = 1): string {
  return Number(n.toFixed(digits)).toString();
}

/**
 * Format a sensor state for display, honouring `device_class`, `unit_of_measurement`
 * and the HA locale where available.
 */
export function formatSensor(
  entity: HassEntity,
  hass?: HomeAssistant
): string {
  const { state } = entity;
  const unit = entity.attributes.unit_of_measurement as string | undefined;
  const deviceClass = entity.attributes.device_class as string | undefined;

  if (state === 'unavailable' || state === 'unknown') return '—';

  // Timestamp device classes render as localised date/time.
  if (deviceClass === 'timestamp') {
    const d = new Date(state);
    if (!Number.isNaN(d.getTime())) {
      try {
        return d.toLocaleString(hass?.locale?.language);
      } catch {
        return d.toLocaleString();
      }
    }
  }

  const num = Number(state);
  if (!Number.isNaN(num) && state.trim() !== '') {
    const formatted = formatNumber(num, hass);
    return unit ? `${formatted} ${unit}` : formatted;
  }

  // Non-numeric (e.g. binary_sensor, enum) — capitalise the raw state.
  const text = capitalize(state.replace(/_/g, ' '));
  return unit ? `${text} ${unit}` : text;
}

export function formatNumber(num: number, hass?: HomeAssistant): string {
  const lang = hass?.locale?.language;
  try {
    return num.toLocaleString(lang, { maximumFractionDigits: 2 });
  } catch {
    return trim(num, 2);
  }
}

export function capitalize(s: string): string {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** "75" from a 0..255 brightness value. */
export function brightnessToPercent(brightness: number | undefined): number {
  if (brightness == null) return 0;
  return Math.round((brightness / 255) * 100);
}

/** 0..255 from a 0..100 percentage. */
export function percentToBrightness(percent: number): number {
  return Math.round((Math.max(0, Math.min(100, percent)) / 100) * 255);
}

/** Format seconds as m:ss (media position/duration). */
export function formatDuration(seconds: number | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return '0:00';
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, '0')}`;
}
