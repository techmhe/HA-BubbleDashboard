import { describe, expect, it } from 'vitest';

const source = Object.values(
  (import.meta as unknown as {
    glob(p: string, o: { query: string; import: string; eager: true }): Record<string, string>;
  }).glob('../src/ha-start-dashboard.ts', { query: '?raw', import: 'default', eager: true }),
)[0];

// iOS rubber-band scrolling shows whatever lies past the page end (the HA theme background).
// The card paints its own background there with a shadow, which does not grow the scroll area.
describe('overscroll background', () => {
  it('paints the card background below the card', () => {
    const wrap = source.match(/\n\s*\.wrap\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(wrap).toMatch(/box-shadow:\s*0\s+100vh\s+0\s+0\s+var\(--sd-bg\)/);
  });
});
