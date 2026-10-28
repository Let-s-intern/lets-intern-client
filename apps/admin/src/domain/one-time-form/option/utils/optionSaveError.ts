import { isAxiosError } from 'axios';

/** 계약 A7 에러 코드 */
const MESSAGE_BY_CODE: Record<string, string> = {
  ONE_TIME_FORM_ITEM_NOT_IN_FORM:
    '이미 삭제됐거나 이 폼에 없는 옵션이 있습니다. 새로고침한 뒤 다시 저장해 주세요.',
  ONE_TIME_FORM_NOT_FOUND: '폼을 찾을 수 없습니다.',
  BAD_REQUEST:
    '입력값이 올바르지 않습니다. 빈 문구, 길이 제한, 금액을 확인해 주세요.',
};

export const getOptionSaveErrorMessage = (error: unknown): string => {
  const code = isAxiosError(error) ? error.response?.data?.code : undefined;
  return MESSAGE_BY_CODE[code] ?? '옵션을 저장하지 못했습니다.';
};
