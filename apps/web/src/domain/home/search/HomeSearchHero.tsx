'use client';

import { useMutation } from '@tanstack/react-query';
import { ChevronDown, Search, Sparkles, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

import HomeSearchResults from './HomeSearchResults';
import {
  HOME_SEARCH_CATEGORIES,
  HOME_SEARCH_QUERY_MAX_LENGTH,
  HomeSearchCategory,
  HomeSearchResponse,
} from './homeSearchTypes';

async function postHomeSearch(params: {
  query: string;
  category: HomeSearchCategory;
}): Promise<HomeSearchResponse> {
  const res = await fetch('/api/home-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('검색에 실패했어요.');
  return res.json();
}

const HomeSearchHero = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<HomeSearchCategory>('ALL');
  const search = useMutation({ mutationFn: postHomeSearch });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || search.isPending) return;
    search.mutate({ query: trimmed, category });
  };

  const handleClear = () => {
    setQuery('');
    search.reset();
  };

  return (
    <section className="flex w-full max-w-[1120px] flex-col items-center px-5 xl:px-0">
      <span className="text-xsmall16 text-primary md:text-small18 font-semibold">
        취업 준비의 모든 순간, 렛츠커리어
      </span>
      <h1 className="text-small20 text-neutral-0 md:text-medium24 mt-1 text-center font-bold md:mt-2">
        막막한 취업 준비,{' '}
        <span className="text-primary md:text-xlarge28">렛츠커리어</span>와 함께
        해결해요.
      </h1>

      <form
        role="search"
        onSubmit={handleSubmit}
        className="border-primary mt-6 flex h-12 w-full max-w-[420px] items-center rounded-full border-2 bg-white pl-4 pr-3 md:mt-8"
      >
        <label className="relative flex shrink-0 items-center">
          <span className="sr-only">검색 범위</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as HomeSearchCategory)}
            className="text-xsmall14 text-neutral-40 w-[72px] cursor-pointer appearance-none bg-transparent pr-5 outline-none"
          >
            {HOME_SEARCH_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="text-neutral-45 pointer-events-none absolute right-0"
          />
        </label>
        <span className="bg-neutral-80 mx-3 h-4 w-px shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={HOME_SEARCH_QUERY_MAX_LENGTH}
          placeholder="필요한 프로그램을 찾아보세요"
          aria-label="검색어"
          className="text-xsmall14 text-neutral-0 min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-50"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="검색어 지우기"
            className="mr-1 p-1 text-neutral-50"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="submit"
          aria-label="검색"
          className="home_search_submit text-primary p-1"
          data-text={query}
        >
          <Search size={20} />
        </button>
      </form>

      {search.isPending && (
        <div className="text-xsmall14 text-primary mt-6 flex items-center gap-2 font-medium">
          <Sparkles size={16} className="animate-pulse" />
          AI가 딱 맞는 프로그램을 찾고 있어요
        </div>
      )}
      {search.isError && (
        <p className="text-xsmall14 text-system-error mt-6">
          검색에 실패했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      {search.isSuccess && <HomeSearchResults result={search.data} />}
    </section>
  );
};

export default HomeSearchHero;
