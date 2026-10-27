import { css, html, nothing } from 'lit';
import { icon } from '../components/ui';
import { deviceIcon, I } from '../icons';
import { watts } from '../logic/devices';
import { batteryNote, consumers, energyCost, energyHeadline, energyNow, energyToday, gridTariff, houseSources, type BatteryCoupling, type Consumer, type EnergyNow } from '../logic/energy';
import { fmt } from '../logic/util';
import type { PageContext } from './context';

const E = {
  pylon: 'M12 2 6 22M12 2l6 20M8 9h8M7 14h10',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  question: 'M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.5V14M12 18h.01',
  battery: 'M3 8h15a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM21 11v2',
};

const IDLE = 5;
const kwh = (v: number) => `${fmt(v, 1)} kWh`;
const eur = (v: number) => `${fmt(v, 2)} €`;

function consumerIcon(c: Consumer): string {
  if (c.untracked) return E.question;
  if (/netzwerk|nas|server|router|switch|rack/i.test(c.name)) return E.server;
  return deviceIcon(c.id, c.name);
}

/** Line between two flow nodes; `dir` is the direction energy flows (or null when idle). */
/** Vertical link between house and battery: 'up' = battery feeds the house, 'down' = it charges. */
function batteryLine(color: string, dir: 'up' | 'down' | null) {
  if (!dir) return html`<div class="vline idle" style="border-color:${color}4d" aria-hidden="true"></div>`;
  return html`<div class="vline live ${dir}" style="--c:${color}" aria-hidden="true"><span class="dashes"></span><span class="arrow"></span></div>`;
}

function flowLine(color: string, dir: 'left' | 'right' | null) {
  if (!dir) return html`<div class="fline idle" style="border-color:${color}4d" aria-hidden="true"></div>`;
  return html`<div class="fline live ${dir}" style="--c:${color}" aria-hidden="true"><span class="dashes"></span><span class="arrow"></span></div>`;
}

type Chart = (key: string, name?: string) => void;
type Battery = NonNullable<EnergyNow['battery']>;

/** PV — Haus — Netz with the battery below the house (PV and battery each feed the house). */
function classicFlow(ctx: PageContext, now: EnergyNow, chart: Chart) {
  const exporting = now.export > now.import;
  const gridW = exporting ? now.export : now.import;
  const gridColor = exporting ? '#64d2ff' : '#ff9f0a';
  const bat = now.battery;
  return html`
        <div class="frow">
          <button class="node" aria-label="PV ${watts(now.pv)}, Verlauf anzeigen" @click=${() => chart('pv')}>
            <span class="circle" style="width:48px;height:48px;background:rgba(255,214,10,${now.pv > IDLE ? 0.32 : 0.18})">${icon(I.sun, 22, '#ffd60a', 2)}</span>
            <span class="nv">${watts(now.pv)}</span><span class="nl">PV</span>
          </button>
          ${flowLine('#ffd60a', now.pv > IDLE ? 'right' : null)}
          <button class="node" aria-label="Haus ${watts(now.house)}, Verbrauch anzeigen" @click=${() => chart('house')}>
            <span class="house">${icon(I.home, 22, '#101218', 2.2)}<span>${watts(now.house)}</span></span>
            <span class="nl">Haus</span>
          </button>
          ${flowLine(gridColor, gridW > IDLE ? (exporting ? 'right' : 'left') : null)}
          <button class="node" aria-label="Netz ${watts(gridW)}, Verlauf anzeigen" @click=${() => chart(exporting ? 'export' : 'import')}>
            <span class="circle" style="width:48px;height:48px;background:${gridW > IDLE ? gridColor : 'rgba(255,255,255,0.12)'}">${icon(E.pylon, 22, gridW > IDLE ? '#1a1206' : '#fff', 2.2)}</span>
            <span class="nv">${watts(gridW)}</span><span class="nl">${exporting ? 'Einspeisung' : 'Bezug'}</span>
          </button>
        </div>
        ${bat
          ? html`<button class="bnode" aria-label="Akku, geladene und entladene Energie anzeigen" @click=${() => ctx.openSheet({ id: 'energyChart', key: 'battery', range: '7d' })}>
              ${batteryLine('#30d158', bat.power > IDLE ? 'up' : bat.power < -IDLE ? 'down' : null)}
              <span class="bring" style="--soc:${Math.max(0, Math.min(100, bat.soc ?? 0))}%" role="img"
                aria-label="Akku${bat.soc !== null ? ` ${fmt(bat.soc)} %` : ''}">
                <span class="circle" style="width:44px;height:44px;background:${Math.abs(bat.power) > IDLE ? '#30d158' : '#1d2a22'}">${icon(E.battery, 20, Math.abs(bat.power) > IDLE ? '#0b1a10' : '#7ee8a0', 2.2)}</span>
              </span>
              <span class="nv">${Math.abs(bat.power) > IDLE ? watts(Math.abs(bat.power)) : '0 W'}</span>
              <span class="nl">${bat.power > IDLE ? 'Akku liefert' : bat.power < -IDLE ? 'Akku lädt' : 'Akku'}${bat.soc !== null ? ` · ${fmt(bat.soc)} %` : ''}${Math.abs(bat.power) <= IDLE && batteryNote(bat, ctx.config.battery) ? ` · ${batteryNote(bat, ctx.config.battery)}` : ''}</span>
            </button>`
          : nothing}`;
}

