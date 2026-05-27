import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';

import FeedbackLiveReservationPage from '../FeedbackLiveReservationPage';

const useFeedbackMentorListQueryMock = vi.fn();
const useUserQueryMock = vi.fn();
const useFeedbackMentorDetailQueryMock = vi.fn();
const useFeedbackMentorSlotsQueryMock = vi.fn();

vi.mock('@/api/feedback/feedback', () => ({
  useFeedbackMentorListQuery: () => useFeedbackMentorListQueryMock(),
  useFeedbackMentorDetailQuery: (id: number | null) =>
    useFeedbackMentorDetailQueryMock(id),
  useFeedbackMentorSlotsQuery: () => useFeedbackMentorSlotsQueryMock(),
}));

vi.mock('@/api/user/user', () => ({
  useUserQuery: () => useUserQueryMock(),
}));

function makeFeedback(overrides: Partial<FeedbackMentor> = {}): FeedbackMentor {
  return {
    feedbackId: 1,
    startDate: '2025-10-16T17:30:00',
    endDate: '2025-10-16T18:00:00',
    createDate: '2025-10-10T13:20:00',
    meetingUrl: null,
    mentorStatus: 'PRESENT',
    menteeStatus: 'PRESENT',
    status: 'COMPLETED',
    programTitle: '한경닷컴 마케팅 과정 9기 1:1 멘토링',
    menteeName: '강하늘',
    ...overrides,
  };
}

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FeedbackLiveReservationPage />
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

/** "완료된 예약" 섹션의 table 엘리먼트. (select option 텍스트와 충돌 방지용 스코프) */
function getCompletedTable(): HTMLTableElement {
  return screen
    .getByRole('heading', { name: '완료된 예약' })
    .parentElement!.querySelector('table')!;
}

