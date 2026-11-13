import { Sparkles } from 'lucide-react';
import Link from 'next/link';

import { HomeSearchItem, HomeSearchResponse } from './homeSearchTypes';

const KIND_LABEL: Record<HomeSearchItem['kind'], string> = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE 클래스',
  LIVE_MENTORING: 'LIVE 멘토링',
  VOD: 'VOD',
  REPORT: '서류 진단',
  GUIDEBOOK: '가이드북',
  BLOG: '블로그',
};

const HomeSearchResults = ({ result }: { result: HomeSearchResponse }) => {
  // 프로그램을 먼저, 블로그는 맨 뒤로. 같은 종류 안에서는 관련도 순서를 유지한다
  const items = [
    ...result.items.filter((item) => item.kind !== 'BLOG'),
    ...result.items.filter((item) => item.kind === 'BLOG'),
  ];

  return (
    <div className="bg-primary-5 mt-6 w-full max-w-[1120px] rounded-md px-4 py-5 md:px-6 md:py-6">
      {result.answer && (
        <p className="text-xsmall14 text-neutral-10 md:text-xsmall16 flex items-start gap-2 font-medium">
          <Sparkles size={18} className="text-primary mt-0.5 shrink-0" />
          {result.answer}
        </p>
      )}

      {items.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40 text-center">
          검색 결과가 없어요. 다른 고민이나 키워드로 찾아보세요.
        </p>
      ) : (
        <ul
          className={`grid grid-cols-1 gap-3 md:grid-cols-3 ${result.answer ? 'mt-4' : ''}`}
        >
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="home_search_result flex h-full gap-3 rounded-sm bg-white p-3"
                data-url={item.href}
                data-text={item.title}
              >
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="rounded-xs h-16 w-16 shrink-0 object-cover"
                  />
                )}
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-xxsmall12 text-primary font-semibold">
                    {KIND_LABEL[item.kind] ?? item.kind}
                  </span>
                  <span className="text-xsmall14 text-neutral-0 line-clamp-2 font-semibold">
                    {item.title}
                  </span>
                  <span className="text-xxsmall12 text-neutral-40 line-clamp-1">
                    {item.description}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomeSearchResults;
