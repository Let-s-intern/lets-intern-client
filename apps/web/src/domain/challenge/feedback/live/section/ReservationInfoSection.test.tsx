/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { FeedbackInfo, Mentor } from '../types';
import ReservationInfoSection from './ReservationInfoSection';

// @jitsi/react-sdk(ESM)는 jest가 그대로 파싱하지 못하므로 임베드 본문을 경량 스텁으로
// 대체한다. 방 URL 은 BE meetingUrl 을 그대로 받는다(스텁의 data-room-url 로 검증).
jest.mock('@letscareer/ui/JitsiEmbed', () => ({
  __esModule: true,
  JitsiEmbed: ({ roomUrl }: { roomUrl: string }) => (
    <div data-testid="jitsi-embed" data-room-url={roomUrl} />
  ),
}));

const FEEDBACK_ID = 4242;
const MEETING_URL = 'https://meet.jit.si/letscareer-x7k2p9';

const mentor: Mentor = {
  nickname: '김멘토',
  introduction: '멘토 소개입니다.',
  profileImgUrl: '',
};

const feedbackInfo: FeedbackInfo = {
  feedbackId: FEEDBACK_ID,
  startDate: '2026-05-04T10:00:00+09:00',
  endDate: '2026-05-04T10:30:00+09:00',
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

  it('meetingUrl 미생성(null) 시 입장 모달이 회의실 준비 중 안내를 표시한다', async () => {
    const user = userEvent.setup();
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

    expect(screen.queryByTestId('jitsi-embed')).not.toBeInTheDocument();
    expect(
      screen.getByText(/회의실이 아직 준비되지 않았습니다/),
    ).toBeInTheDocument();
  });
});
