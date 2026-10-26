import { css, html, type TemplateResult } from 'lit';
import { I } from '../icons';
import { swipeToClose } from './swipe';

export function icon(path: string, size: number, stroke: string, width = 2.2): TemplateResult {
  return html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${stroke} stroke-width=${width}
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${path}></path></svg>`;
}

export const SCENE_COLORS = ['#ffb340', '#64d2ff', '#bf9bff', '#7ee8a0', '#ff9f0a', '#ff6b5e'];

/** mdi icon via HA's own <ha-icon> when available, else a generic SVG. */
export function mdi(name: string | undefined, fallback: string, stroke: string, size = 18): TemplateResult {
  if (name && customElements.get('ha-icon')) {
    return html`<ha-icon .icon=${name} style="--mdc-icon-size:${size}px;color:${stroke}"></ha-icon>`;
  }
  return icon(fallback, size - 2, stroke, 2.1);
}

export interface SheetOptions {
  title: string;
  /** Accent for the header circle and the top glow. */
  color: string;
  glow: string;
  iconPath: string;
  /** Used instead of `iconPath` when set (e.g. an animated glyph). */
  iconTemplate?: TemplateResult;
  iconStroke?: string;
  onClose: () => void;
  body: TemplateResult;
  /** Small line under the title. */
  subtitle?: string;
  /** Extra header content between title and close button. */
  headerExtra?: TemplateResult;
  /** Replaces the icon circle with a back button. */
  onBack?: () => void;
  /** Hide the close button (e.g. when a back button is shown). */
  noClose?: boolean;
}

/** Bottom sheet rendered inside the card (pop-ups do not depend on Bubble Card). */
export function sheet(o: SheetOptions): TemplateResult {
  // Pulling down, tapping outside and Escape leave this sheet: back to its parent if it has one.
  const dismiss = o.onBack ?? o.onClose;
  return html`
    <div class="backdrop" @click=${dismiss}></div>
    <section class="sheet" role="dialog" aria-modal="true" aria-label=${o.title}
      style="background-image: radial-gradient(100% 30% at 50% 0%, ${o.glow}, transparent 70%)"
      ${swipeToClose(dismiss)}
      @keydown=${(e: KeyboardEvent) => e.key === 'Escape' && dismiss()}>
      <div class="grabber" aria-hidden="true"></div>
      <header class="sheet-head">
        ${o.onBack
          ? html`<button class="close back" aria-label="Zurück" @click=${o.onBack}>${icon('M15 5l-7 7 7 7', 18, '#fff', 2.4)}</button>`
          : html`<span class="circle" style="width:44px;height:44px;background:${o.color}">${o.iconTemplate ?? icon(o.iconPath, 20, o.iconStroke ?? '#141008', 2)}</span>`}
        <span class="sheet-title">
          <h1 class="ellipsis">${o.title}</h1>
          ${o.subtitle ? html`<span class="sheet-sub">${o.subtitle}</span>` : ''}
        </span>
        ${o.headerExtra ?? ''}
        ${o.noClose ? '' : html`<button class="close" aria-label="Schließen" @click=${o.onClose}>${icon(I.close, 16, '#fff', 2.4)}</button>`}
      </header>
      ${o.body}
    </section>
  `;
}

export interface ConfirmOptions {
  title: string;
  text: string;
  confirm: string;
  color: string;
  iconPath: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function confirmSheet(o: ConfirmOptions): TemplateResult {
  return sheet({
    title: o.title,
    color: o.color,
    glow: o.color + '33',
    iconPath: o.iconPath,
    onClose: o.onClose,
    body: html`
      <p class="confirm-text">${o.text}</p>
      <div class="confirm-row">
        <button class="btn" @click=${o.onClose}>Abbrechen</button>
        <button class="btn primary" style="background:${o.color}" @click=${() => { o.onConfirm(); o.onClose(); }}>${o.confirm}</button>
      </div>
    `,
  });
}

export const sheetStyles = css`
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    background: rgba(0, 0, 0, 0.55);
    animation: fade 0.2s ease-out;
  }
  .sheet {
    position: fixed;
    z-index: 21;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, var(--drag, 0px));
    width: min(100%, 480px);
    max-height: calc(100% - 44px);
    overflow-y: auto;
    overscroll-behavior: contain;
    border-radius: 42px 42px 0 0;
    background-color: var(--sd-sheet);
    padding: 8px 14px calc(24px + env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: rise 0.28s cubic-bezier(0.2, 0.9, 0.3, 1);
  }
  /* Stacked sheets: the one underneath shrinks back and dims, like iOS. */
  .layer {
    display: contents;
  }
  .layer.under .sheet {
    transform: translate(-50%, -12px) scale(0.93);
    transform-origin: 50% 0;
    filter: brightness(0.6);
    transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.3s;
  }
  .layer .sheet {
    transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.3s;
  }
  .layer.stacked .backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  .grabber {
    position: relative;
    cursor: grab;
    align-self: center;
    width: 40px;
    height: 5px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.25);
  }
  .grabber::before {
    content: '';
    position: absolute;
    inset: -12px -60px -8px;
  }
  .sheet-head {
    cursor: grab;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 60px;
    padding: 0 6px 0 8px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.08);
  }
  .sheet-title {
    flex: 1;
    min-width: 0;
  }
  .sheet-title h1 {
    font-size: 18px;
    font-weight: 700;
  }
  .sheet-sub {
    display: block;
    font-size: 12px;
    color: var(--sd-muted);
  }
  .close {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: var(--sd-fill-2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .close.back {
    width: 44px;
    height: 44px;
    border-radius: 22px;
  }
  .confirm-text {
    margin: 6px 10px;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.85);
  }
  .confirm-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .btn {
    height: 52px;
    border-radius: 26px;
    background: var(--sd-fill-2);
    font-size: 15px;
    font-weight: 700;
    text-align: center;
  }
  .btn.primary {
    color: #101010;
  }
  @keyframes rise {
    from {
      transform: translate(-50%, 100%);
    }
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .sheet,
    .backdrop {
      animation: none;
    }
  }
`;

