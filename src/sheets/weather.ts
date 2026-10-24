import { css, html, nothing } from 'lit';
import { icon, sheet } from '../components/ui';
import { I, IC, weatherIcon } from '../icons';
import { ent } from '../logic/entities';
import { dailyRows, dayDetail, hourlySlots, pollenInfo, stormHint, WEATHER_METRICS, weatherNow, weatherWarnings, type WeatherMetric } from '../logic/weather';
import { loadWeatherMetric } from '../data/series';
import { trendFigure } from '../components/trend';
import { fmt, num } from '../logic/util';
import type { PageContext } from '../pages/context';

const BLUE = '#8fd0ff';
const CHIP_ICONS: Record<string, string> = {
  humidity: IC.drop,
  wind: I.wind,
  pressure: 'M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16M12 12l4-3',
  uv: I.sun,
  visibility: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6',
};
const DAY_ICONS: Record<string, string> = { rain: IC.drop, sun: I.sun, wind: I.wind, humidity: IC.drop, uv: I.sun };
const CHEVRON = 'M6 9l6 6 6-6';
const WET = ['rainy', 'pouring', 'snowy', 'snowy-rainy', 'hail', 'lightning-rainy'];

export function weatherSheet(ctx: PageContext) {
  const { hass, config } = ctx;
  const id = ent(config, 'weather');
  const fc = ctx.forecast();
  const now = weatherNow(hass, config, fc.daily, ctx.now);
  const hours = hourlySlots(fc.hourly, ctx.now);
  const days = dailyRows(fc.daily);
  const warnings = weatherWarnings(hass, config, ctx.now);
  const storm = warnings.length ? null : stormHint(fc.daily, num(hass, ent(config, 'gusts')), ctx.now);
  const pollen = pollenInfo(hass, config);
  const pollenColor = !pollen || pollen.level === 0 ? '#7ee8a0' : pollen.level < 2 ? '#ffd60a' : '#ff9f0a';

  return sheet({
    title: String(hass.states[id]?.attributes.friendly_name ?? 'Wetter'),
    subtitle: now.source || undefined,
    color: BLUE,
    glow: 'rgba(90,140,220,0.35)',
    iconPath: weatherIcon(now.condition),
    iconStroke: '#0a1a2a',
    onClose: ctx.closeSheet,
    body: html`
      <div class="w-now">
        <span class="w-temp">${now.temp}</span>
        <span><span class="w-cond">${now.label}</span>${now.today ? html`<span class="w-today">${now.today}</span>` : nothing}</span>
      </div>
      ${now.chips.length
        ? html`<div class="w-chips">
            ${now.chips.map((c) => c.key in WEATHER_METRICS
              ? html`<button class="w-chip" aria-label="${c.label}, Verlauf anzeigen"
                  @click=${() => ctx.openSheet({ id: 'weatherMetric', metric: c.key as WeatherMetric })}>${icon(CHIP_ICONS[c.key], 14, BLUE, 2.2)}${c.label}</button>`
              : html`<span class="w-chip">${icon(CHIP_ICONS[c.key], 14, BLUE, 2.2)}${c.label}</span>`)}
          </div>`
        : nothing}

      ${warnings.map((w, i) => {
        // Compact rows; tap shows the DWD text.
        const open = ctx.ui[`warn${i}`] === true;
        return html`
          <button class="w-alert" aria-expanded=${open} ?disabled=${!w.text}
            style="border-color:${w.color}66;background:linear-gradient(90deg, ${w.color}38, ${w.color}0d)"
            @click=${() => ctx.setUi({ [`warn${i}`]: !open })}>
            <span class="w-ah">
              <span class="circle" style="width:32px;height:32px;background:${w.color}">${icon(I.storm, 15, '#1d1030', 2.2)}</span>
              <span class="grow"><span class="w-wt">${w.current ? (w.level >= 3 ? 'Unwetterwarnung' : 'Warnung') : 'Vorabwarnung'}: ${w.title}</span>
                <span class="w-ws">${w.when} · Stufe ${w.level} von 4</span></span>
              ${w.text ? html`<span class="w-chev ${open ? 'open' : ''}">${icon(CHEVRON, 16, 'rgba(255,255,255,0.7)', 2.4)}</span>` : nothing}
            </span>
            ${open ? html`<span class="w-at">${w.text}</span>` : nothing}
          </button>`;
      })}

      ${storm
        ? html`<div class="w-warn">
            <span class="circle" style="width:40px;height:40px;background:#bf9bff">${icon(I.storm, 18, '#1d1030', 2.2)}</span>
            <span><span class="w-wt">${storm.title}</span><span class="w-ws">${storm.text}</span></span>
          </div>`
        : nothing}

      ${fc.loading && !fc.hourly.length
        ? html`<div class="w-msg">Vorhersage wird geladen …</div>`
        : fc.error && !fc.hourly.length
          ? html`<div class="w-msg">Vorhersage nicht verfügbar.</div>`
          : nothing}

      ${hours.length
        ? html`<div class="w-hours" style="grid-template-columns: repeat(${hours.length}, minmax(0, 1fr))">
            ${hours.map((h) => html`<div class="w-hour">
              <span class="w-ht">${h.t}</span>
              ${icon(weatherIcon(h.condition), 20, WET.includes(h.condition) ? BLUE : 'rgba(255,255,255,0.85)', 2)}
              <span class="w-hv">${h.temp ?? '–'}°</span>
              <span class="w-hr">${h.rain}</span>
            </div>`)}
          </div>`
        : nothing}

      ${days.length
        ? html`<div class="w-days">
            ${days.map((d) => html`<button class="w-day" aria-label="${d.day}, Details anzeigen"
              @click=${() => ctx.openSheet({ id: 'weatherDay', date: d.date })}>
              <span class="w-dn">${d.day}</span>
              ${icon(weatherIcon(d.condition), 20, WET.includes(d.condition) ? BLUE : 'rgba(255,255,255,0.8)', 2)}
              <span class="w-dr">${d.rain}</span>
              <span class="w-track">
                <span class="w-bar" style="left:${d.left}%;width:${d.width}%"></span>
                <span class="w-lo" style="left:${d.left}%">${d.min}°</span>
              </span>
              <span class="w-dmax">${d.max}°</span>
            </button>`)}
          </div>`
        : nothing}

      ${pollen
        ? html`<div class="w-pollen" style="background:${pollenColor}1f">
            ${icon(IC.leaf, 16, pollenColor, 2.2)}
            <span><strong>${pollen.title}</strong> · ${pollen.text}</span>
          </div>`
        : nothing}
    `,
  });
}

