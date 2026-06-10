'use client';

import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useEditQuestionMutation,
  useMyQuestionsQuery,
} from '@/api/challenge-question/challengeQuestion';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import InquiryForm from './InquiryForm';
import InquiryItem from './InquiryItem';

const ChallengeInquiryPage = () => {
  const params = useParams<{ programId: string }>();
  const challengeId = Number(params.programId);

  const [isCreating, setIsCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: questions = [], isLoading } = useMyQuestionsQuery(challengeId);
  const { mutate: createQuestion, isPending: isCreatePending } =
    useCreateQuestionMutation(challengeId);
  const { mutate: editQuestion, isPending: isEditPending } =
    useEditQuestionMutation(challengeId);
  const { mutate: deleteQuestion } = useDeleteQuestionMutation(challengeId);

  return (
    <main className="px-5 pb-16 md:ml-12 md:px-0">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-medium22 text-neutral-0 mt-8 font-semibold md:mt-0">
          1:1 문의
        </h2>
        {!isCreating && (
          <button
            className="bg-primary-5 text-primary rounded-xs text-md px-4 py-2 font-medium"
            onClick={() => setIsCreating(true)}
          >
            + 1:1 문의하기
          </button>
        )}
      </header>

      <div className="flex flex-col gap-3">
        {isCreating && (
          <InquiryForm
            isPending={isCreatePending}
            onSubmit={(data) => {
              createQuestion(data, { onSuccess: () => setIsCreating(false) });
            }}
            onCancel={() => setIsCreating(false)}
          />
        )}

        {isLoading ? (
          <p className="text-neutral-40 py-10 text-center text-sm">
            불러오는 중...
          </p>
        ) : questions.length === 0 ? (
          <p className="text-neutral-40 py-10 text-center text-sm">
            등록된 문의가 없습니다.
          </p>
        ) : (
          <ul>
            {questions.map((item) => (
              <InquiryItem
                key={item.id}
                item={item}
                isExpanded={expandedId === item.id}
                onToggleExpand={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
                onEdit={(data) =>
                  editQuestion({ questionId: item.id, ...data })
                }
                onDelete={() => deleteQuestion(item.id)}
                isEditPending={isEditPending}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default ChallengeInquiryPage;
