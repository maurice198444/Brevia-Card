/**
 * Local action-handler directive.
 *
 * Plan correction #5 assumed `custom-card-helpers` exports an `actionHandler`
 * directive — it does NOT (only `handleAction`/`hasAction`). So we implement the
 * canonical HA pattern locally (a singleton `<action-handler>` element that
 * disambiguates tap / hold / double-tap via Pointer Events) and pair it with
 * `handleAction` for dispatch. This is the documented "mirror locally" fallback
 * from the plan's risk note.
 *
 * Each target element keeps its own options and listeners (bound once); the
 * singleton only holds the transient timing state of the in-flight gesture,
 * which is safe because only one pointer gesture runs at a time.
 */
import { noChange } from 'lit';
import type { ElementPart } from 'lit';
import { directive, Directive, PartType } from 'lit/directive.js';
import type { DirectiveParameters, PartInfo } from 'lit/directive.js';
import type { ActionHandlerOptions } from '../types';

interface ActionHandlerElement extends HTMLElement {
  actionHandlerBound?: boolean;
  actionHandlerOptions?: ActionHandlerOptions;
}

const HOLD_MS = 500;
const DOUBLE_CLICK_MS = 250;

class ActionHandler extends HTMLElement {
  private held = false;
  private timer?: number;
  private dblTimer?: number;
  private clicks = 0;

  connectedCallback(): void {
    Object.assign(this.style, {
      position: 'fixed',
      width: '0',
      height: '0',
      pointerEvents: 'none',
    });
  }

  bind(element: ActionHandlerElement, options: ActionHandlerOptions): void {
    element.actionHandlerOptions = options;
    if (element.actionHandlerBound) return;
    element.actionHandlerBound = true;
    element.addEventListener('pointerdown', this.start);
    element.addEventListener('pointerup', this.end);
    element.addEventListener('pointercancel', this.reset);
  }

  private start = (e: Event): void => {
    const el = e.currentTarget as ActionHandlerElement;
    this.held = false;
    if (this.timer !== undefined) clearTimeout(this.timer);
    if (el.actionHandlerOptions?.hasHold) {
      this.timer = window.setTimeout(() => {
        this.held = true;
      }, HOLD_MS);
    }
  };

  private end = (e: Event): void => {
    const el = e.currentTarget as ActionHandlerElement;
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    const options = el.actionHandlerOptions ?? {};

    if (this.held) {
      fire(el, 'hold');
      return;
    }

    if (options.hasDoubleClick) {
      if (this.clicks === 0) {
        this.clicks = 1;
        this.dblTimer = window.setTimeout(() => {
          this.clicks = 0;
          fire(el, 'tap');
        }, DOUBLE_CLICK_MS);
      } else {
        if (this.dblTimer !== undefined) clearTimeout(this.dblTimer);
        this.clicks = 0;
        fire(el, 'double_tap');
      }
    } else {
      fire(el, 'tap');
    }
  };

  private reset = (): void => {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.held = false;
  };
}

function fire(node: HTMLElement, action: string): void {
  node.dispatchEvent(
    new CustomEvent('action', {
      detail: { action },
      bubbles: true,
      composed: true,
    })
  );
}

const TAG = 'brevia-action-handler';

function getActionHandler(): ActionHandler {
  let existing = document.body.querySelector(TAG) as ActionHandler | null;
  if (!existing) {
    existing = document.createElement(TAG) as ActionHandler;
    document.body.appendChild(existing);
  }
  return existing;
}

class ActionHandlerDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('actionHandler can only be bound to an element');
    }
  }

  override update(part: ElementPart, [options]: DirectiveParameters<this>) {
    getActionHandler().bind(part.element as ActionHandlerElement, options ?? {});
    return this.render(options);
  }

  render(_options?: ActionHandlerOptions): typeof noChange {
    return noChange;
  }
}

export const actionHandler = directive(ActionHandlerDirective);

if (!customElements.get(TAG)) {
  customElements.define(TAG, ActionHandler);
}
