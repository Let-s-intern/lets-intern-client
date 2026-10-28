import { isAxiosError } from 'axios';

/** 계약 A6 에러 코드 */
const MESSAGE_BY_CODE: Record<string, string> = {
  ONE_TIME_FORM_CHOICES_REQUIRED:
    '선택형 질문에는 빈칸이나 중복 없이 선택지를 1개 이상 넣어 주세요.',
  ONE_TIME_FORM_QUESTION_TYPE_LOCKED:
    '저장된 질문의 형식은 바꿀 수 없습니다. 질문을 지우고 새로 만들어 주세요.',
  ONE_TIME_FORM_ITEM_NOT_IN_FORM:
    '이미 삭제됐거나 이 폼에 없는 질문이 있습니다. 새로고침한 뒤 다시 저장해 주세요.',
  ONE_TIME_FORM_NOT_FOUND: '폼을 찾을 수 없습니다.',
  BAD_REQUEST:
    '입력값이 올바르지 않습니다. 빈 문구와 길이 제한을 확인해 주세요.',
};

export const getQuestionSaveErrorMessage = (error: unknown): string => {
  const code = isAxiosError(error) ? error.response?.data?.code : undefined;
  return MESSAGE_BY_CODE[code] ?? '질문을 저장하지 못했습니다.';
};
