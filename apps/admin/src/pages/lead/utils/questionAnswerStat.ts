/**
 * 마그넷 신청자의 질문 답변률 통계.
 */
export interface QuestionAnswerStatResult {
  total: number;
  /** `questionAnswerList`에 trim 후 비어있지 않은 answer가 하나 이상 있는 신청자 수. */
  answered: number;
  /** 0~100 정수(반올림). 총원 0이면 0. */
  percent: number;
}

/**
 * 신청자 배열의 질문 답변률을 계산한다.
 *
 * - `answered`는 `questionAnswerList` 중 `answer`가 trim 후 비어있지 않은 항목이
 *   하나 이상 있는 신청자 수다.
 * - `percent`는 `Math.round((answered / total) * 100)`로 계산되며 소수점은 가지지 않는다.
 * - `total === 0`이면 `{ total: 0, answered: 0, percent: 0 }`을 반환한다.
 */
export const questionAnswerStat = (
  items: Array<{ questionAnswerList: Array<{ answer?: string | null }> }>,
): QuestionAnswerStatResult => {
  const total = items.length;
  if (total === 0) return { total: 0, answered: 0, percent: 0 };

  let answered = 0;
  for (const item of items) {
    const hasAnswer = item.questionAnswerList.some(
      (qa) => (qa.answer ?? '').trim() !== '',
    );
    if (hasAnswer) answered += 1;
  }

  return {
    total,
    answered,
    percent: Math.round((answered / total) * 100),
  };
};
