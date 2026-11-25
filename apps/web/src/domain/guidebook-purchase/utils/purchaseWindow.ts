import { parseReturnUrl } from './returnUrl';

/** window.close() 가 먹는 환경이면 이 안에 창이 닫힌다. 그래도 남아 있으면 닫을 수 없는 환경이다 */
const CLOSE_WAIT_MS = 300;

type PurchaseWindow = Pick<Window, 'close' | 'closed' | 'location'>;

/**
 * 구매 창의 확인·닫기. 먼저 창을 닫아 보고, 짧게 기다려도 창이 남아 있으면(새 탭, 앱 갔다 온 모바일,
 * 인앱 브라우저 등) 검증을 통과한 returnUrl 로 이동한다. returnUrl 이 없거나 검증에 실패하면 닫기만
 * 시도한다. 값은 쓰는 이 자리에서 검증한다.
 */
export const closePurchaseWindow = (
  returnUrl: string | null,
  win: PurchaseWindow = window,
) => {
  win.close();

  const safeUrl = parseReturnUrl(returnUrl);
  if (!safeUrl) return;

  window.setTimeout(() => {
    if (!win.closed) win.location.assign(safeUrl);
  }, CLOSE_WAIT_MS);
};
