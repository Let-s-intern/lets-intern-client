/** [E2E HH:MM:SS] prefix 가 붙은 콘솔 로그. */
export function log(message: string): void {
  const ts = new Date().toISOString().slice(11, 19);
  // eslint-disable-next-line no-console
  console.log(`[E2E ${ts}] ${message}`);
}
