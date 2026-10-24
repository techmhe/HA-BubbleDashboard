import { css, html } from 'lit';
import { icon, sheet } from '../components/ui';
import { I, IC } from '../icons';
import { allRoomsSelection, floorGroups } from '../logic/climate';
import { ent } from '../logic/entities';
import { fmt } from '../logic/util';
import type { PageContext } from '../pages/context';

export const DURATIONS = ['Dauerhaft', '1 h', '2 h', '4 h'];
const MIN = 7;
const MAX = 25;

export async function applyAllRooms(ctx: PageContext) {
  const s = ctx.allRooms;
  const c = ctx.config;
  await ctx.call('input_number', 'set_value', { value: s.temp }, { entity_id: ent(c, 'all_rooms_temperature') });
  await ctx.call('input_text', 'set_value', { value: allRoomsSelection(ctx.rooms, s.selected) }, { entity_id: ent(c, 'all_rooms_selection') });
  await ctx.call('input_select', 'select_option', { option: s.duration }, { entity_id: ent(c, 'all_rooms_duration') });
  await ctx.runScript(ent(c, 'all_rooms_apply'));
}

export function allRoomsSheet(ctx: PageContext) {
  const s = ctx.allRooms;
  const floors = floorGroups(ctx.hass, ctx.rooms);
  const setTemp = (d: number) => ctx.setAllRooms({ temp: Math.min(MAX, Math.max(MIN, Math.round((s.temp + d) * 2) / 2)) });
  const toggle = (slug: string) => {
    const next = new Set(s.selected);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    ctx.setAllRooms({ selected: next });
  };
  const count = s.selected.size;
  return sheet({
    title: 'Alle Räume einstellen',
    color: '#ffffff',
    glow: 'rgba(255,159,10,0.2)',
    iconPath: IC.tune,
    iconStroke: '#101218',
    onClose: ctx.closeSheet,
    body: html`
      <div class="arcontrol">
        <button class="bigstep" aria-label="Senken" @click=${() => setTemp(-0.5)}>−</button>
        <div style="text-align:center">
          <div class="arbig">${fmt(s.temp, 1)}°</div>
          <div class="arsub">Soll für ${count} ${count === 1 ? 'Raum' : 'Räume'}</div>
        </div>
        <button class="bigstep" aria-label="Erhöhen" @click=${() => setTemp(0.5)}>+</button>
      </div>

      <div class="section-head">
        <h2 style="font-size:14px">Räume</h2>
        <span class="rule" aria-hidden="true"></span>
        ${floors.filter((f) => f.id).map((f) => html`<button class="mini"
          @click=${() => ctx.setAllRooms({ selected: new Set(f.rooms.map((r) => r.slug)) })}>nur ${f.short}</button>`)}
        <button class="mini" @click=${() => ctx.setAllRooms({ selected: new Set(ctx.rooms.map((r) => r.slug)) })}>alle</button>
      </div>
      <div class="chips">
        ${ctx.rooms.map((r) => {
          const on = s.selected.has(r.slug);
          return html`<button class="rchip ${on ? 'on' : ''}" aria-pressed=${on} @click=${() => toggle(r.slug)}>
            ${on ? icon(I.check, 14, '#ffc061', 2.8) : ''}${r.name}</button>`;
        })}
      </div>

      <div class="section-head"><h2 style="font-size:14px">Wie lange</h2><span class="rule" aria-hidden="true"></span></div>
      <div class="durations" role="radiogroup" aria-label="Dauer">
        ${DURATIONS.map((d) => html`<button role="radio" aria-checked=${s.duration === d} class=${s.duration === d ? 'sel' : ''}
          @click=${() => ctx.setAllRooms({ duration: d })}>${d}</button>`)}
      </div>

      <button class="btn primary apply" ?disabled=${count === 0}
        @click=${async () => { await applyAllRooms(ctx); ctx.closeSheet(); }}>Übernehmen</button>
    `,
  });
}

export const allRoomsStyles = css`
  .arcontrol {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-radius: 34px;
    background: linear-gradient(140deg, rgba(255, 159, 10, 0.28), rgba(255, 255, 255, 0.05) 70%);
  }
  .arbig {
    font-size: 60px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .arsub {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 4px;
  }
  .mini {
    height: 28px;
    padding: 0 10px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 11px;
    font-weight: 600;
  }
  .rchip {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 12px;
    border-radius: 19px;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.75);
    font-size: 13px;
    font-weight: 600;
  }
  .rchip.on {
    padding-left: 8px;
    background: rgba(255, 159, 10, 0.22);
    color: #ffd29a;
  }
  .durations {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
  }
  .durations button {
    height: 44px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .durations button.sel {
    background: #fff;
    color: #101218;
  }
  .apply {
    height: 56px;
    border-radius: 28px;
    background: #ff9f0a;
    color: #1a1206;
    margin-top: 6px;
  }
  .apply:disabled {
    opacity: 0.4;
  }
`;
