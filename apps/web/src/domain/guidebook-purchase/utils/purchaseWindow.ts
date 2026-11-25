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

/** 오공고 등 연 쪽이 받는 메시지의 type. 신호일 뿐이고 구매 여부의 근거로 삼지 않는다 */
export const PURCHASE_MESSAGE_TYPE = 'letscareer:guidebook-purchase';

/**
 * 신청이 끝나면 연 창에 성공을 알린다. targetOrigin 은 검증된 returnUrl 의 origin 이라 '*' 를 쓰지
 * 않는다. 결제 도중 창 연결이 끊기면(opener 없음) 보내지 않고, 받는 쪽도 이 신호에 기대지 않는다.
 */
export const notifyPurchaseSuccess = (
  guidebookId: number,
  returnUrl: string | null,
  win: Pick<Window, 'opener'> = window,
) => {
  const safeUrl = parseReturnUrl(returnUrl);
  if (!safeUrl || !win.opener) return;

  win.opener.postMessage(
    { type: PURCHASE_MESSAGE_TYPE, status: 'success', guidebookId },
    new URL(safeUrl).origin,
  );
};
