'use client';

import Link from 'next/link';

import { useGetUserCuration } from '@/api/curation';

/**
 * 멘토링 카탈로그 상단 구좌.
 *
 * 어드민 큐레이션 관리에서 노출 위치를 '멘토링 카탈로그 상단'으로 둔 큐레이션을 그린다.
 * 상단 문구는 큐레이션 제목, 구좌는 항목의 썸네일·제목·url 이다. 노출 중인 것이 없으면 숨긴다.
 */
const MentoringCurationSection = () => {
  const { data } = useGetUserCuration({ locationType: 'MENTORING_CATALOG' });

  const curation = data?.curationList[0];
  const items = curation?.curationItemList.slice(0, 4) ?? [];

  if (!curation || items.length === 0) return null;

  return (
    <section className="border-primary-20 bg-primary-5 flex flex-col gap-5 rounded-md border px-5 py-6 md:mb-12 md:gap-8 md:px-8 md:py-8">
      <h2 className="text-small18 md:text-small20 text-neutral-0 font-semibold">
        {curation.curationInfo.title}
      </h2>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-x-5">
        {items.map((item) => {
          const url = item.url ?? '';
          return (
            <li key={item.id}>
              <Link
                href={url}
                target={url.startsWith('http') ? '_blank' : undefined}
                className="flex flex-col gap-3 md:gap-4"
              >
                <div className="bg-neutral-80 aspect-[415/279] overflow-hidden rounded-sm">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title ?? ''}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <span className="text-xsmall14 md:text-xsmall16 text-neutral-0 line-clamp-2 font-semibold">
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default MentoringCurationSection;
