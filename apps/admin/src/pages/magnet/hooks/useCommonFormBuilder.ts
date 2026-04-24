import {
  useCreateBaseQuestionMutation,
  useGetBaseQuestionsQuery,
  usePatchMagnetQuestionMutation,
} from '@/api/magnet/magnet';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { generateUUID } from '@/utils/random';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FormQuestion } from '../types';
import {
  detailQuestionToFormQuestion,
  formQuestionToBaseApiBody,
} from '../utils/questionMapper';

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

export const useCommonFormBuilder = () => {
  const navigate = useNavigate();
  const { snackbar: setSnackbar } = useAdminSnackbar();

  const { data: baseData, isLoading, refetch } = useGetBaseQuestionsQuery();
  const { mutateAsync: createBaseQuestion } = useCreateBaseQuestionMutation({});
  const { mutateAsync: patchQuestion } = usePatchMagnetQuestionMutation({});

  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 서버에서 받은 원본 질문을 추적 (새로 추가된 질문 vs 기존 질문 구분, 삭제 시 원본 데이터 필요)
  const originalQuestionIdsRef = useRef<Set<string>>(new Set());
  const originalQuestionsRef = useRef<Map<string, FormQuestion>>(new Map());

  useEffect(() => {
    if (!baseData || initialized) return;

    const mapped = baseData.magnetQuestionInfo
      .filter((q) => q.isVisible === true)
      .map(detailQuestionToFormQuestion);
    setQuestions(mapped);
    originalQuestionIdsRef.current = new Set(
      mapped.map((q) => q.questionId),
    );
    originalQuestionsRef.current = new Map(
      mapped.map((q) => [q.questionId, q]),
    );
    setInitialized(true);
  }, [baseData, initialized]);

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

    setIsSaving(true);

    try {
      const currentQuestionIds = new Set(questions.map((q) => q.questionId));

      // 1. 삭제된 질문 처리: 원본에 있었지만 현재 목록에 없는 질문 → isVisible: false로 PATCH
      const deletedIds = [...originalQuestionIdsRef.current].filter(
        (id) => !currentQuestionIds.has(id),
      );
      await Promise.all(
        deletedIds.map((id) => {
          const original = originalQuestionsRef.current.get(id);
          if (!original) return Promise.resolve();
          return patchQuestion({
            magnetQuestionId: Number(id),
            ...formQuestionToBaseApiBody(original),
            isVisible: false,
          });
        }),
      );

      // 2. 기존 질문 수정 + 새 질문 생성
      await Promise.all(
        questions.map((q) => {
          const apiBody = formQuestionToBaseApiBody(q);
          if (originalQuestionIdsRef.current.has(q.questionId)) {
            // 기존 질문 → PATCH
            return patchQuestion({
              magnetQuestionId: Number(q.questionId),
              ...apiBody,
              isVisible: true,
            });
          } else {
            // 새 질문 → POST
            return createBaseQuestion({
              type: 'BASE',
              ...apiBody,
            });
          }
        }),
      );

      // 서버 재조회하여 ID 동기화
      const { data: freshData } = await refetch();
      if (freshData) {
        const mapped = freshData.magnetQuestionInfo
          .filter((q) => q.isVisible === true)
          .map(detailQuestionToFormQuestion);
        setQuestions(mapped);
        originalQuestionIdsRef.current = new Set(
          mapped.map((q) => q.questionId),
        );
        originalQuestionsRef.current = new Map(
          mapped.map((q) => [q.questionId, q]),
        );
      }

      setSnackbar('공통 신청폼이 저장되었습니다.');
    } catch (error) {
      console.error(error);
      setSnackbar('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const navigateToList = () => {
    navigate('/magnet/list');
  };

  return {
    questions,
    isLoading,
    isSaving,
    addQuestion,
    removeQuestion,
    updateQuestion,
    saveForm,
    navigateToList,
  };
};