describe('FeedbackLiveReservationPage', () => {
  it('헤더와 두 섹션(예약 목록/완료된 예약)을 노출한다', () => {
    mockBase([]);
    renderPage();
    expect(
      screen.getByRole('heading', { name: '예약 현황' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '예약 목록' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '완료된 예약' }),
    ).toBeInTheDocument();
  });

  it('RESERVED는 예정이 없으면 "예정된 예약이 없습니다."를 노출한다', () => {
    mockBase([makeFeedback({ status: 'COMPLETED' })]);
    renderPage();
    expect(screen.getByText('예정된 예약이 없습니다.')).toBeInTheDocument();
  });

  it('RESERVED는 "예약 목록", COMPLETED는 "완료된 예약"으로 분리된다', () => {
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'RESERVED',
        menteeName: '이지수',
        startDate: '2026-05-20T10:00:00',
        endDate: '2026-05-20T10:30:00',
      }),
      makeFeedback({
        feedbackId: 2,
        status: 'COMPLETED',
        menteeName: '강하늘',
      }),
    ]);
    renderPage();

    const reservedTable = screen
      .getByRole('heading', { name: '예약 목록' })
      .parentElement!.querySelector('table')!;
    expect(within(reservedTable).getByText('이지수')).toBeInTheDocument();
    expect(within(getCompletedTable()).getByText('강하늘')).toBeInTheDocument();
    expect(
      within(getCompletedTable()).queryByText('이지수'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('예정된 예약이 없습니다.'),
    ).not.toBeInTheDocument();
  });

  it('프로그램명 필터로 해당 프로그램 항목만 남는다', async () => {
    const user = userEvent.setup();
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'COMPLETED',
        menteeName: '강하늘',
        programTitle: '한경닷컴 마케팅 과정 9기 1:1 멘토링',
      }),
      makeFeedback({
        feedbackId: 2,
        status: 'COMPLETED',
        menteeName: '윤서아',
        programTitle: '포트폴리오 완성 챌린지 16기 1차 피드백',
      }),
    ]);
    renderPage();

    await user.selectOptions(
      screen.getByLabelText('프로그램명 검색'),
      '포트폴리오 완성 챌린지 16기 1차 피드백',
    );

    expect(within(getCompletedTable()).getByText('윤서아')).toBeInTheDocument();
    expect(
      within(getCompletedTable()).queryByText('강하늘'),
    ).not.toBeInTheDocument();
  });

  it('멘티명 필터로 해당 멘티 항목만 남는다', async () => {
    const user = userEvent.setup();
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'COMPLETED',
        menteeName: '강하늘',
      }),
      makeFeedback({
        feedbackId: 2,
        status: 'COMPLETED',
        menteeName: '윤서아',
      }),
    ]);
    renderPage();

    await user.selectOptions(screen.getByLabelText('멘티명 검색'), '윤서아');

    expect(within(getCompletedTable()).getByText('윤서아')).toBeInTheDocument();
    expect(
      within(getCompletedTable()).queryByText('강하늘'),
    ).not.toBeInTheDocument();
  });

  it('예약 날짜 범위 필터로 startDate 기준 항목을 거른다', async () => {
    const user = userEvent.setup();
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'COMPLETED',
        menteeName: '강하늘',
        startDate: '2025-10-16T17:30:00',
        endDate: '2025-10-16T18:00:00',
      }),
      makeFeedback({
        feedbackId: 2,
        status: 'COMPLETED',
        menteeName: '윤서아',
        startDate: '2025-11-12T16:00:00',
        endDate: '2025-11-12T16:30:00',
      }),
    ]);
    renderPage();

    await user.type(screen.getByLabelText('예약 시작 날짜'), '2025-11-01');

    expect(within(getCompletedTable()).getByText('윤서아')).toBeInTheDocument();
    expect(
      within(getCompletedTable()).queryByText('강하늘'),
    ).not.toBeInTheDocument();
  });

  it('신청 날짜 필터 적용 시 createDate가 null이면 제외된다', async () => {
    const user = userEvent.setup();
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'COMPLETED',
        menteeName: '강하늘',
        createDate: '2025-10-10T13:20:00',
      }),
      makeFeedback({
        feedbackId: 2,
        status: 'COMPLETED',
        menteeName: '윤서아',
        createDate: null,
      }),
    ]);
    renderPage();

    await user.type(screen.getByLabelText('신청 시작 날짜'), '2025-10-01');

    expect(within(getCompletedTable()).getByText('강하늘')).toBeInTheDocument();
    expect(
      within(getCompletedTable()).queryByText('윤서아'),
    ).not.toBeInTheDocument();
  });

  it('createDate가 null이면 신청 시간 컬럼에 "—"를 표기한다', () => {
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'COMPLETED',
        menteeName: '강하늘',
        createDate: null,
      }),
    ]);
    renderPage();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('멘티 헤더 클릭으로 완료 테이블 정렬이 토글된다', async () => {
    const user = userEvent.setup();
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'COMPLETED',
        menteeName: '강하늘',
      }),
      makeFeedback({
        feedbackId: 2,
        status: 'COMPLETED',
        menteeName: '윤서아',
      }),
      makeFeedback({
        feedbackId: 3,
        status: 'COMPLETED',
        menteeName: '오지호',
      }),
    ]);
    renderPage();

    const completedTable = getCompletedTable();

    // 기본 정렬은 datetime asc → 멘티 헤더 클릭 시 menteeName asc(강하늘, 오지호, 윤서아).
    await user.click(
      within(completedTable).getByRole('button', { name: /멘티/ }),
    );
    let rows = within(completedTable).getAllByRole('row').slice(1);
    expect(within(rows[0]).getByText('강하늘')).toBeInTheDocument();

    // 다시 클릭 → desc 토글(윤서아, 오지호, 강하늘).
    await user.click(
      within(completedTable).getByRole('button', { name: /멘티/ }),
    );
    rows = within(completedTable).getAllByRole('row').slice(1);
    expect(within(rows[0]).getByText('윤서아')).toBeInTheDocument();
  });

  it('멘토 컬럼은 로그인 멘토 본인 이름으로 모든 행 동일하다', () => {
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'COMPLETED',
        menteeName: '강하늘',
      }),
      makeFeedback({
        feedbackId: 2,
        status: 'COMPLETED',
        menteeName: '윤서아',
      }),
    ]);
    renderPage();
    expect(screen.getAllByText('테스트 멘토')).toHaveLength(2);
  });

  it('"보기" 클릭 시 라이브 피드백 모달을 열고 해당 feedbackId 상세를 fetch한다', async () => {
    const user = userEvent.setup();
    mockBase([
      makeFeedback({
        feedbackId: 1,
        status: 'COMPLETED',
        menteeName: '강하늘',
      }),
    ]);
    useFeedbackMentorDetailQueryMock.mockReturnValue({
      data: {
        feedbackId: 1,
        startDate: '2025-10-16T17:30:00',
        endDate: '2025-10-16T18:00:00',
        meetingUrl: null,
        status: 'COMPLETED',
        programTitle: '한경닷컴 마케팅 과정 9기 1:1 멘토링',
        attendanceUrl: 'https://example.com/x',
        attendanceStatus: 'PRESENT',
        menteeName: '강하늘',
        menteeWishField: '기획 / PM / PO',
        menteeWishIndustry: 'IT',
        menteeWishCompany: 'Toss',
        preQuestion: '자소서 피드백 받고 싶어요.',
        mentorStatus: 'PRESENT',
        menteeStatus: 'PRESENT',
      },
      isLoading: false,
      isError: false,
    });
    renderPage();

    await user.click(screen.getByRole('button', { name: '보기' }));

    // 경량 모달 대신 LiveFeedbackReservationModal 이 열린다.
    expect(screen.getAllByText(/LIVE 피드백/).length).toBeGreaterThan(0);
    expect(screen.getByText('자소서 피드백 받고 싶어요.')).toBeInTheDocument();
    // 열린 동안 클릭한 feedbackId(=1) 로 상세를 fetch한다.
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
    renderPage();
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
    renderPage();
    expect(
      screen.getByText('예약 내역을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });
});
