import { useState } from 'react';

import { CHECKUP, CHECKUP_QUESTIONS } from '../data/checkup';
import CheckupQuestionCard from '../ui/CheckupQuestionCard';

/** 아직 고르지 않은 문항은 null 이다. 길이는 문항 수로 고정한다. */
type Answers = (number | null)[];

/**
 * 시안 2 — 무료 진단 5문항 (FREE CHECK-UP).
 *
 * 답은 `useState` 로만 들고 있다. 서버에도 브라우저에도 저장하지 않으므로 새로고침하면
 * 초기화된다 (PRD 결정 Q2).
 *
 * 한 번에 한 문항만 보여준다. 고르면 다음 문항으로 넘어가고, 마지막 문항을 고르면
 * 결과 자리가 열린다 — 결과 화면 자체는 Push 2 다.
 */
export default function CheckupSection() {
  const [answers, setAnswers] = useState<Answers>(() =>
    CHECKUP_QUESTIONS.map(() => null),
  );
  const [current, setCurrent] = useState(0);

  const isLast = current === CHECKUP_QUESTIONS.length - 1;
  const isComplete = answers.every((answer) => answer !== null);

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) =>
      prev.map((answer, i) => (i === current ? optionIndex : answer)),
    );
    if (!isLast) setCurrent(current + 1);
  };

  return (
    <section
      className="bg-gradient-to-b from-[#0E0E12] to-[#1B2038] py-16 md:py-24"
      id={CHECKUP.anchorId}
    >
      <div className="wrap">
        <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
          {CHECKUP.eyebrow}
        </p>

        <h2 className="mt-4 text-center text-2xl font-bold leading-snug text-white md:text-[2rem]">
          {CHECKUP.title}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 mt-4 text-center leading-relaxed text-neutral-50">
          {CHECKUP.subLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>

        <div className="mx-auto mt-10 max-w-[860px] md:mt-14">
          <CheckupQuestionCard
            index={current}
            onPrev={current === 0 ? undefined : () => setCurrent(current - 1)}
            onSelect={handleSelect}
            question={CHECKUP_QUESTIONS[current]}
            selected={answers[current]}
            total={CHECKUP_QUESTIONS.length}
          />

          {/* 진단 결과 자리. 카드 2장을 여기에 그리는 것은 Push 2 다 (PRD 4.3). */}
          {isComplete ? <div data-testid="checkup-result-slot" /> : null}
        </div>
      </div>
    </section>
  );
}