const HOUR = 3600_000;

/** One forecast day: facts, 3-hourly slots and the temperature curve (where the hourly forecast reaches). */
export function weatherDaySheet(ctx: PageContext, date: string) {
  const fc = ctx.forecast();
  const item = fc.daily.find((d) => d.datetime === date);
  const back = () => ctx.openSheet({ id: 'weather' });
  if (!item) {
    return sheet({
      title: 'Vorhersage', color: BLUE, glow: 'rgba(90,140,220,0.35)', iconPath: I.sun, iconStroke: '#0a1a2a',
      onClose: ctx.closeSheet, onBack: back,
      body: html`<div class="w-msg">${fc.loading ? 'Vorhersage wird geladen …' : 'Für diesen Tag gibt es keine Vorhersage mehr.'}</div>`,
    });
  }
  const d = dayDetail(item, fc.hourly);
  const at = (h: number) => `${String(h).padStart(2, '0')} Uhr`;
  return sheet({
    title: d.title,
    subtitle: d.label || undefined,
    color: BLUE,
    glow: 'rgba(90,140,220,0.35)',
    iconPath: weatherIcon(d.condition),
    iconStroke: '#0a1a2a',
    onClose: ctx.closeSheet,
    onBack: back,
    body: html`
      <div class="w-now">
        <span class="w-temp">${d.max ?? '–'}°</span>
        <span><span class="w-cond">${d.label}</span>${d.min !== null ? html`<span class="w-today">Tiefstwert ${d.min}°</span>` : nothing}</span>
      </div>
      ${d.facts.length
        ? html`<div class="w-chips">${d.facts.map((f) => html`<span class="w-chip">${icon(DAY_ICONS[f.key], 14, BLUE, 2.2)}${f.label}</span>`)}</div>`
        : nothing}
      ${d.hours.length
        ? html`<div class="w-hours" style="grid-template-columns: repeat(${d.hours.length}, minmax(0, 1fr))">
            ${d.hours.map((h) => html`<div class="w-hour">
              <span class="w-ht">${h.t}</span>
              ${icon(weatherIcon(h.condition), 20, WET.includes(h.condition) ? BLUE : 'rgba(255,255,255,0.85)', 2)}
              <span class="w-hv">${h.temp ?? '–'}°</span>
              <span class="w-hr">${h.rain}</span>
            </div>`)}
          </div>`
        : html`<div class="w-msg">Stündliche Werte gibt es erst näher am Tag.</div>`}
      ${d.temps.length > 1
        ? trendFigure({
            title: 'Temperatur', color: '#ffc061', unit: '°C', digits: 1, snap: 2,
            data: { loading: false, past: d.temps, start: d.start, end: d.end },
            caption: `${fmt(Math.min(...d.temps.map((p) => p.v)), 1)} – ${fmt(Math.max(...d.temps.map((p) => p.v)), 1)} °C`,
            labels: [at(0), at(5), at(10), at(14), at(19)],
          })
        : nothing}
    `,
  });
}

