/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { FeedbackInfo, Mentor } from '../types';
import ReservationInfoSection from './ReservationInfoSection';

// Jitsi 임베드(ESM)는 채팅 테스트와 무관하므로 경량 스텁으로 대체.
jest.mock('@letscareer/ui/JitsiEmbed', () => ({
  __esModule: true,
  JitsiEmbed: () => <div data-testid="jitsi-embed" />,
}));

// 입장 핸들러가 쓰는 회의실 URL PATCH 훅 스텁 — axios(@letscareer/api)·QueryClient 체인 차단.
jest.mock('@/api/feedback/feedback', () => ({
  __esModule: true,
  usePatchFeedbackMeetingUrl: () => ({
    mutateAsync: jest.fn().mockResolvedValue(undefined),
  }),
}));

// 멘티 채팅 로스터 훅도 user api(axios) 체인을 끌어오므로 스텁으로 대체(fallback 방 사용).
jest.mock('../useMenteeChatRooms', () => ({
  useMenteeChatRooms: () => [],
}));

// 채팅 모달은 PocketBase 클라이언트를 끌어오므로 스텁으로 대체.
// 여기서는 앱 측 배선(노출 조건·전달 props·open)만 검증한다.
jest.mock('@letscareer/chat/ui/ChatModal', () => ({
  __esModule: true,
  default: ({
    role,
    activeFeedbackId,
  }: {
    role: string;
    activeFeedbackId?: number | null;
  }) => (
    <div
      data-testid="chat-modal"
      data-role={role}
      data-active-feedback-id={activeFeedbackId ?? ''}
    />
  ),
}));

const mentor: Mentor = {
  nickname: '김멘토',
  introduction: '멘토 소개입니다.',
  profileImgUrl: '',
};

const feedbackInfo: FeedbackInfo = {
  feedbackId: 4242,
  startDate: '2026-05-04T10:00:00+09:00',
  endDate: '2026-05-04T10:30:00+09:00',
  meetingUrl: 'https://zoom.example.com/j/abc',
  status: 'RESERVED',
  mentorStatus: null,
  menteeStatus: null,
  score: null,
  review: null,
};

describe('ReservationInfoSection — 멘토에게 연락하기 (채팅 진입)', () => {
  it('feedbackId 가 없으면 "멘토에게 연락하기" 버튼이 노출되지 않는다', () => {
    render(
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={null}
        status="prev"
        feedbackId={null}
      />,
    );

    expect(
      screen.queryByRole('button', { name: '멘토에게 연락하기' }),
    ).not.toBeInTheDocument();
  });

  it('feedbackId 보유 시 버튼이 노출되고, 클릭 전에는 모달이 마운트되지 않는다', () => {
    render(
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={feedbackInfo}
        status="reserved"
        feedbackId={4242}
      />,
    );

    expect(
      screen.getByRole('button', { name: '멘토에게 연락하기' }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('chat-modal')).not.toBeInTheDocument();
  });

  it('버튼 클릭 시 role="mentee" · 해당 feedbackId 로 채팅 모달이 열린다', async () => {
    const user = userEvent.setup();
    render(
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={feedbackInfo}
        status="reserved"
        feedbackId={4242}
      />,
    );

    await user.click(screen.getByRole('button', { name: '멘토에게 연락하기' }));

    const modal = await screen.findByTestId('chat-modal');
    expect(modal).toHaveAttribute('data-role', 'mentee');
    expect(modal).toHaveAttribute('data-active-feedback-id', '4242');
  });
});
