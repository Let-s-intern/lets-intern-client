'use client';

import { useCallback, useRef, useState } from 'react';
import {
  CHALLENGE_COMPARISON,
  FREQUENT_COMPARISON,
} from '../shared/comparisons';
import type { ProgramId } from '../types';
import ChallengeCard from './ChallengeCard';
import CompareResultCard from './CompareResultCard';
import MobileChallengeCard from './MobileChallengeCard';
import MobileCompareView from './MobileCompareView';
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
  const [isMobileViewOpen, setIsMobileViewOpen] = useState(false);
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

  /** 모바일 플로팅 버튼 — 비교 결과 전체화면 뷰 열기 */
  const handleMobileCompare = useCallback(() => {
    if (!canCompare) return;
    setCompareTargets([...cartItems]);
    setRecommendedIndex(null);
    setIsMobileViewOpen(true);
  }, [canCompare, cartItems]);

  return (
    <section
      className="flex w-full flex-col items-center pb-24 md:pb-0"
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

      {/* 메인 컨텐츠 영역 — 1180px 외부, 1032px 내부 (Figma: x=74 offset) */}
      <div className="flex w-full max-w-[73.75rem] flex-col gap-10 px-6 md:px-10 lg:px-0">
        {/* 1032px 내부 컨테이너: 추천 버튼 + 카드 그리드 좌측 정렬 기준 */}
        <div className="mx-auto w-full max-w-[64.5rem]">
          {/* 추천 비교 조합 — 카드 그리드 좌측과 맞춤 */}
          <RecommendedComparisons
            activeIndex={recommendedIndex}
            onSelect={handleRecommendedSelect}
          />

          {/* 챌린지 카드 — 데스크톱 4+3 */}
          <div className="hidden flex-col gap-0 md:flex">
            {/* Row 1: 4 cards */}
            <div className="flex flex-wrap justify-center gap-6 py-5 lg:flex-nowrap lg:justify-start">
              {CHALLENGE_COMPARISON.slice(0, 4).map((challenge) => (
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
            {/* Row 2: 3 cards — center */}
            <div className="flex flex-wrap justify-center gap-6 py-5">
              {CHALLENGE_COMPARISON.slice(4).map((challenge) => (
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
          </div>

          {/* 챌린지 카드 — 모바일 세로 리스트 */}
          <div className="flex flex-col gap-4 py-5 md:hidden">
            {CHALLENGE_COMPARISON.map((challenge) => (
              <MobileChallengeCard
                key={challenge.programId}
                challenge={challenge}
                inCart={isInCart(challenge.programId)}
                isFull={isFull}
                onToggle={toggleCartItem}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        </div>

        {/* 비교하기 바 — 데스크톱 전용 */}
        <div className="hidden flex-col items-center md:flex">
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

        {/* 비교 결과 — 데스크톱 전용 */}
        <div ref={resultRef} className="hidden md:block">
          {compareTargets.length >= 2 && (
            <CompareResultCard
              programIds={compareTargets}
              onClose={handleCloseResult}
            />
          )}
        </div>
      </div>

      {/* 모바일 전용 플로팅 비교하기 버튼 — canCompare 시에만 노출 */}
      {canCompare && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 md:hidden">
          <div className="pb-4 backdrop-blur-sm">
            <button
              type="button"
              onClick={handleMobileCompare}
              className="flex w-full items-center justify-center rounded-lg bg-[#5f66f6] py-4 transition-colors hover:bg-[#4d55f5]"
            >
              <span className="text-base font-semibold leading-6 text-white">
                프로그램 {cartItems.length}개 비교하기
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 모바일 비교 결과 전체화면 뷰 */}
      {isMobileViewOpen && compareTargets.length >= 2 && (
        <MobileCompareView
          programIds={compareTargets}
          onClose={() => setIsMobileViewOpen(false)}
        />
      )}
    </section>
  );
};

export default ChallengeCompareSection;
