import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// mockNow는 라이브 모달이 시연용으로 잡혀 있어 setInterval이 멈춰 있음.
// 테스트는 그대로 사용 (시연 시각 = 2026-05-04 09:45)

import LiveFeedbackReservationModal from '../modal/LiveFeedbackReservationModal';
import type { PeriodBarData } from '../types';

const axiosMock = vi.mocked(axios, true);

function makeBar(overrides: Partial<PeriodBarData> = {}): PeriodBarData {
  return {
    barType: 'live-feedback',
    challengeId: 1,
    missionId: 101,
    challengeTitle: '자소서 챌린지 7기',
    th: 5,
    startDate: '2026-05-04',
    endDate: '2026-05-04',
    feedbackStartDate: '2026-05-04',
    feedbackDeadline: '2026-05-04',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    liveFeedback: {
      id: 101,
      menteeName: '이지수',
      startTime: '10:00',
      endTime: '10:30',
    },
    ...overrides,
  };
}

function renderModal(bar: PeriodBarData) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <LiveFeedbackReservationModal
        isOpen
        onClose={() => {}}
        bar={bar}
        liveFeedbackBars={[bar]}
        onSelectBar={() => {}}
      />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  axiosMock.get.mockResolvedValue({
    data: {
      data: {
        feedbackInfo: {
          feedbackId: 101,
          startDate: '2026-05-04T10:00:00+09:00',
          endDate: '2026-05-04T10:30:00+09:00',
          meetingUrl: null,
          status: 'RESERVED',
        },
      },
    },
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('LiveFeedbackReservationModal — 디자인 개편 영역', () => {
  it('헤더에 "LIVE 피드백" 라벨이 노출된다', () => {
    renderModal(makeBar());
    expect(
      screen.getByText(/자소서 챌린지 7기.*5차 LIVE 피드백/),
    ).toBeInTheDocument();
  });

  it('헤더 4종 카운터(대기/진행 중/완료/미완료)가 노출된다', () => {
    renderModal(makeBar());
    // 데스크탑/모바일 양쪽에서 노출되므로 getAllByText 사용
    expect(screen.getAllByText(/대기/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/진행 중/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/완료/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/미완료/).length).toBeGreaterThan(0);
  });

  it('액션 패널에 "예약 일시" / "줌 회의실" / "피드백 상태" 행이 노출된다', () => {
    renderModal(makeBar());
    expect(screen.getByText('예약 일시')).toBeInTheDocument();
    expect(screen.getByText('줌 회의실')).toBeInTheDocument();
    expect(screen.getByText('피드백 상태')).toBeInTheDocument();
  });

  it('meetingUrl 이 null 이면 ZEP 영역에 "미정"이 표시된다', () => {
    renderModal(makeBar());
    expect(screen.getByText('미정')).toBeInTheDocument();
  });

  it('푸터에 "멘티와 대화하기" 버튼이 disabled 로 노출된다', () => {
    renderModal(makeBar());
    const btn = screen.getByRole('button', { name: /멘티와 대화하기/ });
    expect(btn).toBeDisabled();
  });

  it('meetingUrl 이 null 이면 "라이브 입장하기" 버튼이 disabled', () => {
    renderModal(makeBar());
    const btn = screen.getByRole('button', { name: '라이브 입장하기' });
    expect(btn).toBeDisabled();
  });

  it('예약 일시 라인이 "YYYY.MM.DD (요일) HH:mm~HH:mm" 형식으로 노출된다', () => {
    renderModal(makeBar());
    // 2026-05-04 = 월요일
    expect(screen.getByText(/2026\.05\.04 \(월\) 10:00~10:30/)).toBeInTheDocument();
  });
});
