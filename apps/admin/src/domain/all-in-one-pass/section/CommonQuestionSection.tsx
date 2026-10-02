import { RetrospectiveCommonQuestion } from '@/domain/all-in-one-pass/types';

/**
 * 전 패스 공통 질문 (하드코딩·수정 불가). 기획 확정: FE 하드코딩으로 진행.
 * 답변 FK·응답 조회 매칭을 위해 id 고정 (백엔드도 동일 id 로 DB 시드).
 */
export const COMMON_QUESTIONS: RetrospectiveCommonQuestion[] = [
  { id: 1, question: '지난 회고 이후 어떤 점이 성장했나요?' },
  { id: 2, question: '이번 기간에 어떤 목표를 실천했나요?' },
];

export const COMMON_QUESTION_IDS = COMMON_QUESTIONS.map((q) => q.id);

/** A-4 공통 질문 (하드코딩·읽기 전용) */
export default function CommonQuestionSection() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-small20 text-neutral-0 font-semibold">공통 질문</h2>
      </div>
      <div className="border-neutral-80 flex flex-col gap-2 rounded-md border p-4">
        {COMMON_QUESTIONS.map((q, i) => (
          <div key={q.id} className="flex gap-2">
            <span className="text-xsmall16 text-primary font-medium">
              Q{i + 1}.
            </span>
            <span className="text-xsmall16 text-neutral-10">{q.question}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
