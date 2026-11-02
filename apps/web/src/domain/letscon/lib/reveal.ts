import type { CSSProperties } from 'react';

/** 묶음 안에서 순서대로 나타나도록 등장 시차를 준다 */
export const revealDelay = (index: number, stepMs = 50) =>
  ({ '--reveal-delay': `${index * stepMs}ms` }) as CSSProperties;
