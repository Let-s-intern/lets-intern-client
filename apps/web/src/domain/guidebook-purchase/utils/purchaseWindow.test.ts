import {
  closePurchaseWindow,
  notifyPurchaseSuccess,
  PURCHASE_MESSAGE_TYPE,
} from './purchaseWindow';

const RETURN_URL = 'https://ogonggo.co.kr/reports/fnb';

const createWindow = ({ closeWorks }: { closeWorks: boolean }) => {
  const win = {
    closed: false,
    close: jest.fn(() => {
      if (closeWorks) win.closed = true;
    }),
    location: { assign: jest.fn() },
  };
  return win;
};

describe('closePurchaseWindow', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('창이 닫히면 returnUrl 로 이동하지 않는다', () => {
    const win = createWindow({ closeWorks: true });

    closePurchaseWindow(RETURN_URL, win as never);
    jest.runAllTimers();

    expect(win.close).toHaveBeenCalled();
    expect(win.location.assign).not.toHaveBeenCalled();
  });

  it('창이 닫히지 않으면 짧게 기다린 뒤 returnUrl 로 이동한다', () => {
    const win = createWindow({ closeWorks: false });

    closePurchaseWindow(RETURN_URL, win as never);
    expect(win.location.assign).not.toHaveBeenCalled();
    jest.runAllTimers();

    expect(win.location.assign).toHaveBeenCalledWith(RETURN_URL);
  });

  it.each([
    ['허용 목록에 없는 주소', 'https://evil.com/phish'],
    ['도메인 뒤에 붙인 속임수', 'https://ogonggo.co.kr.evil.com/'],
    ['프로토콜 상대 주소', '//evil.com'],
    ['returnUrl 없음', null],
  ])('%s 는 이동하지 않고 닫기만 시도한다', (_name, returnUrl) => {
    const win = createWindow({ closeWorks: false });

    closePurchaseWindow(returnUrl, win as never);
    jest.runAllTimers();

    expect(win.close).toHaveBeenCalled();
    expect(win.location.assign).not.toHaveBeenCalled();
  });
});

describe('notifyPurchaseSuccess', () => {
  it('연 창에 성공을 보내고 targetOrigin 은 검증된 returnUrl 의 origin 이다', () => {
    const postMessage = jest.fn();

    notifyPurchaseSuccess(12, RETURN_URL, { opener: { postMessage } });

    expect(postMessage).toHaveBeenCalledWith(
      { type: PURCHASE_MESSAGE_TYPE, status: 'success', guidebookId: 12 },
      'https://ogonggo.co.kr',
    );
  });

  it('연결이 끊겨 opener 가 없으면 보내지 않는다', () => {
    expect(() =>
      notifyPurchaseSuccess(12, RETURN_URL, { opener: null }),
    ).not.toThrow();
  });

  it.each([
    ['허용 목록에 없는 주소', 'https://evil.com/phish'],
    ['returnUrl 없음', null],
  ])('%s 로는 보내지 않는다', (_name, returnUrl) => {
    const postMessage = jest.fn();

    notifyPurchaseSuccess(12, returnUrl, { opener: { postMessage } });

    expect(postMessage).not.toHaveBeenCalled();
  });
});
