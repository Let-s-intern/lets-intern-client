import { MagnetDetailQuestion } from '@/api/magnet/magnetSchema';
import { MagnetQuestionReqBody } from '@/api/magnet/magnet';
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

/** 상세 조회 응답(magnetQuestionInfo) → 프론트엔드 FormQuestion */
export function detailQuestionToFormQuestion(
  q: MagnetDetailQuestion,
): FormQuestion {
  return {
    questionId: String(q.magnetQuestionId),
    questionType: q.answerType === 'CHOICE' ? 'OBJECTIVE' : 'SUBJECTIVE',
    isRequired: q.isRequired ? 'REQUIRED' : 'OPTIONAL',
    question: q.question,
    description: q.description ?? '',
    selectionMethod: q.choiceType,
    items: parseOptions(q.options),
  };
}

/** 상세 조회 응답(magnetQuestionInfo) → PATCH 요청용 MagnetQuestionReqBody */
export function detailQuestionToApiBody(
  q: MagnetDetailQuestion,
): MagnetQuestionReqBody {
  return {
    type: q.type,
    question: q.question,
    description: q.description ?? '',
    isRequired: q.isRequired,
    answerType: q.answerType,
    choiceType: q.choiceType,
    options: q.options,
  };
}

/** 프론트엔드 FormQuestion → PATCH 요청용 MagnetQuestionReqBody */
export function formQuestionToApiBody(
  q: FormQuestion,
): MagnetQuestionReqBody {
  return {
    type: 'ADDITIONAL',
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
