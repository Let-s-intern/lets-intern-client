import { Fragment } from 'react';

import type { CheckupAreaId } from '../data/checkup';
import type { PrepStep } from '../data/prepSteps';
import { PREP_STEP_CARDS, PREP_STEPS } from '../data/prepSteps';
import PrepStepCard from '../ui/PrepStepCard';

interface Props {
  /** 진단 전에는 null 이다. 이 영역을 든 카드 한 장만 강조한다 */
  weakestAreaId: CheckupAreaId | null;
}

const ARROW = (
  <svg
    aria-hidden="true"
    // 행이 items-start 라 화살표도 위에 붙는다. 접힌 카드의 세로 가운데쯤에 오도록 내린다.
    className="hidden h-5 w-5 shrink-0 self-start text-neutral-50 md:mt-[6.5rem] md:block"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    viewBox="0 0 24 24"
  >
    <path d="M4 12h15" strokeLinecap="round" />
    <path d="m13.5 6.5 6 5.5-6 5.5" strokeLinecap="round" />
  </svg>
);

function StepRow({
  steps,
  weakestAreaId,
}: {
  steps: readonly PrepStep[];
  weakestAreaId: CheckupAreaId | null;
}) {
  return (
    /*
     * `items-start` 가 핵심이다. 기본값(stretch)이면 한 장을 펼쳤을 때 같은 줄 카드가
     * 모두 그 높이로 늘어나, 내용은 없는데 카드만 길어진 빈 칸이 생긴다.
     * 펼친 카드만 길어지고 나머지는 제 높이를 지킨다.
     */
    <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-3">
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          {index > 0 ? ARROW : null}
          <div className="min-w-0 md:flex-1">
            <PrepStepCard
              highlighted={
                step.areaId !== undefined && step.areaId === weakestAreaId
              }
              step={step}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

/**
 * 시안 4 — 준비 단계 카드 7장 (FROM PARTICIPANTS).
 *
 * 시안 배치가 위 4장(STEP 01 · STEP 02 · CHECKPOINT · STEP 03) / 아래 3장(STEP 04 ·
 * STEP 05 · GOAL)이라 데이터 순서를 그대로 4 + 3 으로 자른다.
 *
 * 지금 `RoadmapSection`(STEP 01~05 세로 목록) 자리를 대신한다.
 */
export default function PrepStepsSection({ weakestAreaId }: Props) {
  return (
    <section className="bg-[#F7F8FC] py-16 md:py-24" id={PREP_STEPS.anchorId}>
      <div className="wrap">
        <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
          {PREP_STEPS.eyebrow}
        </p>

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          {PREP_STEPS.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center">
          {PREP_STEPS.sub}
        </p>

        <div className="mt-12 flex flex-col gap-8 md:mt-16">
          <StepRow
            steps={PREP_STEP_CARDS.slice(0, 4)}
            weakestAreaId={weakestAreaId}
          />
          {/* 아래 줄은 세 장이다. 위 줄과 카드 폭을 맞추려고 폭을 줄여 가운데 둔다 */}
          <div className="md:mx-auto md:w-[75%]">
            <StepRow
              steps={PREP_STEP_CARDS.slice(4)}
              weakestAreaId={weakestAreaId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
