import { css, html, nothing } from 'lit';
import { personAvatar } from '../components/avatar';
import { icon } from '../components/ui';
import { I } from '../icons';
import { ent } from '../logic/entities';
import { ALARM_MODES, alarmInfo, openings, openingsSummary } from '../logic/security';
import { persons, presenceLabel } from '../logic/persons';
import { friendlyName } from '../logic/util';
import type { PageContext } from './context';

const S = {
  camera: 'M3 7h12v10H3zM15 10l6-3v10l-6-3',
  muted: 'M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6',
  sound: 'M4 9h4l5-4v14l-5-4H4zM17 8a5 5 0 0 1 0 8M19.5 5.5a9 9 0 0 1 0 13',
  full: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
};


function cameraLabel(ctx: PageContext, id: string): string {
  if (ctx.config.names?.[id]) return ctx.config.names[id];
  const name = friendlyName(ctx.hass, id);
  return /doorbell|klingel|haust/i.test(`${id} ${name}`) ? 'Haustür' : name;
}

function fullscreen(ctx: PageContext, e: Event, camera: string) {
  const box = (e.currentTarget as HTMLElement).closest('.cam') as HTMLElement | null;
  if (box?.requestFullscreen) box.requestFullscreen().catch(() => ctx.moreInfo(camera));
  else ctx.moreInfo(camera); // iPhone Safari: no element fullscreen, use HA's dialog
}

export function renderSecurity(ctx: PageContext) {
  const { hass, config } = ctx;
  const alarm = alarmInfo(hass, config, ctx.now);
  const floors = openings(hass, config, ctx.rooms);
  const triggered = alarm.state === 'triggered';
  const accent = triggered ? '#ff453a' : '#bf9bff';
  const camera = ent(config, 'camera');
  const camState = hass.states[camera];
  const motion = hass.states[ent(config, 'camera_motion')];
  const person = hass.states[ent(config, 'camera_person')];
  const muted = ctx.ui.camSound !== true;
  const people = persons(hass, config);
  const streamable = !!camState && camState.state !== 'unavailable' && !!customElements.get('ha-camera-stream');

  return html`
    <div class="security">
      <header class="shead2">
        <div>
          <div class="date">${openingsSummary(floors, alarm.state)}</div>
          <h1>Schutz</h1>
        </div>
        ${people.length
          ? html`<button class="pp-pill" aria-label="Personen: ${presenceLabel(people)}, Karte öffnen"
              @click=${() => ctx.openSheet({ id: 'persons' })}>
              ${people.map((p) => personAvatar(p))}
            </button>`
          : nothing}
      </header>

      ${hass.states[alarm.id]
        ? html`<div class="alarmpill" style="background: linear-gradient(90deg, ${accent}42, rgba(255,255,255,0.05) 70%)">
            <button class="circle abtn" style="width:48px;height:48px;background:${accent}" aria-label="Alarm-Details"
              @click=${() => ctx.openSheet({ id: 'alarm' })}>${icon(I.shield, 22, '#1d1030', 2.2)}</button>
            <span class="atext">
              <span class="atitle">${alarm.label}</span>
              ${alarm.sub ? html`<span class="asub">${alarm.sub}</span>` : nothing}
            </span>
            ${ALARM_MODES.filter((m) => m.state !== alarm.state).map((m) => html`
              <button class="amode" aria-label=${m.name} title=${m.name}
                @click=${() => ctx.call('alarm_control_panel', m.service, {}, { entity_id: alarm.id })}>
                ${icon(I[m.icon], 18, '#e2d3ff', 2.1)}
              </button>`)}
          </div>`
        : nothing}

      ${camState
        ? html`<section class="camcard" aria-label="${cameraLabel(ctx, camera)}-Kamera">
            <div class="cam">
              ${streamable
                ? html`<ha-camera-stream class="stream" .hass=${hass} .stateObj=${camState} .muted=${muted} .controls=${false}
                    allow-exoplayer></ha-camera-stream>`
                : html`<span class="camph">${icon(S.camera, 40, 'rgba(255,255,255,0.4)', 1.6)}</span>`}
              <span class="camlive"><span class="dot" style="background:${streamable ? '#ff453a' : '#888'}"></span>${streamable ? 'Live' : 'Offline'} · ${cameraLabel(ctx, camera)}</span>
              <span class="camtools">
                <button aria-label=${muted ? 'Ton an' : 'Ton aus'} @click=${() => ctx.setUi({ camSound: muted })}>${icon(muted ? S.muted : S.sound, 15, '#fff', 2.2)}</button>
                <button aria-label="Vollbild" @click=${(e: Event) => fullscreen(ctx, e, camera)}>${icon(S.full, 15, '#fff', 2.2)}</button>
              </span>
            </div>
            <div class="camchips">
              ${motion ? html`<span class="cchip ${motion.state === 'on' ? 'hot' : ''}">${motion.state === 'on' ? 'Bewegung erkannt' : 'Keine Bewegung'}</span>` : nothing}
              ${person ? html`<span class="cchip ${person.state === 'on' ? 'hot' : ''}">${person.state === 'on' ? 'Person erkannt' : 'Keine Person'}</span>` : nothing}
              <span class="grow"></span>
              <button class="cchip btn2" @click=${() => ctx.moreInfo(motion ? motion.entity_id : camera)}>Verlauf</button>
            </div>
          </section>`
        : nothing}

      ${floors.length
        ? html`
            <div class="section-head">
              <h2>Fenster &amp; Türen</h2><span class="rule" aria-hidden="true"></span>
              <span class="meta legend"><span><span class="dot" style="background:#30d158"></span>zu</span><span><span class="dot" style="background:#ff453a"></span>offen</span></span>
            </div>
            ${floors.map((f) => html`
              <div class="flabel">${f.name}</div>
              <div class="ogrid">
                ${f.areas.map((a) => html`
                  <div class="opill ${a.items.length > 3 ? 'wide' : ''}">
                    <span class="ellipsis oname">${a.name}</span>
                    <span class="oicons">
                      ${a.items.map((o) => {
                        const label = `${o.title} ${o.unavailable ? 'nicht erreichbar' : o.open ? 'offen' : 'zu'}`;
                        return html`<button class="oicon ${o.open ? 'open' : ''} ${o.unavailable ? 'na' : ''}" title=${label} aria-label=${label}
                          @click=${() => ctx.moreInfo(o.id)}>
                          ${icon(o.kind === 'door' ? I.door : I.window, 15, o.unavailable ? 'rgba(255,255,255,0.45)' : o.open ? '#ffd1cf' : '#7ee8a0', 2.2)}
                        </button>`;
                      })}
                    </span>
                  </div>`)}
              </div>`)}
          `
        : nothing}
    </div>
  `;
}

