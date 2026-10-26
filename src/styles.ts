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
  /* State-driven device motion (components/motion.ts). Only the moving part carries the class. */
  .spin,
  .tumble,
  .spray,
  .bob,
  .wobble,
  .breathe,
  .rain,
  .snow,
  .drift,
  .rays,
  .flash {
    transform-box: fill-box;
    transform-origin: center;
  }
  .spin {
    animation: spin 1.4s linear infinite;
  }
  .spin.s1 {
    animation-duration: 2.4s;
  }
  .spin.s2 {
    animation-duration: 1.4s;
  }
  .spin.s3 {
    animation-duration: 0.8s;
  }
  .tumble {
    animation: spin 1.2s linear infinite;
  }
  .spray {
    animation: spray 1.1s ease-in-out infinite;
  }
  .bob {
    animation: bob 1.6s ease-in-out infinite;
  }
  .wobble {
    animation: wobble 1.2s ease-in-out infinite;
  }
  .breathe {
    animation: breathe 5s ease-in-out infinite;
  }
  .rain {
    animation: fall 2s ease-in infinite;
  }
  .rain.late {
    animation-delay: -1s;
  }
  .snow {
    animation: fall 3.6s linear infinite;
  }
  .snow.late {
    animation-delay: -1.8s;
  }
  .drift {
    animation: drift 6s ease-in-out infinite;
  }
  .rays {
    animation: spin 20s linear infinite;
  }
  .flash {
    animation: flash 6s linear infinite;
  }
  @keyframes fall {
    0% {
      opacity: 0;
      transform: translateY(-4px);
    }
    25%,
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(4px);
    }
  }
  @keyframes drift {
    50% {
      transform: translateX(1.5px);
    }
  }
  @keyframes flash {
    0%,
    88%,
    100% {
      opacity: 0.3;
    }
    90%,
    94% {
      opacity: 1;
    }
    92% {
      opacity: 0.4;
    }
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes spray {
    50% {
      opacity: 0.25;
      transform: translateY(1.5px);
    }
  }
  @keyframes bob {
    50% {
      transform: translateY(1.5px);
    }
  }
  @keyframes wobble {
    25% {
      transform: rotate(-9deg);
    }
    75% {
      transform: rotate(9deg);
    }
  }
  @keyframes breathe {
    50% {
      box-shadow: 0 0 14px 3px rgba(255, 159, 10, 0.55);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .spin,
    .tumble,
    .spray,
    .bob,
    .wobble,
    .breathe,
    .rain,
    .snow,
    .drift,
    .rays,
    .flash {
      animation: none;
    }
  }
`;
