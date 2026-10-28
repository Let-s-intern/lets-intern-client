import { useCallback, useReducer, useState } from 'react';

import { useSaveOneTimeFormQuestionsMutation } from '@/api/one-time-form/oneTimeFormQueries';
import type { AdminOneTimeFormQuestion } from '@/api/one-time-form/oneTimeFormSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import type { QuestionListErrors } from '../types/questionDraft';
import {
  initQuestionListState,
  type QuestionListAction,
  questionListReducer,
  toQuestionsRequest,
} from '../utils/questionListReducer';
import { getQuestionSaveErrorMessage } from '../utils/questionSaveError';
import { validateQuestions } from '../utils/validateQuestions';

/** 질문 목록 편집 상태와 A6 일괄 저장 */
export const useQuestionEditor = (
  formId: number,
  initialQuestions: AdminOneTimeFormQuestion[],
) => {
  const { snackbar } = useAdminSnackbar();
  const saveMutation = useSaveOneTimeFormQuestionsMutation();
  const [state, dispatch] = useReducer(
    questionListReducer,
    initialQuestions,
    initQuestionListState,
  );
  const [errors, setErrors] = useState<QuestionListErrors>({});

  /** 고친 질문의 오류는 다음 저장 때 다시 본다 */
  const edit = useCallback((action: QuestionListAction) => {
    dispatch(action);
    if ('key' in action) {
      setErrors((prev) => {
        if (!prev[action.key]) return prev;
        const { [action.key]: _, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const save = async () => {
    const validationErrors = validateQuestions(state.questions);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      snackbar('질문 입력값을 확인해 주세요.');
      return;
    }
    try {
      const saved = await saveMutation.mutateAsync({
        formId,
        body: toQuestionsRequest(state),
      });
      // 새 질문의 ID 를 받아야 다음 저장이 생성이 아니라 수정이 된다
      dispatch({ type: 'reset', questions: saved.questions });
      snackbar('질문을 저장했습니다.');
    } catch (error) {
      snackbar(getQuestionSaveErrorMessage(error));
    }
  };

  return {
    questions: state.questions,
    isDirty: state.isDirty,
    errors,
    edit,
    save,
    isSaving: saveMutation.isPending,
  };
};
