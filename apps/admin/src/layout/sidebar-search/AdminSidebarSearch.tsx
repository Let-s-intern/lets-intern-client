import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { twMerge } from '@/lib/twMerge';

import { matchEntries, splitHighlight } from './matchEntries';
import {
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

const Highlight = ({ text, query }: { text: string; query: string }) => (
  <>
    {splitHighlight(text, query).map((part, index) =>
      part.isMatch ? (
        <mark key={index} className="bg-transparent font-bold text-white">
          {part.text}
        </mark>
      ) : (
        <span key={index}>{part.text}</span>
      ),
    )}
  </>
);

interface Props {
  navData: readonly SearchNavSection[];
}

/**
 * 사이드바 맨 위 메뉴 검색. ⌘K(Mac)·Ctrl+K 로 어디서든 바로 연다.
 * 사이드바 메뉴와 화면 안 탭(`searchEntries.ts`)을 찾아 그 주소로 이동한다.
 */
export default function AdminSidebarSearch({ navData }: Props) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const shortcut = useMemo(() => (isMac() ? '⌘K' : 'Ctrl+K'), []);

  const entries = useMemo(() => buildSearchEntries(navData), [navData]);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => matchEntries(entries, query), [entries, query]);
  const showList = isOpen && query.trim() !== '';

  // ⌘K·Ctrl+K 만 가로챈다. 입력칸·에디터 안에서도 동작하고 다른 키는 건드리지 않는다
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const go = (entry: SearchEntry) => {
    navigate(entry.path);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (showList) setIsOpen(false);
      else inputRef.current?.blur();
      return;
    }
    if (!showList || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[activeIndex]);
    }
  };

  const optionId = (index: number) => `${listId}-option-${index}`;

  return (
    <div className="px-3 pb-2">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="메뉴 검색"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && results.length > 0 ? optionId(activeIndex) : undefined
          }
          placeholder={`검색 ${shortcut}`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
          className="text-xsmall14 w-full rounded bg-[#2A2A2A] py-2 pl-3 pr-14 text-white outline-none placeholder:text-neutral-50 focus:ring-1 focus:ring-neutral-50"
        />
        <kbd className="text-xxsmall12 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-neutral-600 px-1.5 py-0.5 font-sans text-neutral-50">
          {shortcut}
        </kbd>
      </div>
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="메뉴 검색 결과"
          className="mt-1 max-h-[17rem] overflow-y-auto rounded bg-[#2A2A2A] py-1"
        >
          {results.length === 0 ? (
            <li className="text-xsmall14 px-3 py-2 text-neutral-50">
              일치하는 메뉴가 없습니다
            </li>
          ) : (
            results.map((entry, index) => (
              <li
                key={`${entry.path}-${entry.label}`}
                id={optionId(index)}
                role="option"
                aria-selected={index === activeIndex}
                // 누르기 전에 입력칸이 blur 되며 목록이 닫히지 않게 한다
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(entry)}
                onMouseEnter={() => setActiveIndex(index)}
                className={twMerge(
                  'text-xsmall14 text-neutral-70 cursor-pointer px-3 py-2',
                  index === activeIndex && 'bg-[#3A3A3A] text-white',
                )}
              >
                {[...entry.parents, entry.label].map((segment, i) => (
                  <span key={i}>
                    {i > 0 ? ' › ' : null}
                    <Highlight text={segment} query={query} />
                  </span>
                ))}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
