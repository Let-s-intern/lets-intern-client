import type { OneTimeFormQuestionType } from '@/api/one-time-form/oneTimeFormSchema';

/** 편집 중인 질문 하나. 입력 칸 그대로 두고, 저장할 때 A6 본문으로 바꾼다 */
export type QuestionDraft = {
  /** 화면에서만 쓰는 고유 키. 저장 전 질문은 ID 가 없어서 따로 둔다 */
  key: string;
  /** null 이면 아직 저장 안 된 질문. 형식을 바꿀 수 있는 것은 이때뿐이다 */
  questionId: number | null;
  type: OneTimeFormQuestionType;
  title: string;
  description: string;
  isRequired: boolean;
  /** 선택형이 아니어도 지우지 않고 둔다. 저장할 때 null 로 보낸다 */
  choices: string[];
};

export type QuestionListState = {
  questions: QuestionDraft[];
  isDirty: boolean;
  /** 새 질문 키를 만드는 순번 */
  nextKey: number;
};

export type QuestionDraftErrors = {
  title?: string;
  description?: string;
  choices?: string;
};

/** 질문 키별 오류. 빈 객체면 저장할 수 있다 */
export type QuestionListErrors = Record<string, QuestionDraftErrors>;
