/**
 * Pointer-based drag handling for sliders / rings / knobs.
 *
 * Uses Pointer Events with `setPointerCapture` so a drag that starts on the
 * control keeps receiving moves even if the pointer leaves the element. This
 * ALSO stops the Sections-View edit-mode from interpreting a value drag as a
 * card move: we capture the pointer and stop propagation on pointerdown.
 *
 * The capture is always released on `pointerup`/`pointercancel`; forgetting
 * this is the classic "drag state stuck" bug, so release lives in a `finally`-
 * style cleanup that runs for both end events.
 */

export interface DragOptions {
  /** Map a pointer event + the element rect to a 0..100 value. */
  computeValue: (e: PointerEvent, rect: DOMRect) => number;
  /** Live updates during the drag (throttled service call downstream). */
  onInput: (value: number) => void;
  /** Final value when the pointer is released (guaranteed flush). */
  onCommit?: (value: number) => void;
  /** Notified when a drag begins / ends, for visual state. */
  onActiveChange?: (active: boolean) => void;
}

export class DragController {
  private pointerId: number | undefined;
  private element: HTMLElement | undefined;
  private lastValue = 0;
  private readonly move = (e: PointerEvent) => this.handleMove(e);
  private readonly end = (e: PointerEvent) => this.handleEnd(e);

  constructor(private readonly options: DragOptions) {}

  /** Bind this to `@pointerdown`. */
  start = (e: PointerEvent): void => {
    // Only react to the primary button / touch / pen contact.
    if (e.button !== undefined && e.button > 0) return;
    const el = e.currentTarget as HTMLElement;
    e.preventDefault();
    e.stopPropagation();

    this.element = el;
    this.pointerId = e.pointerId;
    el.setPointerCapture(e.pointerId);
    el.addEventListener('pointermove', this.move);
    el.addEventListener('pointerup', this.end);
    el.addEventListener('pointercancel', this.end);

    this.options.onActiveChange?.(true);
    this.emit(e, false);
  };

  private handleMove(e: PointerEvent): void {
    if (e.pointerId !== this.pointerId) return;
    e.preventDefault();
    this.emit(e, false);
  }

  private handleEnd(e: PointerEvent): void {
    if (e.pointerId !== this.pointerId) return;
    this.emit(e, true);
    this.cleanup();
  }

  private emit(e: PointerEvent, commit: boolean): void {
    if (!this.element) return;
    const rect = this.element.getBoundingClientRect();
    const value = clamp(this.options.computeValue(e, rect));
    this.lastValue = value;
    this.options.onInput(value);
    if (commit) this.options.onCommit?.(value);
  }

  private cleanup(): void {
    const el = this.element;
    if (el && this.pointerId !== undefined) {
      try {
        el.releasePointerCapture(this.pointerId);
      } catch {
        /* pointer already released */
      }
      el.removeEventListener('pointermove', this.move);
      el.removeEventListener('pointerup', this.end);
      el.removeEventListener('pointercancel', this.end);
    }
    this.element = undefined;
    this.pointerId = undefined;
    this.options.onActiveChange?.(false);
  }

  get value(): number {
    return this.lastValue;
  }
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/** Horizontal track: left edge = 0, right edge = 100. */
export function horizontalValue(e: PointerEvent, rect: DOMRect): number {
  return ((e.clientX - rect.left) / rect.width) * 100;
}

/** Vertical track: bottom edge = 0, top edge = 100. */
export function verticalValue(e: PointerEvent, rect: DOMRect): number {
  return ((rect.bottom - e.clientY) / rect.height) * 100;
}

/**
 * Radial ring/knob: angle around the centre mapped to 0..100.
 * 0% at the bottom (gap), sweeping clockwise through 270° of travel.
 */
export function radialValue(e: PointerEvent, rect: DOMRect): number {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  // Angle from the bottom, clockwise.
  let angle = Math.atan2(dx, dy) * (180 / Math.PI); // 0 at bottom, +clockwise
  angle = ((angle % 360) + 360) % 360; // 0..360
  const gap = 45; // half of the 90° dead zone at the bottom
  const sweep = 360 - 2 * gap; // 270° usable
  const travel = angle - gap;
  if (travel <= 0) return 0;
  if (travel >= sweep) return 100;
  return (travel / sweep) * 100;
}
