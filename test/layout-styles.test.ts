import { describe, expect, it } from 'vitest';
import { layoutStyles } from '../src/layout-styles';
import { sheetStyles } from '../src/components/ui';

const shell = layoutStyles.cssText;
const sheets = sheetStyles.cssText;

describe('wide layout shell', () => {
  it('puts the navigation in a vertical rail on the left', () => {
    expect(shell).toMatch(/:host\(\[layout='wide'\]\) \.nav\s*\{[^}]*flex-direction:\s*column/);
    expect(shell).toMatch(/:host\(\[layout='wide'\]\) \.nav\s*\{[^}]*width:\s*76px/);
  });

  it('fills the viewport height instead of scrolling the page', () => {
    expect(shell).toMatch(/:host\(\[layout='wide'\]\) \.wrap\s*\{[^}]*height:\s*calc\(100dvh/);
  });

  it('drops the 480 px phone column on tablets', () => {
    expect(shell).toMatch(/:host\(\[layout='tablet'\]\) \.content[^{]*\{[^}]*max-width:\s*none/);
  });
});

describe('side panel sheets', () => {
  it('open on the right at 440 px on tablets and wide screens', () => {
    expect(sheets).toMatch(/:host\(\[layout='wide'\]\) \.sheet[^{]*\{[^}]*right:\s*16px[^}]*width:\s*440px/);
    expect(sheets).toMatch(/:host\(\[layout='tablet'\]\) \.sheet/);
  });

  it('give the Robby sheet 720 px', () => {
    expect(sheets).toMatch(/\.sheet\.xl\s*\{[^}]*width:\s*720px/);
  });
});
