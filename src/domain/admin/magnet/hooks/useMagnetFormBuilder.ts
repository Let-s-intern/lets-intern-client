import {
  useGetMagnetDetailQuery,
  usePatchMagnetMutation,
} from '@/api/magnet/magnet';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { generateUUID } from '@/utils/random';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormQuestion } from '../types';
import {
  detailQuestionToFormQuestion,
  formQuestionToApiBody,
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

interface UseMagnetFormBuilderParams {
  magnetId: string;
}

export const useMagnetFormBuilder = ({
  magnetId,
}: UseMagnetFormBuilderParams) => {
  const router = useRouter();
  const { snackbar: setSnackbar } = useAdminSnackbar();
  const numericMagnetId = Number(magnetId);

  // --- 데이터 페칭 (상세 조회 API) ---
  const { data: detailData, isLoading, refetch } =
    useGetMagnetDetailQuery(numericMagnetId);

  // --- Mutations ---
  const { mutateAsync: patchMagnet } = usePatchMagnetMutation();

  // --- 로컬 상태 ---
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // API 데이터로 초기화 (ADDITIONAL 질문만 표시)
  useEffect(() => {
    if (!detailData || initialized) return;

    const additionalQuestions = detailData.magnetQuestionInfo
      .filter((q) => q.type === 'ADDITIONAL')
      .map(detailQuestionToFormQuestion);
    setQuestions(additionalQuestions);
    setInitialized(true);
  }, [detailData, initialized]);

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

    setIsSaving(true);

    try {
      // ADDITIONAL 질문만 전송 (BASE는 서버가 useBaseQuestion 플래그로 자동 관리)
      await patchMagnet({
        magnetId: numericMagnetId,
        magnetQuestionList: questions.map(formQuestionToApiBody),
      });

      // 서버 재조회하여 서버가 부여한 ID 반영
      const { data: freshData } = await refetch();
      if (freshData) {
        const mapped = freshData.magnetQuestionInfo
          .filter((q) => q.type === 'ADDITIONAL')
          .map(detailQuestionToFormQuestion);
        setQuestions(mapped);
      }

      setSnackbar('신청폼이 저장되었습니다.');
    } catch (error) {
      console.error(error);
      setSnackbar('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const navigateToList = () => {
    router.push('/admin/magnet/list');
  };

  return {
    questions,
    isLoading,
    isSaving,
    addQuestion,
    removeQuestion,
    updateQuestion,
    cloneFromMagnet,
    saveForm,
    navigateToList,
  };
};
