import { readFileSync } from 'node:fs';
import path from 'node:path';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
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

function makeMentorDetail(overrides: Record<string, unknown> = {}) {
  return {
    feedbackId: 101,
    startDate: '2026-05-04T10:00:00+09:00',
    endDate: '2026-05-04T10:30:00+09:00',
    meetingUrl: null,
    status: 'RESERVED',
    programTitle: '자소서 챌린지 7기',
    attendanceUrl: 'https://example.com/submission/101',
    attendanceStatus: 'PRESENT',
    menteeName: '이지수',
    menteeWishField: '기획 / PM / PO',
    menteeWishIndustry: 'IT · 플랫폼',
    menteeWishCompany: 'Toss',
    preQuestion: '자기소개서 피드백을 받고 싶습니다.',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    ...overrides,
  };
}

beforeEach(() => {
  axiosMock.get.mockResolvedValue({
    data: { data: { feedbackInfo: makeMentorDetail() } },
  });
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
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

  it('Jitsi env 미설정 시 회의실 영역에 "미정"이 표시된다 (unassigned)', () => {
    // env stub 없음 → buildJitsiRoomUrl이 호출되지 않아 meetingUrl=null → unassigned
    vi.stubEnv('VITE_JITSI_BASE_URL', '');
    renderModal(makeBar());
    expect(screen.getByText('미정')).toBeInTheDocument();
  });

  it('Jitsi env 설정 + T-10 이전(09:45 / 시작 10:00) → "10분 전 자동 배정" (pending, T-10 회귀)', () => {
    vi.stubEnv('VITE_JITSI_BASE_URL', 'https://meet.jit.si/');
    renderModal(makeBar());
    // mockNow=2026-05-04 09:45, start=10:00 → 15분 전 → pending
    expect(screen.getByText('10분 전 자동 배정')).toBeInTheDocument();
  });

  it('푸터에 "멘티와 대화하기" 버튼이 disabled 로 노출된다', () => {
    renderModal(makeBar());
    const btn = screen.getByRole('button', { name: /멘티와 대화하기/ });
    expect(btn).toBeDisabled();
  });

  it('Jitsi env 미설정 시 "라이브 입장하기" 버튼이 disabled', () => {
    vi.stubEnv('VITE_JITSI_BASE_URL', '');
    renderModal(makeBar());
    const btn = screen.getByRole('button', { name: '라이브 입장하기' });
    expect(btn).toBeDisabled();
  });

  it('Jitsi env 설정 + T-10 이전 → "라이브 입장하기" 버튼이 여전히 disabled (T-10 룰 회귀)', () => {
    vi.stubEnv('VITE_JITSI_BASE_URL', 'https://meet.jit.si/');
    renderModal(makeBar());
    const btn = screen.getByRole('button', { name: '라이브 입장하기' });
    expect(btn).toBeDisabled();
  });

  it('예약 일시 라인이 "YYYY.MM.DD (요일) HH:mm~HH:mm" 형식으로 노출된다', () => {
    renderModal(makeBar());
    // 2026-05-04 = 월요일
    expect(
      screen.getByText(/2026\.05\.04 \(월\) 10:00~10:30/),
    ).toBeInTheDocument();
  });
});

describe('LiveFeedbackReservationModal — 멘토 상세 API 연동', () => {
  it('상세 응답의 멘티 희망정보(직군/산업/기업)를 렌더한다', async () => {
    renderModal(makeBar());
    await waitFor(() => {
      expect(screen.getByText('기획 / PM / PO')).toBeInTheDocument();
    });
    expect(screen.getByText('IT · 플랫폼')).toBeInTheDocument();
    expect(screen.getByText('Toss')).toBeInTheDocument();
  });

  it('상세 응답의 사전 질문(preQuestion)을 렌더한다', async () => {
    renderModal(makeBar());
    await waitFor(() => {
      expect(
        screen.getByText('자기소개서 피드백을 받고 싶습니다.'),
      ).toBeInTheDocument();
    });
  });

  it('attendanceStatus 가 PRESENT 면 제출 상태가 "제출"로 표기된다', async () => {
    renderModal(makeBar());
    await waitFor(() => {
      expect(screen.getByText('제출 상태')).toBeInTheDocument();
    });
    expect(screen.getByText('제출')).toBeInTheDocument();
  });

  it('attendanceStatus 가 ABSENT 면 제출 상태가 "미제출"로 표기된다', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: {
          feedbackInfo: makeMentorDetail({ attendanceStatus: 'ABSENT' }),
        },
      },
    });
    renderModal(makeBar());
    await waitFor(() => {
      expect(screen.getByText('미제출')).toBeInTheDocument();
    });
  });

  it('attendanceUrl 이 있으면 "제출물 보기"가 새 탭 링크로 노출된다', async () => {
    renderModal(makeBar());
    await waitFor(() => {
      const link = screen.getByRole('link', { name: '제출물 보기' });
      expect(link).toHaveAttribute(
        'href',
        'https://example.com/submission/101',
      );
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('attendanceUrl 이 비어있으면 "제출물 보기" 버튼이 disabled', async () => {
    axiosMock.get.mockResolvedValue({
      data: { data: { feedbackInfo: makeMentorDetail({ attendanceUrl: '' }) } },
    });
    renderModal(makeBar());
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: '제출물 보기' }),
      ).toBeDisabled();
    });
  });

  it('menteeStatus(라이브 출석)를 읽기 전용으로 노출한다 (마킹 버튼 없음)', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: { feedbackInfo: makeMentorDetail({ menteeStatus: 'PRESENT' }) },
      },
    });
    renderModal(makeBar());
    await waitFor(() => {
      expect(screen.getByText('라이브 출석')).toBeInTheDocument();
      // 값 노출 — 정확히 "출석" 텍스트 노드 (라이브 출석 라벨과 별개)
      expect(
        screen.getByText((content) => content === '출석'),
      ).toBeInTheDocument();
    });
    // 출석 마킹 버튼(쓰기 UI)은 디자인 미확정으로 노출 금지
    expect(
      screen.queryByRole('button', { name: /출석 처리|불참 처리|출석 마킹/ }),
    ).not.toBeInTheDocument();
  });

  it('전화번호(phoneNumber)는 더 이상 렌더되지 않는다 (데드 필드 제거)', async () => {
    renderModal(makeBar());
    await waitFor(() => {
      expect(screen.getByText('기획 / PM / PO')).toBeInTheDocument();
    });
    expect(screen.queryByText(/010-/)).not.toBeInTheDocument();
  });

  it('모달 소스가 삭제된 liveFeedbackReservationMock 을 import 하지 않는다 (회귀 가드)', () => {
    // cwd = apps/mentor (vitest root)
    const modalSource = readFileSync(
      path.resolve(
        process.cwd(),
        'src/pages/schedule/modal/LiveFeedbackReservationModal.tsx',
      ),
      'utf-8',
    );
    expect(modalSource).not.toContain('liveFeedbackReservationMock');
    expect(modalSource).not.toContain('getLiveFeedbackReservationMock');
  });
});
