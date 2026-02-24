'use client';

import { useCallback, useRef, useState } from 'react';
import {
  CHALLENGE_COMPARISON,
  FREQUENT_COMPARISON,
} from '../shared/comparisons';
import type { ProgramId } from '../types';
import ChallengeCard from './ChallengeCard';
import CompareResultCard from './CompareResultCard';
import RecommendedComparisons from './RecommendedComparisons';
import { useCompareCart } from './useCompareCart';

/** 추천 비교 조합의 프로그램명 → ProgramId 매핑 */
const findProgramIdByLabel = (label: string): ProgramId | null => {
  const match = CHALLENGE_COMPARISON.find((c) => c.label === label);
  return match?.programId ?? null;
};

const ChallengeCompareSection = () => {
  const {
    cartItems,
    toggleCartItem,
    isInCart,
    isFull,
    canCompare,
    removeFromCart,
  } = useCompareCart();

  const [compareTargets, setCompareTargets] = useState<ProgramId[]>([]);
  const [recommendedIndex, setRecommendedIndex] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const scrollToResult = useCallback(() => {
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  /** 비교하기 바 클릭 */
  const handleCompare = useCallback(() => {
    if (!canCompare) return;
    setCompareTargets([...cartItems]);
    setRecommendedIndex(null);
    scrollToResult();
  }, [canCompare, cartItems, scrollToResult]);

  /** 추천 비교 조합 클릭 */
  const handleRecommendedSelect = useCallback(
    (index: number) => {
      const item = FREQUENT_COMPARISON[index];
      if (!item) return;

      const leftId = findProgramIdByLabel(item.left);
      const rightId = findProgramIdByLabel(item.right);
      if (!leftId || !rightId) return;

      setCompareTargets([leftId, rightId]);
      setRecommendedIndex(index);
      scrollToResult();
    },
    [scrollToResult],
  );

  /** 비교 결과 닫기 */
  const handleCloseResult = useCallback(() => {
    setCompareTargets([]);
    setRecommendedIndex(null);
  }, []);

  return (
    <section
      className="flex w-full flex-col items-center"
      id="curation-challenge-comparison"
    >
      {/* 섹션 헤더 */}
      <div className="flex w-full flex-col items-center gap-3 pb-10 pt-[3.75rem]">
        <div className="flex w-full max-w-[62.5rem] flex-col items-center gap-5">
          <p className="text-center text-lg font-semibold leading-[26px] text-[#7177f7]">
            챌린지 비교
          </p>
          <h3 className="text-center text-[1.875rem] font-bold leading-[2.625rem] text-[#27272d]">
            고민되는 챌린지, 비교해보세요
          </h3>
        </div>
        <p className="text-center text-lg font-semibold leading-[26px] text-[#5c5f66]">
          많은 분들이 궁금해하는 챌린지 간 차이를 한눈에 확인하세요
        </p>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex w-full max-w-[73.75rem] flex-col gap-10 px-6 md:px-10 lg:px-0">
        {/* 추천 비교 조합 (카드 위에 배치) */}
        <div className="flex justify-center">
          <RecommendedComparisons
            activeIndex={recommendedIndex}
            onSelect={handleRecommendedSelect}
          />
        </div>

        {/* 챌린지 카드 — flex-wrap, 가운데 정렬 */}
        <div className="flex flex-wrap justify-center gap-6 py-5">
          {CHALLENGE_COMPARISON.map((challenge) => (
            <ChallengeCard
              key={challenge.programId}
              challenge={challenge}
              inCart={isInCart(challenge.programId)}
              isFull={isFull}
              onToggle={toggleCartItem}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* 비교하기 바 */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleCompare}
            disabled={!canCompare}
            className={`flex w-full items-center justify-center rounded-lg px-2 py-5 transition-colors ${
              canCompare
                ? 'cursor-pointer bg-[#5f66f6] hover:bg-[#4d55f5]'
                : 'bg-[#acafb6]'
            }`}
          >
            <span className="text-base font-semibold leading-6 text-[#fafbfd]">
              {canCompare
                ? `프로그램 ${cartItems.length}개 비교하기`
                : '비교할 프로그램을 선택해주세요'}
            </span>
          </button>
          <p className="py-5 text-center text-xs leading-5 text-[#7a7d84]">
            비교할 프로그램 2개 이상을 선택하면 비교 결과를 볼 수 있어요
          </p>
        </div>

        {/* 비교 결과 */}
        <div ref={resultRef}>
          {compareTargets.length >= 2 && (
            <CompareResultCard
              programIds={compareTargets}
              onClose={handleCloseResult}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ChallengeCompareSection;
