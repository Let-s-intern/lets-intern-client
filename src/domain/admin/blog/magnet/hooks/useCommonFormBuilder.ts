import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { generateUUID } from '@/utils/random';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveCommonForm } from '../mock';
import { CommonFormData, FormQuestion } from '../types';

function createEmptyQuestion(): FormQuestion {
  return {
    questionId: generateUUID(),
    questionType: 'SUBJECTIVE',
    isRequired: 'REQUIRED',
    question: '',
    description: '',
    selectionMethod: 'SINGLE',
    items: [],
  };
}

interface UseCommonFormBuilderParams {
  initialData: CommonFormData;
}

export const useCommonFormBuilder = ({
  initialData,
}: UseCommonFormBuilderParams) => {
  const router = useRouter();
  const { snackbar: setSnackbar } = useAdminSnackbar();

  const [questions, setQuestions] = useState<FormQuestion[]>(
    initialData.questions,
  );

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.filter((q) => q.questionId !== questionId),
    );
  };

  const updateQuestion = (
    questionId: string,
    patch: Partial<FormQuestion>,
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId ? { ...q, ...patch } : q,
      ),
    );
  };

  const saveForm = async () => {
    const emptyQuestion = questions.find(
      (q) => q.question.trim() === '',
    );
    if (emptyQuestion) {
      setSnackbar('질문 텍스트를 입력해주세요.');
      return;
    }

    const invalidObjective = questions.find((q) => {
      const hasNoSelectableItems =
        q.items.filter((i) => !i.isOther).length === 0;
      return q.questionType === 'OBJECTIVE' && hasNoSelectableItems;
    });
    if (invalidObjective) {
      setSnackbar('객관식 질문에는 최소 1개의 항목이 필요합니다.');
      return;
    }

    await saveCommonForm({ questions });
    setSnackbar('공통 신청폼이 저장되었습니다.');
  };

  const navigateToList = () => {
    router.push('/admin/blog/magnet/list');
  };

  return {
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    saveForm,
    navigateToList,
  };
};
