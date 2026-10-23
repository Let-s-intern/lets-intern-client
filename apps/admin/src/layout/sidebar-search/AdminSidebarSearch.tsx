import { useEffect, useMemo, useRef, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import SearchPanel from './SearchPanel';
import {
  buildMenuEntries,
  buildSearchEntries,
  type SearchEntry,
  type SearchNavSection,
} from './searchEntries';

/** Mac 이면 ⌘, 아니면 Ctrl */
const isMac = () => {
  if (typeof navigator === 'undefined') return false;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? navigator.platform;
  return /mac/i.test(platform);
};

interface Props {
  navData: readonly SearchNavSection[];
}

/**
 * 사이드바 맨 위 검색 버튼. 누르거나 ⌘K(Mac)·Ctrl+K 로 화면 위쪽에 검색 패널을 띄운다.
 * 사이드바 메뉴와 화면 안 탭(`searchEntries.ts`)을 찾아 그 주소로 이동한다.
 */
export default function AdminSidebarSearch({ navData }: Props) {
  const navigate = useNavigate();
  const shortcut = useMemo(() => (isMac() ? '⌘K' : 'Ctrl K'), []);
  const entries = useMemo(() => buildSearchEntries(navData), [navData]);
  const menuEntries = useMemo(() => buildMenuEntries(navData), [navData]);

  const [isOpen, setIsOpen] = useState(false);
  // 열린 채로 단축키를 다시 누르면 입력칸에 포커스를 다시 준다
  const [focusSignal, setFocusSignal] = useState(0);
  // 닫히면 열기 전 포커스로 돌려준다
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const open = () => {
    if (!isOpen) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
    }
    setIsOpen(true);
    setFocusSignal((prev) => prev + 1);
  };

  const close = () => {
    setIsOpen(false);
    returnFocusRef.current?.focus?.();
  };

  // ⌘K·Ctrl+K 만 가로챈다. 입력칸·에디터 안에서도 동작하고 다른 키는 건드리지 않는다
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
      e.preventDefault();
      open();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // open 이 isOpen 을 읽으므로 열림 상태가 바뀔 때 다시 건다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSelect = (entry: SearchEntry) => {
    setIsOpen(false);
    navigate(entry.path);
  };

  return (
    <div className="px-3 pb-2">
      <button
        type="button"
        aria-label="메뉴 검색 열기"
        aria-keyshortcuts={isMac() ? 'Meta+K' : 'Control+K'}
        onClick={open}
        className="text-xsmall14 flex w-full items-center gap-2 rounded bg-[#2A2A2A] px-3 py-2 text-neutral-50 hover:bg-[#3A3A3A]"
      >
        <IoIosSearch className="shrink-0 text-base" />
        <span className="flex-1 text-left">검색</span>
        <kbd className="text-xxsmall12 rounded border border-neutral-600 px-1.5 py-0.5 font-sans">
          {shortcut}
        </kbd>
      </button>
      {isOpen ? (
        <SearchPanel
          entries={entries}
          menuEntries={menuEntries}
          focusSignal={focusSignal}
          onSelect={handleSelect}
          onClose={close}
        />
      ) : null}
    </div>
  );
}
