import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { uploadFile } from '@/api/file';
import {
  useCreateOneTimeFormMutation,
  useUpdateOneTimeFormMutation,
} from '@/api/one-time-form/oneTimeFormQueries';
import type { AdminOneTimeForm } from '@/api/one-time-form/oneTimeFormSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import { validateOneTimeFormSettings } from '../schema/oneTimeFormSettingsSchema';
import type {
  OneTimeFormSettingsErrors,
  OneTimeFormSettingsValues,
} from '../types/oneTimeFormSettings';
import { getOneTimeFormSaveErrorFeedback } from '../utils/oneTimeFormSaveError';
import {
  DEFAULT_ONE_TIME_FORM_SETTINGS,
  toOneTimeFormSettingsValues,
  toSaveOneTimeFormRequest,
} from '../utils/oneTimeFormSettingsValues';
import { validateThumbnailFile } from '../utils/thumbnailFile';

export type SetOneTimeFormSettingsField = <
  K extends keyof OneTimeFormSettingsValues,
>(
  field: K,
  value: OneTimeFormSettingsValues[K],
) => void;

/**
 * A2·A4 로 저장되는 기본 정보와 결제 설정의 입력 상태와 저장.
 * `form` 이 없으면 새 폼을 만들고, 만든 뒤 수정 화면으로 옮긴다.
 */
export const useOneTimeFormSettings = (form?: AdminOneTimeForm) => {
  const navigate = useNavigate();
  const { snackbar } = useAdminSnackbar();
  const createMutation = useCreateOneTimeFormMutation();
  const updateMutation = useUpdateOneTimeFormMutation();

  const [values, setValues] = useState<OneTimeFormSettingsValues>(() =>
    form ? toOneTimeFormSettingsValues(form) : DEFAULT_ONE_TIME_FORM_SETTINGS,
  );
  const [errors, setErrors] = useState<OneTimeFormSettingsErrors>({});
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const setField: SetOneTimeFormSettingsField = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const uploadThumbnail = async (file: File) => {
    const invalidReason = validateThumbnailFile(file);
    if (invalidReason) {
      setErrors((prev) => ({ ...prev, thumbnailUrl: invalidReason }));
      return;
    }
    setIsUploadingThumbnail(true);
    try {
      const url = await uploadFile({ file, type: 'ONE_TIME_FORM_THUMBNAIL' });
      setField('thumbnailUrl', url);
    } catch {
      setErrors((prev) => ({
        ...prev,
        thumbnailUrl: '이미지를 올리지 못했습니다.',
      }));
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const save = async () => {
    const validationErrors = validateOneTimeFormSettings(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      snackbar('입력값을 확인해 주세요.');
      return;
    }

    const body = toSaveOneTimeFormRequest(values);
    try {
      if (form) {
        // 저장이 상세 조회를 무효화하므로 잠금 여부 같은 서버 값은 다시 받아 온다
        await updateMutation.mutateAsync({ formId: form.formId, body });
        snackbar('저장되었습니다.');
      } else {
        const { formId } = await createMutation.mutateAsync(body);
        snackbar('폼을 만들었습니다.');
        navigate(`/one-time-form/${formId}/edit`, { replace: true });
      }
    } catch (error) {
      const feedback = getOneTimeFormSaveErrorFeedback(error);
      if (feedback.field) {
        setErrors((prev) => ({ ...prev, [feedback.field]: feedback.message }));
      }
      snackbar(feedback.message);
    }
  };

  return {
    values,
    errors,
    setField,
    uploadThumbnail,
    isUploadingThumbnail,
    save,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
};
