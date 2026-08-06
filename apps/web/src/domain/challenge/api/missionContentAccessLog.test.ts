const postMock = jest.fn();

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: (...args: unknown[]) => postMock(...args) },
}));

import { logMissionContentAccess } from './missionContentAccessLog';

/** .catch() 가 붙기 전에 reject 가 새는지 보기 위해 매크로태스크까지 한 번 넘긴다. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('logMissionContentAccess', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    postMock.mockReset();
    postMock.mockResolvedValue({ data: {} });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('필수 콘텐츠 열람을 적재 엔드포인트로 보낸다', () => {
    logMissionContentAccess({
      challengeId: 12,
      missionId: 34,
      contentId: 56,
      contentType: 'ESSENTIAL',
    });

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith('/access-log/mission-content', {
      challengeId: 12,
      missionId: 34,
      contentId: 56,
      contentType: 'ESSENTIAL',
    });
  });

  it('템플릿은 콘텐츠 id 가 없으므로 contentId 키 자체를 생략한다', () => {
    logMissionContentAccess({
      challengeId: 12,
      missionId: 34,
      contentType: 'TEMPLATE',
    });

    expect(postMock).toHaveBeenCalledWith('/access-log/mission-content', {
      challengeId: 12,
      missionId: 34,
      contentType: 'TEMPLATE',
    });
    const [, body] = postMock.mock.calls[0];
    expect('contentId' in body).toBe(false);
  });

  it('contentId 가 없으면 0 등 임의값을 채우지 않고 생략한다', () => {
    logMissionContentAccess({
      challengeId: 12,
      missionId: 34,
      contentId: undefined,
      contentType: 'ADDITIONAL',
    });

    const [, body] = postMock.mock.calls[0];
    expect('contentId' in body).toBe(false);
  });

  it.each([
    ['challengeId 가 없으면', { challengeId: null, missionId: 34 }],
    ['missionId 가 없으면', { challengeId: 12, missionId: null }],
    ['둘 다 없으면', { challengeId: null, missionId: null }],
    ['challengeId 가 NaN 이면', { challengeId: Number.NaN, missionId: 34 }],
  ])('%s 어느 미션인지 특정할 수 없으므로 보내지 않는다', (_label, ids) => {
    logMissionContentAccess({
      ...ids,
      contentId: 56,
      contentType: 'ESSENTIAL',
    });

    expect(postMock).not.toHaveBeenCalled();
  });

  it('요청이 실패해도 예외를 던지지 않고 콘솔에만 남긴다', async () => {
    postMock.mockRejectedValue(new Error('500 Internal Server Error'));

    expect(() =>
      logMissionContentAccess({
        challengeId: 12,
        missionId: 34,
        contentId: 56,
        contentType: 'ESSENTIAL',
      }),
    ).not.toThrow();

    await flush();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('요청 실패가 unhandled rejection 을 만들지 않는다', async () => {
    const rejections: unknown[] = [];
    const onUnhandled = (reason: unknown) => rejections.push(reason);
    process.on('unhandledRejection', onUnhandled);

    postMock.mockRejectedValue(new Error('network error'));
    logMissionContentAccess({
      challengeId: 12,
      missionId: 34,
      contentType: 'TEMPLATE',
    });

    await flush();
    process.off('unhandledRejection', onUnhandled);

    expect(rejections).toEqual([]);
  });

  it('응답을 기다리지 않는다 — 반환값이 없다', () => {
    postMock.mockReturnValue(new Promise(() => {})); // 영원히 pending

    expect(
      logMissionContentAccess({
        challengeId: 12,
        missionId: 34,
        contentId: 56,
        contentType: 'ADDITIONAL',
      }),
    ).toBeUndefined();
  });
});