/** Chart of one weather value: last 24 h from history, next 24 h from the forecast. */
export function weatherMetricSheet(ctx: PageContext, metric: WeatherMetric) {
  const m = WEATHER_METRICS[metric];
  const entity = ent(ctx.config, 'weather');
  const fc = ctx.forecast();
  const data = ctx.series(`weather:${metric}:${fc.hourly.length ? fc.at : 0}`, () => loadWeatherMetric(ctx.hass, entity, metric, fc.hourly), 10 * 60_000);
  const vals = [...data.past, ...(data.future ?? [])].map((p) => p.v);
  const cur = Number(ctx.hass.states[entity]?.attributes[m.attr]);
  const unit = m.unit ? ` ${m.unit}` : '';
  const caption = vals.length
    ? `${Number.isFinite(cur) ? `jetzt ${fmt(cur, m.digits)}${unit} · ` : ''}${fmt(Math.min(...vals), m.digits)} – ${fmt(Math.max(...vals), m.digits)}${unit}`
    : undefined;
  const at = (h: number) => {
    const d = new Date(data.start + h * HOUR);
    return `${String(d.getHours()).padStart(2, '0')} Uhr`;
  };
  return sheet({
    title: m.name,
    subtitle: '24 h zurück · 24 h Vorhersage',
    color: m.color,
    glow: `${m.color}33`,
    iconPath: CHIP_ICONS[metric],
    onClose: ctx.closeSheet,
    onBack: () => ctx.openSheet({ id: 'weather' }),
    body: html`${trendFigure({
      title: m.name, color: m.color, unit: m.unit, digits: m.digits, snap: m.snap, data, caption, zero: metric === 'uv',
      labels: data.start ? [at(0), at(12), 'jetzt', at(36), at(48)] : [],
    })}`,
  });
}

export const weatherStyles = css`
  .w-alert {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    padding: 6px 12px 6px 6px;
    border-radius: 24px;
    border: 1px solid;
    text-align: left;
  }
  .w-alert:disabled {
    opacity: 1;
  }
  .w-chev {
    display: flex;
    transition: transform 0.2s;
  }
  .w-chev.open {
    transform: rotate(180deg);
  }
  .w-ah {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .w-at {
    display: block;
    margin: 0;
    padding: 2px 6px 6px;
    font-size: 12px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.85);
  }
  .w-now {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 4px 10px;
  }
  .w-temp {
    font-size: 64px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1;
  }
  .w-cond {
    display: block;
    font-size: 18px;
    font-weight: 600;
  }
  .w-today {
    display: block;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
  }
  .w-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .w-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 12px 0 10px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 500;
  }
  button.w-chip {
    background: rgba(143, 208, 255, 0.14);
  }
  .w-warn {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 56px;
    padding: 0 8px;
    border-radius: 28px;
    background: linear-gradient(90deg, rgba(191, 155, 255, 0.32), rgba(191, 155, 255, 0.08));
    border: 1px solid rgba(191, 155, 255, 0.35);
  }
  .w-wt {
    display: block;
    font-size: 14px;
    font-weight: 600;
  }
  .w-ws {
    display: block;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.82);
  }
  .w-msg {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    padding: 6px 10px;
  }
  .w-hours {
    display: grid;
    gap: 4px;
    padding: 10px 6px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.06);
  }
  .w-hour {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .w-ht {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.72);
  }
  .w-hv {
    font-size: 15px;
    font-weight: 700;
  }
  .w-hr {
    font-size: 10px;
    color: #8fd0ff;
    min-height: 12px;
  }
  .w-days {
    display: flex;
    flex-direction: column;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.06);
    padding: 4px 14px;
  }
  .w-day {
    width: 100%;
    text-align: left;
    display: grid;
    grid-template-columns: 30px 24px 52px 1fr 30px;
    align-items: center;
    gap: 8px;
    height: 40px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .w-day:last-child {
    border-bottom: none;
  }
  .w-dn {
    font-size: 13px;
    font-weight: 600;
  }
  .w-dr {
    font-size: 11px;
    color: #8fd0ff;
    white-space: nowrap;
  }
  .w-track {
    position: relative;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
  }
  .w-bar {
    position: absolute;
    top: 0;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, #8fd0ff, #ffc061);
  }
  .w-lo {
    position: absolute;
    top: -16px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
  }
  .w-dmax {
    font-size: 13px;
    font-weight: 700;
    text-align: right;
  }
  .w-pollen {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 14px;
    border-radius: 22px;
    font-size: 13px;
  }
`;