/** Battery state under the Akku node: charging, delivering from storage, or idle. */
function batteryState(c: BatteryCoupling, bat: Battery, ctx: PageContext): string {
  if (c.charge > IDLE) return `lädt ${watts(c.charge)}`;
  if (c.fromBattery > IDLE) return `liefert ${watts(c.fromBattery)}`;
  return batteryNote(bat, ctx.config.battery) || 'ruht';
}

/** PV behind the battery: the house split by source, then the chain PV → Akku → Haus ↔ Netz. */
function sourcesFlow(ctx: PageContext, now: EnergyNow, c: BatteryCoupling, bat: Battery, chart: Chart) {
  const src = houseSources(now);
  const total = Math.max(1, src.pv + src.battery + src.grid);
  const pct = (v: number) => `${(v / total) * 100}%`;
  const exporting = now.export > now.import;
  const gridW = exporting ? now.export : now.import;
  const gridColor = exporting ? '#64d2ff' : '#ff9f0a';
  const live = c.charge > IDLE || c.fromBattery > IDLE;
  const part = (label: string, color: string, v: number) =>
    html`<div class="spart"><span class="nl"><i class="dot" style="background:${color}"></i>${label}</span><span class="nv">${watts(v)}</span></div>`;
  const link = (color: string, on: boolean, dir: 'right' | 'left' = 'right') =>
    html`<div class="clink ${on ? `live ${dir}` : 'idle'}" style="--c:${color}" aria-hidden="true"><span class="dashes"></span></div>`;
  return html`
    <div class="shead">
      <span class="nl">Haus jetzt</span>
      <button class="hv" aria-label="Haus ${watts(now.house)}, Verbrauch anzeigen" @click=${() => chart('house')}>${watts(now.house)}</button>
    </div>
    <div class="sbar" role="img" aria-label="Sonne ${watts(src.pv)}, Akku ${watts(src.battery)}, Netz ${watts(src.grid)}">
      <span style="width:${pct(src.pv)};background:#ffd60a"></span><span style="width:${pct(src.battery)};background:#30d158"></span><span style="width:${pct(src.grid)};background:#ff9f0a"></span>
    </div>
    <div class="sparts">${part('Sonne', '#ffd60a', src.pv)}${part('Akku', '#30d158', src.battery)}${part('Netz', '#ff9f0a', src.grid)}</div>
    <div class="chain">
      <button class="cnode" aria-label="PV ${watts(now.pv)}, Verlauf anzeigen" @click=${() => chart('pv')}>
        <span class="circle" style="width:40px;height:40px;background:rgba(255,214,10,${now.pv > IDLE ? 0.32 : 0.18})">${icon(I.sun, 19, '#ffd60a', 2)}</span>
        <span class="nv">${watts(now.pv)}</span><span class="nl">PV</span>
      </button>
      ${link('#ffd60a', c.pv > IDLE)}
      <button class="cnode" aria-label="Akku, geladene und entladene Energie anzeigen" @click=${() => ctx.openSheet({ id: 'energyChart', key: 'battery', range: '7d' })}>
        <span class="bring small" style="--soc:${Math.max(0, Math.min(100, bat.soc ?? 0))}%" role="img" aria-label="Akku${bat.soc !== null ? ` ${fmt(bat.soc)} %` : ''}">
          <span class="circle" style="width:34px;height:34px;background:${live ? '#30d158' : '#1d2a22'}">${icon(E.battery, 17, live ? '#0b1a10' : '#7ee8a0', 2.2)}</span>
        </span>
        <span class="nv">${bat.soc !== null ? `${fmt(bat.soc)} %` : '–'}</span><span class="nl">${batteryState(c, bat, ctx)}</span>
      </button>
      ${link('#30d158', c.output > IDLE)}
      <button class="cnode" aria-label="Akku-Ausgang ${watts(c.output)}, Verbrauch anzeigen" @click=${() => chart('house')}>
        <span class="circle" style="width:40px;height:40px;background:#fff">${icon(I.home, 19, '#101218', 2.2)}</span>
        <span class="nv">${watts(c.output)}</span><span class="nl">ins Haus</span>
      </button>
      ${link(gridColor, gridW > IDLE, exporting ? 'right' : 'left')}
      <button class="cnode" aria-label="Netz ${watts(gridW)}, Verlauf anzeigen" @click=${() => chart(exporting ? 'export' : 'import')}>
        <span class="circle" style="width:40px;height:40px;background:${gridW > IDLE ? gridColor : 'rgba(255,255,255,0.12)'}">${icon(E.pylon, 19, gridW > IDLE ? '#1a1206' : '#fff', 2.2)}</span>
        <span class="nv">${watts(gridW)}</span><span class="nl">${exporting ? 'Einspeisung' : 'Bezug'}</span>
      </button>
    </div>`;
}

