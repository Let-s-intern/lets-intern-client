import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { generateUUID } from '@/utils/random';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveMagnetForm } from '../mock';
import {
  FormQuestion,
  FormQuestionItem,
  MagnetFormData,
} from '../types';

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

export function createEmptyItem(): FormQuestionItem {
  return { itemId: generateUUID(), value: '', isOther: false };
}

export function createOtherItem(): FormQuestionItem {
  return {
    itemId: generateUUID(),
    value: '기타(직접입력)',
    isOther: true,
  };
}

interface UseMagnetFormBuilderParams {
  magnetId: string;
  initialData: MagnetFormData;
}

export const useMagnetFormBuilder = ({
  magnetId,
  initialData,
}: UseMagnetFormBuilderParams) => {
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

  const cloneFromMagnet = (clonedQuestions: FormQuestion[]) => {
    const reIdQuestions = clonedQuestions.map((q) => ({
      ...q,
      questionId: generateUUID(),
      items: q.items.map((item) => ({
        ...item,
        itemId: generateUUID(),
      })),
    }));
    setQuestions(reIdQuestions);
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

    await saveMagnetForm({
      magnetId: Number(magnetId),
      questions,
    });
    setSnackbar('신청폼이 저장되었습니다.');
  };

  const navigateToList = () => {
    router.push('/admin/blog/magnet/list');
  };

  return {
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    cloneFromMagnet,
    saveForm,
    navigateToList,
  };
};
