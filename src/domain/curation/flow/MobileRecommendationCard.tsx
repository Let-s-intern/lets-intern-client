'use client';

import { PROGRAMS } from '../shared/programs';
import type { ProgramRecommendation } from '../types';

interface MobileRecommendationCardProps {
  recommendation: ProgramRecommendation;
  showExtraButton?: boolean;
  onExtraClick?: () => void;
}

const MobileRecommendationCard = ({
  recommendation,
  showExtraButton,
  onExtraClick,
}: MobileRecommendationCardProps) => {
  const program = PROGRAMS[recommendation.programId];
  const plan =
    program.plans.find((p) => p.id === recommendation.suggestedPlanId) ??
    program.plans[0];

  return (
    <div className="flex w-full flex-col items-start justify-start gap-2.5 overflow-hidden rounded-[20px] border border-[#CFCFCF] bg-[#FAFAFA] px-5 py-6">
      <div className="flex flex-1 flex-col items-start justify-start gap-5 self-stretch">
        {/* 프로그램명 + 뱃지 + 서브타이틀 */}
        <div className="flex flex-col items-start justify-start gap-1 self-stretch">
          <div className="inline-flex items-center justify-between self-stretch">
            <div className="flex flex-1 items-center justify-start gap-3">
              <span className="text-base font-bold leading-6 text-black">
                {program.title}
              </span>
              {recommendation.emphasis === 'primary' && (
                <div className="flex items-center justify-center gap-2.5 rounded-[20px] bg-indigo-500 px-3 py-1">
                  <span className="text-center text-xs font-bold leading-4 text-gray-50">
                    추천
                  </span>
                </div>
              )}
            </div>
          </div>
          <span className="self-stretch text-sm font-normal leading-5 text-black">
            {program.subtitle}
          </span>
        </div>

        {/* 상세 정보 */}
        <div className="flex flex-col items-start justify-start gap-3 self-stretch overflow-hidden py-5">
          <div className="inline-flex items-center justify-start gap-6 self-stretch">
            <span className="w-16 shrink-0 text-sm font-semibold leading-5 text-black">
              추천 대상
            </span>
            <span className="text-sm font-normal leading-5 text-black">
              {program.target}
            </span>
          </div>
          <div className="h-0 self-stretch outline outline-1 -outline-offset-[0.5px] outline-neutral-200" />
          <div className="inline-flex items-center justify-start gap-6 self-stretch">
            <span className="w-16 shrink-0 text-sm font-semibold leading-5 text-black">
              기간
            </span>
            <span className="text-sm font-normal leading-5 text-black">
              {program.duration}
            </span>
          </div>
          <div className="h-0 self-stretch outline outline-1 -outline-offset-[0.5px] outline-neutral-200" />
          <div className="inline-flex items-start justify-start gap-6 self-stretch">
            <span className="w-16 shrink-0 text-sm font-semibold leading-5 text-black">
              피드백
            </span>
            <span className="text-sm font-normal leading-5 text-black">
              {program.feedback}
            </span>
          </div>
          <div className="h-0 self-stretch outline outline-1 -outline-offset-[0.5px] outline-neutral-200" />
          <div className="flex flex-col items-start justify-start gap-2.5 self-stretch rounded-lg bg-indigo-50 p-3">
            <span className="text-xs font-bold leading-4 text-indigo-600">
              이 조합 추천해요!
            </span>
            <span className="text-sm font-medium leading-5 text-black">
              {recommendation.reason}
            </span>
          </div>
          <div className="flex flex-col items-start justify-start gap-2.5 self-stretch rounded-lg bg-white p-3">
            <span className="text-xs font-bold leading-4 text-zinc-400">
              추천 플랜
            </span>
            <div className="inline-flex items-start justify-start gap-2.5">
              <span className="text-sm font-bold leading-5 text-black">
                {plan.name}
              </span>
              <span className="text-sm font-medium leading-5 text-black">
                {plan.price}
                {plan.note ? ` · ${plan.note}` : ''}
              </span>
            </div>
          </div>
          <div className="h-0 self-stretch outline outline-1 -outline-offset-[0.5px] outline-neutral-200" />
          <div className="inline-flex items-start justify-start gap-6 self-stretch">
            <span className="w-16 shrink-0 text-sm font-semibold leading-5 text-black">
              결과물
            </span>
            <span className="text-sm font-normal leading-5 text-black">
              {program.deliverable}
            </span>
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

export default MobileRecommendationCard;
