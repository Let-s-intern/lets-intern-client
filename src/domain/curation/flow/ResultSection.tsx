'use client';

import { useState } from 'react';
import { CurationResult } from '../types';
import DesktopRecommendationCard from './DesktopRecommendationCard';
import MobileRecommendationCard from './MobileRecommendationCard';

interface ResultSectionProps {
  result: CurationResult | null;
  onRestart: () => void;
}

const ResultSection = ({ result, onRestart }: ResultSectionProps) => {
  const [showSecondary, setShowSecondary] = useState(false);

  const primary = result?.recommendations.filter((r) => r.emphasis === 'primary') ?? [];
  const secondary = result?.recommendations.filter((r) => r.emphasis === 'secondary') ?? [];

  // primary 중 첫 번째 1개만 표시
  const primaryCard = primary[0] ?? null;

  return (
    <section className="w-full" id="curation-result">
      <div className="flex w-full flex-col items-center justify-start gap-11">
        {/* 타이틀 */}
        <div className="flex flex-col items-center justify-start gap-1 self-stretch">
          <span className="text-center text-lg font-bold leading-6 text-zinc-800">
            맞춤 추천 프로그램
          </span>
          <span className="text-center text-sm font-medium leading-5 text-neutral-600">
            답변을 기반으로 챌린지, 플랜, 병행 가이드를 제안해요
          </span>
        </div>

        {!result && (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-white px-4 py-8 text-center">
            <p className="text-sm font-semibold text-zinc-800">아직 결과가 없어요.</p>
            <p className="text-xs text-zinc-400">
              준비 상태와 질문 2개를 완료하면 맞춤 추천을 보여드릴게요.
            </p>
          </div>
        )}

        {result && (
          <>
            {/* 요약 박스 */}
            <div className="inline-flex items-start justify-center gap-2.5 self-stretch overflow-hidden rounded-xl bg-indigo-50 px-2.5 py-5">
              <div className="inline-flex flex-col items-center justify-center gap-2.5">
                <span className="text-center text-sm font-bold leading-5 text-indigo-600">
                  {result.headline}
                </span>
                <span className="text-center text-sm font-medium leading-5 text-black">
                  {result.summary}
                </span>
              </div>
            </div>

            {/* 카드 영역 */}
            <div className="flex flex-col items-center justify-start gap-5 self-stretch">
              {/* 모바일 */}
              <div className="flex flex-col gap-4 md:hidden">
                {primaryCard && (
                  <MobileRecommendationCard
                    recommendation={primaryCard}
                    showExtraButton={!showSecondary && secondary.length > 0}
                    onExtraClick={() => setShowSecondary(true)}
                  />
                )}
                {showSecondary &&
                  secondary.map((rec) => (
                    <MobileRecommendationCard
                      key={`${rec.programId}-${rec.emphasis}`}
                      recommendation={rec}
                    />
                  ))}
              </div>

              {/* 데스크톱 */}
              <div className="hidden w-full flex-col items-center gap-5 md:flex">
                {/* primary 카드 1개: secondary 없으면 중앙 고정 너비, 있으면 전체 너비 */}
                {primaryCard && !showSecondary && (
                  <div className="flex w-full max-w-[52rem] flex-row gap-5">
                    <DesktopRecommendationCard
                      recommendation={primaryCard}
                      showExtraButton={secondary.length > 0}
                      onExtraClick={() => setShowSecondary(true)}
                    />
                  </div>
                )}

                {/* secondary 펼쳤을 때: primary + secondary 가로 배치 */}
                {primaryCard && showSecondary && (
                  <div className="flex w-full flex-row gap-5">
                    <DesktopRecommendationCard recommendation={primaryCard} />
                    {secondary.map((rec) => (
                      <DesktopRecommendationCard
                        key={`${rec.programId}-${rec.emphasis}`}
                        recommendation={rec}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 다시 선택하기 */}
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex w-48 items-center justify-center gap-1 overflow-hidden rounded-lg bg-zinc-100 px-2 py-3 transition-colors hover:bg-zinc-200"
              >
                <span className="text-center text-xs font-semibold leading-4 text-zinc-500">
                  다시 선택하기
                </span>
              </button>
            </div>

          </>
        )}
      </div>
    </section>
  );
};

export default ResultSection;
