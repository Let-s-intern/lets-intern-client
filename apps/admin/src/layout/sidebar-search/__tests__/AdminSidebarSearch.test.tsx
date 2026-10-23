import { act, fireEvent, render, screen, within } from '@testing-library/react';
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

const onBackgroundClick = vi.fn();

const renderSearch = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <AdminSidebarSearch navData={NAV} />
      <textarea aria-label="다른 입력칸" />
      <button type="button" onClick={onBackgroundClick}>
        뒤 화면 버튼
      </button>
      <Routes>
        <Route path="*" element={<CurrentLocation />} />
      </Routes>
    </MemoryRouter>,
  );

const openButton = () => screen.getByRole('button', { name: '메뉴 검색 열기' });
const panel = () => screen.queryByRole('search', { name: '메뉴 검색' });
const input = () => screen.getByRole('combobox', { name: '메뉴 검색어' });
const type = (value: string) =>
  fireEvent.change(input(), { target: { value } });
const options = () => screen.getAllByRole('option');
const location = () => screen.getByTestId('location').textContent;

const pressShortcut = (
  target: EventTarget,
  modifier: { ctrlKey?: boolean; metaKey?: boolean },
) => {
  const event = new KeyboardEvent('keydown', {
    key: 'k',
    bubbles: true,
    cancelable: true,
    ...modifier,
  });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
};

// ClickAwayListener 는 마운트 다음 틱부터 바깥 클릭을 받는다
const waitClickAwayReady = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 0)));

afterEach(() => {
  vi.restoreAllMocks();
  onBackgroundClick.mockClear();
});

describe('AdminSidebarSearch 열기', () => {
  it('사이드바에는 입력칸이 아니라 검색 버튼과 단축키 배지가 있다', () => {
    renderSearch();
    expect(openButton()).toHaveTextContent(/검색(⌘K|Ctrl K)/);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('버튼을 누르면 패널이 열리고 입력칸에 포커스한다', () => {
    renderSearch();
    fireEvent.click(openButton());
    expect(panel()).toBeInTheDocument();
    expect(document.activeElement).toBe(input());
    expect(input()).toHaveAttribute(
      'placeholder',
      '메뉴·탭 검색 (예: 렛커 픽, 상세페이지, 일괄 등록)',
    );
  });

  it.each([
    ['Ctrl+K', { ctrlKey: true }],
    ['⌘K', { metaKey: true }],
  ])('%s 는 입력칸 안에서도 패널을 연다', (_, modifier) => {
    renderSearch();
    const textarea = screen.getByLabelText('다른 입력칸');
    textarea.focus();
    const event = pressShortcut(textarea, modifier);
    expect(event.defaultPrevented).toBe(true);
    expect(panel()).toBeInTheDocument();
    expect(document.activeElement).toBe(input());
  });

  it('열린 채로 다시 누르면 입력칸에 포커스를 되돌린다', () => {
    renderSearch();
    pressShortcut(window, { ctrlKey: true });
    screen.getByLabelText('다른 입력칸').focus();
    pressShortcut(window, { ctrlKey: true });
    expect(document.activeElement).toBe(input());
  });

  it('다른 키는 가로채지 않는다', () => {
    renderSearch();
    const textarea = screen.getByLabelText('다른 입력칸');
    const copy = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    const plainK = new KeyboardEvent('keydown', {
      key: 'k',
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(copy);
    textarea.dispatchEvent(plainK);
    expect(copy.defaultPrevented).toBe(false);
    expect(plainK.defaultPrevented).toBe(false);
    expect(panel()).not.toBeInTheDocument();
  });

  it('사이드바가 내려가면 단축키 리스너도 걷는다', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderSearch();
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});

describe('AdminSidebarSearch 패널', () => {
  it('검색어가 비면 사이드바 메뉴 전체를 섹션별로 보인다', () => {
    renderSearch();
    fireEvent.click(openButton());
    expect(options().map((option) => option.textContent)).toEqual([
      '멘토 목록멘토 관리 › 멘토 목록',
      '렛커 픽멘토 관리 › 렛커 픽',
      '회사 로고멘토 관리 › 회사 로고',
      '1:1 LIVE 멘토링프로그램 관리 › 1:1 LIVE 멘토링',
    ]);
    const sectionTitles = [
      ...screen
        .getByRole('listbox')
        .querySelectorAll('li[role="presentation"]'),
    ].map((item) => item.textContent);
    expect(sectionTitles).toEqual(['멘토 관리', '프로그램 관리']);
  });

  it('메뉴명과 「섹션 › 메뉴 › 탭」 경로를 보이고 맞는 부분을 강조한다', () => {
    renderSearch();
    fireEvent.click(openButton());
    type('상세페이지');
    const option = options()[0];
    expect(option).toHaveTextContent(
      '상세페이지프로그램 관리 › 1:1 LIVE 멘토링 › 상세페이지',
    );
    expect(within(option).getAllByText('상세페이지')[0].tagName).toBe('MARK');
  });

  it('↑↓ 는 끝에서 돌고, Enter 로 이동하며 패널을 닫는다', () => {
    renderSearch();
    fireEvent.click(openButton());
    type('멘토');
    expect(options()[0]).toHaveAttribute('aria-selected', 'true');
    expect(input()).toHaveAttribute('aria-activedescendant', options()[0].id);

    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    expect(options().at(-1)).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(options()[0]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(input()).toHaveAttribute('aria-activedescendant', options()[1].id);

    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(location()).toBe('/mentors');
    expect(panel()).not.toBeInTheDocument();
  });

  it('탭 항목을 누르면 ?tab= 주소로 간다', () => {
    renderSearch();
    fireEvent.click(openButton());
    type('상세페이지');
    fireEvent.click(options()[0]);
    expect(location()).toBe('/live-mentoring?tab=detailPage');
  });

  it('맞는 메뉴가 없으면 안내한다', () => {
    renderSearch();
    fireEvent.click(openButton());
    type('없는메뉴');
    expect(screen.getByText('일치하는 메뉴가 없습니다')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('Esc 로 닫고 열기 전 포커스(검색 버튼)로 돌려준다', () => {
    renderSearch();
    openButton().focus();
    fireEvent.click(openButton());
    fireEvent.keyDown(input(), { key: 'Escape' });
    expect(panel()).not.toBeInTheDocument();
    expect(document.activeElement).toBe(openButton());
  });

  it('배경을 가리지 않아 뒤 화면을 그대로 누를 수 있고, 바깥을 누르면 닫힌다', async () => {
    renderSearch();
    openButton().focus();
    fireEvent.click(openButton());
    await waitClickAwayReady();
    // 모달이 아니다
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(panel()).not.toHaveAttribute('aria-modal');

    const background = screen.getByRole('button', { name: '뒤 화면 버튼' });
    fireEvent.mouseDown(background);
    fireEvent.mouseUp(background);
    fireEvent.click(background);
    expect(onBackgroundClick).toHaveBeenCalled();
    expect(panel()).not.toBeInTheDocument();
  });
});
