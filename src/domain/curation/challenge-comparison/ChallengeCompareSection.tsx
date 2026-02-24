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

/** Figma 기반 카드별 썸네일 배경 색상 */
const CARD_COLORS: Record<ProgramId, string> = {
  experience: '#ff8165',
  resume: '#4d55f5',
  coverLetter: '#14bcff',
  portfolio: '#14bcff',
  enterpriseCover: '#6cdb3f',
  marketingAllInOne: '#161c2f',
  hrAllInOne: '#161c2f',
};

/** 추천 비교 조합의 프로그램명 → ProgramId 매핑 */
const findProgramIdByLabel = (label: string): ProgramId | null => {
  const match = CHALLENGE_COMPARISON.find((c) => c.label === label);
  return match?.programId ?? null;
};

/** 체크 아이콘 SVG */
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className={className}
  >
    <path
      d="M2.5 7L5.5 10L11.5 4"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** X 아이콘 SVG */
const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M3 3L9 9M9 3L3 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

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

  const allPrograms = CHALLENGE_COMPARISON;
  const row1 = allPrograms.slice(0, 4);
  const row2 = allPrograms.slice(4);

  const renderCard = (challenge: (typeof allPrograms)[number]) => {
    const program = PROGRAMS[challenge.programId];
    const inCart = isInCart(challenge.programId);
    const bgColor = CARD_COLORS[challenge.programId];
    const isDark = bgColor === '#161c2f';

    return (
      <div key={challenge.programId} className="flex w-[240px] flex-col">
        {/* 카드 본체 */}
        <div className="flex flex-1 flex-col gap-3">
          {/* 썸네일 영역 */}
          <div
            className="flex h-[180px] w-[240px] items-end overflow-hidden rounded-[7px] p-4"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex flex-col gap-0.5">
              <span
                className={`text-xs font-medium ${isDark ? 'text-white/70' : 'text-white/80'}`}
              >
                {program.subtitle}
              </span>
              <span className="text-base font-bold text-white">
                {program.title}
              </span>
            </div>
          </div>

          {/* 텍스트 영역 */}
          <div className="flex flex-col gap-3 px-1">
            <span className="line-clamp-2 text-lg font-bold leading-[26px] text-[#27272d]">
              {program.title}
            </span>
            <div className="flex items-start gap-0.5">
              <CheckIcon className="mt-1 shrink-0 text-[#7a7d84]" />
              <span className="line-clamp-2 text-sm leading-[22px] text-[#27272d]">
                {challenge.target}
              </span>
            </div>
          </div>
        </div>

        {/* 비교함 담기 버튼 — mt-auto로 카드 하단 고정 */}
        <div className="mt-auto flex gap-1 pt-3">
          {inCart ? (
            <>
              <button
                type="button"
                onClick={() => toggleCartItem(challenge.programId)}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#dbddfd] px-2 py-2.5"
              >
                <CheckIcon className="text-[#5f66f6]" />
                <span className="text-xs font-semibold leading-4 text-[#5f66f6]">
                  비교함 담기
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCart(challenge.programId);
                }}
                className="flex w-[46px] items-center justify-center rounded-lg bg-[#e7e7e7]"
              >
                <CloseIcon />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => toggleCartItem(challenge.programId)}
              disabled={isFull}
              className={`flex w-full items-center justify-center rounded-lg px-2 py-2.5 transition-colors ${
                isFull
                  ? 'cursor-not-allowed bg-[#e7e7e7] opacity-50'
                  : 'bg-[#e7e7e7] hover:bg-[#dbddfd] hover:text-[#5f66f6]'
              }`}
            >
              <span className="text-xs font-semibold leading-4 text-[#5c5f66]">
                비교함 담기
              </span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      className="flex w-full flex-col items-center"
      id="curation-challenge-comparison"
    >
      {/* 섹션 헤더 */}
      <div className="flex w-full flex-col items-center gap-3 pb-10 pt-[60px]">
        <div className="flex w-[1000px] flex-col items-center gap-5">
          <p className="text-center text-lg font-semibold leading-[26px] text-[#7177f7]">
            챌린지 비교
          </p>
          <h3 className="text-center text-[30px] font-bold leading-[42px] text-[#27272d]">
            고민되는 챌린지, 비교해보세요
          </h3>
        </div>
        <p className="text-center text-lg font-semibold leading-[26px] text-[#5c5f66]">
          많은 분들이 궁금해하는 챌린지 간 차이를 한눈에 확인하세요
        </p>
      </div>

      {/* 메인 컨텐츠 영역 (1180px) */}
      <div className="flex w-[1180px] flex-col gap-10">
        {/* 추천 비교 조합 (카드 위에 배치) */}
        <RecommendedComparisons
          activeIndex={recommendedIndex}
          onSelect={handleRecommendedSelect}
        />

        {/* 챌린지 카드 — 4+3 2열, 가운데 정렬 */}
        <div className="flex flex-col gap-1">
          {/* Row 1: 4 cards — 가운데 정렬 */}
          <div className="flex justify-center gap-6 py-5">
            {row1.map((challenge) => renderCard(challenge))}
          </div>
          {/* Row 2: 3 cards — 가운데 정렬 */}
          <div className="flex justify-center gap-6 py-5">
            {row2.map((challenge) => renderCard(challenge))}
          </div>
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
