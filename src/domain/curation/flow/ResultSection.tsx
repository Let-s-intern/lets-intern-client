'use client';

import { useState } from 'react';
import { GUIDE_STEPS, PROGRAMS } from '../data/constants';
import { CurationResult, ProgramRecommendation } from '../types/types';
import MobileRecommendationCard from './MobileRecommendationCard';

interface ResultSectionProps {
  result: CurationResult | null;
  onRestart: () => void;
}

interface DesktopRecommendationCardProps {
  recommendation: ProgramRecommendation;
  showExtraButton?: boolean;
  onExtraClick?: () => void;
}

const DesktopRecommendationCard = ({
  recommendation,
  showExtraButton,
  onExtraClick,
}: DesktopRecommendationCardProps) => {
  const program = PROGRAMS[recommendation.programId];
  const plan =
    program.plans.find((p) => p.id === recommendation.suggestedPlanId) ??
    program.plans[0];

  return (
    <div className="inline-flex flex-1 flex-col items-start justify-start gap-2.5 overflow-hidden rounded-[20px] border border-[#CFCFCF] bg-[#FAFAFA] px-8 py-9">
      <div className="inline-flex flex-1 flex-col items-start justify-start gap-5 self-stretch">
        {/* 프로그램명 + 뱃지 + 서브타이틀 */}
        <div className="flex flex-col items-start justify-start gap-1 self-stretch">
          <div className="inline-flex items-center justify-between self-stretch">
            <div className="flex flex-1 items-center justify-start gap-5">
              <span className="text-base font-bold leading-6 text-black">{program.title}</span>
              {recommendation.emphasis === 'primary' && (
                <div className="flex items-center justify-center gap-2.5 rounded-[20px] bg-indigo-500 px-3 py-1">
                  <span className="text-center text-xs font-bold leading-4 text-gray-50">추천</span>
                </div>
              )}
            </div>
          </div>
          <span className="self-stretch text-sm font-normal leading-5 text-black">{program.subtitle}</span>
        </div>

        {/* 상세 정보 */}
        <div className="flex flex-col items-start justify-start gap-3 self-stretch overflow-hidden py-5">
          <div className="inline-flex items-center justify-start gap-10">
            <span className="w-20 text-sm font-semibold leading-5 text-black">추천 대상</span>
            <span className="text-sm font-normal leading-5 text-black">{program.target}</span>
          </div>
          <div className="h-0 self-stretch outline outline-1 -outline-offset-[0.5px] outline-neutral-200" />
          <div className="inline-flex w-52 items-center justify-start gap-10">
            <span className="w-20 text-sm font-semibold leading-5 text-black">기간</span>
            <span className="text-sm font-normal leading-5 text-black">{program.duration}</span>
          </div>
          <div className="h-0 self-stretch outline outline-1 -outline-offset-[0.5px] outline-neutral-200" />
          <div className="inline-flex w-64 items-start justify-start gap-10">
            <span className="w-20 text-sm font-semibold leading-5 text-black">피드백</span>
            <span className="text-sm font-normal leading-5 text-black">{program.feedback}</span>
          </div>
          <div className="h-0 self-stretch outline outline-1 -outline-offset-[0.5px] outline-neutral-200" />
          <div className="flex flex-col items-start justify-start gap-2.5 self-stretch rounded-lg bg-indigo-50 p-3">
            <span className="text-xs font-bold leading-4 text-indigo-600">이 조합 추천해요!</span>
            <span className="text-sm font-medium leading-5 text-black">{recommendation.reason}</span>
          </div>
          <div className="flex flex-col items-start justify-start gap-2.5 self-stretch rounded-lg bg-white p-3">
            <span className="text-xs font-bold leading-4 text-zinc-400">추천 플랜</span>
            <div className="inline-flex items-start justify-start gap-2.5">
              <span className="text-sm font-bold leading-5 text-black">{plan.name}</span>
              <span className="text-sm font-medium leading-5 text-black">
                {plan.price}{plan.note ? ` · ${plan.note}` : ''}
              </span>
            </div>
          </div>
          <div className="h-0 self-stretch outline outline-1 -outline-offset-[0.5px] outline-neutral-200" />
          <div className="inline-flex items-start justify-start gap-10 self-stretch">
            <span className="w-20 text-sm font-semibold leading-5 text-black">결과물</span>
            <span className="text-sm font-normal leading-5 text-black">{program.deliverable}</span>
          </div>
        </div>

        {/* CTA 버튼 + 추가 추천 받기 */}
        <div className="flex flex-col gap-3 self-stretch">
          <a
            href={`/program/challenge/${program.id}`}
            className="inline-flex h-11 items-center justify-center gap-1 self-stretch overflow-hidden rounded-lg bg-indigo-500 px-2 py-5 transition-opacity hover:opacity-90"
          >
            <span className="text-center text-sm font-bold leading-5 text-indigo-50">
              [{program.title}] 바로가기
            </span>
          </a>
          {showExtraButton && (
            <button
              type="button"
              onClick={onExtraClick}
              className="inline-flex h-11 items-center justify-center gap-1 self-stretch overflow-hidden rounded-lg bg-neutral-200 px-2 py-3 transition-colors hover:bg-neutral-300"
            >
              <span className="text-center text-sm font-medium leading-5 text-zinc-500">
                + 추가 추천 받기
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
                  <MobileRecommendationCard recommendation={primaryCard} />
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
                  <div className="flex w-[600px] flex-row gap-5">
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

            {/* 병행 수강 가이드 */}
            <div className="inline-flex items-start justify-center gap-2.5 self-stretch overflow-hidden rounded-xl bg-stone-50 px-2.5 py-5">
              <div className="inline-flex flex-col items-start justify-center gap-2.5">
                <span className="text-sm font-bold leading-5 text-zinc-600">
                  병행 수강 가이드
                </span>
                <div className="flex flex-col gap-1.5">
                  {GUIDE_STEPS.map((step) => (
                    <span key={step} className="text-sm font-medium leading-5 text-zinc-500">
                      {step}
                    </span>
                  ))}
                  {result.emphasisNotes?.map((note) => (
                    <span key={note} className="text-sm font-medium leading-5 text-zinc-500">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ResultSection;
