/**
 * Styles HA's dashboard toolbar (hui-root) from inside the card: hide it, or make it transparent
 * so the card's background runs underneath. Only affects the dashboard the card is on, and is
 * removed again in edit mode (open the dashboard with ?edit=1 to edit while it is hidden).
 */
export type HeaderMode = 'hide' | 'blend' | 'default';

const STYLE_ID = 'ha-start-dashboard-header';

export function headerCss(mode: HeaderMode): string {
  if (mode === 'hide') {
    return `
      .header { display: none !important; }
      #view { padding-top: 0 !important; min-height: 100vh !important; }`;
  }
  if (mode === 'blend') {
    return `
      .header { background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: none !important; border: none !important; }
      #view { padding-top: 0 !important; }`;
  }
  return '';
}

interface HuiRoot extends HTMLElement {
  lovelace?: { editMode?: boolean };
}

/** Find the hui-root that hosts `el`, crossing shadow roots. */
export function findHuiRoot(el: Node): HuiRoot | null {
  let n: Node | null = el;
  while (n) {
    if (n instanceof HTMLElement && n.tagName === 'HUI-ROOT') return n as HuiRoot;
    n = n.parentNode ?? (n instanceof ShadowRoot ? n.host : null);
  }
  return null;
}

/** Apply (or remove) the header style; call on every update, it is cheap. */
export function applyHeader(el: HTMLElement, mode: HeaderMode): boolean {
  const root = findHuiRoot(el);
  const sr = root?.shadowRoot;
  if (!root || !sr) return false;
  const css = root.lovelace?.editMode ? '' : headerCss(mode);
  let style = sr.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!css) {
    style?.remove();
    return false;
  }
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    sr.appendChild(style);
  }
  if (style.textContent !== css) style.textContent = css;
  return true;
}

export function removeHeader(el: HTMLElement) {
  findHuiRoot(el)?.shadowRoot?.getElementById(STYLE_ID)?.remove();
}
