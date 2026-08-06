import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AdminLiveMentoring } from '@/api/live-mentoring/liveMentoringSchema';

const listQuery = vi.fn();
const approveMock = vi.fn();
const rejectMock = vi.fn();
const closeMock = vi.fn();
const snackbarMock = vi.fn();

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useAdminLiveMentoringListQuery: (params: unknown) => listQuery(params),
  useApproveLiveMentoringMutation: () => ({
    mutate: approveMock,
    isPending: false,
  }),
  useRejectLiveMentoringMutation: () => ({
    mutate: rejectMock,
    isPending: false,
  }),
  useCloseLiveMentoringOpeningMutation: () => ({
    mutate: closeMock,
    isPending: false,
  }),
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: snackbarMock }),
}));

import AdminLiveMentoringTable from './AdminLiveMentoringTable';

/** 만료 판정이 실행 시점에 좌우되지 않게 오늘 기준 상대 날짜를 만든다. */
const dateFromToday = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

const pendingRow: AdminLiveMentoring = {
  liveMentoringId: 10,
  mentorId: 21,
  mentorNickname: '렛츠멘토',
  mentorProfileImage: null,
  title: '이력서 피드백',
  status: 'PENDING_REVIEW',
  categories: ['RESUME', 'PORTFOLIO'],
  hasDetailPage: true,
  approvedAt: null,
  approvedByUserId: null,
  createDate: '2026-08-03T12:00:00',
  lastModifiedDate: '2026-08-03T12:00:00',
  currentOpening: null,
};

const approvedRow: AdminLiveMentoring = {
  ...pendingRow,
  liveMentoringId: 11,
  mentorNickname: '오픈멘토',
  status: 'APPROVED',
  approvedAt: '2026-08-04T14:30:00',
  approvedByUserId: 1,
  currentOpening: {
    openingId: 100,
    status: 'OPEN',
    durationPrices: [
      { duration: 30, price: 35000 },
      { duration: 60, price: 60000 },
    ],
    feedbackStartDate: dateFromToday(-1),
    feedbackEndDate: dateFromToday(20),
    openedAt: '2026-08-04T14:30:00',
    closedAt: null,
    closeReason: null,
    closedByUserId: null,
    createDate: '2026-08-04T14:30:00',
    lastModifiedDate: '2026-08-04T14:30:00',
  },
};

/** 필터 칩과 행 액션·상태 배지가 같은 단어를 쓰므로 늘 영역을 좁혀 찾는다. */
const filterBar = () => screen.getByRole('group', { name: '상태 필터' });

const renderTable = (rows: AdminLiveMentoring[]) => {
  listQuery.mockReturnValue({
    data: {
      liveMentoringList: rows,
      pageInfo: {
        pageNum: 0,
        pageSize: 20,
        totalElements: rows.length,
        totalPages: 1,
      },
    },
    isLoading: false,
    isError: false,
  });
  return render(<AdminLiveMentoringTable />);
};

afterEach(() => {
  listQuery.mockReset();
  approveMock.mockReset();
  rejectMock.mockReset();
  closeMock.mockReset();
  snackbarMock.mockReset();
});

