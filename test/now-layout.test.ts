import { describe, expect, it } from 'vitest';
import { nowLayout, type NowItem } from '../src/logic/overview';

const it_ = (id: string, action = false): NowItem => ({
  id, title: id, text: '', icon: '', color: '', tint: '', tap: null,
  ...(action ? { action: { kind: 'service', label: 'OK', domain: 'x', service: 'y' } as NowItem['action'] } : {}),
});
const ids = (l: ReturnType<typeof nowLayout>) => l.map((x) => `${x.item.id}${x.wide ? '*' : ''}`);

describe('Aktuell layout', () => {
  it('puts urgent and actionable items full width first, the rest in two columns', () => {
    expect(ids(nowLayout([it_('robby-due'), it_('warn'), it_('filter'), it_('airing', true), it_('battery'), it_('waste')]))).toEqual([
      'warn*', 'airing*', 'robby-due', 'filter', 'battery', 'waste',
    ]);
  });

  it('stretches a lone half tile at the end', () => {
    expect(ids(nowLayout([it_('robby-due'), it_('filter'), it_('battery')]))).toEqual(['robby-due', 'filter', 'battery*']);
    expect(ids(nowLayout([it_('filter')]))).toEqual(['filter*']);
  });
});

describe('Aktuell layout for technical items', () => {
  it('renders the technical items full width', () => {
    expect(ids(nowLayout([it_('filter'), it_('print'), it_('print-done'), it_('print-error'), it_('services'), it_('pihole'), it_('battery')]))).toEqual([
      'print*', 'print-done*', 'print-error*', 'services*', 'pihole*', 'filter', 'battery',
    ]);
  });
});
