import { isAxiosError } from 'axios';

import type { OneTimeFormSettingsField } from '../types/oneTimeFormSettings';

type SaveErrorFeedback = {
  message: string;
  /** 오류를 함께 보여 줄 칸 */
  field?: OneTimeFormSettingsField;
};

/** 계약 A2·A4 에러 코드 */
const FEEDBACK_BY_CODE: Record<string, SaveErrorFeedback> = {
  ONE_TIME_FORM_SLUG_DUPLICATED: {
    field: 'slug',
    message: '이미 다른 폼이 쓰는 주소입니다. 다른 주소를 입력해 주세요.',
  },
  ONE_TIME_FORM_SLUG_LOCKED: {
    field: 'slug',
    message: '공개 중이거나 신청이 있는 폼은 주소를 바꿀 수 없습니다.',
  },
  ONE_TIME_FORM_INVALID_PERIOD: {
    field: 'endDate',
    message:
      '기간 설정이 올바르지 않습니다. 신청 마감과 취소 마감은 신청 시작보다 뒤여야 합니다.',
  },
};

export const getOneTimeFormSaveErrorFeedback = (
  error: unknown,
): SaveErrorFeedback => {
  const code = isAxiosError(error) ? error.response?.data?.code : undefined;
  return FEEDBACK_BY_CODE[code] ?? { message: '저장하지 못했습니다.' };
};
