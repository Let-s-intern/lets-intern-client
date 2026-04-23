const Y_OFFSET = 12;
const DURATION = 0.55;

export const FADE_IN = (delay = 0) => ({
  initial: { opacity: 0, y: Y_OFFSET },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' } as const,
  transition: { duration: DURATION, delay },
});