export const securityStyles = css`
  .security {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .shead2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 0 4px 4px 6px;
  }
  .pp-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 52px;
    padding: 0 6px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
  }
  .pp-av {
    display: block;
    position: relative;
    flex-shrink: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.14);
    box-shadow: 0 0 0 2px #1c1e24;
  }
  .pp-av img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
  .pp-av.out img,
  .pp-av.out .pp-ini {
    opacity: 0.5;
    filter: grayscale(1);
  }
  .pp-ini {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    font-size: 14px;
    font-weight: 700;
  }
  .pp-zone {
    position: absolute;
    right: -3px;
    bottom: -3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    box-shadow: 0 0 0 2px #1c1e24;
  }

  .shead2 h1 {
    margin-top: 2px;
    font-size: 30px;
    font-weight: 700;
  }
  .alarmpill {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 64px;
    padding: 0 8px;
    border-radius: 32px;
  }
  .atext {
    flex: 1;
    min-width: 0;
  }
  .atitle {
    display: block;
    font-size: 15px;
    font-weight: 700;
  }
  .asub {
    display: block;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.72);
  }
  .amode {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 21px;
    background: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .camcard {
    border-radius: 30px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.07);
  }
  .cam {
    position: relative;
    min-height: 200px;
    background: linear-gradient(160deg, #2a2d36, #15171d);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cam:fullscreen {
    background: #000;
  }
  .stream {
    display: block;
    width: 100%;
  }
  .camph {
    padding: 80px 0;
  }
  .camlive {
    position: absolute;
    left: 10px;
    top: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    height: 26px;
    padding: 0 10px;
    border-radius: 13px;
    background: rgba(0, 0, 0, 0.55);
    font-size: 11px;
    font-weight: 600;
  }
  .camtools {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    gap: 6px;
  }
  .camtools button {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .camchips {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px;
  }
  .cchip {
    height: 30px;
    padding: 0 12px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    font-size: 12px;
  }
  .cchip.hot {
    background: rgba(255, 159, 10, 0.24);
    color: #ffd29a;
  }
  .cchip.btn2 {
    background: rgba(255, 255, 255, 0.14);
    font-weight: 600;
  }
  .legend {
    gap: 8px;
    font-size: 11px;
  }
  .legend > span {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .flabel {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    margin: 2px 8px 0;
  }
  .ogrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .opill {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    min-height: 46px;
    padding: 0 6px 0 14px;
    border-radius: 23px;
    background: rgba(255, 255, 255, 0.07);
  }
  .opill.wide {
    grid-column: span 2;
  }
  .oname {
    font-size: 13px;
    font-weight: 600;
  }
  .oicons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 3px;
    padding: 6px 0;
  }
  .oicon {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(48, 209, 88, 0.18);
  }
  .oicon.open {
    background: #ff453a;
  }
  .oicon.na {
    background: transparent;
    border: 1px dashed rgba(255, 255, 255, 0.25);
  }
`;
