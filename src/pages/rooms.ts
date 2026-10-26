import { css, html, nothing } from 'lit';
import { hold } from '../components/hold';
import { deviceGlyph } from '../components/motion';
import { icon, mdi, SCENE_COLORS } from '../components/ui';
import { I, IC, roomIcon } from '../icons';
import { temp } from '../logic/climate';
import { lightTint, watts, type DeviceInfo, type SceneInfo } from '../logic/devices';
import { applyRoomsFilter, roomsFilters, roomsHeader, roomsView, type RoomView } from '../logic/rooms-page';
import { num } from '../logic/util';
import { toggleDevice } from '../sheets/device';
import type { PageContext } from './context';
import { activeScenes } from '../logic/devices';

const circ = (bg: string, size: number) => `width:${size}px;height:${size}px;background:${bg}`;

export function renderRooms(ctx: PageContext) {
  const { hass } = ctx;
  const views = roomsView(hass, ctx.config, ctx.rooms);
  const filters = roomsFilters(hass, views);
  const filter = filters.some((f) => f.id === ctx.roomsFilter) ? ctx.roomsFilter : 'all';
  const shown = applyRoomsFilter(views, filter);
  const lightsOn = views.flatMap((v) => v.devices.filter((d) => d.on && d.kind === 'light').map((d) => d.id));

  return html`
    <div class="rooms">
      <header class="rhead">
        <div>
          <div class="date">${roomsHeader(views)}</div>
          <h1>Räume</h1>
        </div>
        <button class="lightsoff" ?disabled=${!lightsOn.length}
          @click=${() => ctx.call('light', 'turn_off', {}, { entity_id: lightsOn })}>
          ${icon(IC.power, 16, '#fff', 2.4)}Licht aus
        </button>
      </header>

      <div class="rfilter" role="tablist" aria-label="Filter" style="grid-template-columns: repeat(${filters.length}, minmax(0, 1fr))">
        ${filters.map((f) => html`<button role="tab" aria-selected=${f.id === filter} class=${f.id === filter ? 'sel' : ''}
          @click=${() => ctx.setRoomsFilter(f.id)}>${f.label}</button>`)}
      </div>

      ${shown.length ? shown.map((v) => roomCard(ctx, v, filter === 'on')) : html`<div class="rempty">Gerade ist nichts an.</div>`}
    </div>
  `;
}

function roomCard(ctx: PageContext, v: RoomView, compact = false) {
  const activeIds = activeScenes(ctx.hass, v.scenes.map((s) => s.id), ctx.sceneConfigs(), ctx.now);
  const { hass } = ctx;
  const { room } = v;
  const t = num(hass, room.temperature);
  const h = num(hass, room.humidity);
  const canOpen = !!room.climate;
  return html`
    <article class="rcard ${v.active ? 'active' : ''} ${compact ? 'compact' : ''}">
      <div class="rtop">
        <span class="circle" style=${circ(v.active ? '#ffd60a' : 'rgba(255,255,255,0.12)', compact ? 32 : 40)}>
          ${icon(roomIcon(room.name, room.icon), 18, v.active ? '#2b2200' : '#fff', 2)}
        </span>
        <span class="rname">
          <h2 class="ellipsis">${room.name}</h2>
          <span class="rsub ellipsis">${v.sub}</span>
        </span>
        ${t !== null || v.power !== null
          ? html`<button class="rpill" ?disabled=${!canOpen} aria-label="${room.name}: Raumkarte öffnen"
              @click=${() => canOpen && ctx.openSheet({ id: 'room', slug: room.slug })}>
              ${t !== null ? html`<span>${temp(t)}°</span>` : nothing}
              ${h !== null ? html`<span class="muted">${Math.round(h)} %</span>` : nothing}
              ${v.power !== null
                ? html`<span class="pw"><svg width="11" height="11" viewBox="0 0 24 24" fill="#ffc061" aria-hidden="true"><path d=${I.bolt}></path></svg>${watts(v.power)}</span>`
                : nothing}
            </button>`
          : nothing}
        ${compact
          ? v.scenes.map((sc) => html`<button class="roff" aria-label="${room.name}: alles aus" title="Alles aus"
              @click=${() => ctx.call('scene', 'turn_on', {}, { entity_id: sc.id })}>${icon(IC.power, 15, '#fff', 2.3)}</button>`)
          : nothing}
      </div>

      ${compact
        ? html`<div class="rgrid">${v.devices.map((d) => deviceTile(ctx, d))}</div>`
        : html`${v.scenes.length
            ? html`<div class="rgrid" role="group" aria-label="Szenen ${room.name}">
                ${v.scenes.map((sc, i) => sceneButton(ctx, sc, i, activeIds))}
              </div>`
            : nothing}
          ${v.devices.length ? html`<div class="rgrid">${v.devices.map((d) => deviceTile(ctx, d))}</div>` : nothing}`}
    </article>
  `;
}

