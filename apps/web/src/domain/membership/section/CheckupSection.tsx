import { useState } from 'react';

import {
  captureCheckupAnswered,
  captureCheckupCompleted,
  captureCheckupStarted,
} from '../analytics';
import type { CheckupAnswers } from '../data/checkup';
import {
  CHECKUP,
  CHECKUP_QUESTIONS,
  resolveCheckupResult,
} from '../data/checkup';
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
    const next = answers.map((answer, i) =>
      i === current ? optionIndex : answer,
    );

    /*
     * 시작·완료의 "한 번만" 은 답 배열에서 끌어낸다. 별도 플래그를 두면 "다시 진단하기"
     * 때 함께 되돌리는 것을 잊게 된다 — 답은 그때 반드시 비워지므로 여기가 더 안전하다.
     *
     * 시작: 바꾸기 전 답이 전부 비어 있으면 이번이 첫 답이다. 이전 문항으로 돌아가
     * 다시 골라도 그때는 이미 답이 남아 있어 두 번 나가지 않는다.
     * 완료: 덜 찬 상태에서 다 찬 상태로 넘어가는 순간 한 번이다. 다 채운 뒤 앞 문항을
     * 고쳐도 다시 나가지 않는다.
     */
    if (answers.every((answer) => answer === null)) captureCheckupStarted();

    captureCheckupAnswered({
      question: CHECKUP_QUESTIONS[current],
      optionIndex,
    });

    const wasComplete = answers.every((answer) => answer !== null);
    if (!wasComplete) {
      const result = resolveCheckupResult(next);
      if (result) captureCheckupCompleted(result);
    }

    onAnswersChange(next);
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
