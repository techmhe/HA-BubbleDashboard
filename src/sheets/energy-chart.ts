import { html } from 'lit';
import { sheet } from '../components/ui';
import { trendFigure } from '../components/trend';
import { I } from '../icons';
import { loadConsumption, loadCost, loadEnergy, loadEnergyShare, loadPower, type ChartRange } from '../data/series';
import { batteryStatIds, consumerEnergyStat, energyStatIds, gridTariff, type ShareKind } from '../logic/energy';
import { ent } from '../logic/entities';
import { friendlyName, fmt, num } from '../logic/util';
import type { PageContext, SheetState } from '../pages/context';

const RANGES: { id: ChartRange; name: string }[] = [
  { id: '24h', name: '24 h' },
  { id: '7d', name: '7 Tage' },
  { id: '30d', name: '30 Tage' },
];

const ROLES: Record<string, { name: string; color: string; ids: 'solar' | 'import' | 'export' }> = {
  pv: { name: 'PV erzeugt', color: '#ffd60a', ids: 'solar' },
  import: { name: 'Netzbezug', color: '#ff9f0a', ids: 'import' },
  export: { name: 'Eingespeist', color: '#64d2ff', ids: 'export' },
};

/** The two "Heute" split bars: percent per hour/day. */
const SHARES: Record<string, { name: string; color: string; kind: ShareKind; total: string }> = {
  autarky: { name: 'Autarkie', color: '#7ee8a0', kind: 'autarky', total: 'autark' },
  selfuse: { name: 'Eigenverbrauch', color: '#ffe066', kind: 'selfuse', total: 'selbst genutzt' },
};

