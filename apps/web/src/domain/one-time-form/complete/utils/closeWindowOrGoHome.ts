/** 테스트에서 가짜 창을 넣을 수 있도록 필요한 속성만 받는다 */
export type ClosableWindow = Pick<Window, 'close' | 'closed'>;

/**
 * 팝업 창을 닫는다. 스크립트가 연 창이 아니면 브라우저가 close() 를 무시해 closed 가 false 로 남는다.
 * 그때는 홈으로 보낸다.
 */
export const closeWindowOrGoHome = (
  win: ClosableWindow,
  goHome: () => void,
): void => {
  win.close();
  if (!win.closed) goHome();
};
