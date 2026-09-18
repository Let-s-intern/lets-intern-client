import { useState } from 'react';

import { getChallengeThumbnailSrc } from '../data/challengeModalItems';
import type { PrepStep, PrepStepProgram } from '../data/prepSteps';
import { PREP_STEPS } from '../data/prepSteps';

interface Props {
  step: PrepStep;
  /** 진단 결과가 이 카드를 가리키면 배지가 붙고 테두리가 진해진다 */
  highlighted?: boolean;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 썸네일이 없는 프로그램(LIVE 클리닉)의 영상 자리 */
function VideoPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-lg bg-[#F2F4F9] px-4 py-8">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
        <svg
          aria-hidden="true"
          className="text-primary h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            d="M8 5.5v13l11-6.5-11-6.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <strong className="text-xsmall14 text-neutral-0 text-center font-bold">
        {title}
      </strong>
    </div>
  );
}

function ProgramThumbnail({ program }: { program: PrepStepProgram }) {
  const { src, title } = program;
  if (!src) return <VideoPlaceholder title={title} />;

  return (
    // 썸네일에 상품명이 적혀 있다. object-cover 로 자르면 글자가 잘린다.
    <img
      alt={title}
      className="w-full rounded-lg"
      loading="lazy"
      src={getChallengeThumbnailSrc({ src })}
    />
  );
}

/**
 * 준비 단계 카드 한 장 (시안 4-0 · 4-1).
 *
 * 펼침 여부를 카드마다 스스로 들고 있다. 단일 아코디언이 아니라 여러 장을 동시에
 * 펼칠 수 있어야 해서, 위에서 "지금 열린 카드" 하나를 들 이유가 없다.
 *
 * 펼침 영역은 `hidden` 이 아니라 조건부 렌더다 — 접힌 카드의 썸네일까지 내려받으면
 * 카드 일곱 장 분량이 첫 화면에 실린다.
 */
export default function PrepStepCard({ step, highlighted = false }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState(0);

  const isGoal = step.kind === 'goal';
  const isCheckpoint = step.kind === 'checkpoint';
  const program = step.expand?.programs[tab] ?? step.expand?.programs[0];

  const border = isCheckpoint
    ? 'border-[#F1642B]'
    : highlighted
      ? 'border-[#293662]'
      : 'border-neutral-85';

  return (
    <div className="relative h-full">
      {highlighted ? (
        <span className="text-xxsmall12 absolute -top-3 left-5 z-10 rounded-full bg-[#293662] px-4 py-1.5 font-bold text-white">
          {PREP_STEPS.resultBadge}
        </span>
      ) : null}

      <div
        className={`rounded-xxl flex h-full flex-col border p-6 ${border} ${
          isGoal
            ? 'border-transparent bg-gradient-to-br from-[#1B2038] to-[#3A3F75]'
            : 'bg-white'
        }`}
        data-kind={step.kind}
        data-testid={`prep-step-${step.id}`}
      >
        <p
          className={`text-xsmall14 font-bold ${
            isCheckpoint
              ? 'text-[#F1642B]'
              : isGoal
                ? 'text-primary-xlight'
                : 'text-neutral-45'
          }`}
        >
          {step.label}
        </p>

        <h3
          className={`text-small18 mt-2 font-bold ${
            isGoal ? 'text-white' : 'text-neutral-0'
          }`}
        >
          {step.title}
        </h3>

        <ul className="mt-4 flex flex-col gap-2">
          {step.todos.map((todo) => (
            <li
              className={`text-xsmall14 flex gap-2 leading-relaxed ${
                isGoal ? 'text-neutral-80' : 'text-neutral-40'
              }`}
              key={todo}
            >
              <span aria-hidden="true">·</span>
              <span>{todo}</span>
            </li>
          ))}
        </ul>

        {step.expand ? (
          <div className="mt-auto pt-5">
            <button
              aria-expanded={expanded}
              className={`text-xsmall14 border-neutral-85 flex w-full items-center justify-between gap-2 border-t pt-4 text-left ${
                isCheckpoint ? 'text-neutral-0 font-bold' : 'text-neutral-30'
              }`}
              onClick={() => setExpanded((prev) => !prev)}
              type="button"
            >
              <span>{step.expand.toggleLabel}</span>
              <Chevron open={expanded} />
            </button>

            {expanded && program ? (
              <div className="mt-4">
                {step.expand.programs.length > 1 ? (
                  <div className="flex gap-2">
                    {step.expand.programs.map((it, index) => (
                      <button
                        aria-pressed={index === tab}
                        className={`text-xsmall14 flex-1 rounded-lg border px-3 py-2.5 font-bold ${
                          index === tab
                            ? 'border-primary text-primary bg-primary-5'
                            : 'border-neutral-90 bg-neutral-90 text-neutral-45'
                        }`}
                        key={it.tabLabel}
                        onClick={() => setTab(index)}
                        type="button"
                      >
                        {it.tabLabel}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="relative mt-3">
                  {step.expand.badge ? (
                    <span className="text-xxsmall12 absolute right-3 top-3 rounded-full bg-[#FCE3D6] px-4 py-1.5 font-bold text-[#F1642B]">
                      {step.expand.badge}
                    </span>
                  ) : null}
                  <ProgramThumbnail program={program} />
                </div>

                {/* `.membership-root a { color: inherit }` 가 Tailwind 글자색을
                    명시도로 이긴다. 색은 안쪽 span 에 준다. */}
                <a
                  className={`mt-3 block rounded-lg py-3.5 text-center ${
                    isCheckpoint ? 'bg-[#F1642B]' : 'bg-[#293662]'
                  }`}
                  href={program.url}
                >
                  <span className="text-xsmall14 font-bold text-white">
                    {step.expand.ctaLabel}
                  </span>
                </a>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