function labels(range: ChartRange, start: number, end: number): string[] {
  if (!start) return [];
  const out: string[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(start + ((end - start) * i) / 5);
    if (range === '24h') out.push(`${String(d.getHours()).padStart(2, '0')} Uhr`);
    else if (range === '7d') out.push(d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', ''));
    else out.push(`${d.getDate()}.${d.getMonth() + 1}.`);
  }
  return out;
}

/**
 * Chart sheet for the Energie page. Kinds:
 * - kWh: energy per hour/day (PV, grid import/export, house consumption, a consumer with an energy statistic)
 * - W: mean power (a consumer without an energy statistic)
 * - share: autarky / self-use in percent
 * The battery has its own sheet: energy charged and discharged.
 */
export function energyChartSheet(ctx: PageContext, key: string, range: ChartRange, name?: string, back?: SheetState) {
  if (key === 'battery') return batteryChartSheet(ctx, range);
  const { prefs } = ctx.energy();
  const role = ROLES[key];
  const share = SHARES[key];
  const ids = prefs ? { ...energyStatIds(prefs), ...batteryStatIds(prefs) } : null;
  let kind: 'kWh' | 'W' | 'share' | '€' = 'kWh';
  let title: string;
  let color: string;
  let load: (() => ReturnType<typeof loadEnergy>) | null = null;
  let needsPrefs = true;
  if (share) {
    kind = 'share';
    title = share.name;
    color = share.color;
    if (ids) load = () => loadEnergyShare(ctx.hass, ids, range, share.kind);
  } else if (key === 'cost') {
    kind = '€';
    title = 'Stromkosten';
    color = '#ff9f0a';
    if (prefs && ids) load = () => loadCost(ctx.hass, gridTariff(prefs), ids, range);
  } else if (key === 'house') {
    title = 'Hausverbrauch';
    color = '#ffffff';
    if (ids) load = () => loadConsumption(ctx.hass, ids, range);
  } else if (role) {
    title = role.name;
    color = role.color;
    const list = ids ? ids[role.ids] : [];
    if (list.length) load = () => loadEnergy(ctx.hass, list, range);
  } else {
    title = name ?? ctx.config.names?.[key] ?? friendlyName(ctx.hass, key).replace(/\s*(device\s+)?(power|leistung)$/i, '');
    color = '#ff9f0a';
    needsPrefs = false;
    const stat = consumerEnergyStat(ctx.hass, key, prefs);
    if (stat) load = () => loadEnergy(ctx.hass, [stat], range);
    else {
      kind = 'W';
      load = () => loadPower(ctx.hass, key, range);
    }
  }
  const unit = kind === 'share' ? '%' : kind;
  const data = load
    ? ctx.series(`energy:${key}:${range}:${kind}`, load)
    : { loading: needsPrefs && !prefs, error: prefs ? 'nicht im Energie-Dashboard' : undefined, past: [], start: 0, end: 0 };
  const sum = data.past.reduce((s, p) => s + p.v, 0);
  const caption = !data.past.length
    ? undefined
    : kind === 'share'
      ? data.total != null ? `gesamt ${data.total} % ${share.total}` : undefined
      : kind === '€'
        ? `Summe ${fmt(sum, 2)} €${data.total ? ` · Vergütung ${fmt(data.total, 2)} €` : ''}`
      : kind === 'kWh'
        ? `Summe ${fmt(sum, sum < 10 ? 2 : 1)} kWh`
        : `Ø ${fmt(sum / data.past.length)} W`;
  const per = range === '24h' ? 'Stunde' : 'Tag';
  const subtitle = { kWh: `kWh pro ${per}`, W: 'mittlere Leistung', share: `Anteil pro ${per}`, '€': `Netzbezug in € pro ${per}` }[kind];

  return sheet({
    title,
    subtitle,
    color,
    glow: `${color}33`,
    iconPath: I.bolt,
    onClose: ctx.closeSheet,
    onBack: back ? () => ctx.openSheet(back) : undefined,
    body: html`
      <div class="tabs3" role="tablist" aria-label="Zeitraum">
        ${RANGES.map((r) => html`<button role="tab" aria-selected=${r.id === range} class=${r.id === range ? 'sel' : ''}
          @click=${() => ctx.openSheet({ id: 'energyChart', key, range: r.id, name, back })}>${r.name}</button>`)}
      </div>
      ${trendFigure({
        title, color, unit, digits: kind === 'kWh' ? 1 : kind === '€' ? 2 : 0, snap: kind === 'kWh' ? 0.5 : kind === '€' ? 0.25 : unit === '%' ? 25 : 10, data, caption,
        bars: kind === 'kWh' || kind === 'share' || kind === '€', zero: true, max: unit === '%' ? 100 : undefined,
        labels: labels(range, data.start, data.end),
      })}
    `,
  });
}

const RANGE_TABS = (ctx: PageContext, key: string, range: ChartRange) => html`
  <div class="tabs3" role="tablist" aria-label="Zeitraum">
    ${RANGES.map((r) => html`<button role="tab" aria-selected=${r.id === range} class=${r.id === range ? 'sel' : ''}
      @click=${() => ctx.openSheet({ id: 'energyChart', key, range: r.id })}>${r.name}</button>`)}
  </div>`;

/** Battery: kWh charged into and discharged from the battery per hour/day (energy dashboard battery source). */
function batteryChartSheet(ctx: PageContext, range: ChartRange) {
  const { prefs } = ctx.energy();
  const ids = prefs ? batteryStatIds(prefs) : null;
  const soc = num(ctx.hass, ent(ctx.config, 'battery_soc'));
  const part = (list: string[] | undefined, tag: string) =>
    list?.length
      ? ctx.series(`energy:battery-${tag}:${range}`, () => loadEnergy(ctx.hass, list, range))
      : { loading: !prefs, error: prefs ? 'kein Akku im Energie-Dashboard' : undefined, past: [], start: 0, end: 0 };
  const charged = part(ids?.batteryIn, 'in');
  const discharged = part(ids?.batteryOut, 'out');
  const sum = (d: { past: { v: number }[] }) => d.past.reduce((s, p) => s + p.v, 0);
  const figure = (title: string, color: string, data: typeof charged) =>
    trendFigure({
      title, color, unit: 'kWh', digits: 1, snap: 0.5, data, bars: true, zero: true,
      caption: data.past.length ? `Summe ${fmt(sum(data), sum(data) < 10 ? 2 : 1)} kWh` : undefined,
      labels: labels(range, data.start, data.end),
    });
  return sheet({
    title: 'Akku',
    subtitle: `${soc !== null ? `Ladestand ${fmt(soc)} % · ` : ''}kWh pro ${range === '24h' ? 'Stunde' : 'Tag'}`,
    color: '#30d158',
    glow: '#30d15833',
    iconPath: I.bolt,
    onClose: ctx.closeSheet,
    body: html`
      ${RANGE_TABS(ctx, 'battery', range)}
      ${figure('Geladen', '#30d158', charged)}
      ${figure('Entladen', '#ffd60a', discharged)}
    `,
  });
}
