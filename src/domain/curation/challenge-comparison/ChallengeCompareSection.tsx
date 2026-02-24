'use client';

import { useCallback, useRef, useState } from 'react';
import {
  CHALLENGE_COMPARISON,
  FREQUENT_COMPARISON,
} from '../shared/comparisons';
import { PROGRAMS } from '../shared/programs';
import type { ProgramId } from '../types';
import CompareResultCard from './CompareResultCard';
import RecommendedComparisons from './RecommendedComparisons';
import { useCompareCart } from './useCompareCart';

/** 카드별 그라데이션 색상 */
const CARD_GRADIENTS: Record<ProgramId, string> = {
  experience: 'from-blue-100 to-indigo-200',
  resume: 'from-violet-100 to-purple-200',
  coverLetter: 'from-indigo-100 to-blue-200',
  portfolio: 'from-cyan-100 to-teal-200',
  enterpriseCover: 'from-blue-200 to-indigo-300',
  marketingAllInOne: 'from-purple-100 to-violet-200',
  hrAllInOne: 'from-teal-100 to-cyan-200',
};

/** 추천 비교 조합의 프로그램명 → ProgramId 매핑 */
const findProgramIdByLabel = (label: string): ProgramId | null => {
  const match = CHALLENGE_COMPARISON.find((c) => c.label === label);
  return match?.programId ?? null;
};

const ChallengeCompareSection = () => {
  const {
    cartItems,
    toggleCartItem,
    clearCart,
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

  /** 비교하기 버튼 클릭 */
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

  const allPrograms = CHALLENGE_COMPARISON;

  return (
    <section
      className="flex w-full flex-col gap-10"
      id="curation-challenge-comparison"
    >
      {/* 섹션 헤더 */}
      <div className="flex flex-col items-center gap-5 py-10">
        <p className="text-center text-lg font-semibold leading-6 text-indigo-500">
          챌린지 비교
        </p>
        <h3 className="text-center text-3xl font-bold leading-10 text-neutral-0">
          고민되는 챌린지, 비교해보세요
        </h3>
        <p className="text-center text-lg font-semibold leading-6 text-zinc-600">
          궁금한 챌린지를 골라보세요. 최대 3개까지 비교할 수 있어요.
        </p>
      </div>

      {/* 챌린지 카드 그리드 — 4+3 2열 고정 레이아웃 */}
      <div className="grid w-full grid-cols-4 gap-5">
        {allPrograms.map((challenge) => {
          const program = PROGRAMS[challenge.programId];
          const inCart = isInCart(challenge.programId);
          const gradient = CARD_GRADIENTS[challenge.programId];

          return (
            <button
              key={challenge.programId}
              type="button"
              onClick={() => toggleCartItem(challenge.programId)}
              disabled={!inCart && isFull}
              className={`group relative flex flex-col overflow-hidden rounded-xl border-2 bg-white transition-all ${
                inCart
                  ? 'border-indigo-500 shadow-lg ring-1 ring-indigo-500/20'
                  : isFull
                    ? 'cursor-not-allowed border-neutral-90 opacity-50'
                    : 'border-transparent shadow-sm hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              {/* 썸네일 영역 */}
              <div
                className={`flex aspect-[5/3] items-center justify-center bg-gradient-to-br ${gradient} p-4`}
              >
                <span className="text-center text-xs font-medium text-neutral-40">
                  {program.subtitle}
                </span>
              </div>

              {/* 정보 */}
              <div className="flex flex-col gap-1.5 px-4 py-3">
                <span className="text-left text-sm font-bold leading-5 text-neutral-0">
                  {program.title}
                </span>
                <span className="text-left text-xs text-neutral-50">
                  {program.duration} · {program.plans[0]?.price}
                </span>
              </div>

              {/* 선택 표시 */}
              {inCart && (
                <div className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white shadow-sm">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 비교함 바 */}
      {cartItems.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-neutral-80 bg-neutral-95 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-neutral-30">
              비교함 ({cartItems.length}/3)
            </span>
            <div className="flex gap-2">
              {cartItems.map((id) => (
                <div
                  key={id}
                  className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-30 shadow-sm"
                >
                  <span>{PROGRAMS[id].title}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(id);
                    }}
                    className="ml-0.5 text-neutral-50 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearCart}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-80"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={handleCompare}
              disabled={!canCompare}
              className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${
                canCompare
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'cursor-not-allowed bg-neutral-80 text-neutral-50'
              }`}
            >
              {canCompare ? '비교하기' : '1개 더 담아주세요'}
            </button>
          </div>
        </div>
      )}

      {/* 추천 비교 조합 */}
      <RecommendedComparisons
        activeIndex={recommendedIndex}
        onSelect={handleRecommendedSelect}
      />

      {/* 비교 결과 */}
      <div ref={resultRef}>
        {compareTargets.length >= 2 && (
          <CompareResultCard
            programIds={compareTargets}
            onClose={handleCloseResult}
          />
        )}
      </div>
    </section>
  );
};

export default ChallengeCompareSection;
