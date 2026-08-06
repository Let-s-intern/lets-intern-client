/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const postMock = jest.fn();

// 적재 모듈은 그대로 두고 그 아래 axios 만 막는다. 실제 모듈을 거쳐야
// "window.open 이 요청보다 먼저" 를 호출부까지 이어서 단언할 수 있다.
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: (...args: unknown[]) => postMock(...args) },
}));

let mockParams: Record<string, string> = { programId: '12' };
jest.mock('next/navigation', () => ({
  useParams: () => mockParams,
}));

import dayjs from '@/lib/dayjs';
import { UserChallengeMissionWithAttendance } from '@/schema';
import MissionGuideZeroSection from './MissionGuideZeroSection';

const buildMissionData = (
  missionInfo: Partial<UserChallengeMissionWithAttendance['missionInfo']> = {},
): UserChallengeMissionWithAttendance => ({
  missionInfo: {
    id: 34,
    th: 0,
    title: 'OT 시청',
    startDate: dayjs().subtract(1, 'day'),
    endDate: dayjs().add(1, 'day'),
    essentialContentsList: [{ id: 56, title: '필수 자료', link: 'https://e' }],
    additionalContentsList: [{ id: 78, title: '추가 자료', link: 'https://a' }],
    status: 'WAITING',
    ...missionInfo,
  },
  attendanceInfo: null,
  userDocumentInfos: null,
});

const renderSection = (
  missionInfo?: Partial<UserChallengeMissionWithAttendance['missionInfo']>,
) =>
  render(
    <MissionGuideZeroSection
      selectedMissionTh={0}
      missionData={buildMissionData(missionInfo)}
    />,
  );

// 버튼의 접근성 이름에 아이콘 alt("file icon") 가 함께 잡히므로 부분 일치로 찾는다.
const clickLink = async (name: string) => {
  await userEvent.click(screen.getByRole('button', { name: new RegExp(name) }));
};

/** 마지막 post 호출의 바디 */
const lastBody = () => postMock.mock.calls.at(-1)?.[1];

describe('MissionGuideZeroSection 미션 자료 열람 기록', () => {
  let openSpy: jest.SpyInstance;

  beforeEach(() => {
    mockParams = { programId: '12' };
    postMock.mockReset();
    postMock.mockResolvedValue({ data: {} });
    openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('필수 콘텐츠를 열면 ESSENTIAL 과 해당 콘텐츠 id 로 기록한다', async () => {
    renderSection();
    await clickLink('필수 자료');

    expect(openSpy).toHaveBeenCalledWith('https://e', '_blank');
    expect(postMock).toHaveBeenCalledWith('/access-log/mission-content', {
      challengeId: 12,
      missionId: 34,
      contentId: 56,
      contentType: 'ESSENTIAL',
    });
  });

  it('추가 콘텐츠를 열면 ADDITIONAL 과 해당 콘텐츠 id 로 기록한다', async () => {
    renderSection();
    await clickLink('추가 자료');

    expect(openSpy).toHaveBeenCalledWith('https://a', '_blank');
    expect(lastBody()).toEqual({
      challengeId: 12,
      missionId: 34,
      contentId: 78,
      contentType: 'ADDITIONAL',
    });
  });

  // 이 단언이 팝업 차단 회귀를 잡는 유일한 수단이다.
  // 기록 요청을 await 한 뒤로 window.open 을 옮기면 여기서 깨진다.
  it.each([['필수 자료'], ['추가 자료']])(
    '%s — window.open 이 기록 요청보다 먼저 호출된다',
    async (name) => {
      renderSection();
      await clickLink(name);

      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledTimes(1);
      expect(openSpy.mock.invocationCallOrder[0]).toBeLessThan(
        postMock.mock.invocationCallOrder[0],
      );
    },
  );

  it('기록 요청이 실패해도 window.open 은 호출되고 unhandled rejection 이 나지 않는다', async () => {
    const rejections: unknown[] = [];
    const onUnhandled = (reason: unknown) => rejections.push(reason);
    process.on('unhandledRejection', onUnhandled);
    postMock.mockRejectedValue(new Error('500'));

    renderSection();
    await clickLink('추가 자료');
    await new Promise((resolve) => setTimeout(resolve, 0));
    process.off('unhandledRejection', onUnhandled);

    expect(openSpy).toHaveBeenCalledWith('https://a', '_blank');
    expect(rejections).toEqual([]);
  });

  it('링크가 없으면 열지도 기록하지도 않는다', async () => {
    renderSection({
      essentialContentsList: [{ id: 56, title: '필수 자료', link: null }],
      additionalContentsList: [{ id: 78, title: '추가 자료', link: null }],
    });

    await clickLink('필수 자료');
    await clickLink('추가 자료');

    // 기존 동작(링크가 없으면 아무것도 하지 않는다)은 그대로 둔다.
    expect(openSpy).not.toHaveBeenCalled();
    expect(postMock).not.toHaveBeenCalled();
  });

  it('challengeId 를 알 수 없으면 기록하지 않는다', async () => {
    mockParams = {};

    renderSection();
    await clickLink('필수 자료');

    expect(openSpy).toHaveBeenCalledWith('https://e', '_blank');
    expect(postMock).not.toHaveBeenCalled();
  });

  it('missionId 를 알 수 없으면 기록하지 않는다', async () => {
    renderSection({ id: 0 });
    await clickLink('추가 자료');

    expect(openSpy).toHaveBeenCalledWith('https://a', '_blank');
    expect(postMock).not.toHaveBeenCalled();
  });
});
