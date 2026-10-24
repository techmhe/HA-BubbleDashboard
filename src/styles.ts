import { css } from 'lit';

// Design tokens and shared styles, ported from the inline styles in design/*.dc.html.
export const baseStyles = css`
  :host {
    --sd-bg: #101218;
    --sd-sheet: #181a22;
    --sd-text: #ffffff;
    --sd-muted: rgba(255, 255, 255, 0.72);
    --sd-fill: rgba(255, 255, 255, 0.07);
    --sd-fill-2: rgba(255, 255, 255, 0.12);
    --sd-rule: rgba(255, 255, 255, 0.12);
    --sd-green: #30d158;
    --sd-yellow: #ffd60a;
    --sd-red: #ff453a;
    --sd-orange: #ff9f0a;
    --sd-blue: #5ac8fa;
    --sd-purple: #bf9bff;
    display: block;
    font-family: Rubik, system-ui, -apple-system, sans-serif;
    color: var(--sd-text);
    -webkit-tap-highlight-color: transparent;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  button {
    font-family: inherit;
    color: inherit;
    cursor: pointer;
    border: none;
    padding: 0;
    background: none;
    text-align: inherit;
    -webkit-user-select: none;
    user-select: none;
  }
  button:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 2px;
  }
  h1,
  h2 {
    margin: 0;
  }
  svg {
    display: block;
    flex-shrink: 0;
  }
  .circle {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  .section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .section-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 4px 6px 2px;
  }
  .section-head h2 {
    font-size: 15px;
    font-weight: 600;
  }
  .section-head .rule {
    flex: 1;
    height: 2px;
    border-radius: 1px;
    background: var(--sd-rule);
  }
  .section-head .meta {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 12px;
    color: var(--sd-muted);
  }
  .dot {
    flex-shrink: 0;
    width: 7px;
    height: 7px;
    border-radius: 4px;
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .grow {
    flex: 1;
    min-width: 0;
  }
`;
