import { css, html, nothing } from 'lit';
import { icon, sheet } from '../components/ui';
import { I } from '../icons';
import { batteryCare, filterCare, type CareItem } from '../logic/care';
import type { PageContext } from '../pages/context';

const ORANGE = '#ff9f0a';
const YELLOW = '#ffd60a';

function row(ctx: PageContext, item: CareItem, iconPath: string, color: string, confirm: { text: string; button: string; hint?: string }) {
  return html`
    <div class="cr-row">
      <button class="cr-main" @click=${() => ctx.moreInfo(item.id)}>
        <span class="circle" style="width:40px;height:40px;background:${color}">${icon(iconPath, 18, '#141008', 2.2)}</span>
        <span class="cr-text"><span class="cr-name ellipsis">${item.name}</span><span class="cr-detail">${item.detail}</span></span>
      </button>
      ${item.reset
        ? html`<button class="cr-act" style="background:${color}" @click=${() => ctx.confirm({
            title: item.name, text: confirm.text, confirm: confirm.button, color, iconPath,
            onConfirm: () => ctx.call('button', 'press', {}, { entity_id: item.reset! }),
          })}>${confirm.button}</button>`
        : confirm.hint
          ? html`<span class="cr-hint">${confirm.hint}</span>`
          : nothing}
    </div>`;
}

/** Batteries and filters that need attention, each with its "done" button where HA has one. */
export function careSheet(ctx: PageContext) {
  const batteries = batteryCare(ctx.hass);
  const filters = filterCare(ctx.hass, ctx.config);
  const total = batteries.length + filters.length;
  return sheet({
    title: 'Wartung',
    subtitle: total ? `${total} ${total === 1 ? 'Gerät braucht' : 'Geräte brauchen'} Aufmerksamkeit` : 'Alles in Ordnung',
    color: ORANGE,
    glow: 'rgba(255,159,10,0.22)',
    iconPath: I.battery,
    onClose: ctx.closeSheet,
    body: html`
      ${batteries.length
        ? html`<div class="section-head"><h2>Batterien</h2><span class="rule" aria-hidden="true"></span></div>
            ${batteries.map((b) => row(ctx, b, I.battery, ORANGE, { text: 'Batterie getauscht? Das Datum wird in Battery Notes gespeichert.', button: 'Getauscht' }))}`
        : nothing}
      ${filters.length
        ? html`<div class="section-head"><h2>Filter</h2><span class="rule" aria-hidden="true"></span></div>
            ${filters.map((f) => row(ctx, f, I.filter, YELLOW, { text: 'Filter gereinigt oder getauscht? Der Zähler wird zurückgesetzt.', button: 'Erledigt', hint: 'am Gerät zurücksetzen' }))}`
        : nothing}
      ${total ? nothing : html`<p class="cr-empty">Keine schwachen Batterien und keine fälligen Filter.</p>`}
    `,
  });
}

export const careStyles = css`
  .cr-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 56px;
    padding: 0 8px 0 6px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.07);
  }
  .cr-main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
  }
  .cr-text {
    min-width: 0;
  }
  .cr-name {
    display: block;
    font-size: 14px;
    font-weight: 600;
  }
  .cr-detail {
    display: block;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.72);
  }
  .cr-act {
    flex-shrink: 0;
    height: 36px;
    padding: 0 14px;
    border-radius: 18px;
    font-size: 13px;
    font-weight: 700;
    color: #141008;
  }
  .cr-hint {
    flex-shrink: 0;
    max-width: 84px;
    font-size: 11px;
    line-height: 1.25;
    text-align: right;
    color: rgba(255, 255, 255, 0.55);
    padding-right: 6px;
  }
  .cr-empty {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    padding: 4px 8px;
  }
`;
