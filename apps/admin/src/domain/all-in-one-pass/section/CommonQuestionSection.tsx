import { useGetCommonQuestionsQuery } from '@/api/all-in-one-pass/useRetrospectives';

interface Props {
  passId: number;
}

/**
 * A-4 공통 질문 (수정 불가·조회 전용). 운영팀 확정 문구이며 백엔드가 시드한다.
 * 전 회차가 공유하는 질문으로, 패스별로 BE에서 조회한다.
 */
export default function CommonQuestionSection({ passId }: Props) {
  const { data: questions = [], isLoading } =
    useGetCommonQuestionsQuery(passId);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-small20 text-neutral-0 font-semibold">공통 질문</h2>
      </div>
      <div className="border-neutral-80 flex flex-col gap-4 rounded-md border p-4">
        {isLoading ? (
          <span className="text-xsmall14 text-neutral-40">불러오는 중...</span>
        ) : questions.length === 0 ? (
          <span className="text-xsmall14 text-neutral-40">
            공통 질문이 없습니다.
          </span>
        ) : (
          questions.map((q, i) => (
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
          ))
        )}
      </div>
    </section>
  );
}
