const postMock = jest.fn();

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: (...args: unknown[]) => postMock(...args) },
}));

import { logMissionAccess } from './missionAccessLog';

/** .catch() 가 붙기 전에 reject 가 새는지 보기 위해 매크로태스크까지 한 번 넘긴다. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('logMissionAccess', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    postMock.mockReset();
    postMock.mockResolvedValue({ data: {} });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('챌린지와 미션을 담아 미션 열람을 기록한다', () => {
    logMissionAccess({ challengeId: 319, missionId: 8842 });

    expect(postMock).toHaveBeenCalledWith('/access-log/mission', {
      challengeId: 319,
      missionId: 8842,
    });
  });

  it('챌린지를 모르면 보내지 않는다', () => {
    // 어느 챌린지의 미션인지 모르는 기록은 환불 분쟁에서 증빙이 되지 않는다.
    logMissionAccess({ challengeId: null, missionId: 8842 });

    expect(postMock).not.toHaveBeenCalled();
  });

  it('미션을 모르면 보내지 않는다', () => {
    logMissionAccess({ challengeId: 319, missionId: undefined });

    expect(postMock).not.toHaveBeenCalled();
  });

  it('기록이 실패해도 예외가 새어나가지 않는다', async () => {
    // 기록 실패로 미션이 안 열리면 안 된다. unhandled rejection 도 남기지 않는다.
    postMock.mockRejectedValue(new Error('network'));

    expect(() =>
      logMissionAccess({ challengeId: 319, missionId: 8842 }),
    ).not.toThrow();

    await flush();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
