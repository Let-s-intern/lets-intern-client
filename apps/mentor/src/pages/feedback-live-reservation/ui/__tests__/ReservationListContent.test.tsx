import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';

import ReservationListContent from '../ReservationListContent';

const useFeedbackMentorListQueryMock = vi.fn();
const useUserQueryMock = vi.fn();
const useFeedbackMentorDetailQueryMock = vi.fn();
const useFeedbackMentorSlotsQueryMock = vi.fn();
const noopMutation = {
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isPending: false,
};

vi.mock('@/api/feedback/feedback', () => ({
  useFeedbackMentorListQuery: () => useFeedbackMentorListQueryMock(),
  useFeedbackMentorDetailQuery: (id: number | null) =>
    useFeedbackMentorDetailQueryMock(id),
  useFeedbackMentorSlotsQuery: () => useFeedbackMentorSlotsQueryMock(),
  useUpdateFeedbackByMentorMutation: () => noopMutation,
  useUpdateFeedbackMeetingUrlMutation: () => noopMutation,
}));

vi.mock('@/api/user/user', () => ({
  useUserQuery: () => useUserQueryMock(),
}));

function makeFeedback(overrides: Partial<FeedbackMentor> = {}): FeedbackMentor {
  return {
    feedbackId: 1,
    startDate: '2026-05-20T10:00:00',
    endDate: '2026-05-20T10:30:00',
    createDate: '2026-05-17T09:30:00',
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle: '한경닷컴 마케팅 과정 9기 1:1 멘토링',
    menteeName: '강하늘',
    ...overrides,
  };
}

function renderContent() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ReservationListContent />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.clearAllMocks();
});

function mockBase(list: FeedbackMentor[]) {
  useFeedbackMentorListQueryMock.mockReturnValue({
    data: list,
    isLoading: false,
    isError: false,
  });
  useUserQueryMock.mockReturnValue({ data: { name: '테스트 멘토' } });
  useFeedbackMentorDetailQueryMock.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
  });
  useFeedbackMentorSlotsQueryMock.mockReturnValue({
    data: { feedbackSlotList: [] },
    isLoading: false,
    isError: false,
  });
}

/** "예약 목록" 섹션의 table 엘리먼트. (select option 텍스트와 충돌 방지용 스코프) */
function getReservedTable(): HTMLTableElement {
  return screen
    .getByRole('heading', { name: '예약 목록' })
    .parentElement!.querySelector('table')!;
}

