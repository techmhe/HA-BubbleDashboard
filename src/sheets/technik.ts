import { css, html, nothing } from 'lit';
import { icon, sheet } from '../components/ui';
import { I, IC } from '../icons';
import { findPrinter, powerLocked, printerState, type Printer, type PrinterState } from '../logic/printer';
import { guestWifi, isTechUser, pihole, services, type GuestWifi, type PiholeState, type ServiceRow, type Services } from '../logic/technik';
import { sinceText, technikProblemCount } from '../logic/technik-now';
import { fmt, state } from '../logic/util';
import type { PageContext } from '../pages/context';

const GREEN = '#30d158';
const RED = '#ff453a';
const YELLOW = '#ffd60a';
const ORANGE = '#ff9f0a';

export function technikHeadline(problems: number): { text: string; alert: boolean } {
  if (!problems) return { text: 'alles in Ordnung', alert: false };
  return { text: `${problems} ${problems === 1 ? 'Meldung' : 'Meldungen'}`, alert: true };
}

function clockSec(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function adBlocker(ctx: PageContext, ph: PiholeState) {
  const target = { entity_id: ph.entity };
  if (ph.kind === 'paused') {
    return html`
      <div class="tk-pause">
        ${icon(IC.clock, 18, YELLOW, 2)}
        <span class="tk-grow">Pausiert noch ${clockSec(ph.remainingSec ?? 0)} min</span>
        <button class="tk-btn" style="background:${YELLOW};color:#2b2200"
          @click=${() => { ctx.call('switch', 'turn_on', {}, target); ctx.setPiholePause(undefined); }}>Fortsetzen</button>
      </div>`;
  }
  if (ph.kind === 'off') {
    return html`
      <div class="tk-row tk-alert">
        <span class="circle" style="width:42px;height:42px;background:${RED}">${icon(I.shieldOff, 18, '#1f0606', 2.2)}</span>
        <span class="tk-grow"><span class="tk-title">Werbeblocker aus</span>
          <span class="tk-sub">Pi-hole · seit ${sinceText(ph.offSince ?? ctx.now.getTime(), ctx.now)}</span></span>
        <button class="tk-btn" style="background:${RED};color:#1f0606" @click=${() => ctx.call('switch', 'turn_on', {}, target)}>Einschalten</button>
      </div>`;
  }
  const pause = (duration: string, ms: number) => () => {
    ctx.call('pi_hole', 'disable', { duration }, target);
    ctx.setPiholePause(ctx.now.getTime() + ms);
  };
  return html`
    <div class="tk-card tk-ok">
      <span class="tk-line">
        <span class="circle" style="width:40px;height:40px;background:${GREEN}">${icon(I.shieldOk, 18, '#06200e', 2.2)}</span>
        <span class="tk-grow"><span class="tk-title">Werbeblocker an</span>
          <span class="tk-sub">${ph.percent !== undefined ? `heute ${fmt(ph.percent)} % aller Anfragen blockiert` : 'Pi-hole'}</span></span>
      </span>
      <div class="tk-two">
        <button class="tk-btn soft" @click=${pause('00:05:00', 5 * 60_000)}>5 min pausieren</button>
        <button class="tk-btn soft" @click=${pause('01:00:00', 3600_000)}>1 h pausieren</button>
      </div>
    </div>`;
}

const KIND_COLOR: Record<ServiceRow['kind'], [string, string, string]> = {
  down: [RED, 'rgba(255,69,58,0.25)', '#ff8a80'],
  pending: [YELLOW, 'rgba(255,214,10,0.2)', '#ffe680'],
  cert: [ORANGE, 'rgba(255,159,10,0.2)', '#ffc061'],
  ok: [GREEN, 'rgba(48,209,88,0.18)', 'rgba(255,255,255,0.6)'],
};

function serviceRow(r: ServiceRow) {
  const [c, glow, tc] = KIND_COLOR[r.kind];
  const text = r.kind === 'ok' && r.members ? `${r.members} Monitore` : r.text;
  return html`
    <div class="tk-srv">
      <span class="tk-dot" style="background:${c};box-shadow:0 0 0 3px ${glow}"></span>
      <span class="tk-sn ellipsis">${r.name}</span>
      <span class="tk-ss" style="color:${tc}">${text}</span>
    </div>`;
}

function serviceCard(ctx: PageContext, s: Services) {
  const open = !!ctx.ui.servicesOpen;
  const toggle = () => ctx.setUi({ servicesOpen: !open });
  const summary = s.problems.length ? `${s.ok.length} weitere erreichbar` : `alle ${s.total} erreichbar`;
  return html`
    <div class="tk-card">
      <span class="tk-cardhead"><span class="tk-grow tk-h">Dienste</span><span class="tk-sub">${s.okMonitors} von ${s.total} ok · Uptime Kuma</span></span>
      ${s.problems.map(serviceRow)}
      ${s.ok.length
        ? html`<button class="tk-srv tk-more" aria-expanded=${open ? 'true' : 'false'} @click=${toggle}>
            <span class="tk-dot" style="background:${GREEN};box-shadow:0 0 0 3px rgba(48,209,88,0.18)"></span>
            <span class="tk-sn ellipsis tk-dim">${summary}</span>
            <span class="tk-chev ${open ? 'open' : ''}">${icon(I.chevron, 14, 'rgba(255,255,255,0.5)', 2.4)}</span>
          </button>
          ${open ? s.ok.map(serviceRow) : nothing}`
        : nothing}
    </div>`;
}

function guestCard(ctx: PageContext, g: GuestWifi) {
  const pic = g.qr ? ctx.hass.states[g.qr]?.attributes.entity_picture : undefined;
  const target = { entity_id: g.entity };
  const clients = g.clients !== undefined ? ` · ${fmt(g.clients)} ${g.clients === 1 ? 'Gerät' : 'Geräte'}` : '';
  return html`
    <div class="tk-card tk-guest">
      ${pic && g.on ? html`<img class="tk-qr" src=${pic} alt="QR-Code Gäste-WLAN" data-entity=${g.qr!} />` : nothing}
      <div class="tk-guest-main">
        <span class="tk-title">Gäste-WLAN</span>
        <span class="tk-state"><span class="tk-dot small" style="background:${g.on ? GREEN : 'rgba(255,255,255,0.35)'}"></span>${g.on ? `an${clients}` : 'aus'}</span>
        ${pic && g.on ? html`<span class="tk-sub">Code scannen zum Verbinden</span>` : nothing}
        <div class="tk-guest-act">
          <button class="tk-btn soft tk-grow" @click=${() => ctx.call('switch', g.on ? 'turn_off' : 'turn_on', {}, target)}>${g.on ? 'Ausschalten' : 'Einschalten'}</button>
          ${g.regenerate
            ? html`<button class="tk-btn soft tk-icon" aria-label="Neues Passwort erzeugen" @click=${() => ctx.confirm({
                title: 'Neues WLAN-Passwort',
                text: 'Das Gäste-WLAN bekommt ein neues Passwort. Verbundene Gäste müssen den neuen Code scannen.',
                confirm: 'Erzeugen', color: GREEN, iconPath: I.wifi,
                onConfirm: () => ctx.call('button', 'press', {}, { entity_id: g.regenerate! }),
              })}>${icon(I.refresh, 16, '#fff', 2.2)}</button>`
            : nothing}
        </div>
      </div>
    </div>`;
}

/** Round plug button used in the Technik row and the printer sheet. */
export function powerButton(ctx: PageContext, p: Printer, s: PrinterState, cls = '') {
  if (!p.plug) return nothing;
  const on = state(ctx.hass, p.plug) === 'on';
  const locked = on && powerLocked(ctx.hass, p, s);
  const target = { entity_id: p.plug };
  const tap = () => {
    if (locked) return;
    if (!on) return ctx.call('switch', 'turn_on', {}, target);
    ctx.confirm({
      title: '3D-Drucker ausschalten', text: 'Die Steckdose des Druckers wird ausgeschaltet.', confirm: 'Ausschalten',
      color: RED, iconPath: I.power, onConfirm: () => ctx.call('switch', 'turn_off', {}, target),
    });
  };
  const label = locked ? 'Ausschalten gesperrt' : on ? 'Drucker ausschalten' : 'Drucker einschalten';
  return html`
    <button class="tk-power ${cls} ${locked ? 'locked' : ''} ${on ? 'on' : 'off'}" aria-label=${label} ?disabled=${locked} @click=${tap}>
      ${icon(I.power, 16, locked ? 'rgba(255,255,255,0.4)' : on ? '#fff' : '#7ee8a0', 2.4)}
      ${locked ? html`<span class="tk-lock">${icon(I.lock, 10, '#ffc061', 2.4)}</span>` : nothing}
    </button>`;
}

function printerRow(ctx: PageContext, p: Printer, s: PrinterState) {
  return html`
    <div class="tk-row tk-printer">
      <button class="tk-grow tk-line" @click=${() => ctx.openSheet({ id: 'printer' })}>
        <span class="circle" style="width:40px;height:40px;background:rgba(255,255,255,0.12)">${icon(I.printer, 18, '#fff', 2)}</span>
        <span class="tk-grow"><span class="tk-title">3D-Drucker</span><span class="tk-sub">${s.status}</span></span>
      </button>
      ${powerButton(ctx, p, s)}
    </div>`;
}

export function technikSheet(ctx: PageContext) {
  const { hass, config, now } = ctx;
  if (!isTechUser(hass, config)) return nothing;
  const item = { dismissed: ctx.dismissed, pauseUntil: ctx.piholePause };
  const head = technikHeadline(technikProblemCount(hass, config, now, item));
  const ph = pihole(hass, config, now, ctx.piholePause);
  const svc = services(hass, config, now);
  const g = guestWifi(hass, config);
  const p = findPrinter(hass, config);
  const ps = p ? printerState(hass, p, now, ctx.dismissed) : undefined;
  return sheet({
    title: 'Technik',
    subtitle: head.text,
    color: head.alert ? RED : GREEN,
    glow: head.alert ? 'rgba(255,69,58,0.2)' : 'rgba(48,209,88,0.16)',
    iconPath: I.server,
    iconStroke: head.alert ? '#1f0606' : '#06200e',
    onClose: ctx.closeSheet,
    body: html`
      ${ph ? adBlocker(ctx, ph) : nothing}
      ${svc.total ? serviceCard(ctx, svc) : nothing}
      ${g ? guestCard(ctx, g) : nothing}
      ${p && ps ? printerRow(ctx, p, ps) : nothing}
    `,
  });
}

export const technikStyles = css`
  .tk-grow { flex: 1; min-width: 0; }
  .tk-title { display: block; font-size: 15px; font-weight: 700; }
  .tk-sub { display: block; font-size: 12px; color: rgba(255, 255, 255, 0.72); }
  .tk-h { font-size: 14px; font-weight: 600; }
  .tk-line { display: flex; align-items: center; gap: 10px; text-align: left; }
  .tk-row { display: flex; align-items: center; gap: 10px; min-height: 60px; padding: 0 8px; border-radius: 30px; background: rgba(255, 255, 255, 0.06); }
  .tk-alert { border: 1px solid rgba(255, 69, 58, 0.4); background: linear-gradient(90deg, rgba(255, 69, 58, 0.22), rgba(255, 69, 58, 0.05)); }
  .tk-card { display: flex; flex-direction: column; gap: 2px; padding: 12px 14px; border-radius: 28px; background: rgba(255, 255, 255, 0.06); }
  .tk-ok { gap: 10px; padding: 14px; background: linear-gradient(90deg, rgba(48, 209, 88, 0.18), rgba(255, 255, 255, 0.05) 80%); }
  .tk-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .tk-btn { height: 40px; padding: 0 14px; border-radius: 20px; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .tk-btn.soft { background: rgba(255, 255, 255, 0.12); color: #fff; }
  .tk-btn.tk-icon { width: 40px; padding: 0; display: flex; align-items: center; justify-content: center; }
  .tk-pause { display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 14px; border-radius: 26px; background: rgba(255, 214, 10, 0.1); font-size: 13px; }
  .tk-pause .tk-btn { height: 34px; }
  .tk-cardhead { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .tk-srv { display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 4px; width: 100%; text-align: left; }
  .tk-dot { width: 9px; height: 9px; border-radius: 5px; flex-shrink: 0; }
  .tk-dot.small { width: 8px; height: 8px; box-shadow: none; }
  .tk-sn { flex: 1; min-width: 0; font-size: 13px; font-weight: 600; }
  .tk-dim { font-weight: 500; color: rgba(255, 255, 255, 0.75); }
  .tk-ss { flex-shrink: 0; font-size: 12px; }
  .tk-chev { transition: transform 0.2s; }
  .tk-chev.open { transform: rotate(180deg); }
  .tk-guest { flex-direction: row; gap: 14px; align-items: stretch; padding: 14px; }
  .tk-qr { width: 116px; height: 116px; flex-shrink: 0; padding: 8px; border-radius: 16px; background: #fff; image-rendering: pixelated; }
  .tk-guest-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .tk-state { display: flex; align-items: center; gap: 6px; font-size: 13px; }
  .tk-guest-act { display: flex; gap: 6px; margin-top: auto; }
  .tk-guest-act .tk-btn { height: 36px; font-size: 12px; }
  .tk-printer { min-height: 56px; border-radius: 28px; }
  .tk-power { position: relative; width: 40px; height: 40px; flex-shrink: 0; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.12); }
  .tk-power.off { background: rgba(48, 209, 88, 0.18); }
  .tk-power.locked { background: rgba(255, 255, 255, 0.05); cursor: default; }
  .tk-lock { position: absolute; right: -1px; bottom: -1px; width: 16px; height: 16px; border-radius: 8px; background: #181a22; display: flex; align-items: center; justify-content: center; }
`;
