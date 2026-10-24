import { html } from 'lit';
import { sheet } from '../components/ui';
import { trendFigure } from '../components/trend';
import { I } from '../icons';
import { loadConsumption, loadEnergy, loadEnergyShare, loadPower, type ChartRange } from '../data/series';
import { batteryStatIds, consumerEnergyStat, energyStatIds, type ShareKind } from '../logic/energy';
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
 * - soc: battery charge level in percent
 */
export function energyChartSheet(ctx: PageContext, key: string, range: ChartRange, name?: string, back?: SheetState) {
  const { prefs } = ctx.energy();
  const role = ROLES[key];
  const share = SHARES[key];
  const ids = prefs ? { ...energyStatIds(prefs), ...batteryStatIds(prefs) } : null;
  let kind: 'kWh' | 'W' | 'share' | 'soc' = 'kWh';
  let title: string;
  let color: string;
  let load: (() => ReturnType<typeof loadEnergy>) | null = null;
  let needsPrefs = true;
  if (share) {
    kind = 'share';
    title = share.name;
    color = share.color;
    if (ids) load = () => loadEnergyShare(ctx.hass, ids, range, share.kind);
  } else if (key === 'house') {
    title = 'Hausverbrauch';
    color = '#ffffff';
    if (ids) load = () => loadConsumption(ctx.hass, ids, range);
  } else if (key === 'battery') {
    kind = 'soc';
    title = 'Akku-Ladestand';
    color = '#30d158';
    needsPrefs = false;
    load = () => loadPower(ctx.hass, ent(ctx.config, 'battery_soc'), range);
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
  const unit = kind === 'share' || kind === 'soc' ? '%' : kind;
  const data = load
    ? ctx.series(`energy:${key}:${range}:${kind}`, load)
    : { loading: needsPrefs && !prefs, error: prefs ? 'nicht im Energie-Dashboard' : undefined, past: [], start: 0, end: 0 };
  const sum = data.past.reduce((s, p) => s + p.v, 0);
  const vals = data.past.map((p) => p.v);
  const soc = num(ctx.hass, ent(ctx.config, 'battery_soc'));
  const caption = !data.past.length
    ? undefined
    : kind === 'share'
      ? data.total != null ? `gesamt ${data.total} % ${share.total}` : undefined
      : kind === 'soc'
        ? `${soc !== null ? `jetzt ${fmt(soc)} % · ` : ''}${fmt(Math.min(...vals))} – ${fmt(Math.max(...vals))} %`
        : kind === 'kWh'
          ? `Summe ${fmt(sum, sum < 10 ? 2 : 1)} kWh`
          : `Ø ${fmt(sum / data.past.length)} W`;
  const per = range === '24h' ? 'Stunde' : 'Tag';
  const subtitle = { kWh: `kWh pro ${per}`, W: 'mittlere Leistung', share: `Anteil pro ${per}`, soc: `Mittel pro ${per}` }[kind];

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
        title, color, unit, digits: kind === 'kWh' ? 1 : 0, snap: kind === 'kWh' ? 0.5 : unit === '%' ? 25 : 10, data, caption,
        bars: kind === 'kWh' || kind === 'share', zero: true, max: unit === '%' ? 100 : undefined,
        labels: labels(range, data.start, data.end),
      })}
    `,
  });
}
