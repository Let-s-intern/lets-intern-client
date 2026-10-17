import { RetrospectiveCommonQuestion } from '@/domain/all-in-one-pass/types';

/**
 * 전 패스 공통 질문 (수정 불가·읽기 전용). 운영팀 확정 문구이며 백엔드가 시드한다.
 * 답변 FK·응답 조회 매칭을 위해 id 고정 (백엔드도 동일 id 로 DB 시드).
 */
export const COMMON_QUESTIONS: RetrospectiveCommonQuestion[] = [
  {
    id: 1,
    question:
      '지난 2주 동안 어떤 프로그램이나 자료를 활용해 취업 준비를 했나요?',
    answerGuide:
      '활용한 프로그램이나 자료, 그걸 통해 해본 일을 적어주세요. 아직 진행 중인 내용도 좋아요.',
  },
  {
    id: 2,
    question: '지난 회고 이후 취업 준비는 얼마나 달라졌나요?',
    answerGuide:
      '지난번과 비교해 준비가 얼마나 진행됐나요? 새롭게 할 수 있게 된 일이나 여전히 어려운 부분도 좋아요.',
  },
];

export const COMMON_QUESTION_IDS = COMMON_QUESTIONS.map((q) => q.id);

/** A-4 공통 질문 (읽기 전용) */
export default function CommonQuestionSection() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-small20 text-neutral-0 font-semibold">공통 질문</h2>
      </div>
      <div className="border-neutral-80 flex flex-col gap-4 rounded-md border p-4">
        {COMMON_QUESTIONS.map((q, i) => (
          <div key={q.id} className="flex flex-col gap-1">
            <div className="flex gap-1.5">
              <span className="text-xsmall16 text-neutral-0 font-semibold">
                Q{i + 1}.
              </span>
              <span className="text-xsmall16 text-neutral-0 font-semibold">
                {q.question}
              </span>
            </div>
            <span className="text-xsmall14 text-neutral-40 pl-6">
              가이드 {q.answerGuide}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
