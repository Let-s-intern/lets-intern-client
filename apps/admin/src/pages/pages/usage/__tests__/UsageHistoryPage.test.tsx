import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import UsageHistoryPage from '../UsageHistoryPage';

/**
 * 필터와 페이지가 URL 에 남는지, 그리고 조회에 그대로 실려 나가는지 본다.
 * 표의 표기·강조는 UsageHistoryTable 테스트가 덮는다.
 */

const listQuery = vi.fn();

vi.mock('@/api/accessLog', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useAccessLogListQuery: (...args: unknown[]) => listQuery(...args),
}));

/** 새로고침·공유 시 같은 조건이 뜨는지 보기 위해 URL 을 그대로 읽는다. */
const UrlProbe = () => {
  const [searchParams] = useSearchParams();
  return <div data-testid="query">{searchParams.toString()}</div>;
};

const renderPage = (initialUrl = '/admin/usage-history') =>
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <UsageHistoryPage />
      <UrlProbe />
    </MemoryRouter>,
  );

const urlQuery = () => screen.getByTestId('query').textContent;

beforeEach(() => {
  listQuery.mockReset();
  listQuery.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
  });
});

describe('UsageHistoryPage 필터', () => {
  it('프로그램 타입을 고르면 URL 에 남는다', async () => {
    // 새로고침하거나 링크를 공유해도 보던 조건이 유지돼야 한다.
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByRole('combobox'), 'CHALLENGE');

    expect(urlQuery()).toContain('programType=CHALLENGE');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ programType: 'CHALLENGE' }),
    );
  });

  it('전체로 되돌리면 조건이 URL 에서 빠진다', async () => {
    const user = userEvent.setup();
    renderPage('/admin/usage-history?programType=CHALLENGE');

    await user.selectOptions(screen.getByRole('combobox'), '');

    expect(urlQuery()).not.toContain('programType');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ programType: undefined }),
    );
  });

  it('URL 의 조건을 그대로 조회에 넘긴다', () => {
    renderPage(
      '/admin/usage-history?programType=CHALLENGE&userKeyword=김렛츠&page=2',
    );

    expect(listQuery).toHaveBeenLastCalledWith({
      programType: 'CHALLENGE',
      userKeyword: '김렛츠',
      page: 2,
      size: 20,
    });
  });

  it('유저 검색은 타자마다 조회하지 않고 제출할 때 나간다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('이름 또는 이메일'), '김렛츠');

    expect(listQuery).not.toHaveBeenCalledWith(
      expect.objectContaining({ userKeyword: '김렛츠' }),
    );

    await user.click(screen.getByRole('button', { name: '검색' }));

    expect(urlQuery()).toContain('userKeyword=');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ userKeyword: '김렛츠' }),
    );
  });

  it('조건이 바뀌면 첫 페이지로 돌아간다', async () => {
    // 3페이지를 보던 중 조건을 바꾸면 결과가 없는 페이지가 나온다.
    const user = userEvent.setup();
    renderPage('/admin/usage-history?page=3');

    await user.selectOptions(screen.getByRole('combobox'), 'VOD');

    expect(urlQuery()).not.toContain('page=');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ programType: 'VOD', page: 0 }),
    );
  });
});

describe('UsageHistoryPage 조회 상태', () => {
  it('조회 실패를 이력 없음과 구분해 알린다', () => {
    // 못 읽은 것과 없는 것은 다르다(PRD 7.4).
    listQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderPage();

    expect(
      screen.getByText(/이용 이력을 불러오지 못했습니다/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('조건에 맞는 이용 이력이 없습니다.'),
    ).not.toBeInTheDocument();
  });

  it('환불 가부를 판정하는 문구를 쓰지 않는다', () => {
    renderPage();

    expect(screen.queryByText(/환불 가능/)).not.toBeInTheDocument();
    expect(screen.queryByText(/환불 불가/)).not.toBeInTheDocument();
  });
});
