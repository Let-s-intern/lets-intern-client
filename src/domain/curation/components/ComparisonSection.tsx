'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CHALLENGE_COMPARISON,
  FREQUENT_COMPARISON,
  PROGRAMS,
} from '../constants';

const ComparisonSection = () => {
  const challenges = CHALLENGE_COMPARISON;
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [, setScrollTrigger] = useState(0); // 스크롤 시 리렌더링 트리거

  const totalItems = FREQUENT_COMPARISON.length;
  // 무한 스크롤을 위해 아이템을 많이 반복 (더 자연스러운 무한 스크롤)
  const repeatCount = 31; // 충분히 많은 반복 횟수
  const infiniteItems = Array(repeatCount).fill(FREQUENT_COMPARISON).flat();

  const toggleRow = (rowKey: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  // 중앙에서의 거리에 따른 투명도와 크기 계산 (양방향 그라데이션)
  const getItemStyle = (index: number) => {
    if (!scrollContainerRef.current || !itemRefs.current[index]) {
      return { opacity: 0, scale: 0.85 };
    }

    const container = scrollContainerRef.current;
    const item = itemRefs.current[index];
    if (!item) return { opacity: 0, scale: 0.85 };

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const containerCenter = containerRect.left + containerRect.width / 2;
    const itemCenter = itemRect.left + itemRect.width / 2;
    const containerLeft = containerRect.left;
    const containerRight = containerRect.right;

    // 중앙에서의 거리와 방향 계산
    const distanceFromCenter = itemCenter - containerCenter;
    const absDistance = Math.abs(distanceFromCenter);

    // 카드가 중앙에 가까울수록 1.0, 멀어질수록 0
    let opacity = 1.0;
    let scale = 1.0;

    if (absDistance < 50) {
      // 중앙 카드 (거의 중앙)
      opacity = 1.0;
      scale = 1.0;
    } else {
      // 중간 지점(화면의 50%)부터 빠르게 페이드 시작
      const halfScreenWidth = containerRect.width * 0.5;

      if (absDistance < halfScreenWidth * 0.5) {
        // 중앙에서 화면의 25% 이내 - 선명하게 유지
        opacity = 1.0;
        scale = 1.0;
      } else if (absDistance < halfScreenWidth) {
        // 중앙에서 25%~50% 사이 - 급격하게 페이드
        const fadeProgress =
          (absDistance - halfScreenWidth * 0.5) / (halfScreenWidth * 0.5);
        // 제곱 함수로 더 급격한 페이드
        opacity = Math.max(0, 1 - Math.pow(fadeProgress, 1.8));
        scale = Math.max(0.85, 1 - fadeProgress * 0.15);
      } else {
        // 중앙에서 50% 이상 - 거의 보이지 않음
        opacity = 0;
        scale = 0.85;
      }

      // 양옆 끝에서 추가 페이드 (화면 끝에 가까울수록)
      if (distanceFromCenter < 0) {
        // 왼쪽 카드
        const itemRight = itemRect.right;
        const distanceFromLeftEdge = itemRight - containerLeft;
        const edgeFadeZone = containerRect.width * 0.25;

        if (distanceFromLeftEdge < edgeFadeZone) {
          opacity = Math.min(
            opacity,
            Math.max(0, distanceFromLeftEdge / edgeFadeZone),
          );
        }
      } else {
        // 오른쪽 카드
        const itemLeft = itemRect.left;
        const distanceFromRightEdge = containerRight - itemLeft;
        const edgeFadeZone = containerRect.width * 0.25;

        if (distanceFromRightEdge < edgeFadeZone) {
          opacity = Math.min(
            opacity,
            Math.max(0, distanceFromRightEdge / edgeFadeZone),
          );
        }
      }
    }

    return { opacity, scale };
  };

  const scrollToIndex = (index: number) => {
    const targetRef = itemRefs.current[index];
    if (targetRef && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetRef.getBoundingClientRect();
      const scrollLeft =
        targetRect.left -
        containerRect.left +
        container.scrollLeft -
        (containerRect.width - targetRect.width) / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleNavigation = (direction: 'left' | 'right') => {
    const newIndex = activeIndex + (direction === 'right' ? 1 : -1);
    setActiveIndex(newIndex);
    scrollToIndex(newIndex);
  };

  // 초기 중앙 위치로 스크롤
  useEffect(() => {
    const middleSet = Math.floor(repeatCount / 2);
    const initialIndex = middleSet * totalItems; // 중간 세트의 첫 번째 아이템
    setActiveIndex(initialIndex);
    setTimeout(() => {
      scrollToIndex(initialIndex);
    }, 100);
  }, [totalItems, repeatCount]);

  // 스크롤 이벤트 감지하여 activeIndex 업데이트 및 무한 스크롤 처리
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isRelocating = false;

    const handleScroll = () => {
      if (isRelocating) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      itemRefs.current.forEach((item, index) => {
        if (item) {
          const itemRect = item.getBoundingClientRect();
          const itemCenter = itemRect.left + itemRect.width / 2;
          const distance = Math.abs(containerCenter - itemCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveIndex(closestIndex);
      setScrollTrigger((prev) => prev + 1); // 스타일 업데이트를 위한 리렌더링

      // 경계에 가까워지면 중간으로 순간 이동 (더 자연스럽게)
      // 첫 3개 세트 또는 마지막 3개 세트에 도달하면 중간으로 이동
      const safeZoneStart = totalItems * 3; // 첫 3개 세트
      const safeZoneEnd = totalItems * (repeatCount - 3); // 마지막 3개 세트 시작

      if (closestIndex < safeZoneStart) {
        // 첫 3개 세트에 있으면 중간 세트로 이동
        const equivalentIndex =
          closestIndex + totalItems * Math.floor(repeatCount / 2);
        if (itemRefs.current[equivalentIndex]) {
          isRelocating = true;
          const targetRef = itemRefs.current[equivalentIndex];
          const targetRect = targetRef.getBoundingClientRect();
          const scrollLeft =
            targetRect.left -
            containerRect.left +
            container.scrollLeft -
            (containerRect.width - targetRect.width) / 2;

          container.scrollTo({
            left: scrollLeft,
            behavior: 'auto',
          });
          setActiveIndex(equivalentIndex);
          setTimeout(() => {
            isRelocating = false;
          }, 100);
        }
      } else if (closestIndex >= safeZoneEnd) {
        // 마지막 3개 세트에 있으면 중간 세트로 이동
        const offsetInSet = closestIndex % totalItems;
        const equivalentIndex =
          totalItems * Math.floor(repeatCount / 2) + offsetInSet;
        if (itemRefs.current[equivalentIndex]) {
          isRelocating = true;
          const targetRef = itemRefs.current[equivalentIndex];
          const targetRect = targetRef.getBoundingClientRect();
          const scrollLeft =
            targetRect.left -
            containerRect.left +
            container.scrollLeft -
            (containerRect.width - targetRect.width) / 2;

          container.scrollTo({
            left: scrollLeft,
            behavior: 'auto',
          });
          setActiveIndex(equivalentIndex);
          setTimeout(() => {
            isRelocating = false;
          }, 100);
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [totalItems, repeatCount]);

  // 속성별로 데이터 추출
  const rows = [
    { label: '추천 대상', key: 'target' as const },
    { label: '기간', key: 'duration' as const },
    { label: '플랜별 가격\n(환급금 기준)', key: 'pricing' as const },
    { label: '피드백 횟수', key: 'feedback' as const },
    { label: '결과물', key: 'deliverable' as const, collapsible: true },
    {
      label: '커리큘럼',
      key: 'curriculum' as const,
      collapsible: true,
      defaultHidden: true,
    },
    {
      label: '주요 특징',
      key: 'features' as const,
      collapsible: true,
      defaultHidden: true,
    },
  ];

  return (
    <section className="flex w-full flex-col gap-8" id="curation-comparison">
      <div className="flex flex-col gap-2">
        <h3 className="text-medium22 font-bold text-neutral-0">
          챌린지별 비교 표
        </h3>
        <p className="text-xsmall15 text-neutral-40">
          가격, 기간, 피드백, 주요 결과물을 한눈에 비교하세요.
        </p>
      </div>

      {/* Desktop View - Transposed Table */}
      <div className="hidden overflow-x-auto lg:block">
        <div className="min-w-full overflow-hidden rounded-lg border-2 border-neutral-90 bg-white shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="text-xsmall13 sticky left-0 z-10 w-[100px] min-w-[100px] border-r-2 border-neutral-90 bg-blue-50 px-3 py-3 text-left font-black text-neutral-0 shadow-[2px_0_10px_rgba(0,0,0,0.08)]">
                  구분
                </th>
                {challenges.map((challenge) => {
                  const program = PROGRAMS[challenge.programId];
                  return (
                    <th
                      key={challenge.programId}
                      className="w-[155px] min-w-[155px] border-l border-neutral-90 px-2 py-2.5 text-center"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xsmall13 break-keep font-black leading-tight text-neutral-0">
                          {program.title}
                        </span>
                        <span className="text-xsmall11 break-keep font-medium leading-snug text-neutral-40">
                          {program.subtitle}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const isCollapsible = row.collapsible;
                const isDefaultHidden = row.defaultHidden;
                const isExpanded = expandedRows[row.key];

                if (isDefaultHidden && !isExpanded) {
                  return (
                    <tr key={row.label}>
                      <td
                        colSpan={challenges.length + 1}
                        className="border-t border-neutral-90 px-3 py-2 text-center"
                      >
                        <button
                          onClick={() => toggleRow(row.key)}
                          className="text-xsmall12 mx-auto flex items-center gap-1 font-semibold text-primary-dark transition-colors hover:text-primary"
                          type="button"
                        >
                          <span>+</span>
                          <span>{row.label} 보기</span>
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={row.label}
                    className={`transition-all hover:bg-primary-5 ${idx % 2 === 0 ? 'bg-white' : 'from-neutral-98 bg-gradient-to-r to-white'}`}
                  >
                    <td
                      className={`text-xsmall12 sticky left-0 z-10 whitespace-pre-line border-r-2 border-neutral-90 px-3 py-2.5 font-bold text-neutral-0 ${idx % 2 === 0 ? 'bg-white' : 'from-neutral-98 bg-gradient-to-r to-white'} shadow-[2px_0_8px_rgba(0,0,0,0.05)] transition-all hover:bg-primary-5`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{row.label}</span>
                        {isCollapsible && (
                          <button
                            onClick={() => toggleRow(row.key)}
                            className="text-xsmall11 font-bold text-primary-dark transition-colors hover:text-primary"
                            type="button"
                          >
                            {isExpanded ? '−' : '+'}
                          </button>
                        )}
                      </div>
                    </td>
                    {challenges.map((challenge) => {
                      const value = challenge[row.key];
                      const displayValue = value || '-';

                      // 결과물 필드는 (본인) 부분만 기본 표시
                      let contentToShow = displayValue;
                      if (
                        row.key === 'deliverable' &&
                        !isExpanded &&
                        displayValue !== '-'
                      ) {
                        const parts = displayValue.split('\n\n');
                        contentToShow = parts[0]; // (본인) 부분만
                      }

                      return (
                        <td
                          key={`${challenge.programId}-${row.key}`}
                          className="border-l border-neutral-90 px-2 py-2.5 text-center align-middle"
                        >
                          <div
                            className={`text-xsmall11 whitespace-pre-line break-keep font-medium leading-relaxed text-neutral-20 ${
                              isCollapsible &&
                              !isExpanded &&
                              row.key !== 'deliverable'
                                ? 'line-clamp-2'
                                : ''
                            }`}
                          >
                            {contentToShow}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="flex flex-col gap-4 lg:hidden">
        {challenges.map((challenge) => {
          const program = PROGRAMS[challenge.programId];
          return (
            <div
              key={challenge.programId}
              className="to-neutral-98 flex flex-col gap-2.5 rounded-lg border-2 border-neutral-90 bg-gradient-to-br from-white p-4 shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-col gap-1 border-b-2 border-neutral-90 pb-2.5">
                <span className="text-small16 font-black text-neutral-0">
                  {program.title}
                </span>
                <span className="text-xsmall12 font-medium text-neutral-40">
                  {program.subtitle}
                </span>
              </div>
              {rows.map((row) => {
                const value = challenge[row.key];
                const displayValue = value || '-';
                const isCollapsible = row.collapsible;
                const isDefaultHidden = row.defaultHidden;
                const rowKey = `mobile-${row.key}`;
                const isExpanded = expandedRows[rowKey];

                if (isDefaultHidden && !isExpanded) {
                  return (
                    <div key={row.key} className="flex justify-center py-1">
                      <button
                        onClick={() => toggleRow(rowKey)}
                        className="text-xsmall11 flex items-center gap-1 font-semibold text-primary-dark transition-colors hover:text-primary"
                        type="button"
                      >
                        <span>+</span>
                        <span>{row.label} 보기</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={row.key} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xsmall12 whitespace-pre-line font-bold text-neutral-40">
                        {row.label}
                      </span>
                      {isCollapsible && (
                        <button
                          onClick={() => toggleRow(rowKey)}
                          className="text-xsmall11 font-bold text-primary-dark transition-colors hover:text-primary"
                          type="button"
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      )}
                    </div>
                    <span
                      className={`text-xsmall12 whitespace-pre-line font-medium leading-relaxed text-neutral-10 ${
                        isCollapsible &&
                        !isExpanded &&
                        row.key !== 'deliverable'
                          ? 'line-clamp-2'
                          : ''
                      }`}
                    >
                      {row.key === 'deliverable' &&
                      !isExpanded &&
                      displayValue !== '-'
                        ? displayValue.split('\n\n')[0]
                        : displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

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
                      itemRefs.current[index] = el;
                    }}
                    onClick={() => {
                      if (!isActive) {
                        setActiveIndex(index);
                        scrollToIndex(index);
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
                      {item.rows.map(
                        (row: {
                          label: string;
                          left: string;
                          right: string;
                        }) => (
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
                        ),
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
