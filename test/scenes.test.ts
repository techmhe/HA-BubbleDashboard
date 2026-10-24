import { describe, expect, it } from 'vitest';
import { activeScenes } from '../src/logic/devices';
import { makeHass, NOW, type Def } from './fixture';

const at = (minAgo: number) => new Date(NOW.getTime() - minAgo * 60000).toISOString();

const EXTRAS: Record<string, Def> = {
  'scene.kochen': [at(30), { id: '1', entity_id: ['light.kuche_decke', 'light.kuche_band'] }, 30, { area: 'kuche' }],
  'scene.kuche_aus': [at(90), { id: '2', entity_id: ['light.kuche_decke', 'light.kuche_band'] }, 90, { area: 'kuche' }],
  'light.kuche_band': ['on', { brightness: 120 }, 30, { area: 'kuche' }],
};
const SCENES = ['scene.kochen', 'scene.kuche_aus'];

describe('active scenes', () => {
  it('matches the stored scene states when the scene configs are known', () => {
    const h = makeHass({ 'light.kuche_decke': { state: 'on', attributes: { brightness: 252 } } }, NOW, EXTRAS);
    const configs = {
      'scene.kochen': { 'light.kuche_decke': { state: 'on', brightness: 255 }, 'light.kuche_band': { state: 'on', brightness: 128 } },
      'scene.kuche_aus': { 'light.kuche_decke': { state: 'off' }, 'light.kuche_band': { state: 'off' } },
    };
    expect([...activeScenes(h, SCENES, configs, NOW)]).toEqual(['scene.kochen']);
    const dimmed = makeHass({ 'light.kuche_decke': { state: 'on', attributes: { brightness: 60 } } }, NOW, EXTRAS);
    expect([...activeScenes(dimmed, SCENES, configs, NOW)]).toEqual([]);
  });

  it('without configs: the last activated scene while its lights stayed untouched', () => {
    const h = makeHass({ 'light.kuche_decke': { state: 'on', minutesAgo: 30 } }, NOW, EXTRAS);
    expect([...activeScenes(h, SCENES, {}, NOW)]).toEqual(['scene.kochen']);
    const touched = makeHass({ 'light.kuche_decke': { state: 'off', minutesAgo: 5 } }, NOW, EXTRAS);
    expect([...activeScenes(touched, SCENES, {}, NOW)]).toEqual([]);
  });
});
