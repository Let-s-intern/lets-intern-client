'use client';

import { FREQUENT_COMPARISON } from '../../data/constants';
import { useInfiniteCarousel } from '../../hooks/useInfiniteCarousel';
import type { FrequentComparisonItem } from '../../types/types';

const FrequentComparisonCarousel = () => {
  const {
    infiniteItems,
    scrollContainerRef,
    setItemRef,
    activeIndex,
    handleNavigation,
    getItemStyle,
    scrollToAndActivate,
  } = useInfiniteCarousel<FrequentComparisonItem>({
    items: FREQUENT_COMPARISON,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h4 className="text-small18 font-semibold text-neutral-0">
          고민되는 챌린지, 비교해보세요
        </h4>
        <p className="text-xsmall14 text-neutral-40">
          많은 분들이 궁금해하는 챌린지 간 차이를 한눈에 확인하세요.
        </p>
      </div>

      {/* 스크롤 컨테이너와 화살표 버튼 */}
      <div className="relative">
        {/* 왼쪽 화살표 */}
        <button
          onClick={() => handleNavigation('left')}
          className="border-3 absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full border-primary-dark bg-white p-4 shadow-2xl transition-all hover:scale-110 hover:border-primary hover:bg-primary-5 active:scale-95"
          aria-label="이전 비교"
          type="button"
        >
          <svg
            className="h-10 w-10 text-primary-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* 오른쪽 화살표 */}
        <button
          onClick={() => handleNavigation('right')}
          className="border-3 absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full border-primary-dark bg-white p-4 shadow-2xl transition-all hover:scale-110 hover:border-primary hover:bg-primary-5 active:scale-95"
          aria-label="다음 비교"
          type="button"
        >
          <svg
            className="h-10 w-10 text-primary-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* 스크롤 가능한 컨테이너 */}
        <div className="relative">
          {/* 왼쪽 그라데이션 오버레이 - 중앙 카드에 영향 없도록 */}
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-[25%] bg-gradient-to-r from-white to-transparent" />

          {/* 오른쪽 그라데이션 오버레이 - 중앙 카드에 영향 없도록 */}
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-[25%] bg-gradient-to-l from-white to-transparent" />

          <div
            ref={scrollContainerRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-12 py-2 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {infiniteItems.map((item, index) => {
              const itemStyle = getItemStyle(index);
              const isActive = index === activeIndex;

              return (
                <div
                  key={`${item.title}-${index}`}
                  ref={(el) => {
                    setItemRef(index, el);
                  }}
                  onClick={() => {
                    if (!isActive) {
                      scrollToAndActivate(index);
                    }
                  }}
                  className={`flex min-w-[85%] snap-center flex-col gap-4 rounded-xl border-2 bg-white p-5 shadow-sm transition-all duration-500 ease-out sm:min-w-[75%] md:min-w-[60%] lg:min-w-[480px] ${
                    isActive
                      ? 'cursor-default border-primary-dark shadow-lg'
                      : 'cursor-pointer border-neutral-90 hover:border-primary-light'
                  }`}
                  style={{
                    opacity: itemStyle.opacity,
                    transform: `scale(${itemStyle.scale})`,
                    pointerEvents: itemStyle.opacity < 0.2 ? 'none' : 'auto',
                  }}
                >
                  {/* 비교 제목 */}
                  <div className="text-medium16 border-b-2 border-neutral-90 pb-3 text-center font-bold text-neutral-0">
                    {item.title}
                  </div>

                  {/* 챌린지 이름 헤더 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
                      <div className="text-xsmall13 break-keep text-center font-bold leading-snug text-neutral-0">
                        {item.left}
                      </div>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                      <div className="text-xsmall13 break-keep text-center font-bold leading-snug text-neutral-0">
                        {item.right}
                      </div>
                    </div>
                  </div>

                  {/* 비교 항목 */}
                  <div className="flex flex-col gap-2.5">
                    {item.rows.map((row) => (
                      <div
                        key={`${item.title}-${row.label}`}
                        className="overflow-hidden rounded-lg border border-neutral-90 bg-white"
                      >
                        <div className="bg-neutral-95 px-3 py-2">
                          <p className="text-xsmall12 font-bold text-neutral-30">
                            {row.label}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-neutral-90">
                          <div className="bg-blue-50/20 px-3 py-2.5">
                            <p className="text-xsmall12 break-keep leading-relaxed text-neutral-10">
                              {row.left}
                            </p>
                          </div>
                          <div className="bg-emerald-50/20 px-3 py-2.5">
                            <p className="text-xsmall12 break-keep leading-relaxed text-neutral-10">
                              {row.right}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentComparisonCarousel;
