import { describe, expect, it } from 'vitest';

// All page and sheet styles share one shadow root, so a class defined in two files
// silently overrides the other (e.g. the weather sheet's 64 px .w-temp hit the overview pill).
// The slider is its own element with its own shadow root.
const OWN_SHADOW_ROOT = ['../src/components/slider.ts'];

const SOURCES = (import.meta as unknown as {
  glob(p: string, o: { query: string; import: string; eager: true }): Record<string, string>;
}).glob('../src/**/*.ts', { query: '?raw', import: 'default', eager: true });

/** Classes that start a selector (".foo", ".foo.bar", ".foo:hover"), i.e. are styled unscoped. */
function topLevelClasses(source: string): Set<string> {
  const out = new Set<string>();
  for (const block of source.matchAll(/css`([\s\S]*?)`/g)) {
    for (const sel of block[1].matchAll(/([^{}]+)\{/g)) {
      for (const part of sel[1].split(',')) {
        const m = part.trim().match(/^\.([\w-]+)/);
        if (m) out.add(m[1]);
      }
    }
  }
  return out;
}

describe('shared shadow root styles', () => {
  it('defines every top-level class in only one file', () => {
    const owners = new Map<string, string[]>();
    expect(Object.keys(SOURCES).length).toBeGreaterThan(20);
    for (const [f, source] of Object.entries(SOURCES)) {
      if (OWN_SHADOW_ROOT.includes(f)) continue;
      for (const c of topLevelClasses(source)) owners.set(c, [...(owners.get(c) ?? []), f]);
    }
    const dupes = [...owners].filter(([, fs]) => fs.length > 1).map(([c, fs]) => `${c}: ${fs.join(', ')}`);
    expect(dupes).toEqual([]);
  });
});
