import { html } from 'lit';
import { sheet } from '../components/ui';
import { trendFigure } from '../components/trend';
import { I } from '../icons';
import { loadEnergy, loadEnergyShare, loadPower, type ChartRange } from '../data/series';
import { batteryStatIds, consumerEnergyStat, energyStatIds, type ShareKind } from '../logic/energy';
import { friendlyName, fmt } from '../logic/util';
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

/** Energy per hour/day for PV, grid import/export or one consumer; power means where no energy statistic exists. */
export function energyChartSheet(ctx: PageContext, key: string, range: ChartRange, name?: string, back?: SheetState) {
  const { prefs } = ctx.energy();
  const role = ROLES[key];
  const share = SHARES[key];
  let title: string;
  let color: string;
  let unit = 'kWh';
  let load: (() => ReturnType<typeof loadEnergy>) | null = null;
  if (share) {
    title = share.name;
    color = share.color;
    unit = '%';
    if (prefs) load = () => loadEnergyShare(ctx.hass, { ...energyStatIds(prefs), ...batteryStatIds(prefs) }, range, share.kind);
  } else if (role) {
    title = role.name;
    color = role.color;
    const ids = prefs ? energyStatIds(prefs)[role.ids] : [];
    if (ids.length) load = () => loadEnergy(ctx.hass, ids, range);
  } else {
    title = name ?? ctx.config.names?.[key] ?? friendlyName(ctx.hass, key).replace(/\s*(device\s+)?(power|leistung)$/i, '');
    color = '#ff9f0a';
    const stat = consumerEnergyStat(ctx.hass, key, prefs);
    if (stat) load = () => loadEnergy(ctx.hass, [stat], range);
    else {
      unit = 'W';
      load = () => loadPower(ctx.hass, key, range);
    }
  }
  const data = load
    ? ctx.series(`energy:${key}:${range}:${unit}`, load)
    : { loading: !prefs, error: prefs ? 'nicht im Energie-Dashboard' : undefined, past: [], start: 0, end: 0 };
  const sum = data.past.reduce((s, p) => s + p.v, 0);
  const caption = data.past.length
    ? share
      ? data.total != null ? `gesamt ${data.total} % ${share.total}` : undefined
      : unit === 'kWh'
      ? `Summe ${fmt(sum, sum < 10 ? 2 : 1)} kWh`
      : `Ø ${fmt(sum / data.past.length)} W`
    : undefined;

  return sheet({
    title,
    subtitle: share
      ? (range === '24h' ? 'Anteil pro Stunde' : 'Anteil pro Tag')
      : unit === 'kWh' ? (range === '24h' ? 'kWh pro Stunde' : 'kWh pro Tag') : 'mittlere Leistung',
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
        title, color, unit, digits: unit === 'kWh' ? 1 : 0, snap: unit === 'kWh' ? 0.5 : unit === '%' ? 25 : 10, data, caption,
        bars: unit !== 'W', zero: true, max: unit === '%' ? 100 : undefined, labels: labels(range, data.start, data.end),
      })}
    `,
  });
}
