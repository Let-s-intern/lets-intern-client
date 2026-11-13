'use client';

import { ChevronDown, Search, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { twMerge } from '@/lib/twMerge';

import HomeSearchChat, { ChatTurn } from './HomeSearchChat';
import {
  HOME_SEARCH_CATEGORIES,
  HOME_SEARCH_QUERY_MAX_LENGTH,
  HomeSearchCategory,
  HomeSearchChatMessage,
  HomeSearchResponse,
} from './homeSearchTypes';

async function postHomeSearch(params: {
  query: string;
  category: HomeSearchCategory;
  history: HomeSearchChatMessage[];
}): Promise<HomeSearchResponse> {
  const res = await fetch('/api/home-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('검색에 실패했어요.');
  return res.json();
}

/** 답이 온 턴만 대화 이력으로 서버에 보낸다 */
function toHistory(turns: ChatTurn[]): HomeSearchChatMessage[] {
  return turns.flatMap((turn) =>
    turn.status === 'done' && turn.result?.answer
      ? [
          { role: 'user' as const, content: turn.query },
          { role: 'assistant' as const, content: turn.result.answer },
        ]
      : [],
  );
}

const HomeSearchHero = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<HomeSearchCategory>('ALL');
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const nextId = useRef(0);
  // 새 대화를 시작하면 이전 대화의 늦은 응답은 버린다
  const conversationId = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isChatting = turns.length > 0;

  // 대화가 시작되면 제목~대화창이 한 화면에 들어오도록 섹션을 네비바 바로 아래로 올린다
  useEffect(() => {
    if (!isChatting) return;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [isChatting]);

  const ask = async (text: string, prevTurns: ChatTurn[]) => {
    const id = nextId.current++;
    const conversation = conversationId.current;
    setTurns([...prevTurns, { id, query: text, status: 'pending' }]);

    const update = (patch: Partial<ChatTurn>) => {
      if (conversation !== conversationId.current) return;
      setTurns((prev) =>
        prev.map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)),
      );
    };

    try {
      const result = await postHomeSearch({
        query: text,
        category,
        history: toHistory(prevTurns),
      });
      update({ status: 'done', result });
    } catch {
      update({ status: 'error' });
    }
  };

  const isPending = turns.at(-1)?.status === 'pending';

  /** 상단 검색창은 새 대화를 시작한다 */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isPending) return;
    conversationId.current++;
    ask(trimmed, []);
  };

  const handleClear = () => {
    setQuery('');
    conversationId.current++;
    setTurns([]);
  };

  return (
    // scroll-mt: 고정 네비바 높이(84px / 155px) + 여백
    <section
      ref={sectionRef}
      className="flex w-full max-w-[1120px] scroll-mt-[96px] flex-col items-center px-5 pb-6 md:scroll-mt-[171px] md:pb-14 xl:px-0"
    >
      {!isChatting && (
        <span className="text-xsmall16 text-primary md:text-small20 mb-2 font-semibold md:mb-3">
          취업 준비의 모든 순간, 렛츠커리어
        </span>
      )}
      <h1 className="text-medium24 text-neutral-0 md:text-xxlarge36 break-keep text-center font-bold">
        막막한 취업 준비,
        <br className="md:hidden" />{' '}
        <span className="text-primary">렛츠커리어</span>와 함께 해결해요.
      </h1>

      <form
        role="search"
        onSubmit={handleSubmit}
        className={twMerge(
          'border-primary shadow-03 mt-8 flex h-14 w-full max-w-[600px] items-center rounded-full border-2 bg-white pl-5 pr-4 md:mt-10 md:h-[60px] md:pl-6 md:pr-5',
          isChatting && 'mt-4 md:mt-5',
        )}
      >
        <label className="relative flex shrink-0 items-center">
          <span className="sr-only">검색 범위</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as HomeSearchCategory)}
            className="text-xsmall14 text-neutral-40 md:text-xsmall16 w-[72px] cursor-pointer appearance-none bg-transparent pr-5 outline-none md:w-[80px]"
          >
            {HOME_SEARCH_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="text-neutral-45 pointer-events-none absolute right-0"
          />
        </label>
        <span className="bg-neutral-80 mx-3 h-5 w-px shrink-0 md:mx-4" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={HOME_SEARCH_QUERY_MAX_LENGTH}
          placeholder="필요한 프로그램을 찾아보세요"
          aria-label="검색어"
          className="text-xsmall16 text-neutral-0 md:text-small18 min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-50"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="검색어 지우기"
            className="mr-1 p-1 text-neutral-50"
          >
            <X size={20} />
          </button>
        )}
        <button
          type="submit"
          aria-label="검색"
          className="home_search_submit text-primary p-1"
          data-text={query}
        >
          <Search className="h-6 w-6 md:h-6 md:w-6" />
        </button>
      </form>

      {isChatting && (
        <HomeSearchChat turns={turns} onAsk={(text) => ask(text, turns)} />
      )}
    </section>
  );
};

export default HomeSearchHero;
