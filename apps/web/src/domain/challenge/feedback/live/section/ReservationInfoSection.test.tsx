/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { FeedbackInfo, Mentor } from '../types';
import ReservationInfoSection from './ReservationInfoSection';

// @jitsi/react-sdk(ESM)는 jest가 그대로 파싱하지 못하므로 임베드 본문을 경량 스텁으로
// 대체한다. 방 URL 은 BE meetingUrl 을 그대로 받는다(스텁의 data-room-url 로 검증).
jest.mock('@letscareer/live-session/JitsiEmbed', () => ({
  __esModule: true,
  // onJoined/onClose 를 버튼으로 노출해 "참가 → 종료" 흐름을 테스트에서 구동한다.
  JitsiEmbed: ({
    roomUrl,
    onClose,
    onJoined,
  }: {
    roomUrl: string;
    onClose: () => void;
    onJoined?: () => void;
  }) => (
    <div data-testid="jitsi-embed" data-room-url={roomUrl}>
      <button type="button" onClick={() => onJoined?.()}>
        회의참가
      </button>
      <button type="button" onClick={onClose}>
        회의종료
      </button>
    </div>
  ),
  LiveSessionTimer: () => <div data-testid="live-session-timer" />,
  LiveFeedbackMaterials: () => <div data-testid="live-feedback-materials" />,
}));

// 입장 핸들러가 쓰는 회의실 URL PATCH 훅 스텁 — axios(@letscareer/api)·QueryClient 체인 차단.
jest.mock('@/api/feedback/feedback', () => ({
  __esModule: true,
  usePatchFeedbackMeetingUrl: () => ({
    mutateAsync: jest.fn().mockResolvedValue(undefined),
  }),
  // 종료 후 정리 모달(LiveFeedbackReviewModal)이 함께 렌더되므로 저장 훅도 필요하다.
  usePatchFeedbackReview: () => ({ mutate: jest.fn(), isPending: false }),
}));

const FEEDBACK_ID = 4242;
const MEETING_URL = 'https://meet.jit.si/letscareer-x7k2p9';

const mentor: Mentor = {
  nickname: '김멘토',
  introduction: '멘토 소개입니다.',
  profileImgUrl: '',
};

// 입장 게이트(isEntranceActive)는 "시작 10분 전 ~ 종료 전"에만 활성이므로,
// 입장 버튼을 누르는 테스트는 시작 +5분 / 종료 +35분(=현재 입장 가능)으로 둔다.
const feedbackInfo: FeedbackInfo = {
  feedbackId: FEEDBACK_ID,
  startDate: new Date(Date.now() + 5 * 60_000).toISOString(),
  endDate: new Date(Date.now() + 35 * 60_000).toISOString(),
  meetingUrl: MEETING_URL,
  status: 'RESERVED',
  mentorStatus: null,
  menteeStatus: null,
  score: null,
  review: null,
};

describe('ReservationInfoSection — LIVE 피드백 입장 (Jitsi)', () => {
  beforeAll(() => {
    if (!document.getElementById('modal')) {
      const root = document.createElement('div');
      root.id = 'modal';
      document.body.appendChild(root);
    }
  });

  it('클릭 전에는 Jitsi 임베드가 마운트되지 않는다', () => {
    render(
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={feedbackInfo}
        status="reserved"
        feedbackId={FEEDBACK_ID}
      />,
    );

    expect(screen.queryByTestId('jitsi-embed')).not.toBeInTheDocument();
  });

  it('"LIVE 피드백 입장하기" 클릭 시 BE meetingUrl 로 동일 방에 임베드된다', async () => {
    const user = userEvent.setup();
    render(
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={feedbackInfo}
        status="reserved"
        feedbackId={FEEDBACK_ID}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'LIVE 피드백 입장하기' }),
    );

    const embed = screen.getByTestId('jitsi-embed');
    // BE 가 합성한 meetingUrl(= base + 랜덤 meetingRoom)이 그대로 임베드에 전달되어
    // 멘토/멘티가 동일 방으로 수렴한다.
    expect(embed).toHaveAttribute('data-room-url', MEETING_URL);
  });

  it('meetingUrl 미생성(null) + 살아있는 회의실 도메인이 없으면 알림 후 입장하지 않는다', async () => {
    // 입장 순서 무관(데드락 방지): meetingUrl 이 null 이어도 멘티가 직접 헬스체크 후
    // 회의실을 생성(PATCH)하려 시도한다. 단, 살아있는 도메인이 하나도 없으면 알림 후 종료.
    // (생성 성공 경로는 @letscareer/ui ensureLiveMeetingUrl 단위 테스트가 커버)
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    // 환경에 따라 global.fetch 유무가 다르므로 헬스체크가 결정적으로 실패하도록 stub
    // (실제 네트워크 호출/타임아웃 대기로 인한 flaky·지연 방지).
    const originalFetch = global.fetch;
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('health-check down')) as typeof fetch;

    render(
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={{ ...feedbackInfo, meetingUrl: null }}
        status="reserved"
        feedbackId={FEEDBACK_ID}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'LIVE 피드백 입장하기' }),
    );

    // 살아있는 도메인 없음 → 알림·모달 미오픈.
    expect(alertSpy).toHaveBeenCalled();
    expect(screen.queryByTestId('jitsi-embed')).not.toBeInTheDocument();

    global.fetch = originalFetch;
    alertSpy.mockRestore();
  });

  /**
   * 종료 직후 정리 모달 — hangup 과 닫기 버튼이 같은 onClose 로 수렴하므로,
   * "실제로 참가했는가"만이 노출을 가르는 조건이다.
   */
  describe('종료 후 정리 모달', () => {
    const enterAndRender = async (info: FeedbackInfo = feedbackInfo) => {
      const user = userEvent.setup();
      render(
        <ReservationInfoSection
          mentor={mentor}
          feedbackInfo={info}
          status="reserved"
          feedbackId={FEEDBACK_ID}
        />,
      );
      await user.click(
        screen.getByRole('button', { name: 'LIVE 피드백 입장하기' }),
      );
      return user;
    };

    const reviewTitle = () =>
      screen.queryByText('오늘 멘토링, 무엇을 얻으셨나요?');

    it('회의에 참가한 뒤 종료하면 정리 모달이 열린다', async () => {
      const user = await enterAndRender();

      await user.click(screen.getByRole('button', { name: '회의참가' }));
      expect(reviewTitle()).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).toBeVisible();
      expect(screen.queryByTestId('jitsi-embed')).not.toBeInTheDocument();
    });

    it('참가하지 못한 채 닫으면 정리 모달이 열리지 않는다', async () => {
      const user = await enterAndRender();

      // 회의 참가 없이 곧바로 닫기 — 회의실 오류로 못 들어간 경우.
      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).not.toBeInTheDocument();
    });

    it('이미 정리를 마친 세션은 다시 열지 않는다', async () => {
      const user = await enterAndRender({
        ...feedbackInfo,
        score: 5,
        review: '이미 작성한 내용',
      });

      await user.click(screen.getByRole('button', { name: '회의참가' }));
      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).not.toBeInTheDocument();
    });
  });
});