/** Consumers shown before "Alle anzeigen". */
const SHOWN = 6;

export function renderEnergy(ctx: PageContext) {
  const { hass, config } = ctx;
  const energy = ctx.energy();
  const now = energyNow(hass, config, energy.prefs);
  const today = energyToday(hass, config, energy.today);
  const cost = energy.prefs ? energyCost(gridTariff(energy.prefs), today, energy.today?.cost !== undefined
    ? { cost: energy.today.cost, compensation: energy.today.compensation ?? 0 } : undefined) : null;
  const all = consumers(hass, config, 100, energy.prefs);
  const top = ctx.consumersAll ? all : all.slice(0, SHOWN);
  const chart = (key: string, name?: string) => ctx.openSheet({ id: 'energyChart', key, range: '24h', name });
  const max = Math.max(1, ...top.map((c) => c.value));
  const bat = now.battery;
  const coupled = now.coupled;

  return html`
    <div class="energy">
      <header class="ehead">
        <div class="date">${energyHeadline(ctx.now, now)}</div>
        <h1>Energie</h1>
      </header>

      <div class="flow">
        ${coupled && bat ? sourcesFlow(ctx, now, coupled, bat, chart) : classicFlow(ctx, now, chart)}
        <button class="elink" @click=${() => ctx.navigate('/energy')}>Energie-Dashboard ›</button>
      </div>

      <div class="section-head">
        <h2>Heute</h2><span class="rule" aria-hidden="true"></span>
        <span class="meta">ca. ${kwh(today.consumed)} verbraucht</span>
      </div>
      <div class="tiles">
        ${[
          { k: 'pv', v: today.pv, l: 'PV erzeugt', c: '#ffd60a' },
          { k: 'import', v: today.import, l: 'Netzbezug', c: '#ff9f0a' },
          { k: 'export', v: today.export, l: 'Eingespeist', c: '#64d2ff' },
        ].map((t) => html`<button class="tile" aria-label="${t.l} ${kwh(t.v)}, Verlauf anzeigen" @click=${() => chart(t.k)}>
          <span class="tdot" style="background:${t.c}"></span><span class="tv">${kwh(t.v)}</span><span class="tl">${t.l}</span></button>`)}
      </div>
      ${cost
        ? html`<div class="tiles">
            ${[
              { v: cost.cost, l: 'Stromkosten', c: '#ff9f0a' },
              { v: cost.compensation, l: 'Vergütung', c: '#64d2ff' },
              ...(cost.saved !== null ? [{ v: cost.saved, l: 'Gespart (PV & Akku)', c: '#7ee8a0' }] : []),
            ].map((t) => html`<button class="tile" aria-label="${t.l} ${eur(t.v)}, Verlauf anzeigen" @click=${() => chart('cost')}>
              <span class="tdot" style="background:${t.c}"></span><span class="tv">${eur(t.v)}</span><span class="tl">${t.l}</span></button>`)}
          </div>`
        : nothing}

      ${today.consumed > 0
        ? html`<div class="split">
            ${splitBar('Woher kam der Strom?', today.autarky !== null ? `${today.autarky} % autark` : '', '#7ee8a0',
              [today.local, '#ffd60a', `PV & Akku ${kwh(today.local)}`], [today.import, '#ff9f0a', `Netz ${kwh(today.import)}`],
              () => chart('autarky'))}
            ${today.pv > 0
              ? splitBar('Wohin ging der Solarstrom?', `${today.selfUse} % selbst genutzt`, '#ffe066',
                  [Math.max(0, today.pv - today.export), '#ffd60a', `Haus ${kwh(Math.max(0, today.pv - today.export))}`],
                  [today.export, '#64d2ff', `Eingespeist ${kwh(today.export)}`], () => chart('selfuse'))
              : html`<div class="nopv">Heute noch kein Solarstrom.</div>`}
          </div>`
        : nothing}

      <div class="section-head"><h2>Aktuell</h2><span class="rule" aria-hidden="true"></span></div>
      ${top.length
        ? top.map((c) => html`
            <button class="cons" aria-label="${c.name} ${watts(c.value)}, Verlauf anzeigen" @click=${() => chart(c.id, c.name)}>
              <span class="cbar" style="width:${Math.round((c.value / max) * 100)}%" aria-hidden="true"></span>
              <span class="circle" style="width:36px;height:36px;background:rgba(255,255,255,0.12)">${icon(consumerIcon(c), 16, '#fff', 2)}</span>
              <span class="cname ellipsis">${c.name}</span>
              <span class="cval">${watts(c.value)}</span>
            </button>`)
        : html`<div class="nopv">Keine Messwerte.</div>`}
      ${all.length > SHOWN
        ? html`<button class="cmore" @click=${() => ctx.setConsumersAll(!ctx.consumersAll)}>
            ${ctx.consumersAll ? 'Weniger anzeigen' : `Alle anzeigen (${all.length})`}</button>`
        : nothing}
    </div>
  `;
}

