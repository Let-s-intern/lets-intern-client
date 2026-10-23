import { ClickAwayListener } from '@mui/material';
import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { twMerge } from '@/lib/twMerge';

import { matchEntries, splitHighlight } from './matchEntries';
import type { SearchEntry } from './searchEntries';

const Highlight = ({ text, query }: { text: string; query: string }) => (
  <>
    {splitHighlight(text, query).map((part, index) =>
      part.isMatch ? (
        <mark key={index} className="text-primary bg-transparent font-bold">
          {part.text}
        </mark>
      ) : (
        <span key={index}>{part.text}</span>
      ),
    )}
  </>
);

interface Props {
  /** 검색 대상 전체(메뉴 + 화면 안 탭) */
  entries: SearchEntry[];
  /** 검색어가 비었을 때 섹션별로 보여 줄 사이드바 메뉴 */
  menuEntries: SearchEntry[];
  /** 열린 상태에서 단축키를 다시 누르면 올라간다. 입력칸으로 포커스를 다시 가져온다 */
  focusSignal: number;
  onSelect: (entry: SearchEntry) => void;
  onClose: () => void;
}

/**
 * 화면 위쪽 가운데에 뜨는 메뉴 검색(Spotlight 식). 모달이 아니다 — 배경을 가리거나 스크롤·포커스를
 * 묶지 않아 뒤 화면을 그대로 보고 만질 수 있다. Esc·바깥 클릭·이동으로 닫힌다.
 */
export default function SearchPanel({
  entries,
  menuEntries,
  focusSignal,
  onSelect,
  onClose,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const isEmptyQuery = query.trim() === '';
  const results = useMemo(
    () => (isEmptyQuery ? menuEntries : matchEntries(entries, query)),
    [entries, menuEntries, query, isEmptyQuery],
  );

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [focusSignal]);

  // 키보드로 움직인 행이 목록 밖이면 보이게 한다
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex]);

  const optionId = (index: number) => `${listId}-option-${index}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onSelect(results[activeIndex]);
    }
  };

  return createPortal(
    <ClickAwayListener onClickAway={onClose}>
      <div
        role="search"
        aria-label="메뉴 검색"
        // MUI 모달(1300) 위, 스낵바(1400) 아래
        className="border-neutral-80 fixed left-1/2 top-[12vh] z-[1350] w-[640px] max-w-[calc(100vw-32px)] -translate-x-1/2 overflow-hidden rounded-xl border bg-white shadow-2xl"
      >
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="메뉴 검색어"
          aria-expanded
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            results.length > 0 ? optionId(activeIndex) : undefined
          }
          placeholder="메뉴·탭 검색 (예: 렛커 픽, 상세페이지, 일괄 등록)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="border-neutral-80 text-neutral-0 h-14 w-full border-b px-5 text-[18px] outline-none placeholder:text-neutral-50"
        />
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="메뉴 검색 결과"
          className="max-h-[60vh] overflow-y-auto py-2"
        >
          {results.length === 0 ? (
            <li className="text-neutral-40 px-5 py-6 text-center text-sm">
              일치하는 메뉴가 없습니다
            </li>
          ) : (
            results.map((entry, index) => {
              const section = entry.parents[0];
              // 검색어가 비었을 때는 사이드바처럼 섹션 제목을 끼운다
              const showSection =
                isEmptyQuery && section !== results[index - 1]?.parents[0];
              return (
                <Fragment key={`${entry.path}-${entry.label}`}>
                  {showSection ? (
                    <li
                      role="presentation"
                      className="text-neutral-40 px-5 pb-1 pt-3 text-xs font-semibold"
                    >
                      {section}
                    </li>
                  ) : null}
                  <li
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                    // 누르기 전에 입력칸이 포커스를 잃지 않게 한다
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelect(entry)}
                    onMouseMove={() => setActiveIndex(index)}
                    className={twMerge(
                      'mx-2 cursor-pointer rounded-lg px-3 py-2.5',
                      index === activeIndex && 'bg-neutral-95',
                    )}
                  >
                    <div className="text-neutral-0 text-[16px] font-semibold">
                      <Highlight text={entry.label} query={query} />
                    </div>
                    <div className="text-neutral-40 text-[13px]">
                      {[...entry.parents, entry.label].map((segment, i) => (
                        <span key={i}>
                          {i > 0 ? ' › ' : null}
                          <Highlight text={segment} query={query} />
                        </span>
                      ))}
                    </div>
                  </li>
                </Fragment>
              );
            })
          )}
        </ul>
      </div>
    </ClickAwayListener>,
    document.body,
  );
}
