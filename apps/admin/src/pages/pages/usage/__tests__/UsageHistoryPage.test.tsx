import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

const openAdvanced = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: '상세 조건 펼치기' }));

const programSearch = () => screen.getByPlaceholderText('프로그램 제목 일부');
const userSearch = () => screen.getByPlaceholderText('이름 또는 이메일');
const searchButton = () => screen.getByRole('button', { name: '검색' });

beforeEach(() => {
  /*
    빠른 선택이 만드는 날짜를 단언하려면 오늘이 고정돼야 한다.
    타이머는 실제 것을 쓴다(userEvent 가 기다린다).
  */
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-08-06T09:00:00'));

  listQuery.mockReset();
  listQuery.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('UsageHistoryPage 검색', () => {
  it('URL 의 조건을 그대로 조회에 넘긴다', () => {
    renderPage(
      '/admin/usage-history?programKeyword=챌린지&userKeyword=김렛츠&programType=CHALLENGE' +
        '&paidFrom=2026-07-01&paidTo=2026-08-06&firstAccessedFrom=2026-07-02' +
        '&firstAccessedTo=2026-08-05&usageStatus=NOT_USED&includeCanceled=false' +
        '&sort=PAID_ASC&page=2',
    );

    expect(listQuery).toHaveBeenLastCalledWith({
      programKeyword: '챌린지',
      userKeyword: '김렛츠',
      programType: 'CHALLENGE',
      paidFrom: '2026-07-01',
      paidTo: '2026-08-06',
      firstAccessedFrom: '2026-07-02',
      firstAccessedTo: '2026-08-05',
      usageStatus: 'NOT_USED',
      includeCanceled: false,
      sort: 'PAID_ASC',
      page: 2,
      size: 20,
    });
  });

  it('유저 검색은 타자마다 조회하지 않고 제출할 때 나간다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(userSearch(), '김렛츠');

    expect(listQuery).not.toHaveBeenCalledWith(
      expect.objectContaining({ userKeyword: '김렛츠' }),
    );

    await user.click(searchButton());

    expect(urlQuery()).toContain('userKeyword=');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ userKeyword: '김렛츠' }),
    );
  });

  it('프로그램 검색도 타자마다 조회하지 않고 제출할 때 나간다', async () => {
    // 두 검색칸의 동작이 서로 달라서는 안 된다. 한쪽만 즉시 나가면 운영이 두 칸을
    // 다른 것으로 오해하고, 서버는 타자 수만큼 맞는다.
    const user = userEvent.setup();
    renderPage();

    await user.type(programSearch(), '면접 준비');

    expect(listQuery).not.toHaveBeenCalledWith(
      expect.objectContaining({ programKeyword: '면접 준비' }),
    );

    await user.click(searchButton());

    expect(urlQuery()).toContain('programKeyword=');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ programKeyword: '면접 준비' }),
    );
  });

  it('프로그램과 유저를 함께 넣으면 둘 다 조회에 실린다', async () => {
    // 어드민이 programId 를 몰라 프로그램을 못 찾던 문제를 푼 것이지,
    // 유저 검색을 대체한 것이 아니다. 두 조건은 AND 로 함께 걸려야 한다.
    const user = userEvent.setup();
    renderPage();

    await user.type(programSearch(), '챌린지');
    await user.type(userSearch(), '김렛츠');
    await user.click(searchButton());

    expect(urlQuery()).toContain('programKeyword=');
    expect(urlQuery()).toContain('userKeyword=');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        programKeyword: '챌린지',
        userKeyword: '김렛츠',
      }),
    );
  });

  it('프로그램 타입까지 세 조건을 동시에 건다', async () => {
    const user = userEvent.setup();
    renderPage();

    await openAdvanced(user);
    await user.selectOptions(
      screen.getByLabelText('프로그램 타입'),
      'CHALLENGE',
    );
    await user.type(programSearch(), '챌린지');
    await user.type(userSearch(), '김렛츠');
    await user.click(searchButton());

    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        programType: 'CHALLENGE',
        programKeyword: '챌린지',
        userKeyword: '김렛츠',
      }),
    );
  });

  it('검색어를 비우고 제출하면 URL 에서 빠진다', async () => {
    const user = userEvent.setup();
    renderPage('/admin/usage-history?programKeyword=챌린지&userKeyword=김렛츠');

    await user.clear(programSearch());
    await user.click(searchButton());

    expect(urlQuery()).not.toContain('programKeyword');
    // 한쪽을 지웠다고 다른 쪽까지 사라지면 안 된다.
    expect(urlQuery()).toContain('userKeyword=');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        programKeyword: undefined,
        userKeyword: '김렛츠',
      }),
    );
  });

  it('조건이 바뀌면 첫 페이지로 돌아간다', async () => {
    // 3페이지를 보던 중 조건을 바꾸면 결과가 없는 페이지가 나온다.
    const user = userEvent.setup();
    renderPage('/admin/usage-history?page=3');

    await user.selectOptions(screen.getByLabelText('이용 상태'), 'NOT_USED');

    expect(urlQuery()).not.toContain('page=');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ usageStatus: 'NOT_USED', page: 0 }),
    );
  });
});

