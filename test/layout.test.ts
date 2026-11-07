import { describe, expect, it } from 'vitest';
import { layoutFor } from '../src/logic/layout';

describe('layout breakpoints', () => {
  it('keeps the phone layout below 700 px', () => {
    expect(layoutFor(390)).toBe('phone');
    expect(layoutFor(699)).toBe('phone');
  });

  it('uses the tablet layout from 700 px (iPad portrait)', () => {
    expect(layoutFor(700)).toBe('tablet');
    expect(layoutFor(834)).toBe('tablet');
    expect(layoutFor(999)).toBe('tablet');
  });

  it('uses the wide layout from 1000 px (iPad landscape, MacBook)', () => {
    expect(layoutFor(1000)).toBe('wide');
    expect(layoutFor(1194)).toBe('wide');
    expect(layoutFor(1728)).toBe('wide');
  });

  it('falls back to phone for an unknown width', () => {
    expect(layoutFor(0)).toBe('phone');
    expect(layoutFor(Number.NaN)).toBe('phone');
  });
});
