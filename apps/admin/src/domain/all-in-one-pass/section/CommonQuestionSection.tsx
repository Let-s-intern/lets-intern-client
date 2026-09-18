import { useGetCommonQuestionsQuery } from '@/api/all-in-one-pass/useRetrospectives';
import CommonQuestionModal from '@/domain/all-in-one-pass/ui/retrospective/CommonQuestionModal';
import { Button } from '@mui/material';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

/** A-4 공통 질문 카드(읽기) + 수정 모달 */
export default function CommonQuestionSection() {
  const [open, setOpen] = useState(false);
  const { data: questions = [] } = useGetCommonQuestionsQuery();

  const handleSubmit = (updated: string[]) => {
    // TODO: API 연결 후 공통 질문 저장 뮤테이션 연결
    // eslint-disable-next-line no-console
    console.log('[공통 질문 저장]', updated);
    setOpen(false);
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-small20 text-neutral-0 font-semibold">공통 질문</h2>
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          startIcon={<Pencil />}
          onClick={() => setOpen(true)}
        >
          공통 질문 수정
        </Button>
      </div>
      <div className="border-neutral-80 flex flex-col gap-2 rounded-md border p-4">
        {questions.length === 0 ? (
          <span className="text-xsmall14 text-neutral-40">
            등록된 공통 질문이 없습니다.
          </span>
        ) : (
          questions.map((q, i) => (
            <div key={q.id} className="flex gap-2">
              <span className="text-xsmall16 text-primary font-medium">
                Q{i + 1}.
              </span>
              <span className="text-xsmall16 text-neutral-10">
                {q.question}
              </span>
            </div>
          ))
        )}
      </div>

      <CommonQuestionModal
        open={open}
        initial={questions}
        onSubmit={handleSubmit}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
