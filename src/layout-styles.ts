import { css } from 'lit';

/**
 * Tablet and wide layouts of the card shell (design/ipad mockups). The phone layout lives in the
 * card's own styles; everything here is scoped to the host's `layout` attribute.
 */
export const layoutStyles = css`
  /* Tablet (iPad portrait): full width, bottom navigation. */
  :host([layout='tablet']) .content,
  :host([layout='wide']) .content {
    max-width: none;
  }
  :host([layout='tablet']) .content {
    padding: 24px 24px 20px;
  }
  :host([layout='tablet']) .nav {
    max-width: 560px;
  }

  /* Wide (iPad landscape, MacBook): rail on the left, the page fills the screen. */
  :host([layout='wide']) .wrap {
    flex-direction: row;
    gap: 18px;
    height: calc(100dvh - var(--header-height, 56px));
    min-height: 0;
    padding: 22px 24px 22px 16px;
    overflow: hidden;
  }
  :host([layout='wide']) .wrap.hdr-hide {
    height: calc(100dvh);
    padding-top: calc(22px + env(safe-area-inset-top));
  }
  :host([layout='wide']) .wrap.hdr-blend {
    height: calc(100dvh);
    padding-top: calc(var(--header-height, 56px) + 22px + env(safe-area-inset-top));
  }
  :host([layout='wide']) .content {
    flex: 1;
    min-width: 0;
    min-height: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  :host([layout='wide']) .content > * {
    flex: 1;
    min-height: 0;
  }
  :host([layout='wide']) .nav {
    order: -1;
    position: relative;
    bottom: auto;
    align-self: center;
    flex-shrink: 0;
    flex-direction: column;
    gap: 6px;
    width: 76px;
    margin: 0;
    padding: 6px;
    border-radius: 38px;
  }
  :host([layout='wide']) .nav .lens {
    display: none;
  }
  :host([layout='wide']) .nav .tab {
    flex: none;
    flex-direction: column;
    gap: 4px;
    height: 64px;
    border-radius: 32px;
    font-size: 11px;
  }
  :host([layout='wide']) .nav .tab.active {
    background: #fff;
    color: #101218;
  }
  /* Columns of a wide page scroll on their own when they do not fit. */
  .wcol {
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  :host([layout='wide']) .wcol {
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: none;
  }
  :host([layout='wide']) .wcol::-webkit-scrollbar {
    display: none;
  }
  .wcard {
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.06);
  }
`;
