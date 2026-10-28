import { closeWindowOrGoHome } from './closeWindowOrGoHome';

describe('closeWindowOrGoHome', () => {
  it('창이 닫히면 이동하지 않는다', () => {
    const win = {
      closed: false,
      close: jest.fn(() => {
        win.closed = true;
      }),
    };
    const goHome = jest.fn();

    closeWindowOrGoHome(win, goHome);

    expect(win.close).toHaveBeenCalled();
    expect(goHome).not.toHaveBeenCalled();
  });

  it('브라우저가 닫기를 막으면 홈으로 보낸다', () => {
    const win = { closed: false, close: jest.fn() };
    const goHome = jest.fn();

    closeWindowOrGoHome(win, goHome);

    expect(win.close).toHaveBeenCalled();
    expect(goHome).toHaveBeenCalled();
  });
});