describe('ReservationListContent', () => {
  it('단독 마운트 시 "예약 목록" 섹션을 노출하고, 별도 "예약 변경 내역" 섹션은 없다', () => {
    mockBase([]);
    renderContent();
    expect(
      screen.getByRole('heading', { name: '예약 목록' }),
    ).toBeInTheDocument();
    // 변경 내역 전용 테이블 섹션(heading)은 제거됨.
    expect(
      screen.queryByRole('heading', { name: '예약 변경 내역' }),
    ).not.toBeInTheDocument();
  });

  it('예정 예약이 없으면 "예정된 예약이 없습니다."를 노출한다', () => {
    mockBase([makeFeedback({ status: 'COMPLETED' })]);
    renderContent();
    expect(screen.getByText('예정된 예약이 없습니다.')).toBeInTheDocument();
  });

  it('RESERVED 항목만 "예약 목록" 테이블에 노출한다 (COMPLETED 제외)', () => {
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'RESERVED',
        menteeName: '이지수',
      }),
      makeFeedback({
        feedbackId: 2,
        status: 'COMPLETED',
        menteeName: '강하늘',
      }),
    ]);
    renderContent();

    const reservedTable = getReservedTable();
    expect(within(reservedTable).getByText('이지수')).toBeInTheDocument();
    expect(within(reservedTable).queryByText('강하늘')).not.toBeInTheDocument();
  });

  it('프로그램명 필터로 해당 프로그램 항목만 남는다', async () => {
    const user = userEvent.setup();
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'RESERVED',
        menteeName: '강하늘',
        programTitle: '한경닷컴 마케팅 과정 9기 1:1 멘토링',
      }),
      makeFeedback({
        feedbackId: 2,
        status: 'RESERVED',
        menteeName: '윤서아',
        programTitle: '포트폴리오 완성 챌린지 16기 1차 피드백',
      }),
    ]);
    renderContent();

    await user.selectOptions(
      screen.getByLabelText('프로그램명 검색'),
      '포트폴리오 완성 챌린지 16기 1차 피드백',
    );

    expect(within(getReservedTable()).getByText('윤서아')).toBeInTheDocument();
    expect(
      within(getReservedTable()).queryByText('강하늘'),
    ).not.toBeInTheDocument();
  });

  it('멘티명 필터로 해당 멘티 항목만 남는다', async () => {
    const user = userEvent.setup();
    mockBase([
      makeFeedback({ feedbackId: 1, status: 'RESERVED', menteeName: '강하늘' }),
      makeFeedback({ feedbackId: 2, status: 'RESERVED', menteeName: '윤서아' }),
    ]);
    renderContent();

    await user.selectOptions(screen.getByLabelText('멘티명 검색'), '윤서아');

    expect(within(getReservedTable()).getByText('윤서아')).toBeInTheDocument();
    expect(
      within(getReservedTable()).queryByText('강하늘'),
    ).not.toBeInTheDocument();
  });

  it('예약 날짜 범위 필터로 startDate 기준 항목을 거른다', async () => {
    const user = userEvent.setup();
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'RESERVED',
        menteeName: '강하늘',
        startDate: '2025-10-16T17:30:00',
        endDate: '2025-10-16T18:00:00',
      }),
      makeFeedback({
        feedbackId: 2,
        status: 'RESERVED',
        menteeName: '윤서아',
        startDate: '2025-11-12T16:00:00',
        endDate: '2025-11-12T16:30:00',
      }),
    ]);
    renderContent();

    await user.type(screen.getByLabelText('예약 시작 날짜'), '2025-11-01');

    expect(within(getReservedTable()).getByText('윤서아')).toBeInTheDocument();
    expect(
      within(getReservedTable()).queryByText('강하늘'),
    ).not.toBeInTheDocument();
  });

  it('예약 목록 테이블 헤더는 "신청 시간" 없이 6컬럼(날짜/시간·프로그램·멘토·멘티·상세·예약 변경 내역)이다', () => {
    mockBase([makeFeedback({ feedbackId: 1, status: 'RESERVED' })]);
    renderContent();
    const headers = within(getReservedTable())
      .getAllByRole('columnheader')
      .map((th) => th.textContent);
    expect(headers).toEqual([
      '날짜 / 시간',
      '프로그램',
      '멘토',
      '멘티',
      '상세',
      '예약 변경 내역',
    ]);
  });

  it('멘토 컬럼은 로그인 멘토 본인 이름으로 모든 행 동일하다', () => {
    mockBase([
      makeFeedback({ feedbackId: 1, status: 'RESERVED', menteeName: '강하늘' }),
      makeFeedback({ feedbackId: 2, status: 'RESERVED', menteeName: '윤서아' }),
    ]);
    renderContent();
    expect(within(getReservedTable()).getAllByText('테스트 멘토')).toHaveLength(
      2,
    );
  });

  it('행의 "예약 변경 내역" 버튼을 누르면 변경 내역 드롭다운이 펼쳐진다', async () => {
    const user = userEvent.setup();
    mockBase([makeFeedback({ feedbackId: 1, status: 'RESERVED' })]);
    renderContent();

    const reservedTable = getReservedTable();
    // 펼치기 전: 변경 내역 패널 문구 없음.
    expect(
      within(reservedTable).queryByText('예약을 옮긴 내역이 없습니다.'),
    ).not.toBeInTheDocument();

    await user.click(
      within(reservedTable).getByRole('button', { name: /예약 변경 내역/ }),
    );

    expect(
      within(reservedTable).getByText('예약을 옮긴 내역이 없습니다.'),
    ).toBeInTheDocument();
  });

  it('"보기" 클릭 시 라이브 피드백 모달을 열고 해당 feedbackId 상세를 fetch한다', async () => {
    const user = userEvent.setup();
    mockBase([makeFeedback({ feedbackId: 1, status: 'RESERVED' })]);
    useFeedbackMentorDetailQueryMock.mockReturnValue({
      data: {
        feedbackId: 1,
        startDate: '2025-10-16T17:30:00',
        endDate: '2025-10-16T18:00:00',
        meetingUrl: null,
        status: 'RESERVED',
        programTitle: '한경닷컴 마케팅 과정 9기 1:1 멘토링',
        attendanceUrl: 'https://example.com/x',
        attendanceStatus: 'PENDING',
        menteeName: '강하늘',
        menteeWishField: '기획 / PM / PO',
        menteeWishIndustry: 'IT',
        menteeWishCompany: 'Toss',
        preQuestion: '자소서 피드백 받고 싶어요.',
        mentorStatus: 'PENDING',
        menteeStatus: 'PENDING',
      },
      isLoading: false,
      isError: false,
    });
    renderContent();

    await user.click(
      within(getReservedTable()).getByRole('button', { name: '보기' }),
    );

    expect(screen.getAllByText(/LIVE 피드백/).length).toBeGreaterThan(0);
    expect(screen.getByText('자소서 피드백 받고 싶어요.')).toBeInTheDocument();
    expect(useFeedbackMentorDetailQueryMock).toHaveBeenCalledWith(1);
  });

  it('로딩 중이면 안내 문구를 노출한다', () => {
    useFeedbackMentorListQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    useUserQueryMock.mockReturnValue({ data: undefined });
    useFeedbackMentorDetailQueryMock.mockReturnValue({ data: undefined });
    useFeedbackMentorSlotsQueryMock.mockReturnValue({
      data: { feedbackSlotList: [] },
      isLoading: false,
      isError: false,
    });
    renderContent();
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });

  it('에러면 실패 안내를 노출한다', () => {
    useFeedbackMentorListQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    useUserQueryMock.mockReturnValue({ data: undefined });
    useFeedbackMentorDetailQueryMock.mockReturnValue({ data: undefined });
    useFeedbackMentorSlotsQueryMock.mockReturnValue({
      data: { feedbackSlotList: [] },
      isLoading: false,
      isError: false,
    });
    renderContent();
    expect(
      screen.getByText('예약 내역을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });
});
