import { css, html, LitElement, type PropertyValues } from 'lit';

/**
 * Horizontal pointer slider used by the light sheet.
 * - variant "bubble": filled pill from the left (brightness).
 * - variant "knob": gradient track with a round white knob (colour temperature).
 * Fires `slide-change` with `{ value }` when the finger is lifted (or on arrow keys).
 * Keeps showing the local value until HA reports it back (or 5 s pass).
 */
export class SdSlider extends LitElement {
  static properties = {
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    variant: { type: String },
    label: { type: String },
    track: { type: String },
    fill: { type: String },
    format: { attribute: false },
    _local: { state: true },
  };

  value = 0;
  min = 0;
  max = 100;
  step = 1;
  variant: 'bubble' | 'knob' = 'bubble';
  label = '';
  track = 'rgba(255,255,255,0.08)';
  fill = 'linear-gradient(90deg, rgba(255,214,10,0.35), #ffe37a)';
  format: (v: number) => string = (v) => String(v);
  private _local: number | null = null;
  private _localAt = 0;
  private _dragging = false;

  protected willUpdate(changed: PropertyValues) {
    if (changed.has('value') && !this._dragging && this._local !== null) {
      if (this.value === this._local || Date.now() - this._localAt > 5000) this._local = null;
    }
  }

  private get _shown(): number {
    return this._local ?? this.value;
  }

  private _fromX(clientX: number): number {
    const r = this.renderRoot.querySelector('.track')!.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const raw = this.min + f * (this.max - this.min);
    return Math.min(this.max, Math.max(this.min, Math.round(raw / this.step) * this.step));
  }

  private _down(e: PointerEvent) {
    this._dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this._set(this._fromX(e.clientX));
  }

  private _move(e: PointerEvent) {
    if (this._dragging) this._set(this._fromX(e.clientX));
  }

  private _up() {
    if (!this._dragging) return;
    this._dragging = false;
    this._commit();
  }

  private _cancel() {
    this._dragging = false;
    this._local = null;
  }

  private _set(v: number) {
    this._local = v;
    this._localAt = Date.now();
  }

  private _commit() {
    if (this._local === null) return;
    this.dispatchEvent(new CustomEvent('slide-change', { detail: { value: this._local } }));
  }

  private _key(e: KeyboardEvent) {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const big = (this.max - this.min) / 20;
    this._set(Math.min(this.max, Math.max(this.min, this._shown + d * Math.max(this.step, Math.round(big / this.step) * this.step))));
    this._commit();
  }

  protected render() {
    const v = this._shown;
    const f = (v - this.min) / (this.max - this.min || 1);
    return html`
      <div class="head"><span class="lbl">${this.label}</span><span class="val">${this.format(v)}</span></div>
      <div class="track v-${this.variant}" role="slider" tabindex="0" aria-label=${this.label}
        aria-valuemin=${this.min} aria-valuemax=${this.max} aria-valuenow=${v} aria-valuetext=${this.format(v)}
        style="background:${this.track}"
        @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._up}
        @pointercancel=${this._cancel} @lostpointercapture=${this._up} @keydown=${this._key}>
        ${this.variant === 'bubble'
          ? html`<span class="fill" style="width:max(64px, ${f * 100}%);background:${this.fill};opacity:${v <= this.min ? 0 : 1}"></span>
              <slot></slot>`
          : html`<span class="knob" style="left:calc(${f * 100}% - ${f * 44}px + 4px)"></span>`}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
      color: #fff;
    }
    .head {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 0 8px 6px;
    }
    .lbl {
      font-weight: 600;
    }
    .val {
      font-weight: 700;
    }
    .track {
      position: relative;
      overflow: hidden;
      touch-action: pan-y;
      cursor: pointer;
      outline: none;
    }
    .track:focus-visible {
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
    }
    .track.v-bubble {
      height: 64px;
      border-radius: 32px;
    }
    .track.v-knob {
      height: 44px;
      border-radius: 22px;
    }
    .fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border-radius: 32px;
      transition: width 0.08s linear;
    }
    ::slotted(*) {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
    }
    .knob {
      position: absolute;
      top: 4px;
      width: 36px;
      height: 36px;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      pointer-events: none;
    }
  `;
}

if (!customElements.get('start-dashboard-slider')) customElements.define('start-dashboard-slider', SdSlider);
