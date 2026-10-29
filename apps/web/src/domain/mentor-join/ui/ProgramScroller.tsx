'use client';

import Image from 'next/image';
import { DragScroll } from './DragScroll';

// square: 멘토 프로필처럼 1:1 썸네일 (기본 4:3)
export type ProgramCard = {
  href: string;
  thumbnail: string;
  title: string;
  label: string;
  square?: boolean;
};

// 렛츠커리어 프로그램 썸네일 카드 가로 목록. 카드를 누르면 렛츠커리어 상세 페이지가 새 탭으로 열린다
export function ProgramScroller({
  items,
  more,
}: {
  items: ProgramCard[];
  more: { href: string; label: string };
}) {
  const moreCard = (
    <li className="flex w-[160px] shrink-0 snap-start">
      <a
        href={more.href}
        data-track-target="program_more"
        data-track-location="program_list"
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        className="flex aspect-[160/183] w-full flex-col items-center justify-center gap-2 rounded-[6px] border border-white/15 text-sm font-medium text-[#b0b3ba] hover:bg-white/5"
      >
        {more.label}
        <span aria-hidden className="text-lg">
          →
        </span>
      </a>
    </li>
  );

  return (
    <div className="relative -mx-6 sm:-mx-8">
      {/* 왼쪽 시작점 = 카드 안쪽 여백 + 번호 칸 + 간격 → 항목 제목과 같은 위치. 넘기면 카드 왼쪽 끝까지 흘러간다 */}
      <DragScroll className="flex scroll-pl-[72px] scroll-pr-6 gap-3 overflow-x-auto pb-3 pl-[72px] pr-6 [scrollbar-color:#55555e_transparent] [scrollbar-width:thin] sm:scroll-pl-24 sm:scroll-pr-8 sm:pl-24 sm:pr-8">
        {items.map((c) => (
          <li
            key={c.href}
            className={`shrink-0 snap-start ${c.square ? 'w-[183px]' : 'w-[244px]'}`}
          >
            <a
              href={c.href}
              data-track-target="program"
              data-track-location="program_list"
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              className="group flex flex-col gap-2.5"
            >
              <Image
                src={c.thumbnail}
                alt={c.title}
                width={c.square ? 183 : 244}
                height={183}
                sizes={c.square ? '183px' : '244px'}
                draggable={false}
                className={`w-full rounded-[6px] object-cover transition-transform group-hover:-translate-y-1 ${
                  c.square ? 'aspect-square' : 'aspect-[4/3]'
                }`}
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold leading-normal text-[#8288f8]">
                  {c.label}
                </span>
                <span className="line-clamp-1 text-sm font-medium leading-normal text-white group-hover:underline">
                  {c.title}
                </span>
              </span>
            </a>
          </li>
        ))}
        {moreCard}
        {/* 마지막 카드가 오른쪽 흐림에 가리지 않도록 끝 여백 */}
        <li aria-hidden className="w-6 shrink-0 sm:w-10" />
      </DragScroll>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-0 top-0 w-10 bg-gradient-to-l from-[#303036] to-[#303036]/0 sm:w-16"
      />
    </div>
  );
}