describe('AdminLiveMentoringTable — 조회', () => {
  it('기본 필터는 검토 대기이고, 1-based 페이지로 요청한다', () => {
    renderTable([pendingRow]);

    expect(listQuery).toHaveBeenCalledWith({
      status: 'PENDING_REVIEW',
      page: 1,
      size: 20,
    });
  });

  it('필터를 바꾸면 해당 상태로 다시 조회한다', () => {
    renderTable([pendingRow]);

    fireEvent.click(within(filterBar()).getByRole('button', { name: '승인' }));

    expect(listQuery).toHaveBeenLastCalledWith({
      status: 'APPROVED',
      page: 1,
      size: 20,
    });
  });

  it('전체 필터는 status 파라미터를 보내지 않는다', () => {
    renderTable([pendingRow]);

    fireEvent.click(within(filterBar()).getByRole('button', { name: '전체' }));

    expect(listQuery).toHaveBeenLastCalledWith({
      status: undefined,
      page: 1,
      size: 20,
    });
  });

  it('상품 정보를 한글 라벨로 렌더한다', () => {
    renderTable([pendingRow]);

    expect(screen.getByText('렛츠멘토')).toBeInTheDocument();
    expect(screen.getByText('이력서 피드백')).toBeInTheDocument();
    expect(screen.getByText('이력서 · 포트폴리오')).toBeInTheDocument();
    expect(
      within(screen.getByRole('table')).getByText('검토 대기'),
    ).toBeInTheDocument();
  });

  it('현재 개설의 기간·가격을 함께 보여준다', () => {
    renderTable([approvedRow]);

    expect(
      screen.getByText('30분 35,000원 / 60분 60,000원'),
    ).toBeInTheDocument();
  });

  // 만료 자동 종료 배치가 서버에 없어 기간이 지나도 OPEN 으로 남는다.
  it('기간이 지났는데 OPEN 인 개설을 구분해 표시한다', () => {
    renderTable([
      {
        ...approvedRow,
        currentOpening: {
          ...approvedRow.currentOpening!,
          feedbackStartDate: dateFromToday(-30),
          feedbackEndDate: dateFromToday(-1),
        },
      },
    ]);

    expect(screen.getByText('기간 만료(종료 처리 안 됨)')).toBeInTheDocument();
  });

  it('목록이 비면 빈 상태 문구를 노출한다', () => {
    renderTable([]);
    expect(
      screen.getByText('해당 조건의 상품이 없습니다.'),
    ).toBeInTheDocument();
  });
});

describe('AdminLiveMentoringTable — 액션', () => {
  it('검토 대기 행에만 승인·반려 버튼이 있다', () => {
    renderTable([approvedRow]);

    // 필터 버튼과 구분하기 위해 표 안에서 찾는다.
    const table = screen.getByRole('table');
    expect(
      within(table).queryByRole('button', { name: '승인' }),
    ).not.toBeInTheDocument();
    expect(
      within(table).getByRole('button', { name: '개설 강제 종료' }),
    ).toBeInTheDocument();
  });

  it('승인은 확인 모달을 거친 뒤 상품 id 로 호출한다', () => {
    renderTable([pendingRow]);

    fireEvent.click(
      within(screen.getByRole('table')).getByRole('button', {
        name: '승인',
      }),
    );
    // 모달이 먼저 뜨고, 이 시점에는 요청이 나가지 않는다.
    expect(approveMock).not.toHaveBeenCalled();
    // 승인이 곧 오픈이라는 사실을 문구로 알린다.
    expect(
      screen.getByText(/승인하면 이 상품이 곧바로 오픈됩니다/),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '승인하고 오픈' }));
    expect(approveMock).toHaveBeenCalledTimes(1);
    expect(approveMock.mock.calls[0][0]).toBe(10);
  });

  it('반려는 확인 후 상품 id 로 호출한다', () => {
    renderTable([pendingRow]);

    fireEvent.click(
      within(screen.getByRole('table')).getByRole('button', {
        name: '반려',
      }),
    );
    fireEvent.click(
      screen.getAllByRole('button', { name: '반려' }).slice(-1)[0],
    );

    expect(rejectMock).toHaveBeenCalledTimes(1);
    expect(rejectMock.mock.calls[0][0]).toBe(10);
  });

  it('강제 종료는 상품 id 가 아니라 개설 id 로 호출한다', () => {
    renderTable([approvedRow]);

    fireEvent.click(
      within(screen.getByRole('table')).getByRole('button', {
        name: '개설 강제 종료',
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: '강제 종료' }));

    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(closeMock.mock.calls[0][0]).toBe(100);
  });

  it('취소하면 아무 요청도 보내지 않는다', () => {
    renderTable([pendingRow]);

    fireEvent.click(
      within(screen.getByRole('table')).getByRole('button', {
        name: '승인',
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: '취소' }));

    expect(approveMock).not.toHaveBeenCalled();
    expect(
      screen.queryByText(/승인하면 이 상품이 곧바로 오픈됩니다/),
    ).not.toBeInTheDocument();
  });
});
