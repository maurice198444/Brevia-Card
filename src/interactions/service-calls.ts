/**
 * Throttled service-call dispatch.
 *
 * Sliders (brightness / temperature / volume) fire `pointermove` at display
 * refresh rate. Hammering `hass.callService` floods the websocket and makes
 * lights stutter. We throttle to a fixed interval but GUARANTEE a trailing
 * call so the final resting value is always sent.
 */
import type { HomeAssistant } from '../types';

export interface ServiceTarget {
  domain: string;
  service: string;
  data: Record<string, unknown>;
}

export class ServiceThrottle {
  private lastRun = 0;
  private timer: number | undefined;
  private pending: ServiceTarget | undefined;

  constructor(private readonly intervalMs: number = 150) {}

  /** Schedule a service call, throttled with a guaranteed trailing edge. */
  call(hass: HomeAssistant, target: ServiceTarget): void {
    this.pending = target;
    const now = Date.now();
    const elapsed = now - this.lastRun;

    if (elapsed >= this.intervalMs) {
      this.flush(hass);
      return;
    }

    if (this.timer === undefined) {
      const wait = this.intervalMs - elapsed;
      this.timer = window.setTimeout(() => {
        this.timer = undefined;
        this.flush(hass);
      }, wait);
    }
  }

  /** Force-send the pending call immediately (e.g. on pointerup). */
  flush(hass: HomeAssistant): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    const target = this.pending;
    this.pending = undefined;
    if (!target) return;
    this.lastRun = Date.now();
    hass.callService(target.domain, target.service, target.data);
  }

  /** Cancel any pending trailing call (e.g. on disconnect). */
  cancel(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.pending = undefined;
  }
}
