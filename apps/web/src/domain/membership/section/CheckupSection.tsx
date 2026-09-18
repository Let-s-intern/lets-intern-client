import { useState } from 'react';

import type { CheckupAnswers } from '../data/checkup';
import { CHECKUP, CHECKUP_QUESTIONS } from '../data/checkup';
import CheckupQuestionCard from '../ui/CheckupQuestionCard';

interface Props {
  answers: CheckupAnswers;
  onAnswersChange: (answers: CheckupAnswers) => void;
}

/**
 * 시안 2 — 무료 진단 5문항 (FREE CHECK-UP).
 *
 * 답은 랜딩이 들고 있다. 결과 섹션과 준비 단계 섹션이 같은 답을 봐야 하기 때문이다.
 * 서버에도 브라우저에도 저장하지 않으므로 새로고침하면 초기화된다 (PRD 결정 Q2).
 *
 * "지금 몇 번째 문항인가" 는 이 섹션만 쓰므로 여기 남는다. 그래서 "다시 진단하기" 는
 * 랜딩이 `key` 를 바꿔 이 섹션을 다시 마운트하는 방식으로 처음 문항으로 되돌린다.
 *
 * 한 번에 한 문항만 보여준다. 고르면 다음 문항으로 넘어가고, 마지막 문항을 고르면
 * 아래 결과 섹션이 채워진다.
 */
export default function CheckupSection({ answers, onAnswersChange }: Props) {
  const [current, setCurrent] = useState(0);

  const isLast = current === CHECKUP_QUESTIONS.length - 1;

  const handleSelect = (optionIndex: number) => {
    onAnswersChange(
      answers.map((answer, i) => (i === current ? optionIndex : answer)),
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
        </div>
      </div>
    </section>
  );
}
