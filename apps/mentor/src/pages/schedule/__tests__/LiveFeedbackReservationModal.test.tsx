import { readFileSync } from 'node:fs';
import path from 'node:path';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

// 채팅 모달은 PocketBase realtime에 연결되므로 테스트에서는 패키지 컴포넌트를 모킹해
// 멘토 측 래핑(역할·feedbackId 전달)만 검증한다. (패키지 자체는 별도 테스트됨)
vi.mock('@letscareer/chat/ui/ChatModal', () => ({
  default: ({
    role,
    activeFeedbackId,
    onClose,
  }: {
    role: string;
    activeFeedbackId?: number | null;
    onClose: () => void;
  }) => (
    <div
      data-testid="chat-modal"
      data-role={role}
      data-feedback-id={String(activeFeedbackId)}
    >
      <button type="button" onClick={onClose}>
        채팅 모달 닫기
      </button>
    </div>
  ),
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

  it('액션 패널에 "예약 일시" / "피드백 상태" 행이 노출된다', () => {
    renderModal(makeBar());
    expect(screen.getByText('예약 일시')).toBeInTheDocument();
    expect(screen.getByText('피드백 상태')).toBeInTheDocument();
  });

  it('액션 패널에 "줌 회의실" 행이 더 이상 노출되지 않는다', () => {
    vi.stubEnv('VITE_JITSI_BASE_URL', 'https://meet.jit.si/');
    renderModal(makeBar());
    expect(screen.queryByText('줌 회의실')).not.toBeInTheDocument();
    // 줌 회의실 행에서만 쓰이던 상태 라벨도 사라진다.
    expect(screen.queryByText('미정')).not.toBeInTheDocument();
    expect(screen.queryByText('10분 전 자동 배정')).not.toBeInTheDocument();
    expect(screen.queryByText('종료됨')).not.toBeInTheDocument();
  });

  it('푸터의 "멘티와 대화하기" 버튼이 활성 상태로 노출된다', () => {
    renderModal(makeBar());
    const btn = screen.getByRole('button', { name: '멘티와 대화하기' });
    expect(btn).toBeEnabled();
  });

  it('"멘티와 대화하기" 클릭 시 role=mentor·해당 feedbackId로 채팅 모달이 열린다', async () => {
    const user = userEvent.setup();
    renderModal(makeBar());

    await user.click(screen.getByRole('button', { name: '멘티와 대화하기' }));

    const modal = await screen.findByTestId('chat-modal');
    expect(modal).toHaveAttribute('data-role', 'mentor');
    expect(modal).toHaveAttribute('data-feedback-id', '101');
  });

  it('meetingUrl 미생성(null) 이어도 멘토는 "라이브 입장하기" 버튼이 활성 (데드락 방지)', async () => {
    // 멘토가 아직 입장(meeting-url PATCH)하지 않아 BE meetingUrl 이 null 인 상태.
    // 데드락 방지: 멘토는 클릭해서 회의실을 생성해야 하므로 버튼이 활성이어야 한다.
    axiosMock.get.mockResolvedValue({
      data: { data: { feedbackInfo: makeMentorDetail({ meetingUrl: null }) } },
    });
    renderModal(makeBar());
    const btn = await screen.findByRole('button', { name: '라이브 입장하기' });
    await waitFor(() => expect(btn).toBeEnabled());
  });

  // TODO(임시): 라이브 입장 시간 게이팅(T-10 룰)이 임시 해제됨 (PRD §13).
  // 정식 운영 복원 시 "T-10 이전 → disabled" 단언으로 되돌린다.
  // 임시 동작: BE meetingUrl(= base + 랜덤 meetingRoom)이 내려오면
  // 시간 무관(T-10 이전 포함) 항상 입장 가능.
  it('meetingUrl 존재 시 T-10 이전이어도 "라이브 입장하기" 버튼이 활성 (시간 게이팅 임시 해제)', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: {
          feedbackInfo: makeMentorDetail({
            meetingUrl: 'https://meet.jit.si/letscareer-x7k2p9',
          }),
        },
      },
    });
    renderModal(makeBar());
    const btn = await screen.findByRole('button', { name: '라이브 입장하기' });
    await waitFor(() => expect(btn).toBeEnabled());
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

  it('menteeStatus(피드백 참여)를 읽기 전용으로 노출한다 (마킹 버튼 없음)', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: { feedbackInfo: makeMentorDetail({ menteeStatus: 'PRESENT' }) },
      },
    });
    renderModal(makeBar());
    await waitFor(() => {
      expect(screen.getByText('피드백 참여')).toBeInTheDocument();
      // 값 노출 — 정확히 "출석" 텍스트 노드 (피드백 참여 라벨과 별개)
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

  it('"피드백 참여" 라벨 옆 ⓘ 트리거에 호버하면 안내 툴팁이 노출된다', async () => {
    const user = userEvent.setup();
    renderModal(makeBar());

    const trigger = await screen.findByRole('button', {
      name: '피드백 참여 안내',
    });
    // role=tooltip 본문은 항상 DOM에 있으나 트리거와 aria-describedby로 연결된다.
    const describedBy = trigger.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const tooltip = document.getElementById(describedBy!);
    expect(tooltip).toHaveAttribute('role', 'tooltip');
    expect(tooltip).toHaveTextContent(
      '피드백 종료 후 멘티 참여 상태를 저장해주세요. 참여 여부 저장 후 진행 완료 및 정산 대상에 반영됩니다.',
    );

    await user.hover(trigger);
    expect(tooltip).toHaveClass('opacity-100');
  });

  it('"참여 확인하기" 버튼 클릭 시 멘티 참여 상태 확인 모달이 열린다', async () => {
    const user = userEvent.setup();
    renderModal(makeBar());

    const btn = await screen.findByRole('button', { name: '참여 확인하기' });
    await user.click(btn);
    // 참여 확인 모달은 종료 후 저장 게이트를 가진 별도 모달 — 진입만 검증
    expect(btn).toBeInTheDocument();
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