function splitBar(title: string, badge: string, badgeColor: string, a: [number, string, string], b: [number, string, string], onTap: () => void) {
  const total = a[0] + b[0] || 1;
  const pa = Math.round((a[0] / total) * 100);
  return html`<button class="sbtn" aria-label="${title} ${badge}, Verlauf anzeigen" @click=${onTap}>
    <div class="shead"><span>${title}</span><span style="color:${badgeColor}">${badge}</span></div>
    <div class="sbar" role="img" aria-label="${a[2]}, ${b[2]}"><span style="width:${pa}%;background:${a[1]}"></span><span style="width:${100 - pa}%;background:${b[1]}"></span></div>
    <div class="slegend"><span>${a[2]}</span><span>${b[2]}</span></div>
  </button>`;
}

export const energyStyles = css`
  .energy {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ehead {
    padding: 0 6px 4px;
  }
  .ehead h1 {
    margin-top: 2px;
    font-size: 30px;
    font-weight: 700;
  }
  .flow {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 12px 12px;
    border-radius: 34px;
    background: rgba(255, 255, 255, 0.06);
  }
  .frow {
    display: grid;
    grid-template-columns: 70px minmax(0, 1fr) 86px minmax(0, 1fr) 70px;
    align-items: center;
  }
  .node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .nv {
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }
  .nl {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
  }
  .house {
    width: 78px;
    height: 78px;
    border-radius: 39px;
    background: #fff;
    color: #101218;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 700;
  }
  .fline {
    position: relative;
    margin: 0 4px 34px;
  }
  .fline.idle {
    height: 0;
    border-top: 3px dotted;
  }
  .fline.live {
    height: 4px;
  }
  /* Dashes move with a GPU transform (one 16 px period per cycle), so they stay smooth. */
  .dashes {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 2px;
  }
  .dashes::before {
    content: '';
    position: absolute;
    inset: 0 -16px;
    background: repeating-linear-gradient(90deg, var(--c) 0 10px, transparent 10px 16px);
    animation: dash-x 1s linear infinite;
    will-change: transform;
  }
  .left > .dashes::before {
    animation-direction: reverse;
  }
  .vline .dashes::before {
    inset: -16px 0;
    background: repeating-linear-gradient(180deg, var(--c) 0 10px, transparent 10px 16px);
    animation-name: dash-y;
  }
  .vline.up > .dashes::before {
    animation-direction: reverse;
  }
  .fline .arrow {
    position: absolute;
    top: -6px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }
  .fline.right .arrow {
    right: -2px;
    border-left: 10px solid var(--c);
  }
  .fline.left .arrow {
    left: -2px;
    border-right: 10px solid var(--c);
  }
  @keyframes dash-x {
    from {
      transform: translateX(-16px);
    }
    to {
      transform: translateX(0);
    }
  }
  @keyframes dash-y {
    from {
      transform: translateY(-16px);
    }
    to {
      transform: translateY(0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .dashes::before {
      animation: none;
    }
  }
  .bnode {
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-top: -6px;
  }
  .bring {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    border-radius: 27px;
    background: conic-gradient(#30d158 var(--soc), rgba(255, 255, 255, 0.12) 0);
  }
  .vline {
    position: relative;
    width: 4px;
    height: 26px;
    margin-bottom: 4px;
  }
  .vline.idle {
    width: 0;
    border-left: 3px dotted;
  }

  .vline .arrow {
    position: absolute;
    left: -6px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
  }
  .vline.up .arrow {
    top: -6px;
    border-bottom: 10px solid var(--c);
  }
  .vline.down .arrow {
    bottom: -6px;
    border-top: 10px solid var(--c);
  }

  .shead {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0 6px;
  }
  .shead .nl {
    font-size: 13px;
  }
  .hv {
    font-size: 24px;
    font-weight: 700;
  }
  .sbar {
    display: flex;
    height: 20px;
    margin: 0 4px;
    border-radius: 10px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
  }
  .sbar span {
    transition: width 0.6s ease;
  }
  .sparts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .spart {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.05);
  }
  .spart .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    margin-right: 6px;
  }
  .chain {
    display: flex;
    align-items: flex-start;
    gap: 2px;
    padding: 10px 8px 8px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.04);
  }
  .cnode {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 0;
    flex: 0 0 auto;
  }
  .cnode .nl {
    font-size: 10px;
    white-space: nowrap;
  }
  .bring.small {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
  .clink {
    position: relative;
    flex: 1;
    min-width: 12px;
    height: 4px;
    margin-top: 18px;
  }
  .clink.idle {
    height: 0;
    border-top: 3px dotted color-mix(in srgb, var(--c) 30%, transparent);
  }
  .cmore {
    align-self: center;
    height: 36px;
    padding: 0 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 13px;
    font-weight: 600;
  }
  .elink {
    align-self: flex-end;
    height: 32px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    padding-right: 6px;
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .tile {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.07);
  }
  .tdot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    margin-bottom: 4px;
  }
  .tv {
    font-size: 18px;
    font-weight: 700;
    white-space: nowrap;
  }
  .tl {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.72);
  }
  .split {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.06);
  }
  .sbtn {
    display: block;
    width: 100%;
    text-align: left;
  }
  .shead {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .sbar {
    display: flex;
    height: 14px;
    border-radius: 7px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.08);
  }
  .slegend {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.72);
    margin-top: 4px;
  }
  .nopv {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    padding: 0 4px;
  }
  .cons {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 14px 0 6px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.07);
    overflow: hidden;
  }
  .cbar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: rgba(255, 159, 10, 0.18);
    border-radius: 24px;
  }
  .cons .circle,
  .cname,
  .cval {
    position: relative;
  }
  .cname {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
  }
  .cval {
    font-size: 14px;
    font-weight: 700;
  }
`;
