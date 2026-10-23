import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AdminSidebarSearch from '../AdminSidebarSearch';
import type { SearchNavSection } from '../searchEntries';

const NAV: SearchNavSection[] = [
  {
    title: '멘토 관리',
    itemList: [
      { name: '멘토 목록', url: '/mentors' },
      { name: '렛커 픽', url: '/mentors/pick' },
      { name: '회사 로고', url: '/mentors/company-logos' },
    ],
  },
  {
    title: '프로그램 관리',
    itemList: [{ name: '1:1 LIVE 멘토링', url: '/live-mentoring' }],
  },
];

const CurrentLocation = () => {
  const location = useLocation();
  return (
    <span data-testid="location">{`${location.pathname}${location.search}`}</span>
  );
};

const renderSearch = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <AdminSidebarSearch navData={NAV} />
      <textarea aria-label="다른 입력칸" />
      <Routes>
        <Route path="*" element={<CurrentLocation />} />
      </Routes>
    </MemoryRouter>,
  );

const input = () => screen.getByRole('combobox', { name: '메뉴 검색' });
const type = (value: string) => {
  fireEvent.focus(input());
  fireEvent.change(input(), { target: { value } });
};
const options = () => screen.getAllByRole('option');
const location = () => screen.getByTestId('location').textContent;

describe('AdminSidebarSearch 단축키', () => {
  afterEach(() => vi.restoreAllMocks());

  it.each([
    ['Ctrl+K', { ctrlKey: true }],
    ['⌘K', { metaKey: true }],
  ])('%s 로 검색칸에 포커스하고 입력을 고른다', (_, modifier) => {
    renderSearch();
    type('멘토');
    fireEvent.blur(input());
    screen.getByLabelText('다른 입력칸').focus();

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      bubbles: true,
      cancelable: true,
      ...modifier,
    });
    const selectSpy = vi.spyOn(input() as HTMLInputElement, 'select');
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(input());
    expect(selectSpy).toHaveBeenCalled();
  });

  it('입력칸 안에서도 동작하고, 다른 키는 가로채지 않는다', () => {
    renderSearch();
    const textarea = screen.getByLabelText('다른 입력칸');
    textarea.focus();

    const other = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(other);
    expect(other.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(textarea);

    const plainK = new KeyboardEvent('keydown', {
      key: 'k',
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(plainK);
    expect(plainK.defaultPrevented).toBe(false);

    textarea.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'K',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(document.activeElement).toBe(input());
  });

  it('사이드바가 내려가면 단축키 리스너도 걷는다', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderSearch();
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('OS 에 맞춰 단축키 안내를 단다', () => {
    renderSearch();
    expect(input()).toHaveAttribute(
      'placeholder',
      expect.stringMatching(/^검색 (⌘K|Ctrl\+K)$/),
    );
  });
});

describe('AdminSidebarSearch 결과', () => {
  it('「섹션 › 메뉴」 경로로 보이고 맞는 부분을 강조한다', () => {
    renderSearch();
    type('픽');

    const [first] = options();
    expect(first).toHaveTextContent('멘토 관리 › 렛커 픽');
    expect(within(first).getByText('픽').tagName).toBe('MARK');
  });

  it('화면 안 탭은 「섹션 › 메뉴 › 탭」 으로 보이고 ?tab= 주소로 간다', () => {
    renderSearch();
    type('상세페이지');

    const option = options().find((item) =>
      item.textContent?.includes('1:1 LIVE 멘토링 › 상세페이지'),
    )!;
    expect(option).toHaveTextContent(
      '프로그램 관리 › 1:1 LIVE 멘토링 › 상세페이지',
    );
    fireEvent.click(option);
    expect(location()).toBe('/live-mentoring?tab=detailPage');
  });

  it('별칭으로도 찾는다(「파비콘」 → 회사 로고)', () => {
    renderSearch();
    type('파비콘');
    expect(options()[0]).toHaveTextContent('멘토 관리 › 회사 로고');
  });

  it('↑↓ 로 고르고 Enter 로 이동한 뒤 입력을 비우고 닫는다', () => {
    renderSearch();
    type('멘토');
    expect(options()[0]).toHaveAttribute('aria-selected', 'true');
    expect(input()).toHaveAttribute('aria-activedescendant', options()[0].id);

    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(options()[1]).toHaveAttribute('aria-selected', 'true');
    expect(input()).toHaveAttribute('aria-activedescendant', options()[1].id);
    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    // 맨 위에서 위로 가면 맨 아래로 돈다
    expect(options().at(-1)).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(input(), { key: 'ArrowDown' });

    const target = options()[0].textContent;
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(target).toContain('멘토 목록');
    expect(location()).toBe('/mentors');
    expect(input()).toHaveValue('');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Esc 는 목록을 닫고, 한 번 더 누르면 검색칸에서 나간다', () => {
    renderSearch();
    input().focus();
    type('멘토');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(input(), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(input());

    fireEvent.keyDown(input(), { key: 'Escape' });
    expect(document.activeElement).not.toBe(input());
  });

  it('맞는 메뉴가 없으면 안내한다', () => {
    renderSearch();
    type('없는메뉴');
    expect(screen.getByText('일치하는 메뉴가 없습니다')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });
});