describe('UsageHistoryPage 결제일 범위', () => {
  it('빠른 선택이 날짜를 채우고 그 값이 입력칸에 보인다', async () => {
    // 무엇이 걸렸는지 감춘 채 결과만 주면 운영이 목록을 신뢰할 근거가 없다.
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: '7일' }));

    expect(urlQuery()).toContain('paidFrom=2026-07-30');
    expect(screen.getByLabelText('결제일 시작')).toHaveValue('2026-07-30');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ paidFrom: '2026-07-30' }),
    );
  });

  it('전체를 고르면 결제일 조건이 빠진다', async () => {
    const user = userEvent.setup();
    renderPage('/admin/usage-history?paidFrom=2026-07-30&paidTo=2026-08-06');

    await user.click(screen.getByRole('button', { name: '전체' }));

    expect(urlQuery()).not.toContain('paidFrom');
    expect(urlQuery()).not.toContain('paidTo');
  });

  it('시작이 종료보다 늦으면 조회하지 않고 그 자리에서 알린다', async () => {
    // 서버에 보내 빈 결과를 받으면 입력이 잘못된 것인지 해당 건이 없는 것인지 알 수 없다.
    renderPage('/admin/usage-history?paidFrom=2026-08-10');

    fireEvent.change(screen.getByLabelText('결제일 종료'), {
      target: { value: '2026-08-01' },
    });

    expect(screen.getByText(/시작일이 종료일보다 늦습니다/)).toBeVisible();
    expect(urlQuery()).not.toContain('paidTo');
    expect(listQuery).not.toHaveBeenCalledWith(
      expect.objectContaining({ paidTo: '2026-08-01' }),
    );
  });

  it('범위를 바로잡으면 그때 조회에 실린다', async () => {
    renderPage('/admin/usage-history?paidFrom=2026-08-10');

    fireEvent.change(screen.getByLabelText('결제일 종료'), {
      target: { value: '2026-08-01' },
    });
    fireEvent.change(screen.getByLabelText('결제일 종료'), {
      target: { value: '2026-08-12' },
    });

    expect(urlQuery()).toContain('paidTo=2026-08-12');
  });
});

describe('UsageHistoryPage 빠른 조회', () => {
  it('결제 7일 이내 · 미이용을 한 번에 건다', async () => {
    // 이 화면이 존재하는 이유인 질의다(PRD 5.5.3).
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: '결제 7일 이내 · 미이용' }),
    );

    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        paidFrom: '2026-07-30',
        usageStatus: 'NOT_USED',
      }),
    );
  });

  it('버튼이 채운 값을 필터가 그대로 보여주고 손으로 고칠 수 있다', async () => {
    // 규정 숫자를 코드에 박지 않는 것과 같은 이유로, 채운 값은 조정 가능해야 한다.
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: '결제 7일 이내 · 미이용' }),
    );

    expect(screen.getByLabelText('결제일 시작')).toHaveValue('2026-07-30');
    expect(screen.getByLabelText('이용 상태')).toHaveValue('NOT_USED');

    fireEvent.change(screen.getByLabelText('결제일 시작'), {
      target: { value: '2026-07-27' },
    });

    expect(urlQuery()).toContain('paidFrom=2026-07-27');
  });
});

describe('UsageHistoryPage 이용 상태', () => {
  it('미이용과 집계 이전을 하나로 묶지 않는다', () => {
    // 묶으면 소급 불가능한 과거 결제가 미이용 목록에 섞이고, 그게 잘못된 전액 환불이 된다.
    renderPage();

    const options = Array.from(
      screen.getByLabelText('이용 상태').querySelectorAll('option'),
    ).map((option) => option.textContent);

    expect(options).toEqual([
      '전체',
      '이용함',
      '미이용',
      '기록 없음 (집계 이전)',
    ]);
  });

  it('집계 이전만 따로 조회할 수 있다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(
      screen.getByLabelText('이용 상태'),
      'BEFORE_TRACKING',
    );

    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ usageStatus: 'BEFORE_TRACKING' }),
    );
  });
});

describe('UsageHistoryPage 상세 조건', () => {
  it('평소에는 접혀 있다', () => {
    renderPage();

    expect(screen.queryByLabelText('프로그램 타입')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '상세 조건 펼치기' }),
    ).toBeInTheDocument();
  });

  it('걸려 있는 상세 조건이 있으면 펼쳐진 채로 연다', () => {
    // 공유받은 링크의 조건이 접힌 채 결과만 바꾸면 운영이 목록을 잘못 읽는다.
    renderPage('/admin/usage-history?sort=PAID_ASC');

    expect(screen.getByLabelText('정렬')).toHaveValue('PAID_ASC');
  });

  it('취소 건은 기본 포함이고 끄면 조회에 실린다', async () => {
    const user = userEvent.setup();
    renderPage();

    await openAdvanced(user);

    expect(screen.getByLabelText('취소 건 포함')).toBeChecked();

    await user.click(screen.getByLabelText('취소 건 포함'));

    expect(urlQuery()).toContain('includeCanceled=false');
    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ includeCanceled: false }),
    );
  });

  it('최초 이용일 범위와 정렬을 건다', async () => {
    const user = userEvent.setup();
    renderPage();

    await openAdvanced(user);
    fireEvent.change(screen.getByLabelText('최초 이용일 시작'), {
      target: { value: '2026-07-01' },
    });
    await user.selectOptions(screen.getByLabelText('정렬'), 'PAID_DESC');

    expect(listQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        firstAccessedFrom: '2026-07-01',
        sort: 'PAID_DESC',
      }),
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
