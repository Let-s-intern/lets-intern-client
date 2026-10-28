import { useCallback, useReducer, useState } from 'react';

import { useSaveOneTimeFormOptionGroupsMutation } from '@/api/one-time-form/oneTimeFormQueries';
import type { AdminOneTimeFormOptionGroup } from '@/api/one-time-form/oneTimeFormSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import type { OptionGroupListErrors } from '../types/optionGroupDraft';
import {
  initOptionGroupListState,
  type OptionGroupListAction,
  optionGroupListReducer,
  toOptionGroupsRequest,
} from '../utils/optionGroupListReducer';
import { getOptionSaveErrorMessage } from '../utils/optionSaveError';
import { validateOptionGroups } from '../utils/validateOptionGroups';

const editedKey = (action: OptionGroupListAction) => {
  if ('optionKey' in action) return action.optionKey;
  if ('groupKey' in action) return action.groupKey;
  return undefined;
};

/**
 * 옵션 그룹·옵션 편집 상태와 A7 일괄 저장.
 * 미리보기가 저장 전 값을 읽어야 해서 편집기 화면에서 부른다.
 * `formId` 가 없으면(새 폼) 옵션을 편집할 수 없으므로 저장하지 않는다.
 */
export const useOptionGroupEditor = (
  formId: number | undefined,
  initialGroups: AdminOneTimeFormOptionGroup[],
) => {
  const { snackbar } = useAdminSnackbar();
  const saveMutation = useSaveOneTimeFormOptionGroupsMutation();
  const [state, dispatch] = useReducer(
    optionGroupListReducer,
    initialGroups,
    initOptionGroupListState,
  );
  const [errors, setErrors] = useState<OptionGroupListErrors>({});

  /** 고친 그룹·옵션의 오류는 다음 저장 때 다시 본다 */
  const edit = useCallback((action: OptionGroupListAction) => {
    dispatch(action);
    const key = editedKey(action);
    if (key === undefined) return;
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const save = async () => {
    if (formId === undefined) return;
    const validationErrors = validateOptionGroups(state.groups);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      snackbar('옵션 입력값을 확인해 주세요.');
      return;
    }
    try {
      const saved = await saveMutation.mutateAsync({
        formId,
        body: toOptionGroupsRequest(state),
      });
      // 새 ID 와, 결제돼서 삭제 대신 숨김으로 남은 옵션을 받아 온다
      dispatch({ type: 'reset', optionGroups: saved.optionGroups });
      snackbar('옵션을 저장했습니다.');
    } catch (error) {
      snackbar(getOptionSaveErrorMessage(error));
    }
  };

  return {
    groups: state.groups,
    isDirty: state.isDirty,
    errors,
    edit,
    save,
    isSaving: saveMutation.isPending,
  };
};

export type OptionGroupEditor = ReturnType<typeof useOptionGroupEditor>;
