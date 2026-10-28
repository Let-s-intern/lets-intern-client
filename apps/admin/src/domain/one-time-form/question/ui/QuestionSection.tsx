import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import type { AdminOneTimeFormQuestion } from '@/api/one-time-form/oneTimeFormSchema';

import {
  QUESTION_TYPE_LABELS,
  QUESTION_TYPES,
} from '../constants/questionTypes';
import { useDragReorder } from '../hooks/useDragReorder';
import { useQuestionEditor } from '../hooks/useQuestionEditor';
import type { QuestionDraft } from '../types/questionDraft';
import DeleteQuestionDialog from './DeleteQuestionDialog';
import QuestionCard from './QuestionCard';

interface QuestionSectionProps {
  formId: number;
  /** 0 보다 크면 이미 받은 신청이 있다는 안내와 삭제 확인을 띄운다 */
  applicationCount: number;
  questions: AdminOneTimeFormQuestion[];
}

/** 질문 편집. 질문 전체를 A6 으로 한 번에 저장한다 */
const QuestionSection = ({
  formId,
  applicationCount,
  questions: initialQuestions,
}: QuestionSectionProps) => {
  const { questions, isDirty, errors, edit, save, isSaving } =
    useQuestionEditor(formId, initialQuestions);
  const { getHandleProps, getDropProps } = useDragReorder((from, to) =>
    edit({ type: 'move', from, to }),
  );
  const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);
  const [pendingDelete, setPendingDelete] = useState<QuestionDraft | null>(
    null,
  );
  const hasApplications = applicationCount > 0;

  const requestDelete = (question: QuestionDraft) => {
    // 저장 안 된 질문은 받은 답이 없으니 바로 지운다
    if (hasApplications && question.questionId !== null) {
      setPendingDelete(question);
      return;
    }
    edit({ type: 'remove', key: question.key });
  };

  const confirmDelete = () => {
    if (pendingDelete) edit({ type: 'remove', key: pendingDelete.key });
    setPendingDelete(null);
  };

  return (
    <section className="border-neutral-80 flex flex-col gap-5 rounded-md border p-6">
      <div>
        <h3 className="text-small18 text-neutral-0 font-bold">질문</h3>
        {hasApplications && (
          <p className="text-xxsmall12 text-neutral-40 bg-neutral-95 mt-2 rounded-md px-4 py-3">
            신청 {applicationCount}건을 받은 폼입니다. 질문을 고쳐도 이미 받은
            신청에는 신청 시점 값이 남습니다.
          </p>
        )}
      </div>

      {questions.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40">
          아직 질문이 없습니다. 질문 추가로 형식을 골라 만드세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.key}
              question={question}
              index={index}
              total={questions.length}
              errors={errors[question.key]}
              edit={edit}
              onDelete={() => requestDelete(question)}
              handleProps={getHandleProps(index)}
              dropProps={getDropProps(index)}
            />
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outlined"
          onClick={(e) => setAddMenuAnchor(e.currentTarget)}
        >
          질문 추가
        </Button>
        <Menu
          anchorEl={addMenuAnchor}
          open={!!addMenuAnchor}
          onClose={() => setAddMenuAnchor(null)}
        >
          {QUESTION_TYPES.map((type) => (
            <MenuItem
              key={type}
              onClick={() => {
                edit({ type: 'add', questionType: type });
                setAddMenuAnchor(null);
              }}
            >
              {QUESTION_TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </Menu>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xxsmall12 text-neutral-40">
              저장하지 않은 변경이 있습니다.
            </span>
          )}
          <Button
            variant="contained"
            disabled={!isDirty || isSaving}
            onClick={save}
          >
            질문 저장
          </Button>
        </div>
      </div>

      <DeleteQuestionDialog
        open={!!pendingDelete}
        questionTitle={pendingDelete?.title.trim() ?? ''}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
};

export default QuestionSection;
