import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdminOneTimeFormListItem } from '@/api/one-time-form/oneTimeFormSchema';

import OneTimeFormListPage from './OneTimeFormListPage';

const listQuery = vi.fn();
const navigate = vi.fn();

vi.mock('@/api/one-time-form/oneTimeFormQueries', () => ({
  useOneTimeFormListQuery: () => listQuery(),
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

const form = (
  overrides: Partial<AdminOneTimeFormListItem>,
): AdminOneTimeFormListItem => ({
  formId: 1,
  title: '폼',
  slug: 'form',
  isVisible: true,
  isPaid: false,
  basePrice: 0,
  startDate: '2026-11-01T00:00:00',
  endDate: '2026-11-10T23:59:59',
  applicationCount: 0,
  createDate: '2026-10-20T10:00:00',
  ...overrides,
});

// 지금은 2026-11-05 정오로 고정한다
const forms = [
  form({ formId: 1, title: '비공개 폼', isVisible: false }),
  form({
    formId: 2,
    title: '시작 전 폼',
    startDate: '2026-11-20T00:00:00',
    endDate: '2026-11-30T23:59:59',
  }),
  form({ formId: 3, title: '진행 중 폼', applicationCount: 17 }),
  form({
    formId: 4,
    title: '마감 폼',
    startDate: '2026-10-01T00:00:00',
    endDate: '2026-10-10T23:59:59',
  }),
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <OneTimeFormListPage />
    </MemoryRouter>,
  );

const rowOf = (title: string) =>
  screen
    .getByRole('link', { name: title })
    .closest('[role="row"]') as HTMLElement;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-11-05T12:00:00'));
  navigate.mockReset();
  listQuery.mockReturnValue({
    data: { forms },
    isLoading: false,
    isError: false,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('OneTimeFormListPage', () => {
  it('폼이 없으면 빈 목록 문구를 보여준다', () => {
    listQuery.mockReturnValue({
      data: { forms: [] },
      isLoading: false,
      isError: false,
    });
    renderPage();

    expect(screen.getByText('등록된 폼이 없습니다.')).toBeInTheDocument();
  });

  it('제목, 상태, 기간, 신청 수 컬럼을 그린다', () => {
    renderPage();

    for (const header of ['제목', '상태', '기간', '신청 수']) {
      expect(
        screen.getByRole('columnheader', { name: header }),
      ).toBeInTheDocument();
    }
  });

  it.each([
    ['비공개 폼', '비공개'],
    ['시작 전 폼', '시작 전'],
    ['진행 중 폼', '진행 중'],
    ['마감 폼', '마감'],
  ])('%s 의 상태는 %s 다', (title, label) => {
    renderPage();

    expect(within(rowOf(title)).getByText(label)).toBeInTheDocument();
  });

  it('기간과 신청 수를 보여준다', () => {
    renderPage();

    const row = rowOf('진행 중 폼');
    expect(
      within(row).getByText('2026.11.01 00:00 ~ 2026.11.10 23:59'),
    ).toBeInTheDocument();
    expect(within(row).getByText('17')).toBeInTheDocument();
  });

  it('제목은 그 폼의 수정 화면으로 연결된다', () => {
    renderPage();

    expect(screen.getByRole('link', { name: '진행 중 폼' })).toHaveAttribute(
      'href',
      '/one-time-form/3/edit',
    );
  });

  it('폼 만들기 버튼은 생성 화면으로 보낸다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: '폼 만들기' }));

    expect(navigate).toHaveBeenCalledWith('/one-time-form/new');
  });

  it('조회에 실패하면 안내 문구를 보여준다', () => {
    listQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderPage();

    expect(
      screen.getByText('폼 목록을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });
});
