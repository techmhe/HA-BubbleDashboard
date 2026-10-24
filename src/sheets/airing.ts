import { css, html, nothing } from 'lit';
import { icon, sheet } from '../components/ui';
import { I, IC } from '../icons';
import { airingInfo, clock } from '../logic/climate';
import { ent } from '../logic/entities';
import { durationText, fmt, minutesSince, num } from '../logic/util';
import type { PageContext } from '../pages/context';

export function airingSheet(ctx: PageContext) {
  const { hass, now } = ctx;
  const a = airingInfo(hass, ctx.rooms, ctx.config, now);
  const start = () => ctx.runScript(ent(ctx.config, 'airing_start'));
  const running = a.active || a.paused;
  const pct = running && a.duration ? Math.max(0, Math.min(100, (a.remaining / a.duration) * 100)) : 100;
  const status = a.paused ? 'pausiert' : a.active ? (a.remaining > 0 ? 'läuft' : 'fertig') : 'bereit';
  const single = a.recommended.length === 1 ? a.recommended[0] : a.openWindows.length === 1 ? a.openWindows[0] : null;

  return sheet({
    title: single ? `Lüften · ${single.name}` : 'Lüften',
    color: '#5ac8fa',
    glow: 'rgba(90,200,250,0.24)',
    iconPath: I.wind,
    iconStroke: '#06202c',
    onClose: ctx.closeSheet,
    body: html`
      <div class="ringcard">
        <span class="ring" style="background: conic-gradient(#5ac8fa 0 ${pct}%, rgba(255,255,255,0.1) ${pct}% 100%)">
          <span class="ring-in">
            <span class="ring-time">${clock(a.remaining)}</span>
            <span class="ring-status">${status}</span>
          </span>
        </span>
        <div class="ring-info">
          <span><span class="muted">Fenster offen</span> <strong>${a.openWindows.length || 'keins'}</strong></span>
          <span><span class="muted">Empfohlen</span> <strong>${a.recommended.length ? `${a.recommended.length} ${a.recommended.length === 1 ? 'Raum' : 'Räume'}` : 'keiner'}</strong></span>
        </div>
      </div>

      ${a.openWindows.length
        ? html`
          <div class="section-head"><h2>Offene Fenster</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${a.openWindows.map((r) => html`<span class="chip open">${icon(I.window, 14, '#ff8a80', 2.4)}${r.name}
              <span class="chip-meta">${durationText(minutesSince(hass, r.window!, now))}</span></span>`)}
          </div>`
        : nothing}

      ${a.recommended.length
        ? html`
          <div class="section-head"><h2>Lüften empfohlen</h2><span class="rule" aria-hidden="true"></span></div>
          <div class="chips">
            ${a.recommended.map((r) => {
              const h = num(hass, r.humidity);
              return html`<span class="chip rec">${icon(IC.drop, 14, '#8fd8ff', 2.4)}${r.name}${h !== null ? html`<span class="chip-meta">${fmt(Math.round(h))} %</span>` : nothing}</span>`;
            })}
          </div>`
        : nothing}

      ${running
        ? html`<div class="confirm-row" style="margin-top:4px">
            <button class="btn" @click=${start}>Neu starten</button>
            <button class="btn primary" style="background:#5ac8fa;color:#06202c"
              @click=${() => ctx.call('timer', 'cancel', {}, { entity_id: ent(ctx.config, 'airing_timer') })}>Stopp</button>
          </div>`
        : html`<button class="btn primary" style="background:#5ac8fa;color:#06202c;margin-top:4px"
            @click=${start}>Lüften starten</button>`}
    `,
  });
}

export const airingStyles = css`
  .ringcard {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 34px;
    background: rgba(90, 200, 250, 0.1);
  }
  .ring {
    flex-shrink: 0;
    width: 112px;
    height: 112px;
    border-radius: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ring-in {
    width: 92px;
    height: 92px;
    border-radius: 46px;
    background: var(--sd-sheet);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .ring-time {
    font-size: 26px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .ring-status {
    font-size: 11px;
    color: #8fd8ff;
  }
  .ring-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
  }
  .muted {
    color: var(--sd-muted);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 12px 0 10px;
    border-radius: 19px;
    font-size: 13px;
    font-weight: 600;
  }
  .chip.open {
    background: rgba(255, 69, 58, 0.16);
  }
  .chip.rec {
    background: rgba(90, 200, 250, 0.16);
  }
  .chip-meta {
    font-weight: 400;
    color: var(--sd-muted);
  }
`;
