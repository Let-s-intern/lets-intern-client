import { MagnetQuestionApi } from '@/api/magnet/magnetSchema';
import { generateUUID } from '@/utils/random';
import { FormQuestion, FormQuestionItem } from '../types';

const OTHER_ITEM_VALUE = '기타(직접입력)';

/** 콤마 구분 options 문자열 → FormQuestionItem[] */
function parseOptions(options: string | null): FormQuestionItem[] {
  if (!options) return [];
  return options.split(',').map((value) => ({
    itemId: generateUUID(),
    value: value.trim(),
    isOther: value.trim() === OTHER_ITEM_VALUE,
  }));
}

/** FormQuestionItem[] → 콤마 구분 문자열 */
function serializeOptions(items: FormQuestionItem[]): string {
  return items.map((item) => item.value).join(',');
}

/** API 응답 → 프론트엔드 FormQuestion */
export function apiQuestionToFormQuestion(
  api: MagnetQuestionApi,
): FormQuestion {
  return {
    questionId: String(api.magnetQuestionId),
    questionType: api.answerType === 'CHOICE' ? 'OBJECTIVE' : 'SUBJECTIVE',
    isRequired: api.isRequired ? 'REQUIRED' : 'OPTIONAL',
    question: api.question,
    description: api.description ?? '',
    selectionMethod: api.choiceType,
    items: parseOptions(api.options),
  };
}

/** 프론트엔드 FormQuestion → API 요청 바디 */
export function formQuestionToApiBody(q: FormQuestion) {
  return {
    type: 'ADDITIONAL' as const,
    question: q.question,
    description: q.description,
    isRequired: q.isRequired === 'REQUIRED',
    answerType: (q.questionType === 'OBJECTIVE' ? 'CHOICE' : 'TEXT') as
      | 'CHOICE'
      | 'TEXT',
    choiceType: q.selectionMethod as 'SINGLE' | 'MULTIPLE',
    options:
      q.questionType === 'OBJECTIVE' ? serializeOptions(q.items) : null,
  };
}