function sceneButton(ctx: PageContext, s: SceneInfo, i: number, activeIds: Set<string>) {
  const bg = s.off ? 'rgba(255,255,255,0.14)' : SCENE_COLORS[i % SCENE_COLORS.length];
  const stroke = s.off ? '#fff' : '#101010';
  const on = activeIds.has(s.id);
  return html`<button class="rscene" aria-pressed=${on} style=${on ? `background:${s.off ? 'rgba(255,255,255,0.2)' : bg + '33'};box-shadow:0 0 18px ${s.off ? 'rgba(255,255,255,0.08)' : bg + '40'}` : ''}
    @click=${() => ctx.call('scene', 'turn_on', {}, { entity_id: s.id })}>
    <span class="circle" style=${circ(bg, 34)}>${s.off ? icon(IC.power, 16, stroke, 2.1) : mdi(s.icon, IC.scene, stroke)}</span>
    <span class="ellipsis">${s.off ? 'Aus' : s.name}</span>
  </button>`;
}

function deviceTile(ctx: PageContext, d: DeviceInfo) {
  const light = d.kind === 'light';
  // Lights take their current colour (or white tone); other devices stay green.
  const lt = light ? lightTint(ctx.hass.states[d.id]?.attributes ?? {}) : null;
  const col = lt ? lt.color : '#30d158';
  const tint = lt ? lt.bg : 'rgba(48,209,88,0.14)';
  const stroke = d.on ? (lt ? lt.icon : '#151005') : d.unavailable ? 'rgba(255,255,255,0.45)' : '#fff';
  return html`<button class="rdev ${d.on ? 'on' : ''} ${d.unavailable ? 'na' : ''}" style=${d.on ? `background:${tint}` : ''}
    aria-label="${d.name}: ${d.tileState}"
    ${hold({ tap: () => toggleDevice(ctx, d.id), hold: () => ctx.openSheet({ id: 'device', entity: d.id }) })}>
    <span class="circle" style=${circ(d.on ? col : 'rgba(255,255,255,0.1)', 32)}>${deviceGlyph(d, ctx.hass.states[d.id]?.attributes, 15, stroke, 2.2)}</span>
    <span class="rdtext">
      <span class="ellipsis rdname">${d.name}</span>
      <span class="rdstate" style="color:${d.on ? (lt ? lt.text : '#9af0b5') : 'rgba(255,255,255,0.55)'}">${d.tileState}</span>
    </span>
  </button>`;
}

export const roomsStyles = css`
  .rooms {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .rhead {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 6px 4px;
  }
  .rhead h1 {
    margin-top: 2px;
    font-size: 30px;
    font-weight: 700;
  }
  .lightsoff {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 44px;
    padding: 0 16px 0 12px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 13px;
    font-weight: 700;
  }
  .lightsoff:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .rfilter {
    display: grid;
    gap: 4px;
    padding: 4px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.06);
  }
  .rfilter button {
    height: 36px;
    border-radius: 18px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .rfilter button.sel {
    background: #fff;
    color: #101218;
  }
  .rempty {
    padding: 18px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.05);
    font-size: 14px;
    color: var(--sd-muted);
    text-align: center;
  }
  .rcard {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.05);
  }
  .rcard.active {
    background: linear-gradient(160deg, rgba(255, 214, 10, 0.14), rgba(255, 255, 255, 0.05) 50%);
  }
  .rcard.compact {
    gap: 8px;
    padding: 8px;
    border-radius: 24px;
  }
  .rcard.compact .rsub {
    display: none;
  }
  .rcard.compact .rdev,
  .rcard.compact .rscene {
    height: 44px;
    border-radius: 22px;
  }
  .roff {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rtop {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .rname {
    flex: 1;
    min-width: 0;
  }
  .rname h2 {
    font-size: 15px;
    font-weight: 600;
  }
  .rsub {
    display: block;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.68);
  }
  .rpill {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 30px;
    padding: 0 10px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.09);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }
  .rpill:disabled {
    cursor: default;
  }
  .rpill .muted {
    color: rgba(255, 255, 255, 0.75);
  }
  .rpill .pw {
    display: flex;
    align-items: center;
    gap: 2px;
    color: #ffc061;
  }
  .rgrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .rscene {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    padding: 0 8px 0 5px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 600;
    min-width: 0;
  }
  .rdev {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 8px 0 6px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.06);
    min-width: 0;
    touch-action: manipulation;
    -webkit-touch-callout: none;
  }
  .rdev.na {
    background: transparent;
    border: 1px dashed rgba(255, 255, 255, 0.22);
  }
  .rdtext {
    min-width: 0;
    text-align: left;
  }
  .rdname {
    display: block;
    font-size: 12px;
    font-weight: 600;
  }
  .rdstate {
    display: block;
    font-size: 11px;
  }
`;
