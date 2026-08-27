import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BlogPopupListPage, {
  formatClickRate,
  formatTarget,
} from './BlogPopupListPage';

const mutate = vi.fn();
const navigate = vi.fn();

const blogPopupList = [
  {
    blogPopupId: 1,
    title: '낮은 클릭률 팝업',
    link: 'https://letscareer.co.kr/a',
    targetType: 'SELECTED' as const,
    targetBlogCount: 3,
    isVisible: true,
    startDate: '2026-09-01T09:00:00',
    endDate: '2026-09-30T11:59:00',
    impressionCount: 1000,
    clickCount: 12,
    clickRate: 1.2,
  },
  {
    blogPopupId: 2,
    title: '노출 없는 팝업',
    link: 'https://letscareer.co.kr/b',
    targetType: 'ALL' as const,
    targetBlogCount: 0,
    isVisible: false,
    startDate: '2026-09-01T09:00:00',
    endDate: '2026-09-30T11:59:00',
    impressionCount: 0,
    clickCount: 0,
    clickRate: 0,
  },
  {
    blogPopupId: 3,
    title: '높은 클릭률 팝업',
    link: 'https://letscareer.co.kr/c',
    targetType: 'ALL' as const,
    targetBlogCount: 0,
    isVisible: true,
    startDate: '2026-09-01T09:00:00',
    endDate: '2026-09-30T11:59:00',
    impressionCount: 500,
    clickCount: 40,
    clickRate: 8,
  },
];

vi.mock('@/api/blog/blogPopup', () => ({
  useGetAdminBlogPopupList: () => ({
    data: {
      blogPopupList,
      pageInfo: { pageNum: 0, pageSize: 10, totalElements: 3, totalPages: 1 },
    },
  }),
  useDeleteAdminBlogPopup: () => ({ mutate }),
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <BlogPopupListPage />
    </MemoryRouter>,
  );

/** 본문 행의 제목 순서. 헤더 행에는 gridcell 이 없어 걸러진다. */
const titleOrder = () =>
  screen
    .getAllByRole('row')
    .map((row) => within(row).queryAllByRole('gridcell')[0]?.textContent)
    .filter((title): title is string => title !== undefined);

beforeEach(() => {
  mutate.mockReset();
  navigate.mockReset();
});

describe('formatClickRate', () => {
  it('소수점 첫째 자리 백분율로 적는다', () => {
    expect(formatClickRate(1.2)).toBe('1.2%');
    expect(formatClickRate(8)).toBe('8.0%');
  });

  it('노출이 없어 값이 비면 0.0% 다', () => {
    expect(formatClickRate(0)).toBe('0.0%');
    expect(formatClickRate(null)).toBe('0.0%');
    expect(formatClickRate(undefined)).toBe('0.0%');
  });
});

describe('formatTarget', () => {
  it('전체 노출은 전체로 적는다', () => {
    expect(formatTarget({ targetType: 'ALL', targetBlogCount: 0 })).toBe(
      '전체',
    );
  });

  it('특정 글 선택은 고른 개수를 적는다', () => {
    expect(formatTarget({ targetType: 'SELECTED', targetBlogCount: 3 })).toBe(
      '선택 3개',
    );
  });
});

describe('BlogPopupListPage', () => {
  it('요구된 컬럼을 모두 그린다', () => {
    renderPage();

    for (const header of [
      '제목',
      '노출 대상',
      '링크',
      '노출 여부',
      '노출 수',
      '클릭 수',
      '클릭률',
    ]) {
      expect(
        screen.getByRole('columnheader', { name: header }),
      ).toBeInTheDocument();
    }
    expect(screen.getByText('노출기간')).toBeInTheDocument();
  });

  it('클릭률을 소수점 첫째 자리로 보여준다', () => {
    renderPage();

    expect(screen.getByText('1.2%')).toBeInTheDocument();
    expect(screen.getByText('8.0%')).toBeInTheDocument();
  });

  it('노출이 0 인 팝업도 클릭률을 0.0% 로 보여준다', () => {
    renderPage();

    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('노출 대상을 전체 또는 선택 N개로 보여준다', () => {
    renderPage();

    expect(screen.getByText('선택 3개')).toBeInTheDocument();
    expect(screen.getAllByText('전체')).toHaveLength(2);
  });

  it('클릭률 컬럼을 눌러 정렬할 수 있다', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(titleOrder()).toEqual([
      '낮은 클릭률 팝업',
      '노출 없는 팝업',
      '높은 클릭률 팝업',
    ]);

    await user.click(screen.getByRole('columnheader', { name: '클릭률' }));

    await waitFor(() =>
      expect(titleOrder()).toEqual([
        '노출 없는 팝업',
        '낮은 클릭률 팝업',
        '높은 클릭률 팝업',
      ]),
    );

    await user.click(screen.getByRole('columnheader', { name: '클릭률' }));

    await waitFor(() =>
      expect(titleOrder()).toEqual([
        '높은 클릭률 팝업',
        '낮은 클릭률 팝업',
        '노출 없는 팝업',
      ]),
    );
  });

  it('수정 버튼은 그 팝업의 수정 화면으로 보낸다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getAllByRole('menuitem', { name: 'Edit' })[0]);

    expect(navigate).toHaveBeenCalledWith('/blog/popup/edit/1');
  });

  it('삭제는 확인을 받고 나서 지운다', async () => {
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPage();

    await user.click(screen.getAllByRole('menuitem', { name: 'Delete' })[0]);
    expect(mutate).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    await user.click(screen.getAllByRole('menuitem', { name: 'Delete' })[0]);
    expect(mutate).toHaveBeenCalledWith(1);

    confirm.mockRestore();
  });
});
