import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminSidebar } from '../AdminSidebar';

const isAdminQuery = vi.fn();

// 사이드바는 어드민 여부만 확인하고 그린다. 조회 자체는 이 테스트의 관심사가 아니다.
vi.mock('@/api/user/user', () => ({
  useIsAdminQuery: () => isAdminQuery(),
}));

const renderSidebar = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AdminSidebar />
    </MemoryRouter>,
  );

/** `히스토리` 제목을 가진 그룹 블록. 다른 그룹의 링크가 섞이지 않게 범위를 좁힌다. */
const historyGroup = () =>
  screen.getByRole('heading', { name: '히스토리' }).closest('div')!
    .parentElement!;

beforeEach(() => {
  isAdminQuery.mockReturnValue({ data: true, isLoading: false });
});

describe('AdminSidebar 히스토리 그룹', () => {
  it('결제 관리 대신 히스토리 그룹을 그린다', () => {
    renderSidebar();

    expect(
      screen.getByRole('heading', { name: '히스토리' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('결제 관리')).not.toBeInTheDocument();
  });

  it('환불 히스토리와 이용 히스토리 두 항목을 둔다', () => {
    renderSidebar();

    const links = within(historyGroup()).getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual([
      '환불 히스토리',
      '이용 히스토리',
    ]);
  });

  it('환불 히스토리 경로는 /refund-history 그대로다', () => {
    // 경로를 바꾸면 기존 북마크가 깨진다. 회귀를 여기서 잡는다.
    renderSidebar();

    expect(
      within(historyGroup()).getByRole('link', { name: '환불 히스토리' }),
    ).toHaveAttribute('href', '/refund-history');
  });

  it('이용 히스토리 경로는 /usage-history 다', () => {
    renderSidebar();

    expect(
      within(historyGroup()).getByRole('link', { name: '이용 히스토리' }),
    ).toHaveAttribute('href', '/usage-history');
  });
});

/**
 * 화면을 만들어도 메뉴에 없으면 운영은 존재를 모른다 (LC-3438, PRD 4.3 A-2).
 */
describe('AdminSidebar VOD 관리 그룹', () => {
  it('VOD 관리 그룹은 올인원패스 관리와 히스토리 사이에 있다', () => {
    renderSidebar();

    const titles = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent);

    expect(titles.indexOf('VOD 관리')).toBe(
      titles.indexOf('올인원패스 관리') + 1,
    );
    expect(titles.indexOf('히스토리')).toBe(titles.indexOf('VOD 관리') + 1);
  });

  const vodGroup = () =>
    screen.getByRole('heading', { name: 'VOD 관리' }).closest('div')!
      .parentElement!;

  it.each([
    ['VOD 이용권 설정', '/vod-pass-product'],
    ['VOD 이용권 판매 설정', '/vod-pass-sale-settings'],
    ['VOD 이용권 구매자', '/vod-pass-applications'],
  ])('%s 메뉴가 %s 경로로 이어진다', (name, href) => {
    renderSidebar();

    expect(within(vodGroup()).getByRole('link', { name })).toHaveAttribute(
      'href',
      href,
    );
  });

  it('VOD 이용권 메뉴를 프로그램 관리 그룹에서는 보이지 않는다', () => {
    renderSidebar();

    const programGroup = screen
      .getByRole('heading', { name: '프로그램 관리' })
      .closest('div')!.parentElement!;

    expect(
      within(programGroup).queryByRole('link', { name: /VOD 이용권/ }),
    ).not.toBeInTheDocument();
  });
});

const groupLinks = (title: string) =>
  within(
    screen.getByRole('heading', { name: title }).closest('div')!.parentElement!,
  ).getAllByRole('link');

describe('AdminSidebar 멘토 관리 그룹 (LC-3492)', () => {
  it('멘토 화면 다섯 개를 이 순서로 둔다', () => {
    renderSidebar();

    expect(
      groupLinks('멘토 관리').map((link) => [
        link.textContent,
        link.getAttribute('href'),
      ]),
    ).toEqual([
      ['멘토 목록', '/mentors'],
      ['멘토 등록', '/mentors/register'],
      ['키워드', '/mentors/keywords'],
      ['렛커 픽', '/mentors/pick'],
      ['회사 로고', '/mentors/company-logos'],
    ]);
  });

  it('사용자 관리 바로 앞에 있고, 사용자 관리에는 멘토 항목이 없다', () => {
    renderSidebar();

    const titles = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent);
    expect(titles.indexOf('멘토 관리')).toBe(titles.indexOf('사용자 관리') - 1);
    expect(groupLinks('사용자 관리').map((link) => link.textContent)).toEqual([
      '커리어 DB',
      '쿠폰 관리',
      '리드 관리',
      '합격 인증 관리',
    ]);
  });

  it('멘토 상세(/mentors/:id)에서는 멘토 목록이 켜진다', () => {
    renderSidebar('/mentors/7');

    expect(screen.getByRole('link', { name: '멘토 목록' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('/mentors/pick 에서는 렛커 픽만 켜지고 멘토 목록은 꺼진다', () => {
    renderSidebar('/mentors/pick');

    expect(screen.getByRole('link', { name: '렛커 픽' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: '멘토 목록' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(
      screen
        .getAllByRole('link')
        .filter((link) => link.hasAttribute('aria-current')),
    ).toHaveLength(1);
  });
});
