import { ClickAwayListener } from '@mui/material';
import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { twMerge } from '@/lib/twMerge';

import { matchEntries, splitHighlight } from './matchEntries';
import type { SearchEntry } from './searchEntries';
import { useProgramSearch } from './useProgramSearch';
import { useUserSearch } from './useUserSearch';

/** 유저·프로그램처럼 서버에서 찾는 묶음이 입력이 멈추길 기다리는 시간 */
const REMOTE_DEBOUNCE_MS = 300;

const Highlight = ({ text, query }: { text: string; query: string }) => (
  <>
    {splitHighlight(text, query).map((part, index) =>
      part.isMatch ? (
        <mark key={index} className="bg-transparent font-bold text-[#8E9BFF]">
          {part.text}
        </mark>
      ) : (
        <span key={index}>{part.text}</span>
      ),
    )}
  </>
);

/** 목록 한 줄. option 만 키보드로 고를 수 있다 */
type Block =
  | { kind: 'heading'; key: string; text: string }
  | { kind: 'note'; key: string; text: string }
  | { kind: 'header'; key: string; node: ReactNode }
  | { kind: 'option'; key: string; entry: SearchEntry; isNested?: boolean };

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

/*
 * 다크 패널 색(대비는 WCAG 기준으로 확인)
 *   배경 #1F2328 · 입력칸 #262B31 · 선택 행 #2D333B · 테두리 흰색 10%
 *   글자 흰색 · 경로·placeholder #9AA4B2(5.0~6.3:1) · 섹션 제목 #8B949E(배경 위 5.1:1)
 *   · 일치 #8E9BFF(5.0~6.2:1)
 */

