import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AdminLiveMentoring } from '@/api/live-mentoring/liveMentoringSchema';

const listQuery = vi.fn();
const closeMock = vi.fn();
const snackbarMock = vi.fn();

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useAdminLiveMentoringListQuery: (params: unknown) => listQuery(params),
  useCloseLiveMentoringOpeningMutation: () => ({
    mutate: closeMock,
    isPending: false,
  }),
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: snackbarMock }),
}));

import AdminLiveMentoringTable from './AdminLiveMentoringTable';

const draftRow: AdminLiveMentoring = {
  liveMentoringId: 10,
  mentorId: 21,
  mentorNickname: '렛츠멘토',
  mentorProfileImage: null,
  title: '이력서 피드백',
  status: 'DRAFT',
  categories: ['RESUME', 'PORTFOLIO'],
  hasDetailPage: true,
  createDate: '2026-08-03T12:00:00',
  lastModifiedDate: '2026-08-03T12:00:00',
  currentOpening: null,
};

const approvedRow: AdminLiveMentoring = {
  ...draftRow,
  liveMentoringId: 11,
  mentorNickname: '오픈멘토',
  status: 'APPROVED',
  currentOpening: {
    openingId: 100,
    status: 'OPEN',
    durationPrices: [
      { duration: 30, price: 35000 },
      { duration: 60, price: 60000 },
    ],
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
  closeMock.mockReset();
  snackbarMock.mockReset();
});

describe('AdminLiveMentoringTable — 조회', () => {
  it('기본 필터는 전체이고, 1-based 페이지로 요청한다', () => {
    renderTable([draftRow]);

    expect(listQuery).toHaveBeenCalledWith({
      status: undefined,
      page: 1,
      size: 20,
    });
  });

  it('필터를 바꾸면 해당 상태로 다시 조회한다', () => {
    renderTable([draftRow]);

    fireEvent.click(within(filterBar()).getByRole('button', { name: '승인' }));

    expect(listQuery).toHaveBeenLastCalledWith({
      status: 'APPROVED',
      page: 1,
      size: 20,
    });
  });

  it('전체 필터는 status 파라미터를 보내지 않는다', () => {
    renderTable([draftRow]);

    fireEvent.click(within(filterBar()).getByRole('button', { name: '승인' }));
    fireEvent.click(within(filterBar()).getByRole('button', { name: '전체' }));

    expect(listQuery).toHaveBeenLastCalledWith({
      status: undefined,
      page: 1,
      size: 20,
    });
  });

  it('상품 정보를 한글 라벨로 렌더한다', () => {
    renderTable([draftRow]);

    expect(screen.getByText('렛츠멘토')).toBeInTheDocument();
    expect(screen.getByText('이력서 피드백')).toBeInTheDocument();
    expect(screen.getByText('이력서 · 포트폴리오')).toBeInTheDocument();
    expect(
      within(screen.getByRole('table')).getByText('초안'),
    ).toBeInTheDocument();
  });

  it('현재 개설의 진행시간별 가격을 보여준다', () => {
    renderTable([approvedRow]);

    expect(
      screen.getByText('30분 35,000원 / 60분 60,000원'),
    ).toBeInTheDocument();
  });

  /**
   * 슬롯 오픈 전환으로 개설에서 모집 기간이 사라졌다. 기간 표기와,
   * 기간이 지나도 OPEN 으로 남는 상황을 알리던 만료 경고를 함께 걷어냈다.
   */
  it('기간과 만료 경고를 노출하지 않는다', () => {
    renderTable([approvedRow]);

    const table = screen.getByRole('table');
    expect(within(table).queryByText(/\d{4}-\d{2}-\d{2} ~ /)).toBeNull();
    expect(within(table).queryByText(/기간 만료/)).toBeNull();
    expect(within(table).queryByText(/종료 처리 안 됨/)).toBeNull();
  });

  it('목록이 비면 빈 상태 문구를 한 행으로 펼쳐 노출한다', () => {
    renderTable([]);

    const emptyCell = screen.getByText('해당 조건의 상품이 없습니다.');
    expect(emptyCell).toBeInTheDocument();
    // 컬럼 수를 줄이지 않았으므로 빈 상태도 8칸을 그대로 덮는다.
    expect(emptyCell).toHaveAttribute('colspan', '8');
    expect(
      within(screen.getByRole('table')).getAllByRole('columnheader'),
    ).toHaveLength(8);
  });
});

describe('AdminLiveMentoringTable — 액션', () => {
  it('백엔드에 없는 승인·반려 버튼은 어떤 상태 행에도 없다', () => {
    renderTable([draftRow, approvedRow]);

    const table = screen.getByRole('table');
    expect(
      within(table).queryByRole('button', { name: '승인' }),
    ).not.toBeInTheDocument();
    expect(
      within(table).queryByRole('button', { name: '반려' }),
    ).not.toBeInTheDocument();
  });

  it('개설 중(OPEN)인 행에만 강제 종료 버튼이 있다', () => {
    renderTable([draftRow, approvedRow]);

    const table = screen.getByRole('table');
    expect(
      within(table).getAllByRole('button', { name: '개설 강제 종료' }),
    ).toHaveLength(1);
  });

  it('강제 종료는 확인 모달을 거친 뒤 개설 id 로 호출한다', () => {
    renderTable([approvedRow]);

    fireEvent.click(
      within(screen.getByRole('table')).getByRole('button', {
        name: '개설 강제 종료',
      }),
    );
    // 모달이 먼저 뜨고, 이 시점에는 요청이 나가지 않는다.
    expect(closeMock).not.toHaveBeenCalled();
    expect(
      screen.getByText('이 개설을 강제로 종료합니다.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '강제 종료' }));
    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(closeMock.mock.calls[0][0]).toBe(100);
  });

  it('취소하면 아무 요청도 보내지 않는다', () => {
    renderTable([approvedRow]);

    fireEvent.click(
      within(screen.getByRole('table')).getByRole('button', {
        name: '개설 강제 종료',
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: '취소' }));

    expect(closeMock).not.toHaveBeenCalled();
    expect(
      screen.queryByText('이 개설을 강제로 종료합니다.'),
    ).not.toBeInTheDocument();
  });
});
