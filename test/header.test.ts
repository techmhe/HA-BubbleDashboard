import { describe, expect, it } from 'vitest';
import { headerCss } from '../src/header';

describe('HA header styling', () => {
  it('hides the toolbar and the space it reserves', () => {
    const css = headerCss('hide');
    expect(css).toMatch(/\.header\s*\{[^}]*display:\s*none/);
    expect(css).toMatch(/#view\s*\{[^}]*padding-top/);
  });

  it('makes the toolbar transparent so the card background runs underneath', () => {
    const css = headerCss('blend');
    expect(css).toMatch(/\.header\s*\{[^}]*background:\s*transparent/);
    expect(css).not.toMatch(/display:\s*none/);
  });

  it('leaves HA alone in default mode', () => {
    expect(headerCss('default')).toBe('');
  });
});