/**
 * 화면 위쪽 가운데에 뜨는 메뉴 검색(Spotlight 식). 모달이 아니다 — 배경을 가리거나 스크롤·포커스를
 * 묶지 않아 뒤 화면을 그대로 보고 만질 수 있다. Esc·바깥 클릭·이동으로 닫힌다.
 * 메뉴는 바로 거르고, 그 아래 유저·프로그램은 서버에서 찾아 갈 곳을 하위 항목으로 보여 준다.
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
  const debouncedQuery = useDebouncedValue(query, REMOTE_DEBOUNCE_MS);

  const isEmptyQuery = query.trim() === '';
  const menuResults = useMemo(
    () => (isEmptyQuery ? menuEntries : matchEntries(entries, query)),
    [entries, menuEntries, query, isEmptyQuery],
  );
  const userSearch = useUserSearch(query, debouncedQuery);
  const programSearch = useProgramSearch(query, debouncedQuery);

  const blocks = useMemo<Block[]>(() => {
    if (isEmptyQuery) {
      // 검색어가 비었을 때는 사이드바처럼 섹션 제목을 끼운다
      return menuResults.flatMap((entry, index) => {
        const section = entry.parents[0];
        const option: Block = {
          kind: 'option',
          key: `menu-${entry.path}`,
          entry,
        };
        return section !== menuResults[index - 1]?.parents[0]
          ? [
              { kind: 'heading', key: `section-${section}`, text: section },
              option,
            ]
          : [option];
      });
    }

    const list: Block[] = [];
    const hasUserGroup = userSearch.status !== 'idle';
    if (hasUserGroup)
      list.push({ kind: 'heading', key: 'h-menu', text: '메뉴' });
    if (menuResults.length === 0) {
      list.push({
        kind: 'note',
        key: 'menu-empty',
        text: '일치하는 메뉴가 없습니다',
      });
    }
    menuResults.forEach((entry) =>
      list.push({
        kind: 'option',
        key: `menu-${entry.path}-${entry.label}`,
        entry,
      }),
    );

    if (hasUserGroup) {
      list.push({ kind: 'heading', key: 'h-user', text: '유저' });
      userSearch.users.forEach((user) => {
        list.push({
          kind: 'header',
          key: `user-${user.id}`,
          node: (
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-white">
                <Highlight text={user.title} query={query} />
              </span>
              {user.isMentor ? (
                <span className="rounded bg-[#8E9BFF]/20 px-1.5 py-0.5 text-[11px] font-semibold text-[#8E9BFF]">
                  멘토
                </span>
              ) : null}
              <span className="text-[13px] text-[#9AA4B2]">
                {user.maskedEmail}
              </span>
            </div>
          ),
        });
        user.destinations.forEach((entry) =>
          list.push({
            kind: 'option',
            key: `user-${user.id}-${entry.path}`,
            entry,
            isNested: true,
          }),
        );
      });
      if (userSearch.status === 'loading') {
        list.push({ kind: 'note', key: 'user-loading', text: '유저 찾는 중…' });
      } else if (userSearch.status === 'error') {
        list.push({
          kind: 'note',
          key: 'user-error',
          text: '유저를 불러오지 못했습니다',
        });
      } else if (userSearch.users.length === 0) {
        list.push({
          kind: 'note',
          key: 'user-empty',
          text: '일치하는 유저가 없습니다',
        });
      }
    }

    if (programSearch.status !== 'idle') {
      list.push({ kind: 'heading', key: 'h-program', text: '프로그램' });
      programSearch.programs.forEach((program) => {
        list.push({
          kind: 'header',
          key: `program-${program.type}-${program.id}`,
          node: (
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-white">
                <Highlight text={program.title} query={query} />
              </span>
              <span className="text-[13px] text-[#9AA4B2]">
                #{program.id}
                {program.summary ? ` · ${program.summary}` : null}
              </span>
            </div>
          ),
        });
        program.destinations.forEach((entry) =>
          list.push({
            kind: 'option',
            key: `program-${program.type}-${program.id}-${entry.path}`,
            entry,
            isNested: true,
          }),
        );
      });
      if (programSearch.status === 'loading') {
        list.push({
          kind: 'note',
          key: 'program-loading',
          text: '프로그램 찾는 중…',
        });
      } else if (programSearch.status === 'error') {
        list.push({
          kind: 'note',
          key: 'program-error',
          text: '프로그램을 불러오지 못했습니다',
        });
      } else if (programSearch.programs.length === 0) {
        list.push({
          kind: 'note',
          key: 'program-empty',
          text: '일치하는 프로그램이 없습니다',
        });
      }
    }
    return list;
  }, [isEmptyQuery, menuResults, userSearch, programSearch, query]);

  const options = blocks.filter(
    (block): block is Extract<Block, { kind: 'option' }> =>
      block.kind === 'option',
  );
  // 결과가 줄어 고른 자리가 사라지면 맨 위로
  const safeActiveIndex = activeIndex < options.length ? activeIndex : 0;

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [focusSignal]);

  // 키보드로 움직인 행이 목록 밖이면 보이게 한다
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView?.({ block: 'nearest' });
  }, [safeActiveIndex]);

  const optionId = (index: number) => `${listId}-option-${index}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (options.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((safeActiveIndex + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((safeActiveIndex - 1 + options.length) % options.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onSelect(options[safeActiveIndex].entry);
    }
  };

  let optionIndex = -1;

  return createPortal(
    <ClickAwayListener onClickAway={onClose}>
      <div
        role="search"
        aria-label="메뉴 검색"
        // MUI 모달(1300) 위, 스낵바(1400) 아래
        className="fixed left-1/2 top-[12vh] z-[1350] w-[640px] max-w-[calc(100vw-32px)] -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#1F2328] shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
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
            options.length > 0 ? optionId(safeActiveIndex) : undefined
          }
          placeholder="메뉴·탭 검색 (예: 렛커 픽, 상세페이지, 일괄 등록)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="h-14 w-full border-b border-white/10 bg-[#262B31] px-5 text-[18px] text-white outline-none placeholder:text-[#9AA4B2]"
        />
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="메뉴 검색 결과"
          className="max-h-[60vh] overflow-y-auto py-2"
        >
          {blocks.map((block) => {
            if (block.kind === 'heading') {
              return (
                <li
                  key={block.key}
                  role="presentation"
                  className="px-5 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-[#8B949E]"
                >
                  {block.text}
                </li>
              );
            }
            if (block.kind === 'note') {
              return (
                <li
                  key={block.key}
                  role="presentation"
                  className="px-5 py-3 text-center text-sm text-[#9AA4B2]"
                >
                  {block.text}
                </li>
              );
            }
            if (block.kind === 'header') {
              return (
                <li key={block.key} role="presentation" className="px-5 pt-2">
                  {block.node}
                </li>
              );
            }
            optionIndex += 1;
            const index = optionIndex;
            const { entry } = block;
            return (
              <li
                key={block.key}
                id={optionId(index)}
                role="option"
                aria-selected={index === safeActiveIndex}
                // 누르기 전에 입력칸이 포커스를 잃지 않게 한다
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(entry)}
                onMouseMove={() => setActiveIndex(index)}
                className={twMerge(
                  'mx-2 cursor-pointer rounded-lg px-3 py-2.5',
                  block.isNested && 'ml-6 py-1.5',
                  index === safeActiveIndex && 'bg-[#2D333B]',
                )}
              >
                <div
                  className={twMerge(
                    'font-semibold text-white',
                    block.isNested ? 'text-[14px]' : 'text-[16px]',
                  )}
                >
                  <Highlight text={entry.label} query={query} />
                </div>
                <div className="text-[13px] text-[#9AA4B2]">
                  {[...entry.parents, entry.label].map((segment, i) => (
                    <span key={i}>
                      {i > 0 ? ' › ' : null}
                      <Highlight text={segment} query={query} />
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </ClickAwayListener>,
    document.body,
  );
}
